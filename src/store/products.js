import axios from 'axios'

// (講座123從store/index.js拆分二部分,產品部分的state、actions、mutations、getters移過來這裡)
// state是屬於模組區域變數
// actions, mutations, getters 是屬於全域變數,所以在store內的其它模組不可使用相同名稱,但是可使用namespaced改成區域變數比較安全,以避免衝突
export default {
  namespaced: true, // 將actions, mutations, getters改成模組區域變數
  // 加入此語法可在console提示語法錯誤
  strict: true,
  // 資料狀態
  state: {
    // 因Home.vue的getUnique()有宣告vm.products & vm.categories
    products: [],
    categories: [],
  },
  // 操作行爲:傳給mutations來操作資料狀態
  // 以及執行非同步行爲(ajax、setTimeout)
  actions: {
    // context:名稱固定。
    // status:名稱可選,從外部透過dispatch()所傳進來。
    getProducts(context) {
      const url = `${process.env.APIPATH}/api/${
				process.env.CUSTOMPATH
			}/products/all`;
      // context.commit('LOADING', true)
      // 講座123加入root,因爲LOADING的mutations是在cart.js中(state是屬於模組區域變數),如果直接發送的話,modules會不認識,所以我們加入root參數讓modules知道這個commit是一個全域的LOADING變數
      context.commit('LOADING', true, {
        root: true
      })
      // 在非vue組件下無法直接使用this,所以只能使用傳統axios方式(要先import axios)
      // this.$http.get(url).then(response => {
      axios.get(url).then(response => {
        context.commit('PRODUCTS', response.data.products)
        context.commit('GATEGORIES', response.data.products)
        // context.commit('LOADING', false)
        // 講座123加入root,因爲LOADING的mutations是在cart.js中(state是屬於模組區域變數),如果直接發送的話,modules會不認識,所以我們加入root參數讓modules知道這個commit是一個全域的LOADING變數
        context.commit('LOADING', false, {
          root: true
        })
        console.log("取得產品列表:", response);
      });
    },
  },
  // 操作資料狀態(運作資料)
  // 以及執行同步行爲
  // 注意!! => 非同步(ajax、seTimeout)的行爲不要在mutations做,否則會在vue devtool右邊的vuex項目中發現state跟mutation不同步
  mutations: {
    // 官方建議函數名稱全部用大寫
    // state爲上方資料狀態的state
    // status(payload):名稱可選,由actions所傳進來。
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
  },
  // 類似computed,可以直接把要呈現在畫面上的computed移過來
  getters: {
    // 在講座123把Home.vue computed下的categories()跟products()移過來
    // state爲上方資料狀態的state
    /**
     * 功能說明:
     * 把actions獲取的json資料透過mutations放入state.categories跟state.products,再返回到Home.vue的mapGeeters,讓整個Home.vue可以使用。
     */
    /*
    categories(state) {
      return state.categories;
    },
    products(state) {
      return state.products;
    },
		*/
    // 以上getters在講座123改成以下
    categories: state => state.categories,
    products: state => state.products,
  }
};
