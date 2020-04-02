<!--
@Author: Despres Maxence <checkam>
@Date:   28-Feb-2020
@Email:  maxence.despres.etu@univ-lemans.fr
@Filename: Chart.vue
@Last modified by:   checkam
@Last modified time: 02-Apr-2020
-->

<template>
  <div>
  <fusioncharts style="height: 400px;"
    :width="width"
    :height="height"
    :type="type"
    :dataFormat="dataFormat"
    :dataSource="dataSource"
  >
  </fusioncharts>
</div>
</template>
<script>
  import Vue from 'vue';
  import VueFusionCharts from 'vue-fusioncharts';
  import FusionCharts from 'fusioncharts';
  import CandyTheme from 'fusioncharts/themes/fusioncharts.theme.candy';
  import TimeSeries from 'fusioncharts/fusioncharts.timeseries';
  import schemaFetch from '../assets/schema';
  import AsyncComputed from 'vue-async-computed'
  import { APIKEY } from "../apiKeys.js";
  const axios = require('axios');
  const GAMESTAT_KEY = APIKEY.gamestats;

  Vue.use(VueFusionCharts, FusionCharts, TimeSeries, CandyTheme );
  Vue.use(AsyncComputed)

 export default {
   props: {
     search: {
       type: String,
       default: "game"
     }
   },

  data: function() {
    return {
      jsonTex: Array,
      width: '700',
      height: '430',
      type: 'timeseries',
      dataFormat: 'json',
      dataSource: {
        data: null,
        caption: {
          text: 'Interet du jeu (recherche google)'
        },
        subcaption: {
          text: this.search
        },
        yAxis: [{
          plot: {
            value: 'Interet Value',
            type: 'line'
          },
          format: {
            prefix: '$'
          },
          title: 'Interet Value'
        }],
        chart:{
          theme: "candy",
        }
      }
    }
  },
  methods: {
    async get() {
          return axios.get('http://localhost:3000/api/interestWithoutTime?keyword='+this.search,
          {
            headers: {
              "gamestats-key": GAMESTAT_KEY
            }
          })
            .then(response => {
              this.jsonText = response.data
            });
          },
    async showChart(){
        await this.get()
        Promise.all([this.jsonText, schemaFetch]).then(res => {
          const data = res[0];
          const schema = res[1];
          const fusionDataStore = new FusionCharts.DataStore();
          const fusionTable = fusionDataStore.createDataTable(data, schema);
          this.dataSource.data = fusionTable;
        });
      },
  },
  watch: {
    search: function(){
      this.showChart();
    }
  }
}
</script>
