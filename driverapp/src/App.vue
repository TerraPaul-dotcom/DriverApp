<template>
  <v-app>
    <v-app-bar app color="light" light dense>
      <v-container fill-height>
        <small>(Admin:</small>
        <small><a href="https://terradriverapp.de/api/tourenAbgeschlossen/newest" target="_blank">API</a></small>
        <small @click.prevent="toggleDisplayTourAuswahl()">-   Tourauswahl</small>
        <small>)</small>
        <v-spacer></v-spacer>
        <!-- Timer -->
        <span
          class="float-right"
          dense
          v-if="this.$store.getters.tourCurrent"
          >{{ formattedElapsedTime }}</span
        >
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <benutzerKonto />
        <tourAuswahl />
        <tourAnsicht
          @startTimer="startTimer"
          @stopTimer="stopTimer"
          @resetTimer="resetTimer"
        />
      </v-container>
    </v-main>

    <!-- <v-footer app>
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
    </v-footer> -->
  </v-app>
</template>

<script>
import tourAnsicht from './components/tourAnsicht'
import benutzerKonto from './components/benutzerKonto'
import tourAuswahl from './components/tourAuswahl'

export default {
  name: 'App',

  data() {
    return {
      valueBottomNavigation: 1,
      elapsedTime: 0,
      timer: undefined,
      apiUrl: process.env.VUE_APP_API_URL
    }
  },
  components: {
    tourAnsicht,
    benutzerKonto,
    tourAuswahl
  },
  beforeMount() { 
    window.addEventListener("beforeunload", this.preventNav) //Prevent Reload. https://medium.com/js-dojo/how-to-prevent-browser-refresh-url-changes-or-route-navigation-in-vue-132e3f9f96cc
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.preventNav);
  },
  methods: {
    toggleDisplayLoginLogout() {
      this.$store.dispatch('dialogUpdateLoginLogout', true)
    },
    toggleDisplayTourAuswahl() {
      this.$store.dispatch('dialogUpdateTourAuswahl', true)
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.elapsedTime += 1000
      }, 1000)
    },
    stopTimer() {
      clearInterval(this.timer)
      //this.$store.dispatch('updateTourCurrentDauer', this.formattedElapsedTime) //TODO: dauer gibt es nicht mehr im store
    },
    resetTimer() {
      this.elapsedTime = 0
    },
    preventNav(event) { //prevent reload
      if (!this.$store.getters.tourCurrentGestartet) return
      event.preventDefault()
      event.returnValue = ""
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
