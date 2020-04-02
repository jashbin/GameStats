<template>
  <div>
    <fusioncharts
      :type="type"
      :width="width"
      :height="height"
      :dataFormat="dataFormat"
      :dataSource="dataSource"
    >
    </fusioncharts>
  </div>
</template>

<script>
import FusionCharts from "fusioncharts";
import { APIKEY } from "../apiKeys.js";
const axios = require("axios");

let schema = [
  {
    name: "date",
    type: "date",
    format: "%Y-%m-%d %H:%M:%S %Z" // 2020-03-09 07:30:01 +0100
  },
  {
    name: "viewers",
    type: "number"
  }
];
let dataSource = {
  data: null,
  chart: {
    exportEnabled: 1,
    xaxis: "date",
    xaxisname: "Temps",
    yaxis: "viewers",
    yaxisname: "Views",
    theme: "candy",
    lineThickness: "2"
  },
  caption: {
    text: "Twitch"
  },
  subcaption: {
    text: "Nombre de viewers"
  }
};
export default {
  props: {
    search: {
      type: String,
      default: "allGame"
      /*validator: function(value) {
        return value > 1 && value <= 100;
      }*/
    }
  },
  data() {
    return {
      jsonFile: Object,
      chartData: Object,
      renderAt: "chart-container",
      width: "100%",
      height: "400",
      type: "timeseries",
      dataFormat: "json",
      dataSource,
      gameName: "",
      gameId: Number
    };
  },
  methods: {
    getJsonfile() {
      //console.log("JSON");
      if (this.gameId >= 0)
        this.jsonFile = require("../assets/gamesStats/" +
          this.gameId +
          ".json");
      else this.jsonFile = {};
    },
    drawGraph() {
      //console.log("Draw");
      // In this Promise we will create our DataStore and using that we will create a custom DataTable which takes two
      // parameters, one is data another is schema.
      Promise.all([this.jsonFile["points"], schema]).then(res => {
        const data = res[0];
        const schema = res[1];
        // First we are creating a DataStore
        const fusionDataStore = new FusionCharts.DataStore();
        // After that we are creating a DataTable by passing our data and schema as arguments
        const fusionTable = fusionDataStore.createDataTable(data, schema);
        // After that we simply mutated our timeseries datasource by attaching the above
        // DataTable into its data property.
        this.dataSource.data = fusionTable;

        this.dataSource.caption.text = "Twitch - " + this.gameName;
      });
    },
    idToName() {
      return new Promise((resolve, reject) => {
        axios
          .get("https://api.twitch.tv/helix/games?id=" + this.gameId, {
            headers: {
              "Client-ID": APIKEY.twitch
            }
          })
          .then(response => {
            if (response.data.data[0]) {
              this.gameName = response.data.data[0].name;
              //console.log(this.gameName);
              resolve(this.gameName);
            } else {
              this.gameName = "Top Games";
              reject();
            }
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      });
    },
    nameToId(name) {
      //console.log("nameToId");
      return new Promise((resolve, reject) => {
        axios
          .get("https://api.twitch.tv/helix/games?name=" + name, {
            headers: {
              "Client-ID": APIKEY.twitch
            }
          })
          .then(response => {
            //console.log(response.data.data[0].id);
            if (response.data.data[0]) {
              this.gameId = response.data.data[0].id;
              resolve(this.gameId);
            } else {
              this.gameId = -1;
              reject();
            }
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      });
    },
    traiterSearch() {
      if (this.search.length <= 0 || this.search == "allGame") {
        //console.log("Affichage des viewers globals");
        this.gameName = "Top Games";
        this.jsonFile = {};
      } else {
        this.nameToId(this.search)
          .catch(() => {
            this.gameName = "Top Games";
            this.jsonFile = {};
          })
          .then(() => this.getJsonfile())
          .then(() => this.idToName())
          .catch(() => {
            this.gameName = "Top Games";
            this.jsonFile = {};
          })
          .then(() => this.drawGraph());
        /*return new Promise((resolve, reject) => {
          axios.get(this.apiTool, {
          })
          .then(function (response) {
              console.log(response.data);
              resolve(response.data);
          })
          .catch(function (error) {
              console.log(error);
              reject(error)
          });
        })*/
      }
    }
  },
  beforeMount: function() {},
  computed: {},
  mounted: function() {
    this.traiterSearch();
  },
  watch: {
    search: function() {
      this.traiterSearch();
    }
  }
};
</script>

<style scoped></style>
