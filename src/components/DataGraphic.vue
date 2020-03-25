<template>
  <b-container fluid class="p-0 w-100 h-100" style="background-color: #2e3136;">
    <h1 style="color:white;">Graphique Trop Bien</h1>
    <div id="chart-container">
      <fusioncharts
        :type="type"
        :width="width"
        :height="height"
        :dataFormat="dataFormat"
        :dataSource="dataSource"
      >
      </fusioncharts>
    </div>
  </b-container>
</template>

<script>
import FusionCharts from "fusioncharts";
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
  chart: {
    data: null,
    caption: "Test Fusion Chart",
    subcaption: "Twitch",
    xaxis: "date",
    xaxisname: "Temps",
    yaxis: "viewers",
    yaxisname: "Views",
    theme: "fusion",
    lineThickness: "2"
  }
};
export default {
  data() {
    return {
      jsonFile: Object,
      chartData: Object,
      renderAt: "chart-container",
      width: "550",
      height: "350",
      type: "line",
      dataFormat: "json",
      dataSource
    };
  },
  methods: {
    getJsonfile() {
      this.jsonFile = require("../assets/354.json");
    },
    getChartData() {
      /*this.chartData = this.jsonFile["points"];
      const fusionDataStore = new FusionCharts.DataStore();
      const fusionTable = fusionDataStore.createDataTable(
        this.chartData,
        schema
      );
      this.dataSource.data = fusionTable;*/
    }
  },
  beforeMount: function() {
    this.getJsonfile();
  },
  computed: {},
  mounted: function() {
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
    });
  }
};
</script>

<style scoped></style>
