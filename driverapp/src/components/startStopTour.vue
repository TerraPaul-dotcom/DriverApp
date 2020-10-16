<template>
  <div>
    <v-btn
    rounded
    block
    dark
    elevation="2"
    v-bind:color="type === false ? 'success' : 'error'"
    @click.prevent = "toggleType()"
    >
    {{ text }}
    </v-btn>
    <v-btn
              color="primary"
              @click.prevent="clickStop()"
              :disabled="stepStatus > 0"
              block
              >Stop</v-btn
            >
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