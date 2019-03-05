<template>
  <!-- 中間content -->
  <div>
    <div class="container main-content mb-3">
      <!-- <Loading :active.sync="isLoading"></Loading> -->
      <!-- 註解掉,下方vm.isLoading改成vm.$store.state.isLoaidng -->
      <!-- 來改變store/index.js下的state{isLoading}值使之觸發App.vue的</Loading>動畫 -->
      <!-- 也就是說</Loading>動畫改成vuex後,統一由需要的子組件發送$store去改變store/index的isLoaing
      再去觸發父組件App.vue的</Loading>元件來顯示動畫-->
      <div class="row">
        <div class="col-md-3">
          <!-- 左側選單 (List group) -->
          <div class="list-group sticky-top">
            <a
              class="list-group-item list-group-item-action"
              href="#"
              @click.prevent="searchText = item,clickSlide=true"
              :class="{ 'active': item === searchText}"
              v-for="item in categories"
              :key="item"
            >
              <i class="fa fa-street-view" aria-hidden="true"></i>
              {{ item }}
            </a>
            <a
              href="#"
              class="list-group-item list-group-item-action"
              @click.prevent="searchText = ''"
              :class="{ 'active': searchText === ''}"
            >全部顯示</a>
          </div>
        </div>

        <!-- 子頁面 -->
        <div class="col-md-9">
          <div class="d-flex mb-4">
            <!-- Search bar -->
            <form class="form-inline my-3 my-lg-0">
              <div class="input-group">
                <input
                  @keyup.esc="searchText = '',clickSlide=false"
                  class="form-control"
                  type="text"
                  v-model="searchText"
                  placeholder="Search"
                  aria-label="Search"
                >
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="searchText = '',clickSlide=false"
                  >
                    <i class="fa fa-times"></i>
                  </button>
                </div>
              </div>
            </form>
            <button
              class="btn btn-outline-primary ml-auto"
              type="button"
              @click="getProducts"
            >重新取得資料</button>
          </div>
          <!-- content -->
          <div class="tab-pane" id="list-gift">
            <div class="row align-items-stretch">
              <!-- 禮品 -->
              <div class="col-md-4 mb-4" v-for="(item) in filterSearchText" :key="item.id">
                <div class="card border-0 box-shadow text-center h-100">
                  <img class="card-img-top" :src="item.imageUrl" alt="Card image cap">
                  <div class="card-body">
                    <h4 class="card-title">{{ item.title }}</h4>
                    <p class="card-text">{{ item.description }}</p>
                    <p class="card-text text-left">{{ item.content }}</p>
                    <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
                    <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
                    <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
                  </div>
                  <div class="card-footer border-top-0 bg-white">
                    <button
                      class="btn btn-outline-secondary btn-block btn-sm"
                      @click="addtoCart(item.id)"
                    >
                      <i class="fa fa-cart-plus" aria-hidden="true"></i> 加到購物車
                    </button>
                    <!-- {{item.id}} -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 使用mapGetters方法在vuex中取得getters{}中全部的內容(在講座122加入)
import { mapGetters, mapActions } from "vuex"; // 去哪兒網也有使用到mapState取得全部的state{}
export default {
  name: "Home",
  data() {
    return {
      // products: [], // 使用vuex後,名稱會重複,註解掉
      // categories: [], // 使用vuex後,名稱會重複,註解掉
      // isLoading: false, //移到sotre/index.js
      searchText: "",
      clickSlide: false
    };
  },
  methods: {
    // 第四改：在講座123的(store/index.js加入modules)跟(store/products.js加入namespaced),所以做以下修正
    // 加入namespaced 將actions, mutations, getters改成模組區域變數後,需要將Modules名稱寫入
    ...mapActions("productsModules", ["getProducts"]),
    // ...mapActions(["getProducts"]),
    // 第三改：在講座122又將整個getProducts()改成mapActions
    // getProducts() {
    // 第二改：在120講座改成下行(但在講座122又改成mapActions)
    // this.$store.dispatch("getProducts");
    // 在120講座將以下移到/store/index.js的getProducts()
    /*
      const vm = this;
      const url = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products/all`;
      // 原始範例的內容
      // vm.isLoading = true;
      // (第一改：非正確寫法,先簡單示範用)
      // vm.$store.state.isLoading = true;
      // 去改變store/index.js下的state
      // 在講座118改成正確寫法
      vm.$store.dispatch("updateLoading", true);
      this.$http.get(url).then(response => {
        vm.products = response.data.products;
        console.log("取得產品列表:", response);
        vm.getUnique();
        // vm.$store.state.isLoading = false;
        vm.$store.dispatch("updateLoading", false);
      });
    */
    // },

    // PS：但是addtoCart()無法使用mapActions,因爲需要傳遞參數
    addtoCart(id, qty = 1) {
      // 在講座123加入,要證明store/modules下的state是區域變數
      // console.log("證明爲區域變數", this.$store.state.products); // 顯示undefined
      // console.log("證明爲區域變數", this.$store.state.productsModules.products); //正解

      // this.$store.dispatch("addtoCart", id, qty);
      // 因爲actions只能被傳遞一個參數,所以我們使用物件的形式來傳遞與接收
      // this.$store.dispatch("addtoCart", { id, qty });
      // 講座123加入namespaced 將actions, mutations, getters改成模組區域變數後,需要將Modules名稱寫入。
      this.$store.dispatch("cartModules/addtoCart", { id, qty }); // 發送到actions

      // 講座120移到store/index.js的GATEGORIES()
      /*
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      // vm.$store.state.isLoading = true;
      // 改成用vuex,使用dispatch()傳送到store/index.js/actions的updateLoading()
      vm.$store.dispatch("updateLoading", true);
      const item = {
        product_id: id,
        qty
      };
      this.$http.post(url, { data: item }).then(response => {
        // vm.$store.state.isLoading = false;
        vm.$store.dispatch("updateLoading", false);
        console.log("加入購物車:", response);
      });*/
    }
    // 講座120移到store/index.js的GATEGORIES()
    /*
    getUnique() {
      const vm = this;
      const categories = new Set();
      vm.products.forEach(item => {
        categories.add(item.category);
      });
      vm.categories = Array.from(categories);
    }*/
  },
  created() {
    this.getProducts();
  },
  computed: {
    // 判斷content要顯示的項目
    filterSearchText() {
      const vm = this;
      if (!vm.searchText) {
        vm.clickSlide = false;
      }
      if (vm.searchText && !vm.clickSlide) {
        // vm.products對應下方的mapGetters
        return vm.products.filter(item => {
          // 說明:將item.title轉成小寫後,再看裡頭有沒有符合把vm.searchText也轉成小寫的陣列,若爲true就將資料返回到filter,再返回到filterSearchText()
          // includes() 方法用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false。
          // [1, 2, 3].includes(2); // true
          const results = item.title
            .toLowerCase()
            .includes(vm.searchText.toLowerCase());
          // console.log("searchText", vm.searchText);
          return results;
        });
      }
      if (vm.clickSlide) {
        return vm.products.filter(item => {
          // const check = item.category == vm.clickSlide; // 除錯用
          // console.log("clickSlide", check);
          // console.log("clickSlide2", item.category);
          return item.category === vm.searchText;
        });
      }
      // console.log("[filterSearchText-outside]");
      return vm.products;
    },
    // 在122講座移到store/index.js的getters:{}
    /*
    categories() {
      return this.$store.state.categories;
    },
    products() {
      return this.$store.state.products;
    }*/
    // 並在上方import mapGetters後,使用展開的方式「...」取出來
    // ...mapGetters(["categories", "products"])
    // 在講座123的(store/index.js加入modules)跟(store/products.js加入namespaced),所以做以下修正
    // 加入namespaced 將actions, mutations, getters改成模組區域變數後,需要將Modules名稱寫入
    ...mapGetters("productsModules", ["categories", "products"]) // 這條註解也修正,模板跟script都可使用
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
