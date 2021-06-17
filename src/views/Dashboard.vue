<template>
  <div class="h-full">
    <Navbar @show-login="showLogin = !showLogin" />
    <div class="h-20"></div>
    <Login v-if="showLogin" @close-login="showLogin = false" />
    <h1 class="text-6xl text-gray-300 font-semibold text-center my-auto mt-20">
      Welcome to my ThinkPort-API-Web-Client
    </h1>
    <h3 class="text-center text-gray-300 text-xl mt-12">
      Here is the data from the Database:
    </h3>
    <CompanyList />
    <p
      class="text-gray-500 mt-20 cursor-pointer inline-block hover:text-yellow-600 ml-32"
    >
      Send BitCoin/Ether/LightCoin/Monero...
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "@/components/Navbar.vue";
import CompanyList from "@/components/CompanyList.vue";
import Login from "@/components/Login.vue";

export default Vue.extend({
  name: "Dashboard",
  components: { Navbar, CompanyList, Login },
  data() {
    return {
      showLogin: false,
    };
  },
});
</script>
