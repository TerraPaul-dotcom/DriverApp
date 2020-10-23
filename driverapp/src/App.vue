<template>
  <v-app>
    <v-app-bar app color="light" light dense>
      <v-container fill-height>
        <v-spacer></v-spacer>
        <!-- stop-watch -->
        <span
          class="float-right"
          dense
          v-if="this.$store.getters.tourCurrent.length"
          >{{ formattedElapsedTime }}</span
        >
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <loginLogout />
        <tourAuswahl />
        <tourAnsicht @start="start" @stop="stop" @reset="reset"/>
      </v-container>
    </v-main>

    <v-footer app>
      <v-bottom-navigation
        class="bottom-navigation"
        :value="valueBottomNavigation"
        color="light"
        grow
      >
        <v-btn @click.prevent="toggleDisplayTourAuswahl()">
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
  </v-app>
</template>

<script>
import tourAnsicht from './components/tourAnsicht'
import loginLogout from './components/loginLogout'
import tourAuswahl from './components/tourAuswahl'

export default {
  name: 'App',

  data() {
    return {
      valueBottomNavigation: 1,
      elapsedTime: 0,
      timer: undefined
    }
  },
  components: {
    tourAnsicht,
    loginLogout,
    tourAuswahl
  },
  methods: {
    toggleDisplayLoginLogout() {
      this.$store.dispatch('updateLoginLogout', true)
    },
    toggleDisplayTourAuswahl() {
      this.$store.dispatch('updateTourAuswahl', true)
    },
    start() {
      this.timer = setInterval(() => {
        this.elapsedTime += 1000
      }, 1000)
    },
    stop() {
      clearInterval(this.timer)
      this.$store.dispatch('updateTourCurrentDauer', this.formattedElapsedTime)
    },
    reset() {
      this.elapsedTime = 0
    }
  },
  computed: {
    formattedElapsedTime() {
      const date = new Date(null)
      date.setSeconds(this.elapsedTime / 1000)
      const utc = date.toUTCString()
      return utc.substr(utc.indexOf(':') - 2, 8)
    }
  }
}
</script>
