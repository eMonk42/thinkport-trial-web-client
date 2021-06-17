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
          @click="editInfos = !editInfos"
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
      <!-- ADD INFO -->
      <div id="add-info" v-if="editInfos" class="text-gray-300">
        <h3 class="text-xl font-semibold text-center">Edit Info Tables</h3>
        <form @submit.prevent="syncInfoRows" class="flex-col space-y-2 my-2">
          <div v-for="(info, index) of infoModel" :key="index">
            <input
              v-model="infoModel[index]"
              class="text-gray-900"
              :id="'info' + index"
              :placeholder="info"
              type="text"
            />
          </div>
          <div class="mx-auto">
            <i
              class="fas fa-plus hover:text-yellow-600 cursor-pointer"
              @click="infoModel.push('info' + (infoModel.length + 1))"
            ></i>
          </div>
          <div class="flex justify-between w-44 mx-auto">
            <div>
              <span
                class="block py-1 px-3 bg-gray-700 rounded-sm cursor-pointer hover:bg-gray-600"
                @click="
                  editInfos = false;
                  infoModel = Object.keys(companyList[0].additional_infos);
                "
                >Discard</span
              >
            </div>
            <button
              class="py-1 px-3 bg-purple-800 hover:bg-purple-700 rounded-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <!-- END ADD INFO -->
      <!-- EDIT COMAPNY -->
      <div id="edit-company" v-if="selectedCompany" class="text-gray-300">
        <h3 class="text-xl font-semibold text-center">Edit Company</h3>
        <form
          @submit.prevent="submitEditedAndFetch(selectedCompany)"
          class="flex-col max-w-screen-sm mx-auto space-y-2"
        >
          <label for="new-name">Firmenname</label>
          <input v-model="selectedCompany.name" id="new-name" type="text" />
          <label for="new-entity">Legal Entity</label>
          <input v-model="selectedCompany.entity" id="new-entity" type="text" />
          <label for="new-worker-count">Mitarbeiterzahl</label>
          <input
            v-model="selectedCompany.worker_count"
            id="new-worker-count"
            type="number"
          />
          <label for="new-cash">Stammkapital</label>
          <input v-model="selectedCompany.cash" id="new-cash" type="number" />
          <div
            v-for="(key, index) of Object.keys(companyList[0].additional_infos)"
            :key="index"
          >
            <label :for="'new-info' + index">{{ key }}</label>
            <input
              v-model="selectedCompany.additional_infos[key]"
              :id="'new-info' + index"
              type="text"
            />
          </div>
          <div class="flex justify-between mx-auto max-w-screen-sm py-6">
            <div>
              <span
                class="py-1 px-3 bg-gray-700 rounded-sm cursor-pointer hover:bg-gray-600"
                @click="selectedCompany = null"
                >Discard</span
              >
            </div>
            <div>
              <span
                class="py-1 px-3 bg-red-400 rounded-sm cursor-pointer hover:bg-red-600"
                @click="deleteCompany"
                >Delete this Company</span
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
      <!-- EDIT END -->
      <!-- CREATE NEW COMPANY -->
      <div id="new-company" v-if="showCreateCompany" class="text-gray-300">
        <h3 class="text-xl font-semibold text-center">New Company</h3>
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
      infoModel: [],
      editInfos: false,
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
      this.infoModel = Object.keys(this.companyList[0].additional_infos);
    },
    discard() {
      this.showCreateCompany = false;
      this.syncNewCompany();
    },
    async submitNewCompany() {
      if (!this.newCompany.name || this.newCompany.name == 0) {
        console.log("The new company must have at least a name");
        return;
      }
      try {
        //console.log(this.newCompany);
        const res = await axios.post(
          "https://uguxn8t7fc.execute-api.us-east-2.amazonaws.com/test/company",
          this.fillOutCompany(this.newCompany),
          { headers: { Authorization: this.$store.state.token } }
        );
        if (res.data.id) {
          this.companyList.push(res.data);
        }
        this.syncNewCompany();
        this.showCreateCompany = false;
      } catch (err) {
        console.log(err.message);
      }
    },
    async submitEditedCompany(company) {
      if (!company.name || company.name == 0) {
        console.log("The Company must have a name");
        return;
      }
      try {
        await axios.patch(
          "https://uguxn8t7fc.execute-api.us-east-2.amazonaws.com/test/company",
          this.fillOutCompany(company),
          { headers: { Authorization: this.$store.state.token } }
        );
      } catch (err) {
        console.log(err.message);
      }
    },
    async submitEditedAndFetch(company) {
      await this.submitEditedCompany(company);
      await this.fetchCompanies();
      this.selectedCompany = null;
    },
    fillOutCompany(company) {
      const keyArray = Object.keys(company);
      for (let i = 0; i < keyArray.length; i++) {
        if (!company[keyArray[i]]) {
          company[keyArray[i]] = 0;
        } else if (keyArray[i] == "additional_infos") {
          const infoArray = Object.keys(company.additional_infos);
          for (let j = 0; j < infoArray.length; j++) {
            if (!company["additional_infos"][infoArray[j]]) {
              company["additional_infos"][infoArray[j]] = "empty";
            }
          }
        }
      }
      return company;
    },
    async deleteCompany() {
      const id = this.selectedCompany.id;
      try {
        await axios.delete(
          "https://uguxn8t7fc.execute-api.us-east-2.amazonaws.com/test/company?id=" +
            id,
          { headers: { Authorization: this.$store.state.token } }
        );
        await this.fetchCompanies();
        this.selectedCompany = null;
      } catch (err) {
        console.log(err.message);
      }
    },
    async syncInfoRows() {
      const backup = Object.keys(this.companyList[0].additional_infos);
      for (let i = 0; i < this.companyList.length; i++) {
        const newInfoObject = {};
        for (let j = 0; j < this.infoModel.length; j++) {
          if (j <= Object.keys(this.companyList[i].additional_infos).length) {
            newInfoObject[this.infoModel[j]] = this.companyList[
              i
            ].additional_infos[backup[j]];
          } else {
            newInfoObject[this.infoModel[j]] = "empty";
          }
        }
        //console.log(newInfoObject);
        this.companyList[i].additional_infos = newInfoObject;
      }
      try {
        for (let i = 0; i < this.companyList.length; i++) {
          await this.submitEditedCompany(this.companyList[i]);
        }
        await this.fetchCompanies;
      } catch (err) {
        console.log(err.message);
      }
      this.editInfos = false;
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
#edit-company {
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
