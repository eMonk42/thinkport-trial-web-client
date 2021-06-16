<template>
  <div class="h-full">
    <Navbar />
    <div class="h-20"></div>
    <h1 class="text-6xl text-gray-300 font-semibold text-center my-auto">
      Welcome to my ThinkPort-API-Web-Client
    </h1>
    <CompanyList />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "@/components/Navbar.vue";
import CompanyList from "@/components/CompanyList.vue";

export default Vue.extend({
  name: "Dashboard",
  components: { Navbar, CompanyList },
});
</script>
