<template>
  <!-- 上方navbar & 下方footer -->
  <div id="app">
    <nav class="navbar navbar-light bg-light">
      <router-link class="navbar-brand" to="/">
        <i class="fa fa-heart text-info" aria-hidden="true"></i>
        六角血拼賣賣
      </router-link>
      <!-- 購物車內的數量 (Button 內包含 icon, 數量 badge) -->
      <div class="dropdown ml-auto">
        <button class="btn btn-sm btn-cart" data-toggle="dropdown" data-flip="false">
          <i class="fa fa-shopping-cart text-dark fa-2x" aria-hidden="true"></i>
          <!-- 在講座121把cart{carts:[]}移到store/index.js的state中,所以在computed中使用cart(){return ...}的方式將store.index.js所獲取的值返回到cart()中,即可使用cart.carts -->
          <span class="badge badge-pill badge-danger">{{cart.carts.length}}</span>
          <span class="sr-only">unread messages</span>
        </button>
        <div
          class="dropdown-menu dropdown-menu-right p-3"
          style="min-width: 300px"
          data-offset="400"
        >
          <h6>已選擇商品</h6>
          <table class="table table-sm">
            <tbody>
              <tr v-for="item in cart.carts" :key="item.id" v-if="cart.carts.length">
                <td class="align-middle text-center">
                  <a href="#" class="text-muted" @click.prevent="removeCart(item.id)">
                    <i class="far fa-trash-alt"></i>
                  </a>
                </td>
                <td class="align-middle">{{ item.product.title }}</td>
                <td class="align-middle">{{ item.qty }}{{item.product.unit}}</td>
                <td class="align-middle text-right">{{item.total}}</td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-primary btn-block">
            <i class="fa fa-cart-plus" aria-hidden="true"></i> 結帳去
          </button>
        </div>
      </div>
    </nav>
    <div class="jumbotron jumbotron-fluid jumbotron-bg d-flex align-items-end">
      <div class="container">
        <div class="p-3 bg-lighter">
          <h1 class="display-3 font-weight-bold">買到剁手手！最後出清</h1>
          <p class="lead">
            This is a modified jumbotron that occupies
            the entire horizontal space of its parent.
          </p>
        </div>
      </div>
    </div>
    <Loading :active.sync="isLoading"></Loading>
    <router-view/>
    <footer class="bg-light text-muted py-5">
      <div class="container">
        <ul class="list-inline text-center">
          <li class="list-inline-item">© Copright 2017 六角血拼賣賣</li>
          <li class="list-inline-item">
            <a class="text-info" href="#">
              <i class="fa fa-instagram" aria-hidden="true"></i> Instagrame
            </a>
          </li>
          <li class="list-inline-item">
            <a class="text-info" href="#">
              <i class="fa fa-facebook-square" aria-hidden="true"></i> Facebook
            </a>
          </li>
          <li class="list-inline-item">
            <a class="text-info" href="#">About</a>
          </li>
        </ul>
        <p class="text-center">Made with Bootstrap4</p>
      </div>
    </footer>
  </div>
</template>

<script>
// 使用mapGetters方法在vuex中取得getters{}中全部的內容(在講座122加入)
import { mapGetters, mapActions } from "vuex"; // 去哪兒網也有使用到mapState取得全部的state{}
export default {
  name: "App",
  data() {
    return {
      /*
      cart: {
        在講座121移到store/index.js,並從computed帶進來
        carts: []
      }*/
      // isLoading: false,// 移到store/index.js
    };
  },
  methods: {
    // 第四改：在講座123的(store/index.js加入modules)跟(store/products.js加入namespaced),所以做以下修正
    // 加入namespaced 將actions, mutations, getters改成模組區域變數後,需要將Modules名稱寫入
    ...mapActions("cartModules", ["getCart"]),
    // 第三改：在講座122又將整個getProducts()改成mapActions
    // ...mapActions(["getCart"]),
    // getCart() {
    // this.$store.dispatch("getCart");
    // 第二改：在講座121將以下移到store/index.js
    // const vm = this;
    // 原始範例的內容
    // vm.isLoading = true;
    /**
       * (第一改：非正確寫法,先簡單示範用)
      改成從computed的isLoading去獲取到store/index.js下的isLoading,再藉由computed的isLoading()return給
      </Loading>
       */
    /*
      vm.$store.state.isLoading = true;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      this.$http.get(url).then(response => {
        if (response.data.data.carts) {
          vm.cart = response.data.data;
        }
        vm.$store.state.isLoading = false;
        console.log("取得購物車", response.data.data);
      });*/
    // },
    removeCart(id) {
      // 講座123在products.js跟cart.js加入了namespaced將actions, mutations, getters改成模組區域變數後,就只能傳送到App.vue自己的actions, mutations, getters,若要傳送到外部檔案,需要寫入Modules名稱。
      // 這裡要透過dispatch()發送到外部檔案的removeCart(),所以需要將Modules名稱寫入。
      this.$store.dispatch("cartModules/removeCart", id); // 透過dispatch()發送到actions
      // root 可以思考為回到頂層,相當於 "絕對路徑"的概念,所以在 products 模組中是需要先回到根層才能進入其他模組。
      // 而在其他的 Vue 元件中就是直接載入根層的模組,所以可以直接寫上路徑。

      // 在講座121移到store/index.js
      /*
      const vm = this;
      const url = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/cart/${id}`;
      vm.$store.state.isLoading = true;
      this.$http.delete(url).then(response => {
        vm.$store.state.isLoading = false;
        vm.getCart();
        console.log("刪除購物車項目", response);
      });*/
    }
  },
  created() {
    this.getCart();
  },
  computed: {
    // 將store/index.js的state結果讀出來
    // 使用isLoading這個名稱是爲了要跟<!-- <Loading :active.sync="isLoading"></Loading> -->做綁定
    /*isLoading() {
      return this.$store.state.isLoading;
    },
    cart() {
      return this.$store.state.cart;
    }*/
    // 以上在122講座移到store/index.js的getters:{}
    // 加入namespaced 將actions, mutations, getters改成模組區域變數後,需要將Modules名稱寫入
    ...mapGetters("cartModules", ["isLoading", "cart"])
  }
};
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
.jumbotron-bg {
  /* banners.png */
  background: url("https://images.unsplash.com/photo-1477901492169-d59e6428fc90?w=1350");
  background-size: cover;
  background-position: center center;
  min-height: 400px;
}

/* 半透明背景 */
.bg-lighter {
  background-color: rgba(255, 255, 255, 0.45);
}

/* 購物車按鈕 */
.btn-cart {
  background-color: transparent;
  position: relative;
}

/* 購物車按鈕定位 */
.btn-cart .badge {
  position: absolute;
  top: 1px;
  right: 1px;
}

.main-content {
  min-height: calc(100vh - 56px - 176px);
}

.box-shadow {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
  transition: 0.3s linear;
}

.box-shadow:hover {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.08);
}

.dropdown-menu-right {
  right: 0;
  left: auto;
}

.alert-rounded {
  border-radius: 50px;
}
</style>
