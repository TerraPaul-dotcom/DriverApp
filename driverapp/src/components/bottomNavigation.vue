<template>
  <v-footer app>
    <v-bottom-navigation
      class="bottom-navigation"
      :value="valueBottomNavigation"
      color="teal"
      grow
    >
      <v-btn>
        <span>Alle Touren</span>

        <v-icon>mdi-bus-multiple</v-icon>
      </v-btn>

      <v-btn>
        <span>Aktuelle Tour</span>

        <v-icon>mdi-bus</v-icon>
      </v-btn>

      <v-btn @click.prevent="toggleDisplayLoginLogout()"
        ><span>Benutzer*in</span>

        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-footer>
</template>

<script>
export default {
  name: 'Bottom-Navigation',

  data: () => ({
    valueBottomNavigation: 1
  }),

  components: {},
  methods: {
    toggleDisplayLoginLogout() {
      this.$store.dispatch('updateLoginLogout', true)
    }
  }
}
</script>

<style>
bottom-navigation {
  padding-top: 10px;
}
</style>
