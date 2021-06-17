<template lang="">
  <div>
    <div v-if="isLoading" class="text-center text-4xl text-gray-300">
      Loading...
    </div>
    <div v-else class="text-white text-lg flex-col justify-evenly mt-20 px-32">
      <div
        id="list-header"
        class="flex w-full justify-between border-b-2 border-gray-500 relative"
      >
        <p id="first-list-header">Firmenname</p>
        <p>Legal Entity</p>
        <p>Mitarbeiterzahl</p>
        <p>Stammkapital</p>
        <p
          v-for="(key, index) of Object.keys(companyList[0].additional_infos)"
          :key="index"
        >
          <span>{{ key }}</span>
        </p>
        <i
          v-if="isLoggedIn"
          class="fas fa-plus-square text-sm absolute -right-5 cursor-pointer hover:text-yellow-600"
          @click="selectedCompany = company"
        ></i>
      </div>
      <div
        id="company-list"
        v-for="company of companyList"
        :key="company.id"
        class="flex w-full justify-between relative"
      >
        <p>{{ company.name }}</p>
        <p>{{ company.entity }}</p>
        <p>{{ company.worker_count }}</p>
        <p>{{ company.cash }}</p>
        <p v-for="(info, index) of company.additional_infos" :key="index">
          {{ info }}
        </p>
        <i
          v-if="isLoggedIn"
          class="fas fa-edit text-sm absolute -right-6 cursor-pointer hover:text-yellow-600"
          @click="selectedCompany = company"
        ></i>
      </div>
    </div>
    <div v-if="isLoggedIn" class="text-center mt-8">
      <!-- CREATE NEW COMPANY -->
      <div id="new-company" v-if="showCreateCompany" class="text-gray-300">
        <form
          @submit.prevent="submitNewCompany"
          class="flex-col max-w-screen-sm mx-auto space-y-2"
        >
          <label for="new-name">Firmenname</label>
          <input v-model="newCompany.name" id="new-name" type="text" />
          <label for="new-entity">Legal Entity</label>
          <input v-model="newCompany.entity" id="new-entity" type="text" />
          <label for="new-worker-count">Mitarbeiterzahl</label>
          <input
            v-model="newCompany.worker_count"
            id="new-worker-count"
            type="number"
          />
          <label for="new-cash">Stammkapital</label>
          <input v-model="newCompany.cash" id="new-cash" type="number" />
          <div
            v-for="(key, index) of Object.keys(companyList[0].additional_infos)"
            :key="index"
          >
            <label :for="'new-info' + index">{{ key }}</label>
            <input
              v-model="newCompany.additional_infos[key]"
              :id="'new-info' + index"
              type="text"
            />
          </div>
          <div class="flex justify-between mx-auto max-w-screen-sm py-6">
            <div>
              <span
                class="py-1 px-3 bg-gray-700 rounded-sm cursor-pointer"
                @click="discard"
                >Discard</span
              >
            </div>
            <button
              class="py-1 px-3 bg-purple-800 hover:bg-purple-700 rounded-sm"
            >
              Create
            </button>
          </div>
        </form>
      </div>
      <!-- CREATE END -->
      <p
        class="inline-block mx-auto cursor-pointer text-gray-300 hover:text-yellow-600"
        @click="showCreateCompany = !showCreateCompany"
      >
        Add a company
      </p>
    </div>
    <p v-else class="text-center text-lg text-gray-300 mt-20">
      You can add/edit stuff, but therefore you have to log in /sign up first.
      The button is in the Navbar.
    </p>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      companyList: [],
      isLoading: true,
      selectedCompany: null,
      showCreateCompany: false,
      newCompany: {},
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
        this.syncNewCompany();
      } catch (err) {
        console.log(err.message);
      } finally {
        this.isLoading = false;
      }
    },
    syncNewCompany() {
      this.newCompany = {
        name: null,
        entity: null,
        worker_count: null,
        cash: null,
        additional_infos: {},
      };
      Object.keys(this.companyList[0].additional_infos).forEach((key) => {
        this.newCompany.additional_infos[key] = null;
      });
    },
    discard() {
      this.showCreateCompany = false;
      this.syncNewCompany();
    },
    async submitNewCompany() {
      try {
        //console.log(this.newCompany);
        const res = await axios.post(
          "https://uguxn8t7fc.execute-api.us-east-2.amazonaws.com/test/company",
          this.newCompany,
          { headers: { Authorization: this.$store.state.token } }
        );
        console.log(res.data);
        if (res.data.id) {
          this.companyList.push(res.data);
        }
        this.syncNewCompany();
        this.showCreateCompany = false;
      } catch (err) {
        console.log(err.message);
      }
    },
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
#new-company {
  input {
    border: 1px solid orange;
    display: block;
    color: #222;
    padding-left: 0.25rem;
    //width: 100%;
  }
  label {
    display: block;
    //border: 1px solid magenta;
    text-align: left;
  }
}
</style>
