<template>
  <v-bottom-navigation
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

    <v-btn
      v-on="on">
      <span>Benutzer*in</span>

      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
name: 'Bottom-Navigation',

data: () => ({
    valueBottomNavigation: 1
  })

}
</script>

<style>

</style>