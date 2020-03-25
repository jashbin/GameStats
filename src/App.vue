<template>
  <div id="app">
    <div class>
      <input v-model="research" placeholder="Search :" />
      <button v-on:click="send()" type="button" name="button">Search</button>
    </div>
    <Twitch :withAnimation="true" :search="toSend" />
  </div>
</template>

<script>
import Twitch from "./components/Twitch.vue";

export default {
  name: "App",
  components: {
    Twitch
  },
  data() {
    return {
      research: "",
      toSend: ""
    };
  },
  methods: {
    send() {
      this.toSend = this.research;
    }
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
