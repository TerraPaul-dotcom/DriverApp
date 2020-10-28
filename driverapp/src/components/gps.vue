<template>
  <div>
    <v-btn @>get geolocation</v-btn>
    <span> {{ coordinates }} </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: null,
      coordinates: null
    }
  },
  methods: {
    getLocation() {
      this.$getLocation(this.options).then(coordinates => {
        this.coordinates = coordinates
        console.log(coordinates)
      })
    }
  }
}
</script>

<style></style>
