<template lang="">
  <div
    class="fixed w-screen h-20 top-0 z-40 bg-purple-900 flex justify-center items-center space-x-4 text-2xl font-bold text-yellow-600"
  >
    <img :src="logoLight" alt="stylisch lighthouse" class="w-16" />
    <div class="">
      <a href="#" @click="$emit('show-login')">Login</a>
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
};
</script>
<style lang="scss"></style>
