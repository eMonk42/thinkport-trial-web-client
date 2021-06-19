<template lang="">
  <div
    id="login-bg"
    class="fixed w-screen h-screen flex justify-center items-center z-30"
  >
    <!-- LOGIN -->
    <div
      v-if="!showSignUp && !showVerification"
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
          <label for="email">User name</label>
          <input
            id="email"
            class="appearance-none rounded-sm relative block w-full px-1 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
            name="userName"
            placeholder="Username"
            v-model="userName"
            type="text"
          />
        </div>
        <div class="my-4 space-y-4 w-56 mx-auto">
          <label for="pwd">Password</label>
          <input
            id="pwd"
            class="appearance-none rounded-sm relative block w-full px-1 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
            name="password"
            v-model="password"
            type="password"
            @blur="passwordTouched = true"
          />
        </div>
        <div class="px-3 mb-4">
          <p class="px-2 text-xs text-red-600 mx-auto">
            {{ submitError }}
          </p>
          <p v-if="passwordError" class="px-2 text-xs text-red-600 mx-auto">
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
    <div
      v-if="!showVerification && showSignUp"
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
        Do you already have an account?
        <span class="text-purple-600 cursor-pointer" @click="showSignUp = false"
          >log in here</span
        >
      </p>
      <form @submit.prevent="signUp" class="flex-col justify-center mt-4">
        <div class="space-y-4 w-56 mx-auto mb-4">
          <label for="userNameUp">Username</label>
          <input
            id="userNameUp"
            class="appearance-none rounded-sm relative block w-full px-1 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
            name="userNameUp"
            placeholder="Username"
            v-model="userName"
            type="text"
          />
        </div>
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
            type="password"
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
    <!-- VERIFY -->
    <div
      v-if="showVerification"
      class="w-64 bg-gray-300 flex-col justify-center pb-6"
    >
      <form
        @submit.prevent="verify"
        class="flex-col justify-center mt-4 space-y-4"
      >
        <label for="verification" class="ml-4">Verification Code</label>
        <input
          v-model="verificationCode"
          id="verification"
          type="text"
          class="ml-4"
        />
        <button
          class="block mx-auto bg-yellow-600 text-purple-900 py-1 px-4 rounded-sm font-semibold hover:bg-yellow-500"
        >
          verify
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
      userName: "",
      showSignUp: false,
      poolData: {
        UserPoolId: "us-east-2_a2OE9ZGEa",
        ClientId: "74akp3g3rqfftvgrol4ot1gh4j",
      },
      userPool: null,
      unconfirmed: false,
      showVerification: false,
      verificationCode: null,
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
      this.passwordTouched = true;
      this.clearErrors();
      //if (!this.entireFormIsValid) return;
      const authData = {
        Username: this.userName,
        Password: this.password,
      };
      const authDetails = new AuthenticationDetails(authData);
      const userData = {
        Username: this.userName,
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
            // this.submitError = err.message;
            // console.log(this.submitError);
            //console.log(err);
            if (err.message == "User is not confirmed.") {
              this.unconfirmed = true;
            }
            reject(err.message);
          },
        });
      });
      const user = {
        email: this.userName,
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
        this.userName,
        this.password,
        arr,
        null,
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
            this.showVerification = true;
            this.showSignUp = false;
          }
        }
      );
    },
    async verify() {
      const userData = {
        Username: this.userName,
        Pool: this.userPool,
      };
      const cognitoUser = new CognitoUser(userData);
      const token = await new Promise((resolve, reject) => {
        cognitoUser.confirmRegistration(this.verificationCode, true, function(
          err,
          result
        ) {
          if (err) {
            console.log(err);
            reject(err.message);
          } else {
            resolve(result);
          }
        });
      });
      const user = {
        email: this.userName,
      };
      this.$store.commit("SET_USER", { user, token });
      this.showVerification = false;
      this.$emit("close-login");
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
        return "Your password must be at least 12 characters long";
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
