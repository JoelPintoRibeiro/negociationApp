<template>
  <div>
    <b-row>
      <b-col>
        <negotiation-form></negotiation-form>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import NegotiationForm from "@/components/NegotiationForm";
export default {
  name: "negotiationApp",
  components: {
    "negotiation-form": NegotiationForm,
  },
};
</script>