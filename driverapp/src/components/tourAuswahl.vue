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
import tour430 from '../Beispieldaten/schuelerliste-tour-T:430.json'

export default {
  data() {
    return {
      tour430: tour430.schuelerAlleKurzeTour,
      notifications: false,
      alleTagesTouren: [
        [
          //Test Tour. Array of Objects, ), Reihenfolge beginnt mit 0
          {
            straße: 'Seebahnstraße 44',
            ort: 'Waldburg',
            name: 'Nina Meier',
            handicap: 'Rollstuhl',
            stopsReihenfolge: 0
          },
          {
            straße: 'Ottostraße 34',
            ort: 'Waldburg',
            name: 'Olga Müller',
            handicap: 'Rollstuhl',
            stopsReihenfolge: 1
          },
          {
            straße: 'Friedensstrasse 23',
            ort: 'Hasenburg',
            name: 'Hannes Fritz',
            handicap: 'Rollstuhl',
            stopsReihenfolge: 2
          },
          {
            straße: 'Eckstraße 22',
            ort: 'Mittfelden',
            name: 'Karsten Hagen',
            handicap: 'Rollstuhl',
            stopsReihenfolge: 3
          }
        ],
        [
          //Test Tour. Array of Objects, ), Reihenfolge beginnt mit 0
          {
            straße: 'AlteStrasse 44',
            ort: 'Waldburg',
            name: 'Anton Meier',
            stopsReihenfolge: 0
          },
          {
            straße: 'Ottostraße 34',
            ort: 'Waldburg',
            name: 'Olga Müller',
            stopsReihenfolge: 1
          },
          {
            straße: 'Friedensstrasse 23',
            ort: 'Hasenburg',
            name: 'Hannes Fritz',
            stopsReihenfolge: 2
          },
          {
            straße: 'Eckstraße 22',
            ort: 'Mittfelden',
            name: 'Karsten Hagen',
            stopsReihenfolge: 3
          },
          {
            straße: 'AlteStrasse 44',
            ort: 'Waldburg',
            name: 'Anton Meier',
            stopsReihenfolge: 4
          },
          {
            straße: 'Ottostraße 34',
            ort: 'Waldburg',
            name: 'Olga Müller',
            stopsReihenfolge: 5
          },
          {
            straße: 'Friedensstrasse 23',
            ort: 'Hasenburg',
            name: 'Hannes Fritz',
            stopsReihenfolge: 6
          },
          {
            straße: 'Eckstraße 22',
            ort: 'Mittfelden',
            name: 'Karsten Hagen',
            stopsReihenfolge: 7
          },
          {
            straße: 'AlteStrasse 44',
            ort: 'Waldburg',
            name: 'Anton Meier',
            stopsReihenfolge: 8
          },
          {
            straße: 'Ottostraße 34',
            ort: 'Waldburg',
            name: 'Olga Müller',
            stopsReihenfolge: 9
          },
          {
            straße: 'Friedensstrasse 23',
            ort: 'Hasenburg',
            name: 'Hannes Fritz',
            stopsReihenfolge: 10
          },
          {
            straße: 'Eckstraße 22',
            ort: 'Mittfelden',
            name: 'Karsten Hagen',
            stopsReihenfolge: 11
          }
        ],
        [
          //Test Tour. Array of Objects, ), Reihenfolge beginnt mit 0
          {
            straße: 'Seebahnstraße 44',
            ort: 'Waldburg',
            name: 'Nina Meier',
            handicap: 'Rollstuhl',
            stopsReihenfolge: 0
          },
          {
            straße: 'Ottostraße 34',
            ort: 'Waldburg',
            name: 'Olga Müller',
            stopsReihenfolge: 1
          }
        ]
      ]
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
    tourAuswaehlen() {
      this.$store.dispatch('updateTourCurrent',this.tour430)
      this.$store.dispatch('updateTourAuswahl', false)
    }
  },
  mounted() {
    this.tourAuswaehlen()
  }
}
</script>

<style></style>
