import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// https://vuex.vuejs.org/zh/api/#vuex-store
export default new Vuex.Store({
  // 加入此語法可在console提示語法錯誤
  // strict: true, // 必要再用,挺容易報錯
  // 資料狀態
  state: {
    isLoading: false, //動畫預設停止
    // 因Home.vue的getUnique()有宣告vm.products & vm.categories

  },
  // 操作行爲:傳給mutations來操作資料狀態
  // 以及執行非同步行爲(ajax、setTimeout)
  actions: {
    // context:名稱固定。
    // status:名稱可選,從外部透過dispatch()所傳進來。
    updateLoading(context, status) {
      // 使用commit('函數名稱',要傳遞的參數)傳給mutations
      context.commit('LOADING', status)
    }
  },
  // 操作資料狀態(運作資料)
  // 以及執行同步行爲
  // 注意!! => 非同步(ajax、seTimeout)的行爲不要在mutations做,否則會在vue devtool右邊的vuex項目中發現state跟mutation不同步
  mutations: {
    // 官方建議函數名稱全部用大寫
    // state爲上方資料狀態的state
    // status:名稱可選,由actions所傳進來。
    LOADING(state, status) {
      state.isLoading = status
    }
  }
});
