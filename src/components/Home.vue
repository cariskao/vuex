<template>
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
              @click.prevent="searchText = item"
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
                  class="form-control"
                  type="text"
                  v-model="searchText"
                  placeholder="Search"
                  aria-label="Search"
                >
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button" @click="searchText = ''">
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
              <div class="col-md-4 mb-4" v-for="(item) in filterData" :key="item.id">
                <div class="card border-0 box-shadow text-center h-100">
                  <img class="card-img-top" :src="item.image" alt="Card image cap">
                  <div class="card-body">
                    <h4 class="card-title">{{ item.title }}</h4>
                    <p class="card-text text-left">{{ item.content }}</p>
                  </div>
                  <div class="card-footer border-top-0 bg-white">
                    <button
                      class="btn btn-outline-secondary btn-block btn-sm"
                      @click="addtoCart(item.id)"
                    >
                      <i class="fa fa-cart-plus" aria-hidden="true"></i> 加到購物車
                    </button>
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
export default {
  name: "Home",
  data() {
    return {
      // products: [], // 重複名稱註解掉
      searchText: ""
      // categories: [] // 重複名稱註解掉
      // isLoading: false //移到sotre/index.js
    };
  },
  methods: {
    getProducts() {
      // 在120講座改成下行
      this.$store.dispatch("getProducts");
      // 在120講座將以下移到/store/index.js的getProducts()
      /*
      const vm = this;
      const url = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products/all`;
      // 原本
      // vm.isLoading = true;
      // 第一次改成下行(非正確寫法,先方便理解)
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
    },
    addtoCart(id, qty = 1) {
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
      });
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
    filterData() {
      const vm = this;
      if (vm.searchText) {
        return vm.products.filter(item => {
          const data = item.title
            .toLowerCase()
            .includes(vm.searchText.toLowerCase());
          return data;
        });
      }
      return this.products;
    },
    categories() {
      return this.$store.state.categories;
    },
    products() {
      return this.$store.state.products;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
