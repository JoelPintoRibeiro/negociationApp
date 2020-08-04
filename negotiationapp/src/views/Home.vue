<template>
  <div>
    <b-row>
      <b-col>
        <h1>Negotiation App</h1>
        <b-button @click="resetValues" variant="link">(reset app)</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-tabs content-class="pt-3" class="tabs-form">
          <b-tab title="Employer-Tab" active>
            <div v-if="submitedEmployerForm">
              <b-badge href="#" variant="success">Your offer have been submited</b-badge>
            </div>
            <div v-else>
              <form v-on:submit.prevent="submitEmployerValue">
                <div>
                  <input type="number" v-model="employerValue" @keypress="isNumericMixin($event)" placeholder="Enter maximum offer" />
                </div>
                <b-button class="my-2" @click="submitEmployerValue" variant="outline-primary">Submit</b-button>
              </form>
            </div>
          </b-tab>
          <b-tab title="Employee-Tab">
            <div v-if="submitedEmployeeForm">
              <b-badge href="#" variant="success">Your offer have been submited</b-badge>
            </div>
            <div v-else class="submit-content">
              <form v-on:submit.prevent="submitEmployeeValue">
                <div>
                  <input v-model="employeeValue" @keypress="isNumericMixin($event)" placeholder="Enter minimum salary" />
                </div>
                <b-button class="my-2" @click="submitEmployeeValue" variant="outline-primary">submit</b-button>
              </form>
            </div>
          </b-tab>
        </b-tabs>
        <b-modal id="result-modal" title="BootstrapVue" hide-header ok-only>
          <h1 v-if="isNegotiationSuccess">Success!</h1>
          <h1 v-else href="#" variant="success">Failure</h1>
          <div>
            <span>Maximum offer was : {{ employerValue }}</span>
          </div>
          <div>
            <span>Minimum expected salary was : {{ employeeValue }}</span>
          </div>
          <div>
            <span>The current temperature in London is {{ this.currentWeather }}℃</span>
          </div>
        </b-modal>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import isNumericMixin from "@/mixins/isNumericMixin";
import axios from "axios";
export default {
  mixins: [isNumericMixin],
  name: "negotiationApp",
  data: function () {
    return {
      employerValue: null,
      submitedEmployerForm: false,
      employeeValue: null,
      submitedEmployeeForm: false,
      isNegotiationSuccess: null,
      currentWeather: null,
    };
  },
  mounted() {
    let that = this;
    axios
      .get("https://api.openweathermap.org/data/2.5/weather?q=London,uk&units=metric&APPID=" + process.env.VUE_APP_OPEN_WEATHER_API_KEY)
      .then((response) => (that.currentWeather = response.data.main.temp));
  },
  methods: {
    submitEmployeeValue: function () {
      if (this.employeeValue && this.getFloatNumber(this.employeeValue) > 0) {
        this.submitedEmployeeForm = true;
        this.evaluateNegotiation();
      }
    },
    submitEmployerValue: function () {
      if (this.employerValue && this.getFloatNumber(this.employerValue) > 0) {
        this.submitedEmployerForm = true;
        this.evaluateNegotiation();
      }
    },
    evaluateNegotiation: function () {
      debugger;
      if (this.submitedEmployerForm && this.submitedEmployeeForm) {
        this.isNegotiationSuccess = this.getFloatNumber(this.employeeValue) <= this.getFloatNumber(this.employerValue);
        this.$bvModal.show("result-modal");
      }
    },
    resetValues: function () {
      this.submitedEmployerForm = false;
      this.submitedEmployeeForm = false;
      this.employeeValue = null;
      this.employerValue = null;
    },
  },
};
</script>
<style scoped>
.tab-content {
  border: 1px solid #dee2e6;
}
</style>