<template>
  <div id="app">
    <!-- Imgur -->
    <b-container fluid class="p-0" style="height:500px; margin-top: 50px;">
      <Steam nomJeu="Counter-Strike: Global Offensive"/>
    </b-container>
  </div>
</template>

<script>
import Steam from "./components/Steam.vue";

export default {
  name: "App",
  components: {
    Steam
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
