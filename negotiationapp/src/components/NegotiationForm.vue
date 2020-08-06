<template>
  <div>
    <b-button @click="resetValues" v-if="isResetAppEnable" variant="link">(reset app)</b-button>
    <b-tabs content-class="pt-3" class="tabs-form" v-model="currentTab">
      <b-tab title="Employer-Tab" active class="tab-item">
        <div v-if="submitedEmployerForm">
          <b-badge class="success-label" href="#" variant="success">Your offer have been submited</b-badge>
        </div>
        <div v-else>
          <form v-on:submit.prevent="submitEmployerAmount">
            <div>
              <input ref="employerInput" autofocus type="number" v-model="employerAmount" @keypress="isNumeric($event)" placeholder="Enter maximum offer" />
            </div>
            <b-button class="my-2" @click="submitEmployerAmount" variant="outline-primary">Submit</b-button>
          </form>
        </div>
      </b-tab>
      <b-tab title="Employee-Tab" class="tab-item">
        <div v-if="submitedEmployeeForm">
          <b-badge href="#" variant="success">Your offer have been submited</b-badge>
        </div>
        <div v-else class="submit-content">
          <form v-on:submit.prevent="submitEmployeeAmount">
            <div>
              <input ref="employeeInput" v-model="employeeAmount" @keypress="isNumeric($event)" placeholder="Enter minimum salary" />
            </div>
            <b-button class="my-2" @click="submitEmployeeAmount" variant="outline-primary">submit</b-button>
          </form>
        </div>
      </b-tab>
    </b-tabs>
    <b-modal v-model="showModal" id="result-modal" hide-header ok-only>
      <h1 v-if="isNegotiationSuccess">Success!</h1>
      <h1 v-else>Failure</h1>
      <div>
        <span>Maximum offer was : {{ employerAmount }}</span>
      </div>
      <div>
        <span>Minimum expected salary was : {{ employeeAmount }}</span>
      </div>
      <div class="current-temp">
        <span>The current temperature in London is {{ this.currentWeather }}℃</span>
      </div>
    </b-modal>
  </div>
</template>
<script>
import axios from "axios";
import numbersUtilMixin from "@/mixins/numbersUtilMixin";
// import ApiWeatherService from "@/services/ApiWeatherService";
export default {
  name: "NegotiationForm",
  mixins: [numbersUtilMixin],
  data: function () {
    return {
      employerAmount: null,
      submitedEmployerForm: false,
      employeeAmount: null,
      submitedEmployeeForm: false,
      isNegotiationSuccess: null,
      currentWeather: null,
      currentTab: 0,
      showModal: false,
    };
  },
  computed: {
    isResetAppEnable: function () {
      return this.submitedEmployerForm || this.submitedEmployeeForm;
    },
  },
  async mounted() {
    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather?q=London,uk&units=metric&APPID=" + process.env.VUE_APP_OPEN_WEATHER_API_KEY);
    this.currentWeather = response.data.main.temp;
    this.$refs.employerInput.focus();
  },
  methods: {
    submitEmployeeAmount: function () {
      if (this.employeeAmount && this.getFloatNumber(this.employeeAmount) > 0) {
        this.submitedEmployeeForm = true;
        this.evaluateNegotiation();
      }
    },
    submitEmployerAmount: function () {
      if (this.employerAmount && this.getFloatNumber(this.employerAmount) > 0) {
        this.submitedEmployerForm = true;
        this.evaluateNegotiation();
      }
    },
    evaluateNegotiation: function () {
      if (this.submitedEmployerForm && this.submitedEmployeeForm) {
        this.isNegotiationSuccess = this.getFloatNumber(this.employeeAmount) <= this.getFloatNumber(this.employerAmount);
        this.showModal = true;
      } else {
        this.currentTab = this.submitedEmployeeForm ? 0 : 1;
        this.$nextTick(() => {
          this.currentTab == 1 ? this.$refs.employeeInput.focus() : this.$refs.employerInput.focus();
        });
      }
    },
    resetValues: function () {
      this.submitedEmployerForm = false;
      this.submitedEmployeeForm = false;
      this.employeeAmount = null;
      this.employerAmount = null;
      this.currentTab = 0;
      this.showModal = false;
      this.$nextTick(() => {
        this.$refs.employerInput.focus();
      });
    },
  },
};
</script>
<style>
.tab-content {
  border: 1px solid #dee2e6;
}
</style>