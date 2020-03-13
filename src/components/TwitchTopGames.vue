<template>
  <div class="mainBox container-fluid pt-2 pb-2" ref="mainBox" v-on:change="handleResize">
    <div class="d-flex flex-row align-items-center justify-content-center mb-2 mt-1">
      <div class>
        <img
          src="https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png"
          alt="twitch logo"
          class="img-fluid"
        />
      </div>
      <div id="title" class="ml-2">Top Streamed Games</div>
    </div>

    <div
      class="d-flex flex-wrap justify-content-center align-items-center"
      v-if="topGames.length > 0"
    >
      <div class v-for="(game) in topGames.slice(0,imgToDisplay)" :key="game.id">
        <TwitchTopGamesCard :title="game.name" :url_img="game.box_art_url" :card_width="imgWidth" />
      </div>
    </div>
    <div class="text-center" v-else>
      <b-spinner style="width: 3rem; height: 3rem;" variant="danger" label="Large Spinner"></b-spinner>
    </div>

    <div class="text-center pt-3 pb-2 dropBtn" v-on:click="displayGames" style="cursor: pointer;">
      <b-icon icon="chevron-down" scale="3.5" variant="light" class="dropIcon" v-show="!dropdown"></b-icon>
      <b-icon icon="chevron-up" scale="3.5" variant="light" class="dropIcon" v-show="dropdown"></b-icon>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {APIKEY} from "../apiKeys.js";

import TwitchTopGamesCard from './TwitchTopGamesCard.vue'

export default {
  name: 'TwitchTopGames',
  components: {
    TwitchTopGamesCard
  },
  props: {
    imgHeightRatio: {
      type: Number,
      default: 0.3,
      validator: function(value) {
        return value > 0 && value <= 1;
      }
    },
    withAnimation: {
      type: Boolean,
      default: false
    },
    animationSpeed: {
      type: Number,
      default: 100
    },
    displayAllImg: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      topGames: [],
      imgWidth: 143,
      imgHeight: 190,
      imgPerLine: 1,
      imgToDisplay: 1,
      dropdown: false,
      dropdownEnCours: false
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    getTopGames() {
      console.log(APIKEY.twitch);
      axios
        .get("https://api.twitch.tv/helix/games/top", {
          headers: {
            "Client-ID": APIKEY.twitch
          }
        })
        .then(response => {
          response.data.data.forEach(element => {
            this.topGames.push({
              id: element.id,
              name: element.name,
              box_art_url: element.box_art_url.replace(
                "{width}x{height}",
                this.imgWidth + "x" + this.imgHeight
              )
            });
          });
        })
        .catch(error => console.log(error));
    },
    handleResize() {
      /*this.window.width = this.$refs.mainBox.parentNode.clientWidth;
      this.window.height = this.$refs.mainBox.parentNode.clientHeight;*/

      let imgNewHeight = Math.round(window.innerHeight * this.imgHeightRatio);
      let imgNewWidth = Math.round(
        (imgNewHeight * this.imgWidth) / this.imgHeight
      );
      console.log(imgNewWidth + "x" + imgNewHeight);

      for (let i = 0; i < this.topGames.lenght; i++) {
        let newValue = this.topGames[i];
        newValue.box_art_url = newValue.box_art_url.replace(
          this.imgWidth + "x" + this.imgHeight,
          imgNewWidth + "x" + imgNewHeight
        );
        this.topGames.splice(i, 1, newValue);
      }

      let compWidth = this.$refs.mainBox.parentNode.clientWidth;
      compWidth *= 0.9;
      let nbImg = 0;
      while (nbImg * imgNewWidth < compWidth) {
        nbImg++;
      }
      this.imgPerLine = nbImg - 1;
      this.imgToDisplay = this.imgPerLine;

      this.imgWidth = imgNewWidth;
      this.imgHeight = imgNewHeight;
    },
    displayGames() {
      if (!this.dropdownEnCours) {
        this.dropdownEnCours = true;

        if (!this.withAnimation) {
          if (this.dropdown == true) {
            this.imgToDisplay = this.imgPerLine;
          } else {
            console.log(this.imgPerLine);
            this.imgToDisplay = this.getImgDisplayedMax();
          }

          this.dropdown = !this.dropdown;
          this.dropdownEnCours = false;
        } else {
          this.displayGamesAnimation();
        }
      }
    },
    async displayGamesAnimation() {
      if (this.dropdown == false) {
        let nbImg = this.getImgDisplayedMax();
        while (this.imgToDisplay < nbImg) {
          this.imgToDisplay++;
          await this.sleep(this.animationSpeed);
        }
      } else {
        while (this.imgToDisplay > this.imgPerLine) {
          this.imgToDisplay--;
          await this.sleep(this.animationSpeed);
        }
      }
      this.dropdown = !this.dropdown;
      this.dropdownEnCours = false;
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    getImgDisplayedMax() {
      if (this.displayAllImg == true) {
        return this.topGames.length;
      } else {
        return this.topGames.length - (this.topGames.length % this.imgPerLine);
      }
    }
  },
  mounted: function() {
    this.getTopGames();
    this.handleResize();
  }
};
</script>

<style scoped>
.mainBox {
  background-color: #202060;
  /*padding-top: 15px;*/
  /*padding-bottom: 20px;*/
  font-family: "Roboto", sans-serif;
  color: white;
}

#title {
  /* color: #b030b0; */
  color: white;
  font-size: 1.5em;
}

.cardGame {
  background-color: #602080;
  color: white;
  padding: 6px;
}

.dropBtn:hover > .dropIcon {
  color: #b030b0 !important;
}
</style>