<template>
  <div class="cardGame d-flex flex-column rounded m-1">
    <!-- Image -->
    <a class="m-1 text-center" v-show="isLoad" :href="url_game">
      <img class="rounded img-fluid max-height: 100%" :src="url_img" @load="loaded" />
    </a>
    <div class="m-1 text-center" v-show="!isLoad">
      <b-spinner variant="danger" label="Spinning"></b-spinner>
    </div>

    <!-- Titre jeu -->
    <div class>
      <div class="text-center">{{title}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    url_img: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoad: false,
      url_game: "https://www.twitch.tv/directory/game/"
    };
  },
  created() {
    this.url_game += encodeURIComponent(this.title.trim());
  },
  methods: {
    loaded() {
      this.isLoad = true;
    }
  }
};
</script>

<style scoped>
.cardGame {
  background-color: #602080;
  color: white;
  padding: 6px;
}
</style>