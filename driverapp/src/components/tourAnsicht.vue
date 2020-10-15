<template>
  <div id="app">
    <v-app id="inspire">
      <v-stepper v-model="stepCurrent" vertical>
        <div v-for="step in tour" :key="step.stopsReihenfolge">
          <v-stepper-step
            :step="step.stopsReihenfolge + 1"
            :complete="stepCurrent > step.stopsReihenfolge + 1"
            >{{
              `${tour[step.stopsReihenfolge].straße}, ${
                tour[step.stopsReihenfolge].ort
              }`
            }}
            <small>{{ `${tour[step.stopsReihenfolge].name}` }}</small>
          </v-stepper-step>

          <v-stepper-content :step="step.stopsReihenfolge + 1"
            ><v-btn color="primary" @click.prevent="clickStop()">Stop</v-btn>
            <v-btn-toggle
              v-model="einstiegJaNein"
              tile
              color="deep-purple accent-3"
              group
              v-if="stepStatus > 0"
            >
              <v-btn small @click.prevent="auswahlEinstieg()"> Einstieg </v-btn>
              <v-btn small @click.prevent="auswahlKeinEinstieg()"> Kein Einstieg </v-btn>
            </v-btn-toggle>

            <v-card class="mx-auto" max-width="400">
              <v-list>
                <v-list-item-group v-model="selecteOptionsKeinEinstieg" multiple color="indigo" v-if="stepStatus === 3">
                  <v-list-item v-for="(item, i) in itemsKeinEinstieg" :key="i">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
            <v-btn color="primary" @click.prevent="clickWeiterfahrt()">Weiterfahrt </v-btn>
          </v-stepper-content>
        </div>
      </v-stepper>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      timeout="3000"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    </v-app>
  </div>
</template>

<script>
export default {
  data() {
    return {
      e6: 1,
      tour: [
        //Test Tour. Array of Objects, ), Reihenfolge beginnt mit 0
        {
          straße: "Seebahnstraße 44",
          ort: "Waldburg",
          name: "Nina Meier",
          stopsReihenfolge: 0,
        },
        {
          straße: "Ottostraße 34",
          ort: "Waldburg",
          name: "Olga Müller",
          stopsReihenfolge: 1,
        },
        {
          straße: "Friedensstrasse 23",
          ort: "Hasenburg",
          name: "Hannes Fritz",
          stopsReihenfolge: 2,
        },
        {
          straße: "Eckstraße 22",
          ort: "Mittfelden",
          name: "Karsten Hagen",
          stopsReihenfolge: 3,
        },
      ],
      stepCurrent: 1,
      stepStatus: 0, //0. Noch keine Eingabe, 1. Stop geklickt 2. Auswahl Einstieg Ja, 3. Auswahl Einstieg Nein, 4. Auswahl Grund kein Einstieg, 5. Weiterfahrt geklickt
      einstiegJaNein: null,
      itemsKeinEinstieg: [
        {
          text: 'Krankheit'
        },
        {
          text: 'Unklar'
        }
      ],
      selecteOptionsKeinEinstieg: [],
      snackbar: false,
      snackbarText: null

    };
  },
  computed: {},
  methods: {
    clickStop (nummerStop) {
      this.stepStatus = 1
      this.einstiegJaNein = null
      return nummerStop
    },
    auswahlEinstieg (nummerStop) {
      this.stepStatus = 2
      return nummerStop
    },
    auswahlKeinEinstieg (nummerStop) {
      this.stepStatus = 3
      return nummerStop
    },
    clickWeiterfahrt (nummerStop) {
      this.stepStatus = 0
      this.stepCurrent += 1
      this.snackbarText = 'Zwischenhalt gespeichert' 
      this.snackbar = true
      return nummerStop
    }
  }
};
</script>

<style>
</style>