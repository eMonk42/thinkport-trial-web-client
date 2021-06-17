<template lang="">
  <div
    class="fixed w-screen h-20 top-0 z-40 bg-purple-900 flex justify-center items-center space-x-4 text-2xl font-bold text-yellow-600"
  >
    <img :src="logoLight" alt="stylisch lighthouse" class="w-16" />
    <div v-if="!isLoggedIn" class="">
      <a href="#" @click="$emit('show-login')">Login</a>
    </div>
    <div v-else class="flex space-x-4">
      <div>Logged in as: {{ $store.state.user.email }}</div>
      <p class="text-gray-300 cursor-pointer" @click="$store.commit('CLEAR')">
        Logout
      </p>
    </div>
  </div>
</template>
<script>
import logoLight from "@/assets/thinkport_logo_sm.png";
export default {
  data() {
    return {
      logoLight,
    };
  },
  computed: {
    isLoggedIn() {
      if (this.$store.state.token) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style lang="scss"></style>
