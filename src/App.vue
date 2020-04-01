<!--
@Author: Despres Maxence <checkam>
@Date:   01-Apr-2020
@Email:  maxence.despres.etu@univ-lemans.fr
@Filename: App.vue
@Last modified by:   checkam
@Last modified time: 01-Apr-2020
-->

<template>
  <div id="app">
    <div class="d-flex justify-content-center">
      <div class="d-flex flex-row" style="width: 25%;">
        <input class="form-control" v-model="research" placeholder="Search :" />
        <button
          v-on:click="send()"
          type="button"
          class="btn btn-primary"
          name="button"
        >
          Search
        </button>
      </div>
    </div>

    <!-- Twitch -->
    <Twitch :search="toSend" id="twitch" />

    <!-- Imgur -->
    <b-container fluid class="p-0" id="imgur">
      <Imgur :search="toSend" :heightImg="20" />
    </b-container>

    <igdb :search="toSend" id="igdb" />
  </div>
</template>

<script>
import Twitch from "./components/Twitch.vue";
import Imgur from "./components/Imgur.vue";
import Igdb from "./components/IGDB.vue";
export default {
  name: "App",
  components: {
    Twitch,
    Imgur,
    Igdb
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
  padding: 20px;
  background: #202040;
  /* background: #b030b0; */
}

#twitch {
  margin-top: 1%;
}

#imgur {
  height: 500px;
  margin-top: 1%;
}

#igdb {
  margin-top: 1%;
}
</style>
