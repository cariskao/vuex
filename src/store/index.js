import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'

Vue.use(Vuex);

// https://vuex.vuejs.org/zh/api/#vuex-store
export default new Vuex.Store({
  // 加入此語法可在console提示語法錯誤
  // strict: true, // 必要再用,挺容易報錯
  // 資料狀態
  state: {
    isLoading: false, //動畫預設停止
    // 因Home.vue的getUnique()有宣告vm.products & vm.categories
    products: [],
    categories: [],
    // 將App.vue data中的cart資料移過來
    cart: {
      carts: []
    }
  },
  // 操作行爲:傳給mutations來操作資料狀態
  // 以及執行非同步行爲(ajax、setTimeout)
  actions: {
    // context:名稱固定。
    // status:名稱可選,從外部透過dispatch()所傳進來。
    updateLoading(context, status) {
      // 使用commit('函數名稱',要傳遞的參數)傳給mutations
      context.commit('LOADING', status)
    },
    getProducts(context) {
      const url = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products/all`;
      context.commit('LOADING', true)
      // 在非vue組件下無法直接使用this,所以只能使用傳統axios方式(要先import axios)
      // this.$http.get(url).then(response => {
      axios.get(url).then(response => {
        context.commit('PRODUCTS', response.data.products)
        context.commit('GATEGORIES', response.data.products)
        context.commit('LOADING', false)
        console.log("取得產品列表:", response);
      });
    },
    getCart(context) {
      context.commit('LOADING', true)
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      axios.get(url).then(response => {
        if (response.data.data.carts) {
          // vm.cart = response.data.data; // 原本這行改成下行
          context.commit('CART', response.data.data)
        }
        context.commit('LOADING', false)
        console.log("取得購物車", response.data.data);
      });
    },
    removeCart(context, id) {
      const url = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/cart/${id}`;
      context.commit('LOADING', true)
      axios.delete(url).then(response => {
        context.commit('LOADING', false)
        // vm.getCart(); // 原本這行改成下行,重新刷新頁面
        context.dispatch('getCart') //注意:不是this.$store.dispatch()
        console.log("刪除購物車項目", response);
      });
    },
    // addtoCart(context, id, qty) {
    //qty會顯示undefined,因爲actions只能被傳遞一個參數,所以我們使用物件的形式來傳遞與接收
    addtoCart(context, {
      id,
      qty
    }) {
      // console.log(context, id, qty);
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      context.commit('LOADING', true)
      const item = {
        product_id: id,
        qty
      };
      axios.post(url, {
        data: item
      }).then(response => {
        context.commit('LOADING', false)
        //加入購物車後,刷新上方navbar的購物車數量。注意:不是this.$store.dispatch()
        context.dispatch('getCart') // 在Home.vue的addtoCart()沒有做這個部分,之前用$bus.$emit()很難做
        console.log("加入購物車:", response);
      });
    }
  },
  // 操作資料狀態(運作資料)
  // 以及執行同步行爲
  // 注意!! => 非同步(ajax、seTimeout)的行爲不要在mutations做,否則會在vue devtool右邊的vuex項目中發現state跟mutation不同步
  mutations: {
    // 官方建議函數名稱全部用大寫
    // state爲上方資料狀態的state
    // status(payload):名稱可選,由actions所傳進來。
    LOADING(state, status) {
      state.isLoading = status
    },
    PRODUCTS(state, payload) {
      state.products = payload
    },
    GATEGORIES(state, payload) {
      const categories = new Set();
      payload.forEach(item => {
        categories.add(item.category);
      });
      // 將側邊欄的列表資料唯一值存入state.categories
      state.categories = Array.from(categories);
    },
    CART(state, payload) {
      state.cart = payload
    }
  }
});
