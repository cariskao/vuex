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
    isLoading: false, //動畫預設停止
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
      // 因爲LOADING的mutations就在這個檔案中,所以不用加入root參數
    },
    getCart(context) {
      // 因爲LOADING的mutations就在這個檔案中,所以不用加入root參數
      context.commit('LOADING', true)
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      axios.get(url).then(response => {
        if (response.data.data.carts) {
          // vm.cart = response.data.data; // 原本這行改成下行
          context.commit('CART', response.data.data)
        }
        // 因爲LOADING的mutations就在這個檔案中,所以不用加入root參數
        context.commit('LOADING', false)
        console.log("取得購物車", response.data.data);
      });
    },
    removeCart(context, id) {
      const url = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/cart/${id}`;
      // 因爲LOADING的mutations就在這個檔案中,所以不用加入root參數
      context.commit('LOADING', true)
      axios.delete(url).then(response => {
        // 因爲LOADING的mutations就在這個檔案中,所以不用加入root參數
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

      // 因爲LOADING的mutations就在這個檔案中,所以不用加入root參數
      context.commit('LOADING', true)
      const item = {
        product_id: id,
        qty
      };
      axios.post(url, {
        data: item
      }).then(response => {
        // 因爲LOADING的mutations就在這個檔案中,所以不用加入root參數
        context.commit('LOADING', false)
        //加入購物車後,刷新上方navbar的購物車數量。注意:不是this.$store.dispatch()
        context.dispatch('getCart') // 之前用$bus.$emit()做刷新購物車很難做
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
    CART(state, payload) {
      state.cart = payload
    },
  },
  // 類似computed,可以直接把要呈現在畫面上的computed移過來
  getters: {
    // 把App.vue computed下的isLoading()跟carts()移過來
    // state爲上方資料狀態的state
    /**
     * 功能說明:
     * 把actions獲取的json資料透過mutations放入state.isLoading跟state.cart, 再返回到App.vue的mapGeeters, 讓整個Home.vue可以使用。
     */
    /*
    isLoading(state) {
      return state.isLoading;
    },
    cart(state) {
      return state.cart;
    },
    */
    // 以上getters在講座123改成以下
    isLoading: state => state.isLoading,
    cart: state => state.cart,
  },
}
