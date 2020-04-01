<template>
  <div class="mainBox container-fluid pt-2 pb-2" v-on:change="handleResize">
    <div class="d-flex flex-row align-items-center justify-content-center mb-2 mt-1">
      <div class>
        <img
          src="https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png"
          alt="twitch logo"
          class="img-fluid"
        />
      </div>
      <div v-if="streams.length > 0 && search != ''" id="title" class="ml-2">Top Streams</div>
      <div v-else id="title" class="ml-2">Top Streamed Games</div>
    </div>

    <div
      ref="mainBox"
      class="d-flex flex-wrap justify-content-center align-items-center"
      v-if="hasResult == false"
    >
      <h1>Aucun Résultat</h1>
    </div>
    <div
      ref="mainBox"
      class="d-flex flex-wrap justify-content-center align-items-center"
      v-else-if="search.length > 0"
    >
      <div class v-for="(stream) in streams.slice(0,imgToDisplay)" :key="stream.id">
        <TwitchStreamsCard
          :title="stream.title"
          :url_img="stream.thumbnail_url"
          :user_id="stream.user_id"
          :width="imgStreamsWidth"
          :user_name="stream.user_name"
          :viewer_count="stream.viewer_count"
        ></TwitchStreamsCard>
      </div>
    </div>
    <div
      ref="mainBox"
      class="d-flex flex-wrap justify-content-center align-items-center"
      v-else-if="topGames.length > 0"
    >
      <div class v-for="(game) in topGames.slice(0,imgToDisplay)" :key="game.id">
        <TwitchTopGamesCard :title="game.name" :url_img="game.box_art_url" />
      </div>
    </div>
    <div class="text-center" v-else>
      <b-spinner style="width: 3rem; height: 3rem;" variant="danger" label="Large Spinner"></b-spinner>
    </div>

    <div
      class="text-center pt-3 pb-2 dropBtn"
      v-on:click="displayGames"
      styleimgHeightRatio="cursor: pointer;"
    >
      <b-icon icon="chevron-down" scale="3.5" variant="light" class="dropIcon" v-show="!dropdown"></b-icon>
      <b-icon icon="chevron-up" scale="3.5" variant="light" class="dropIcon" v-show="dropdown"></b-icon>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { APIKEY } from "../apiKeys.js";

import TwitchTopGamesCard from "./TwitchTopGamesCard.vue";
import TwitchStreamsCard from "./TwitchStreamsCard.vue";

export default {
  name: "TwitchTopGames",
  components: {
    TwitchTopGamesCard,
    TwitchStreamsCard
  },
  props: {
    imgHeightRatio: {
      type: Number,
      default: 0.2,
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
    search: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      topGames: [],
      streams: [],
      imgTopGamesWidth: 143,
      imgTopGamesHeight: 190,
      imgStreamsWidth: 440,
      imgStreamsHeight: 248,
      imgPerLine: 1,
      imgToDisplay: 1,
      dropdown: false,
      dropdownEnCours: false,
      nbCard: 0,
      hasResult: false
    };
  },
  watch: {
    search: function() {
      if (this.search != "") {
        this.streams = [];
        this.getStreams(this.initComponent);
      } else {
        this.nbCard = this.topGames.length;
        this.initComponent();
      }
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted: function() {
    this.getTopGames(this.initComponent);

    if (this.search != "") {
      this.getStreams(this.initComponent);
    }
  },
  methods: {
    getTopGames(callback) {
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
                this.imgTopGamesWidth + "x" + this.imgTopGamesHeight
              )
            });
          });
          this.nbCard = this.topGames.length;
          this.hasResult = true;
          callback();
          return 0;
        })
        .catch(error => console.log(error));

      this.hasResult = false;
      return -1;
    },
    getStreams(callback) {
      axios
        .get("https://api.twitch.tv/helix/games?name=" + this.search, {
          headers: {
            "Client-ID": APIKEY.twitch
          }
        })
        .then(response => {
          axios
            .get(
              "https://api.twitch.tv/helix/streams?first=20&game_id=" +
                response.data.data[0].id,
              {
                headers: {
                  "Client-ID": APIKEY.twitch
                }
              }
            )
            .then(res => {
              res.data.data.forEach(element => {
                this.streams.push({
                  id: element.id,
                  user_id: element.user_id,
                  user_name: element.user_name,
                  game_id: element.game_id,
                  type: element.type,
                  title: element.title,
                  viewer_count: element.viewer_count,
                  started_at: element.started_at,
                  language: element.language,
                  thumbnail_url: element.thumbnail_url.replace(
                    "{width}x{height}",
                    this.imgStreamsWidth + "x" + this.imgStreamsHeight
                  )
                });
              });
              this.nbCard = this.streams.length;
              this.hasResult = true;
              callback();
              return 0;
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));

      this.hasResult = false;
      return -1;
    },
    async handleResize() {
      if (this.hasResult && this.dropdown == false) {
        /*this.window.width = this.$refs.mainBox.parentNode.clientWidth;
      this.window.height = this.$refs.mainBox.parentNode.clientHeight;*/

        // Resize img Top Games
        let imgNewHeight = Math.round(window.innerHeight * this.imgHeightRatio);
        let imgNewWidth = Math.round(
          (imgNewHeight * this.imgTopGamesWidth) / this.imgTopGamesHeight
        );
        //console.log(imgNewWidth + "x" + imgNewHeight);

        for (let i = 0; i < this.topGames.lenght; i++) {
          let newValue = this.topGames[i];
          newValue.box_art_url = newValue.box_art_url.replace(
            this.imgTopGamesWidth + "x" + this.imgTopGamesHeight,
            imgNewWidth + "x" + imgNewHeight
          );
          this.topGames.splice(i, 1, newValue);
        }
        this.imgTopGamesWidth = imgNewWidth;
        this.imgTopGamesHeight = imgNewHeight;

        //Resize img Streams
        if (this.search != "") {
          imgNewWidth = Math.round(
            (imgNewHeight * this.imgStreamsWidth) / this.imgStreamsHeight
          );
          //console.log(imgNewWidth + "x" + imgNewHeight);

          for (let i = 0; i < this.streams.lenght; i++) {
            let newValue = this.streams[i];
            newValue.thumbnail_url = newValue.thumbnail_url.replace(
              this.imgStreamsWidth + "x" + this.imgStreamsHeight,
              imgNewWidth + "x" + imgNewHeight
            );
            this.streams.splice(i, 1, newValue);
          }
          this.imgStreamsWidth = imgNewWidth;
          this.imgStreamsHeight = imgNewHeight;
        }

        //Calculate nb Card to display
        this.nbCard = 10;
        this.imgPerLine = 1;
        this.imgToDisplay = this.imgPerLine;
        await this.$nextTick(function() {});
        await this.sleep(5);

        let startHeight = this.$refs.mainBox.clientHeight;
        while (
          this.$refs.mainBox.clientHeight <= startHeight &&
          this.imgPerLine < this.nbCard
        ) {
          /*console.log(
            "Avant : img : " +
              this.imgPerLine +
              " / " +
              this.$refs.mainBox.clientHeight +
              " : " +
              startHeight
          );*/
          this.imgPerLine++;
          this.imgToDisplay = this.imgPerLine;
          await this.$nextTick(function() {});
          await this.sleep(5);
          /*console.log(
            "Après : img : " +
              this.imgPerLine +
              " / " +
              this.$refs.mainBox.clientHeight +
              " : " +
              startHeight
          );*/
        }
        this.imgPerLine -= 1;
        this.imgToDisplay = this.imgPerLine;
      }
    },
    displayGames() {
      if (!this.dropdownEnCours) {
        this.dropdownEnCours = true;

        if (!this.withAnimation) {
          if (this.dropdown == true) {
            this.imgToDisplay = this.imgPerLine;
          } else {
            //console.log(this.imgPerLine);
            this.imgToDisplay = this.nbCard;
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
        let nbImg = this.nbCard;
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
    async initComponent() {
      await this.sleep(200);
      this.handleResize();
      await this.sleep(700);
      this.handleResize();
    }
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