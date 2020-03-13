<template>
  <div id="app">
    <TwitchTopGames :withAnimation="true" />

    <TwitchTopGamesCard title="Nioh 2" url_img="https://static-cdn.jtvnw.net/ttv-boxart/sef.jpg" :card_width="148" />
  </div>
</template>

<script>
import TwitchTopGames from './components/TwitchTopGames.vue'
import TwitchTopGamesCard from './components/TwitchTopGamesCard.vue'

export default {
  name: 'App',
  components: {
    TwitchTopGames,
    TwitchTopGamesCard
  }
}
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
