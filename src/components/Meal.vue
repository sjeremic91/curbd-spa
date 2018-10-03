<template>
  <b-card no-body class="meal h-100" header-bg-variant="dark" header-text-variant="white">
    <div class="d-flex justify-content-between" slot="header">
      <div class="align-self-center">
        {{meal.title}}
      </div>
      <div class="ml-1 d-flex flex-nowrap align-self-start">
      
      <b-button size="sm" class="mr-1" @click="$emit('update')" variant="outline-warning">
        <i class="fa fa-edit"></i>
      </b-button>
      <b-button size="sm" @click="$emit('delete')" variant="outline-danger">
        <i class="fa fa-trash"></i>
      </b-button>
      </div>
    </div>

    <b-card-body class="d-flex flex-column justify-content-between">
      <div class="d-flex justify-content-between mb-3">
        <img :src="getImage(imagePath)" class="mr-3 w-25 align-self-start img-thumbnail">
        <div>
          <b-badge variant="primary" class="mr-1" v-if="meal.gluten_free">Gluten Free</b-badge>
          <b-badge variant="primary" class="mr-1" v-if="meal.extra_hot">Extra Hot</b-badge>
          <b-badge variant="primary" class="mr-1" v-if="meal.dairy_free">Dairy Free</b-badge>
          <b-badge variant="primary" v-if="meal.vegeterian">Vegeterian</b-badge>
        </div>
      </div>


      <div class="d-flex card-text justify-content-between">
        <b-button @click="$emit('show-items')" variant="outline-info" size="sm" ><i class="fa fa-list"></i>  Items: {{meal.count_condiments}}</b-button>
        <span class="align-self-end">
          Price: <b>${{meal.price}}</b> 
        </span>

    </div>
      </b-card-body>
  </b-card>
</template>

<script>

export default {
  props :{ 
    meal : {
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
    imagePath() {
      if (this.meal.image_path)
        return '/meals/'+this.meal.image_path
      return '/meals/noimagefound.jpg'
    },
  }
}

</script>

<style lang="scss">

</style>
