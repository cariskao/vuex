// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import App from './App';
import router from './router';
import Vuex from 'vuex';
import store from './store'

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Vuex);
Vue.component('Loading', Loading);

new Vue({
  el: '#app',
  router,
  store, // 注意不要放到components中
  components: {
    App,
  },
  template: '<App/>',
});
