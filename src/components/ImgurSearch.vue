<template>
  <b-container fluid class="p-0" style="background-color: #602080; min-height:100%;">
    <div v-if="!requeteResult" style="color:red;">Pas d'images à afficher</div>
    <div v-if="dataImgur && dataImgur.length > 0">
      <b-row class="align-items-center justify-content-center">
        <b-card
          no-body
          v-for="img in dataImgur.slice(0, nbImgToDisplay)"
          :key="img.id_image"
          class="p-2 m-2"
          style
        >
          <b-img-lazy
            fluid
            :src="img.link_image"
            :style="{ 'max-height': heightImg + 'vh' }"
            class="flex-fill"
          ></b-img-lazy>
        </b-card>
      </b-row>
    </div>
    <div
      class="d-flex justify-content-center align-items-center"
      style="width:100%; height:100%;"
      v-if="requeteResult && !(dataImgur && dataImgur.length > 0)"
    >
      <b-spinner
        style="width: 3rem; height: 3rem;"
        label="Large Spinner"
        variant="success"
        class="m-4"
      ></b-spinner>
    </div>
    <b-col v-if="dataImgur && dataImgur.length > 0" class="p-0 pb-2">
      <div
        class="pb-2 pt-3 w-100 h-100 chevron rounded"
        style="cursor: pointer;"
        v-if="nbImgToDisplay < dataImgur.length"
        @click="
          nbImgToDisplay +=
            nbImgToDisplay + 6 > dataImgur.length
              ? dataImgur.length - nbImgToDisplay
              : 6
        "
      >
        <b-icon icon="chevron-down" variant="light" scale="3.5" class="chIcon"></b-icon>
      </div>
      <div
        class="pb-3 pt-3 w-100 h-100 chevron rounded"
        style="cursor: pointer;"
        v-if="nbImgToDisplay >= dataImgur.length"
        @click="nbImgToDisplay = 6"
      >
        <b-icon icon="chevron-up" variant="light" scale="3.5" class="chIcon"></b-icon>
      </div>
    </b-col>
  </b-container>
</template>
<script>
import { APIKEY } from "../apiKeys.js";
const axios = require("axios");
var requete = true;
/*
dcb84f674e5a514
curl --location --request GET 'https://api.imgur.com/3/gallery/search/top/month/1?q=cats' \
--header 'Authorization: Client-ID dcb84f674e5a514'
*/
export default {
  props: {
    search: {
      type: String,
      default: "game"
    },
    sort: {
      type: String,
      default: "time",
      validator: function(value) {
        return ["time", "viral", "top"].indexOf(value) !== -1;
      }
    },
    date: {
      type: String,
      default: "all",
      validator: function(value) {
        return ["day", "week", "month", "year", "all"].indexOf(value) !== -1;
      }
    },
    page: {
      type: Number,
      default: 1,
      validator: function(value) {
        return value > 0;
      }
    },
    heightImg: {
      type: Number,
      default: 20,
      validator: function(value) {
        return value > 1 && value <= 100;
      }
    }
  },
  data() {
    return {
      dataImgur: [
        /*{
          id_topic: String,
          title_topic: String,
          link_topic: String,

          id_image: String,
          title_image: String,
          description_image: String,
          link_image: String,
          views: Number
        }*/
      ],
      options: {
        type: String,
        default: "1"
      },
      nbImgToDisplay: 6,
      requeteResult: true
    };
  },
  computed: {},
  mounted: function() {
    this.$nextTick(function() {
      if (requete) this.getData();
    });
  },
  watch: {
    search: function() {
      if (requete) this.getData();
    },
    sort: function() {
      if (requete) this.getData();
    },
    date: function() {
      if (requete) this.getData();
    },
    page: function() {
      if (requete) this.getData();
    }
  },
  methods: {
    estImg: chaine => {
      let re = /image\/*/i;
      return re.test(chaine);
    },
    makeOptions: function() {
      this.options = "";
      this.options += this.sort + "/";
      if (this.sort == "top") {
        this.options += this.date + "/";
      }
      this.options += this.page;
      //console.log(this.options);
    },
    getData: async function() {
      requete = false;
      this.dataImgur = [];
      this.makeOptions();
      const response = await axios.get(
        "https://api.imgur.com/3/gallery/search/" +
          this.options +
          "?q=" +
          this.search,
        {
          headers: { Authorization: "Client-ID " + APIKEY.imgur }
        }
      );
      //console.log(response);
      //let check = true;
      if (response.data.data.length == 0) {
        this.requeteResult = false;
        requete = true;
        return;
      } else {
        this.requeteResult = true;
        response.data.data.forEach(element => {
          if (element.images) {
            //check = true;
            element.images.forEach(elementD => {
              if (this.estImg(elementD.type) && elementD.height > 50) {
                //check = false;
                this.dataImgur.push({
                  id_topic: element.id,
                  title_topic: element.title,
                  link_topic: element.link,

                  id_image: elementD.id,
                  title_image: elementD.title,
                  description_image: elementD.description,
                  link_image: elementD.link,
                  views: elementD.views
                });
              }
            });
            //if (check) {
            //this.dataImgur.push(element);
            //}
          }
          //console.log(response);
          requete = true;
          return;
        });
      }
    }
  }
};
</script>

<style scoped>
.chevron:hover {
  background-color: #202060;
}
.chevron:hover > .chIcon {
  color: #b030b0 !important;
}
</style>
