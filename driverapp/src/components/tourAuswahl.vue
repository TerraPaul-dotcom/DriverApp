<template>
  <v-dialog
    v-model="this.$store.getters.dialogTourAuswahl"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{}">
      <!-- <v-btn
          color="primary"
          dark
          v-on="on"
        >
          Open Dialog
        </v-btn> -->
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.prevent="toggleDisplayTourAuswahl()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Tour Auswahl</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <!-- <v-btn
              dark
              text
              @click="dialogUser = false"
            >
              Save
            </v-btn> -->
        </v-toolbar-items>
      </v-toolbar>
      <v-list three-line subheader>
        <v-subheader>Auswahl Touren</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Auswahl Tagestour</v-list-item-title>
            <v-list-item-subtitle>Wähle eine heutige Tour</v-list-item-subtitle>
            <v-btn @click="tourAuswaehlen(0)">Tour Vormittag</v-btn>
            <v-btn @click="tourAuswaehlen(1)">Tour Nachmittag</v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
import beispielTouren from '../Beispieldaten/tourenliste_mit_details_reduziert_beispiel_anonymisiert.json'

export default {
  data() {
    return {
      beispielTouren: beispielTouren.touren,
      notifications: false,
    }
  },
  props: {
    dialogTourAuswahl: Boolean,
    on: null
  },
  methods: {
    toggleDisplayTourAuswahl() {
      this.$store.dispatch('updateTourAuswahl', false)
    },
    tourAuswaehlen(nr) {
      /*let ausgewaehlteTour = this.beispielTouren[nr]
       ausgewaehlteTour.tourAbschnitte.forEach(element => { //Da die Schülerdaten manchmal in schuelerKurz und manchmal in tourenPunktSchule stehen, kopiere falls null
        if (element.schuelerKurz === null) {
          element.schuelerKurz = element.tourenPunktSchule
        }
      }) */
      this.$store.dispatch('updateTourCurrent',this.beispielTouren[nr])
      this.$store.dispatch('updateTourAuswahl', false)
    }
  },
  mounted() {
    this.tourAuswaehlen(0)
  }
}
</script>

<style></style>
