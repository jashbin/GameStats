<!--
@Author: Despres Maxence <checkam>
@Date:   20-Mar-2020
@Email:  maxence.despres.etu@univ-lemans.fr
@Filename: IGDB.vue
@Last modified by:   checkam
@Last modified time: 02-Apr-2020
-->
<template lang="html">
    <b-col class="p-2 w-100" style="background-color: #602080; color: white; height: 430px">
      <b-spinner v-show="!load" variant="danger" label="Spinning"></b-spinner>
      <b-col class="" v-show="load" >
          <b-row class="mb-3 flex-nowrap" style="height: 90px; font-size: 0.8m;">
            <img :src="imageUrl" alt="" class="mr-3">
            <div class="d-flex flex-column">
              <b class="d-flex">{{name}}</b>
              <span class="d-flex"> <b class="mr-2 text-nowrap"> Genre : </b>
                <div v-for="(genre) in genres" :key="genre" class="mr-2 text-nowrap">
                  <!-- genre -->
                  {{genre}},
                </div>
              </span>
              <span class="d-flex"> <b class="mr-2"> Theme : </b>
                <div v-for="(t) in theme" :key="t" class="mr-2 text-nowrap">
                  <!-- theme -->
                  {{t}},
                </div>
              </span>
            </div>
          </b-row>
          <b-row class="text-justify overflow-auto" style="height: 300px;">
              <!-- description -->
              {{description}}
          </b-row>
      </b-col>
    </b-col>
</template>

<script>
import { APIKEY } from "../apiKeys.js";
var request = require('request');
const GAMESTAT_KEY = APIKEY.gamestats;
export default {
  name: "igdb",
  props: {
    search: {
      type: String,
      default: "game"
    }
  },
  data(){
    return {
      id: Number,
      name: "",
      genres: [],
      theme: [],
      description: "",
      imageUrl: "",
      load: false,
      apiUrl: 'http://localhost:3000/games/',
    }
  },
  methods: {
    async sendToLocalApi(url, body, callback){
      console.log("Call request : " + url + "\t" + body)
      await request.get({
            url: url+body,
            headers:{
              'gamestats-key': GAMESTAT_KEY
            },
          }, function(error, response, resBody){
                callback(JSON.parse(resBody));
        });
    },
    async getGame(name, callback){
      await this.sendToLocalApi(this.apiUrl + 'games/',
        'fields *; search "'+ name +'"; limit 100;',
        callback
      );
    },
    async getCoverGame(id, callback){
      await this.sendToLocalApi(this.apiUrl + 'covers/',
                  'fields *; where id = '+id+' ;',
                  callback)
    },
    async getEngine(id, callback){
      await this.sendToLocalApi(this.apiUrl + 'game_engines/',
                          'fields *; where id = ' + id + ';',
                          callback);
          },

    async getGenre(id, callback){
      this.genres = []
      await this.sendToLocalApi(this.apiUrl + 'genres/',
                  'fields *; where id = ' + id + ';',
                  callback);
    },
    async getTheme(id, callback){
      this.theme = []
      await this.sendToLocalApi(this.apiUrl + 'themes/',
                  'fields *; where id = ' + id + ';',
                  callback);
    },
    async getInfo() {
      let self = this;
      self.load = false;
      await self.getGame(self.search, function(data){
        let id = data.length - 1;
        console.log(data[id])
        self.name = data[id].name;
        self.description = data[id].summary;
        self.id = data[id].id;
        self.getCoverGame(data[id].cover,function(data){
          self.imageUrl = "https://" + data[0].url.replace("//","")
          self.load = true
        });
        for(let i = 0; i < data[id].genres.length; i++)
          self.getGenre(data[id].genres[i],function(data){
            self.genres.push(data[0].name)
          });
        for(let i = 0; i < data[id].themes.length; i++)
          self.getTheme(data[id].themes[i],function(data){
            self.theme.push(data[0].name)
          });
      });
    }
  },
  watch: {
    search: function(){
      this.getInfo()
    }
  },
}
</script>

<style lang="css" scoped >

</style>
