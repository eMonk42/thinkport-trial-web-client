<template lang="">
  <div>
    <h1>Hello from CaompanyList!</h1>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      companyList: [],
    };
  },
  async mounted() {
    await this.fetchCompanies();
  },
  methods: {
    async fetchCompanies() {
      try {
        const res = await axios.get(
          "https://uguxn8t7fc.execute-api.us-east-2.amazonaws.com/test/companies"
        );
        console.log(res.data);
      } catch (err) {
        console.log(err.message);
      }
    },
  },
};
</script>
<style lang=""></style>
