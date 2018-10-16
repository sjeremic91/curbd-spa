<template>
  <div class="container-fluid">
    <div class="order-header d-lg-flex justify-content-between">
      <h1 class="d-none d-lg-block align-self-center">Orders</h1>
      <b-form-input size="lg" class="search-input" v-model="search" @keyup.native="filterOrders()" placeholder="Search..."></b-form-input>
    </div>
    <b-row class="orders-wrapper">
      <b-col sm="12" md="6" lg="4"  v-for="order in filteredOrders">
        <app-order :order="order" :key="order.id" @show-items="showModal"></app-order>
      </b-col>
    
    </b-row>

    <b-modal v-if="selectedOrder" ref="orderItemsModal" size="lg" hide-footer title="Order Items">
      <div class="d-flex justify-content-between mb-3">
        <b-badge variant="danger"> <i class="fa fa-truck"></i> {{selectedOrder.truck.name}}</b-badge>
        <b-badge variant="warning"> <i class="fa fa-clock"></i> {{formatDate(selectedOrder.created_at)}}</b-badge>
      </div>
      Total: <strong>${{selectedOrder.price}}</strong>
      <b-list-group class="mb-3">
        <b-list-group-item v-for="item in selectedOrder.order_item" :key="item.id">
          <b-row>
            <b-col>
          {{item.meal.title}}
          <b-badge variant="success">{{item.meal.meal_cat.name}}</b-badge>
            </b-col>
            <b-col class="text-right">
            <small class="text-muted d-block">
              Condiments: {{getCondimentList(item)}}
            </small>

            <small class="text-muted text-nowrap d-block">
              Condiment Price:<strong> ${{item.price_condiment}} </strong>
            </small>
            <small class="text-muted text-nowrap d-block">
              Price:<strong> ${{item.price}} </strong>
            </small>
            </b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
      <b-btn class="float-right" variant="outline-default" @click="hideModal">Close</b-btn>
    </b-modal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import AppOrder from '@/components/Order'

export default {
  components : {AppOrder},
  computed : mapGetters({orders: 'orders/orders'}),
  data() {
    return {
      table_fields: ['status'],
      filteredOrders: [],
      search: '',
      selectedOrder : null
    }
  },
  async created() {
    await this.$store.dispatch('orders/fetchOrders');
    //this.$tours['myTour'].start()
    this.filteredOrders = this.orders;

  },
  methods: {
    getItemsCount(order) {
      return order.order_item.length;
    },
    formatDate(date) {
      return this.moment(date).format('M/D/YYYY h:mm a')
    },
    filterOrders() {
      this.filteredOrders = this.orders.filter((order) => {
        //return order.truck.name.toLowerCase().includes(this.search.toLowerCase()) || order.status.toLowerCase().includes(this.search.toLowerCase())
        return this.smartSearch(order.truck.name, this.search) ||
          this.smartSearch(order.status, this.search) || 
          this.smartSearch(this.formatDate(order.created_at), this.search)  ||
          ('#'+order.id).includes(this.search)  
      });
    },
    smartSearch(haystack, needle) {
      haystack = haystack.toLowerCase()
      needle = needle.toLowerCase()

      let j = 0;
      for (let i = 0; i < haystack.length; i++) {
        if (haystack[i] == needle[j] && j < needle.length) {
          j++;
        }
        if (j == needle.length)
          return true;
      }

      return j == needle.length;

    },
    showModal (order) {
      console.log(order)
      this.selectedOrder = order;
      this.$nextTick(() => {
      this.$refs.orderItemsModal.show()
      });
    },
    getCondimentList(order_item) {
      let condiments = [] 
      for (let i = 0; i < order_item.condiment.length; i++) {
        condiments.push(order_item.condiment[i].title + " ($"+ order_item.condiment[i].price+")")
      }
      return condiments.join(', ')
    },
    hideModal () {
      this.$refs.orderItemsModal.hide()
    }
  }
}
</script>

<style lang="scss">
@import "../assets/scss/_variables";

.search-input {
  width: 300px;
}


.order-header {
  position: fixed;
  z-index: 1000;
  margin-top: 56px;
  width: 100%;
  background: $gray-500;
  padding: 0.7rem;
  margin-bottom: 1.5rem;
  top:0;
  left:0;
  transition: all 0.3s;
}

.show-sidebar .order-header {
  margin-left: 250px;
  width:calc(100% - 250px);
}

.orders-wrapper {
  margin-top:130px;
}

@media (max-width: 992px) {
.search-input {
  width: 100%;
} 
.order-header {
  width: 100%;

}

.show-sidebar .order-header {
  margin-left: 0;
  width:100% ;
}
}

</style>
