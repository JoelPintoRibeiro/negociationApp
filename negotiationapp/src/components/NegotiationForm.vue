<template>
  <div>
    <b-button @click="resetValues" v-if="isResetAppEnable" variant="link">(reset app)</b-button>
    <b-tabs content-class="pt-3" class="tabs-form">
      <b-tab title="Employer-Tab" active>
        <div v-if="submitedEmployerForm">
          <b-badge href="#" variant="success">Your offer have been submited</b-badge>
        </div>
        <div v-else>
          <form v-on:submit.prevent="submitEmployerAmount">
            <div>
              <input type="number" v-model="employerAmount" @keypress="isNumericMixin($event)" placeholder="Enter maximum offer" />
            </div>
            <b-button class="my-2" @click="submitEmployerAmount" variant="outline-primary">Submit</b-button>
          </form>
        </div>
      </b-tab>
      <b-tab title="Employee-Tab">
        <div v-if="submitedEmployeeForm">
          <b-badge href="#" variant="success">Your offer have been submited</b-badge>
        </div>
        <div v-else class="submit-content">
          <form v-on:submit.prevent="submitEmployeeAmount">
            <div>
              <input v-model="employeeAmount" @keypress="isNumericMixin($event)" placeholder="Enter minimum salary" />
            </div>
            <b-button class="my-2" @click="submitEmployeeAmount" variant="outline-primary">submit</b-button>
          </form>
        </div>
      </b-tab>
    </b-tabs>
    <b-modal id="result-modal" title="BootstrapVue" hide-header ok-only>
      <h1 v-if="isNegotiationSuccess">Success!</h1>
      <h1 v-else variant="success">Failure</h1>
      <div>
        <span>Maximum offer was : {{ employerAmount }}</span>
      </div>
      <div>
        <span>Minimum expected salary was : {{ employeeAmount }}</span>
      </div>
      <div>
        <span>The current temperature in London is {{ this.currentWeather }}℃</span>
      </div>
    </b-modal>
  </div>
</template>
<script>
import isNumericMixin from "@/mixins/isNumericMixin";
import axios from "axios";
export default {
  name: "NegotiationForm",
  mixins: [isNumericMixin],
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
      debugger;
      if (this.submitedEmployerForm && this.submitedEmployeeForm) {
        this.isNegotiationSuccess = this.getFloatNumber(this.employeeAmount) <= this.getFloatNumber(this.employerAmount);
        this.$bvModal.show("result-modal");
      }
    },
    resetValues: function () {
      this.submitedEmployerForm = false;
      this.submitedEmployeeForm = false;
      this.employeeAmount = null;
      this.employerAmount = null;
    },
  },
  data: function () {
    return {
      employerAmount: null,
      submitedEmployerForm: false,
      employeeAmount: null,
      submitedEmployeeForm: false,
      isNegotiationSuccess: null,
      currentWeather: null,
    };
  },
  computed: {
    isResetAppEnable: function () {
      return this.submitedEmployerForm || this.submitedEmployeeForm;
    },
  },
  created() {
    let that = this;
    axios
      .get("https://api.openweathermap.org/data/2.5/weather?q=London,uk&units=metric&APPID=" + process.env.VUE_APP_OPEN_WEATHER_API_KEY)
      .then((response) => (that.currentWeather = response.data.main.temp));
  },
};
</script>
<style>
.tab-content {
  border: 1px solid #dee2e6;
}
</style>