<template>
  <div id="app">
    <v-btn
      rounded
      block
      color="primary"
      elevation="2"
      @click.prevent="starteTour()"
      v-if="stepCurrent === 0"
      style="margin-bottom: 12px"
    >
      Starte Tour
    </v-btn>

    <!-- Progress Bar -->
    <v-progress-linear :value="((stepCurrent - 1 )/ tour.length ) * 100" color="teal"></v-progress-linear>
    
    <v-stepper v-model="stepCurrent" vertical v-if="stepCurrent <= tour.length">
      <div v-for="step in tour" :key="step.stopsReihenfolge">
        <v-stepper-step 
          :step="step.stopsReihenfolge + 1"
          :complete="stepCurrent > step.stopsReihenfolge + 1"
          v-if="stepCurrent - 1 <= step.stopsReihenfolge"
          >{{
            `${tour[step.stopsReihenfolge].straße}, ${
              tour[step.stopsReihenfolge].ort
            }`
          }}
          <small>{{ `${tour[step.stopsReihenfolge].name}` }}</small>
        </v-stepper-step>

        <v-stepper-content :step="step.stopsReihenfolge + 1">
          <v-card class="mx-auto" min-height="200" max-width="500"
            ><v-btn
              color="primary"
              @click.prevent="clickStop()"
              :disabled="stepStatus > 0"
              block
              >Stop</v-btn
            >

            <v-btn
              v-if="stepStatus > 0"
              block
              color="success"
              @click.prevent="auswahlEinstieg()"
            >
              Einstieg
            </v-btn>
            <v-btn
              v-if="stepStatus > 0"
              block
              color="error"
              @click.prevent="auswahlKeinEinstieg()"
            >
              Kein Einstieg
            </v-btn>

            <v-list>
              <v-list-item-group
                v-model="selecteOptionsKeinEinstieg"
                color="indigo"
                v-if="stepStatus === 3"
              >
                <v-list-item v-for="(item, i) in itemsKeinEinstieg" :key="i">
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.text"
                      @click.prevent="auswahlGrundKeinEinstieg()"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-stepper-content>
      </div>
    </v-stepper>
    <v-btn
      rounded
      block
      color="primary"
      elevation="2"
      @click.prevent="beendeTour()"
      v-if="stepCurrent === tour.length + 1"
      style="margin-top: 100px"
    >
      Beende Tour
    </v-btn>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" timeout="3000">
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
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
      stepCurrent: 0,
      stepStatus: 0, //0. Noch keine Eingabe, 1. Stop geklickt 2. Auswahl Einstieg Ja, 3. Auswahl Einstieg Nein, 4. Auswahl Grund kein Einstieg, 5. Weiterfahrt geklickt
      einstiegJaNein: null,
      itemsKeinEinstieg: [
        {
          text: "Krankheit",
        },
        {
          text: "Unklar",
        },
      ],
      selecteOptionsKeinEinstieg: [],
      snackbar: false,
      snackbarText: null,
    };
  },
  computed: {},
  methods: {
    starteTour() {
      this.stepCurrent = 1;
    },
    clickStop(nummerStop) {
      this.stepStatus = 1;
      this.einstiegJaNein = null;
      return nummerStop;
    },
    auswahlEinstieg(nummerStop) {
      this.stepStatus = 0;
      this.stepCurrent += 1;
      this.snackbarText = "Zwischenhalt gespeichert";
      this.snackbar = true;
      this.selecteOptionsKeinEinstieg = []; //nach übergabe an die datenbank werte zurücksetzen
      return nummerStop;
    },
    auswahlKeinEinstieg(nummerStop) {
      this.stepStatus = 3;
      return nummerStop;
    },
    auswahlGrundKeinEinstieg(nummerStop) {
      this.auswahlEinstieg(nummerStop);
    },
    beendeTour() {},
  },
  components: {},
};
</script>

<style>

</style>