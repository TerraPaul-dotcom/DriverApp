<template>
  <div>
    <v-btn
    rounded
    dark
    elevation="2"
    v-bind:color="type === false ? 'success' : 'error'"
    small
    @click.prevent = "toggleType()"
    >
    {{ text }}
    </v-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: true,
      text: 'Starte Tour'
    }
  },
  methods: {
    toggleType () {
      this.type = !this.type
      this.text = this.type ? 'Starte Tour' : 'Beende Tour'
    }
  }

}
</script>

<style>

</style>