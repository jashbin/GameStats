<template>
  <div class="cardGame d-flex flex-column rounded m-1" :style="'width: ' + width + 'px'">
    <!-- Image -->
    <a class="m-1 text-center" v-show="isLoad" :href="'https://www.twitch.tv/' + user_name">
      <img class="rounded img-fluid max-height: 100%" :src="url_img" @load="loaded" />
    </a>
    <div class="m-1 text-center" v-show="!isLoad">
      <b-spinner variant="danger" label="Spinning"></b-spinner>
    </div>

    <!-- Info -->
    <div class="d-flex flex-row justify-content-start align-items-center">
      <!-- Profile Image -->
      <a v-if="user.length > 0" class="m-1 mr-2" :href="'https://www.twitch.tv/' + user_name">
        <img class :src="user[0].profile_image_url" style="border-radius: 50%; height: 2.5em;" />
      </a>
      <div v-else class="m-1 text-center">
        <b-spinner variant="danger" label="Spinning"></b-spinner>
      </div>

      <div class="text-truncate d-flex flex-column w-100">
        <!-- Titre jeu -->
        <div class="align-self-start">{{title}}</div>

        <div class="d-flex flex-row justify-content-between align-items-center">
          <!-- User Name -->
          <div class="user">{{user_name}}</div>
          <!-- Viewer Count -->
          <div class="user">
            <b-icon icon="person" scale="1.5" variant="danger"></b-icon>
            {{viewer_count}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { APIKEY } from "../apiKeys.js";

export default {
  props: {
    url_img: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    user_id: {
      type: String,
      required: true
    },
    user_name: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    viewer_count: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isLoad: false,
      user: []
    };
  },
  methods: {
    async loaded() {
      this.isLoad = true;

      //On attend pour éviter de dépasser le nombre de requête maximum
      //do {
      await this.sleep(Math.floor(Math.random() * (2000 - 500) + 500));
      this.getUser();
      //} while (this.getUser() == -1);
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    getUser() {
      // Get user infos from Twitch
      this.user = [];
      axios
        .get("https://api.twitch.tv/helix/users?id=" + this.user_id, {
          headers: {
            "Client-ID": APIKEY.twitch
          }
        })
        .then(response => {
          response.data.data.forEach(element => {
            this.user.push({
              id: element.id,
              login: element.login,
              display_name: element.display_name,
              type: element.type,
              broadcaster_type: element.broadcaster_type,
              description: element.description,
              profile_image_url: element.profile_image_url,
              offline_image_url: element.offline_image_url,
              view_count: element.view_count,
              email: element.email
            });
          });
          return 0;
        })
        .catch(error => console.log(error));

      return -1;
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

.user {
  font-size: 0.8em;
  font-weight: bold;
}
</style>