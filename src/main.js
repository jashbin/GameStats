import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import TimeSeries from 'fusioncharts/fusioncharts.timeseries';
import CandyTheme from 'fusioncharts/themes/fusioncharts.theme.candy';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import Vue from 'vue';
import VueFusionCharts from 'vue-fusioncharts';

import App from './App.vue'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(
    VueFusionCharts, FusionCharts, Charts, TimeSeries, FusionTheme, CandyTheme);

new Vue({
  render: h => h(App),
}).$mount('#app')
