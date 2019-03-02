import Vue from 'vue';
import Vuex from 'vuex';
// import axios from 'axios' //在講座123都移至store/products.js跟store/cart.js,所以這行不用了
import productsModules from './products' // 在講座123加入
import cartModules from './cart'

Vue.use(Vuex);

// https://vuex.vuejs.org/zh/api/#vuex-store
export default new Vuex.Store({
  // 以下在講座123加入,並將以上分別移至store/products.js跟cart.js
  modules: {
    productsModules,
    cartModules,
  }
});
