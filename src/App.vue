<template>
  <div id="app">
    <!-- Imgur -->
    <b-container fluid class="p-0" style="height:500px; margin-top: 50px;">
      <Imgur search="csgo" :heightImg="20" />
    </b-container>
  </div>
</template>

<script>
import Imgur from "./components/Imgur.vue";

export default {
  name: "App",
  components: {
    Imgur
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
