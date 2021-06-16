<template lang="">
  <div>
    <div v-if="isLoading" class="text-center text-4xl text-gray-300">
      Loading...
    </div>
    <div v-else class="text-white text-lg flex-col justify-evenly mt-20 px-32">
      <div
        id="list-header"
        class="flex w-full justify-between border-b-2 border-gray-500"
      >
        <p id="first-list-header">Firmenname</p>
        <p>Legal Entity</p>
        <p>Mitarbeiterzahl</p>
        <p>Stammkapital</p>
        <p>Firmensitz</p>
        <p>Rating</p>
      </div>
      <div
        id="company-list"
        v-for="company of companyList"
        :key="company.id"
        class="flex w-full justify-between"
      >
        <p>{{ company.name }}</p>
        <p>{{ company.entity }}</p>
        <p>{{ company.worker_count }}</p>
        <p>{{ company.cash }}</p>
        <p v-for="(info, index) of company.additional_infos" :key="index">
          {{ info }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      companyList: [],
      isLoading: false,
    };
  },
  async mounted() {
    await this.fetchCompanies();
  },
  methods: {
    async fetchCompanies() {
      try {
        this.isLoading = true;
        const res = await axios.get(
          "https://uguxn8t7fc.execute-api.us-east-2.amazonaws.com/test/companies"
        );
        this.companyList = res.data;
        //console.log(res.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
<style lang="scss">
#list-header {
  p {
    width: 100%;
    //border: 1px solid magenta;
    border-left: 2px solid #888;
    text-align: center;
    font-weight: 600;
  }
  #first-list-header {
    border: none;
  }
}
#company-list {
  p {
    //max-width: calc(innerWidth/6);
    width: 100%;
    border: 1px solid #888;
    padding-left: 0.25rem;
  }
}
</style>
