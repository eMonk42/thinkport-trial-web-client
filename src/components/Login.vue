<template lang="">
  <div
    id="login-bg"
    class="fixed w-screen h-screen flex justify-center items-center z-30"
  >
    <!-- LOGIN -->
    <div
      v-if="!showSignUp"
      class="w-64 bg-gray-300 flex-col justify-center pb-6"
    >
      <div class="flex justify-end">
        <p
          class="px-2 py-1 mt-1 mr-1 cursor-pointer inline-block text-sm font-light hover:text-purple-600 hover:bg-gray-400 rounded-sm"
          @click="$emit('close-login')"
        >
          Close
        </p>
      </div>
      <p class="text-sm px-4">
        If you dont have an account yet,
        <span class="text-purple-600 cursor-pointer" @click="showSignUp = true"
          >sign up here</span
        >
      </p>
      <form @submit.prevent="login" class="flex-col justify-center mt-4">
        <div class="space-y-4 w-56 mx-auto">
          <label for="email">Email Address</label>
          <input
            id="email"
            class="appearance-none rounded-sm relative block w-full px-1 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
            name="email"
            placeholder="Email address"
            v-model="email"
            type="text"
            @blur="emailTouched = true"
          />
        </div>
        <div class="my-4 space-y-4 w-56 mx-auto">
          <label for="pwd">Password</label>
          <input
            id="pwd"
            class="appearance-none rounded-sm relative block w-full px-1 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
            name="password"
            v-model="password"
            type="text"
            @blur="passwordTouched = true"
          />
        </div>
        <div class="px-3 mb-4">
          <p v-if="emailError" class="px-2 text-xs text-red-600 mx-auto">
            {{ emailError }}
          </p>
          <p v-if="emailError" class="px-2 text-xs text-red-600 mx-auto">
            {{ passwordError }}
          </p>
        </div>
        <button
          class="block mx-auto bg-yellow-600 text-purple-900 py-1 px-4 rounded-sm font-semibold hover:bg-yellow-500"
        >
          Log in
        </button>
      </form>
    </div>
    <!-- SIGNUP -->
    <div v-else class="w-64 bg-gray-300 flex-col justify-center pb-6">
      <div class="flex justify-end">
        <p
          class="px-2 py-1 mt-1 mr-1 cursor-pointer inline-block text-sm font-light hover:text-purple-600 hover:bg-gray-400 rounded-sm"
          @click="$emit('close-login')"
        >
          Close
        </p>
      </div>
      <p class="text-sm px-4">
        Do you already have an account?
        <span class="text-purple-600 cursor-pointer" @click="showSignUp = false"
          >log in here</span
        >
      </p>
      <form @submit.prevent="signUp" class="flex-col justify-center mt-4">
        <div class="space-y-4 w-56 mx-auto">
          <label for="email">Email Address</label>
          <input
            id="email"
            class="appearance-none rounded-sm relative block w-full px-1 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
            name="email"
            placeholder="Email address"
            v-model="email"
            type="text"
            @blur="emailTouched = true"
          />
        </div>
        <div class="my-4 space-y-4 w-56 mx-auto">
          <label for="pwd">Password</label>
          <input
            id="pwd"
            class="appearance-none rounded-sm relative block w-full px-1 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
            name="password"
            v-model="password"
            type="text"
            @blur="passwordTouched = true"
          />
        </div>
        <div class="px-3 mb-4">
          <p v-if="emailError" class="px-2 text-xs text-red-600 mx-auto">
            {{ emailError }}
          </p>
          <p v-if="emailError" class="px-2 text-xs text-red-600 mx-auto">
            {{ passwordError }}
          </p>
          <p v-if="unconfirmed" class="px-2 text-xs text-red-600 mx-auto">
            Please confirm your email-address and then try to log in again.
          </p>
        </div>
        <button
          class="block mx-auto bg-yellow-600 text-purple-900 py-1 px-4 rounded-sm font-semibold hover:bg-yellow-500"
        >
          Sign up
        </button>
      </form>
    </div>
  </div>
</template>
<script>
//import axios from "axios";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
const EmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export default {
  data() {
    return {
      email: "",
      emailTouched: false,
      password: "",
      passwordTouched: false,
      submitError: "",
      showSignUp: false,
      poolData: {
        UserPoolId: "us-east-2_a2OE9ZGEa",
        ClientId: "74akp3g3rqfftvgrol4ot1gh4j",
      },
      userPool: null,
      unconfirmed: false,
    };
  },
  mounted() {
    this.userPool = new CognitoUserPool(this.poolData);
  },
  methods: {
    clearErrors() {
      this.submitError = "";
    },
    async login() {
      this.unconfirmed = false;
      this.emailTouched = true;
      this.passwordTouched = true;
      this.clearErrors();
      if (!this.entireFormIsValid) return;
      const authData = {
        Username: this.email,
        Password: this.password,
      };
      const authDetails = new AuthenticationDetails(authData);
      const userData = {
        Username: this.email,
        Pool: this.userPool,
      };
      const cognitoUser = new CognitoUser(userData);

      const token = await new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authDetails, {
          onSuccess: function(result) {
            //console.log(result);
            const accessToken = result.idToken.jwtToken;
            //console.log("token gathered");
            //console.log("token:", accessToken);
            resolve(accessToken);
          },

          onFailure: function(err) {
            console.log(err);
            if (err.message == "User is not confirmed.") {
              this.unconfirmed = true;
            }
            reject("something went wrong: ", err.message);
          },
        });
      });
      const user = {
        email: this.email,
      };
      this.$store.commit("SET_USER", { user, token });
      this.$emit("close-login");
    },
    async signUp() {
      this.unconfirmed = false;
      this.emailTouched = true;
      this.passwordTouched = true;
      this.clearErrors();
      if (!this.entireFormIsValid) return;
      console.log("login started", this.email, this.password);
      const mail = {
        Name: "email",
        Value: this.email,
      };
      const arr = [new CognitoUserAttribute(mail)];
      this.userPool.signUp(
        this.email,
        this.password,
        arr,
        null,
        (err, data) => {
          err ? console.log(err) : console.log(data);
        }
      );
    },
  },
  computed: {
    emailError() {
      if (!this.emailTouched) return "";
      if (!EmailRegex.test(this.email)) {
        return "Please insert a valid email address";
      }
      return "";
    },
    passwordError() {
      if (!this.passwordTouched) return "";
      if (this.password.length < 12) {
        return "Your password must be at least 9 characters long";
      }
      return "";
    },
    entireFormIsValid() {
      return (
        this.passwordTouched &&
        this.emailTouched &&
        this.passwordError == "" &&
        this.emailError == ""
      );
    },
  },
};
</script>
<style lang="scss">
#login-bg {
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
