<!--
INSTRUCTION: To add this component to the user's app, you must follow these steps:
INSTRUCTION: - You are given a correct SQL Statement -- replace the ``PLACEHOLDER_DATA_CREATION_SQL_STATEMENT`` variable in this field with the actual SQL statement.
-->

<template>
  <div class="bg-gray-200 m-12">
    <div class="flex items-center justify-center p-12">
      <div class="mx-auto w-full max-w-[550px]">
        <form @submit.prevent="submitForm">
          <div class="mb-5" v-for="(field, index) in fields" :key="index">
            <label :for="field.name" class="mb-3 block font-bold text-black">{ field.label }</label>
            <input :type="field.type"
                   :name="field.name"
                   :id="field.name"
                   :placeholder="field.placeholder"
                   v-model="form[field.name]"
                   class="w-full rounded-md bg-white py-3 px-6 text-black font-bold outline-none focus:ring-0"/>
          </div>
          <br/>
          <div>
            <button class="font-semibold rounded-md py-3 px-8 text-white outline-none"
                    type="submit"
                    style="background-color:red !important">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
    <br/>
    <br/>
    <div v-if="insertSqlStatus"
         class="bg-green-500 border-t-4 rounded-b px-4 py-3 mt-15"
         role="alert">
      <div class="flex">
        <div class="py-1">
          <svg class="fill-current text-black h-6 w-6 mr-4"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 20 20">
            <path class="fill-current text-black"
                  d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
          </svg>
        </div>
        <div>
          <p class="font-bold text-black mt-1">Your Data Has Been Inserted Successfully!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ContactFormTable',
  delimiters: ['{', '}'],
  data() {
    return {
      form: {},
      fields: [],
      createSqlStatement: "PLACEHOLDER_DATA_CREATION_SQL_STATEMENT",
      insertSqlStatus: false
    };
  },
  mounted() {
    this.initializeForm();
  },
  methods: {
    // Start initializeForm() method
    initializeForm() {
      const sql = this.createSqlStatement.replace('CREATE TABLE', '').trim();
      const columns = sql.split('(')[1].replace(')', '').split(', ');
      this.fields = columns.map((column) => {
        let [name] = column.split(' ');
        name = name.replace("_", " ");
        let formData = {
          name: name.trim(),
          label: name.trim(),
          type: 'text',
          placeholder: "Enter Your " + name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
        };
        return formData;
      });
    },
    // End initializeForm() method

    // Start submitForm() method
    submitForm() {
      const formValues = Object.values(this.form);
      const tableName = this.createSqlStatement.match(/CREATE TABLE (\w+)/)[1];
      const columns = this.fields.map(field => field.name).join(', ');
      const placeholders = this.fields.map((_, index) => '$' + (index + 1)).join(', ');

      let insertSqlStatement = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

      // Construct the values part of the SQL statement
      const values = formValues.map(value => typeof value === 'string' ? `'${value}'` : value).join(', ');
      insertSqlStatement = insertSqlStatement.replace(placeholders, values);

      this.insertData(insertSqlStatement);
    },
    // End submitForm() method

    // Start insertData() method
    insertData(sql) {
      console.log('Insertion sql statement: ', sql);

      return axios
        .post(
          'https://makeinfinite-mentat-dev.azurewebsites.net/insert_data_into_table',
          { insert_sql_statement: sql }
        )
        .then((response) => {
          console.log('Response: ', JSON.stringify(response));
          if (response.data.status === "success") {
            this.insertSqlStatus = true;
            setTimeout(() => {
              this.insertSqlStatus = false;
            }, 5000);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    // End insertData() method
  }
};
</script>

<style scoped>
</style>
