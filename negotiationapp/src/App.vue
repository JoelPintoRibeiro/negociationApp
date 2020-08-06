<template>
  <div id="app">
    <b-container class="home">
      <b-row>
        <b-col>
          <headerComponent></headerComponent>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <router-view />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
export default {
  name: "App",
  components: {
    headerComponent: Header,
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px 0 20px 0;
}
</style>
