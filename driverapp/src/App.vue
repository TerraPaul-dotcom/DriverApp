<template>
  <v-app>
    


    <v-app-bar
      app
      color="primary"
      light
    >
    <v-row justify="center">
      <startStopTour/>
    </v-row>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <loginLogout/>
        <tourAnsicht/>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    
      <v-footer app>
  <v-bottom-navigation class="bottom-navigation"
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
    @click.prevent = "toggleDisplayLoginLogout()"
      ><span>Benutzer*in</span>

      <v-icon>mdi-account</v-icon>
    </v-btn>
    
  </v-bottom-navigation>
  </v-footer>
    

  </v-app>
</template>

<script>
import tourAnsicht from './components/tourAnsicht'
import loginLogout from './components/loginLogout'
import startStopTour from './components/startStopTour'

export default {
  name: 'App',

  data () {
    return {
      valueBottomNavigation: 1
    }
  },

  components: {
    tourAnsicht,
    loginLogout,
    startStopTour
  },
  methods: {
    toggleDisplayLoginLogout () {
        this.$store.dispatch("updateLoginLogout", true)
    }
}
}
</script>
