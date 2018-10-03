<template>
  <b-card :header-bg-variant="headerVariant" class="mb-3" :header-text-variant="textVariant">
    <div slot="header" >
      <strong>#{{order.id}}</strong> 
       <span class="order-status"> {{order.status}}</span>
       <small class="pull-right">
         {{formatedDate}}
       </small>
    </div>
      <p class="card-text">
        <i class="fa fa-truck"></i> {{order.truck.name}} 
      </p>


    <div class="d-flex card-text justify-content-between">
      <b-button @click="$emit('show-items', order)" variant="info" size="sm"><i class="fa fa-list"></i>  Items: {{order.order_item.length}}</b-button>
      <span>
      Total: <b>${{order.price}}</b> 
      </span>
    
    </div>
  </b-card>
</template>

<script>

export default {
  props :{ 
    order : {
      type: Object,
      required: true
    }
  },
  computed: {
    headerLabel() {
      return "<strong>#"+this.order.id+ "</strong> "+this.order.status
    },
    formatedDate() {
      return this.moment(this.order.created_at).format('M/D/YYYY h:mm a')
    },
    textVariant() {
      if (this.order.state < 9)
        return 'white'
      return 'black'
    },
    headerVariant() {
      if (this.order.state ==  1)
        return 'primary'
      if (this.order.state == 2)
        return 'success'
      if (this.order.state == 3)
        return 'info'
      if (this.order.state == 4)
        return 'warning'
      if (this.order.state == 5)
        return 'danger'
      if (this.order.state == 6)
        return 'secondary'
      if (this.order.state == 7)
        return 'light'
      if (this.order.state == 8)
        return 'dark'
      return 'default'
    }
  }
}

</script>

<style>
@media (max-width: 1350px) {
.order-status {
  display: none;
}
}
</style>
