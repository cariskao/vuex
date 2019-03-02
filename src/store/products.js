import axios from 'axios'

// (講座123從store/index.js拆分二部分,產品部分的state、actions、mutations、getters移過來這裡)
// state現在是屬於模組區域變數
// actions, mutations, getters 是屬於全域變數,所以在store內的其它模組不可使用相同名稱,但是可使用namespaced改成區域變數
export default {
  namespaced: true, // 將actions, mutations, getters改成模組區域變數
  // 加入此語法可在console提示語法錯誤
  // strict: true, // 必要再用,挺容易報錯
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
      // 講座123加入root,讓modules知道這個commit是一個全域的LOADING
      context.commit('LOADING', true, {
        root: true
      })
      // 在非vue組件下無法直接使用this,所以只能使用傳統axios方式(要先import axios)
      // this.$http.get(url).then(response => {
      axios.get(url).then(response => {
        context.commit('PRODUCTS', response.data.products)
        context.commit('GATEGORIES', response.data.products)
        // context.commit('LOADING', false)
        // 講座123加入root,讓modules知道這個commit是一個全域的LOADING
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
    // 把Home.vue computed下的categories()跟products()移過來
    // state爲上方資料狀態的state
    // return回去到Home.vue的mapGeeters
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
