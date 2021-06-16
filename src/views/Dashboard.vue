<template>
  <div class="h-full">
    <Navbar />
    <div class="h-20"></div>
    <h1 class="text-6xl text-gray-300 font-semibold text-center my-auto mt-20">
      Welcome to my ThinkPort-API-Web-Client
    </h1>
    <h3 class="text-center text-gray-300 text-xl mt-12">
      Here is the data from the Database:
    </h3>
    <CompanyList />
    <p class="text-center text-lg text-gray-300 mt-20">
      You can add/edit stuff, but therefore you have to log in /sign up first.
      The button is in the Navbar.
    </p>
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
