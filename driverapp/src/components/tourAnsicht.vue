<template>
  <div id="app">
    <span v-if="!this.$store.getters.tourCurrent.length"
      >Keine Tour Ausgewählt, bitte Tour auswählen.</span
    >

    <!-- Austieg Schule -->
      <v-card class="mb-4" v-if="this.stepCurrent === this.tour.length + 1">
        
          <v-card-title>Ausstieg</v-card-title>
          <v-card-subtitle>Ausgestiegene Schüler*innen auswählen</v-card-subtitle>
           <v-spacer></v-spacer>

          <v-checkbox
          v-for="(ausstieg, k) in tourProgress"
          :key="k"
          :label="tourProgress[k].name"
          :true-value="true"
          :false-value="false"
          color="success"
          v-model="tourProgress[k].ausgestiegen"
          class="ml-6">
          </v-checkbox>

          <v-btn @click.prevent="alleAuswaehlenAusstieg()" small class="ml-6 mb-4">(Alle Auswählen)</v-btn>
        
      </v-card>
      


    <!-- Start-Stop-Button -->
    <v-btn
      rounded
      block
      color="primary"
      elevation="2"
      @click.prevent="starteBeendeTour()"
      v-if="
        (stepCurrent === 0 && this.$store.getters.tourCurrent.length) ||
          stepCurrent === tour.length + 1
      "
      class="my-5"
    >
      {{ buttonTextStartStop }}
    </v-btn>

    <!-- Progress Bar -->
    <v-progress-linear
      :value="((stepCurrent - 1) / tour.length) * 100"
      color="primary"
      v-if="stepCurrent <= tour.length"
    ></v-progress-linear>

    <!-- Tour Ansicht -->
    <v-stepper
      class="d-flex flex-column mb-6"
      v-model="stepCurrent"
      vertical
      v-if="stepCurrent <= tour.length"
    >
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
          <small>{{
            `${tour[step.stopsReihenfolge].name}, Handicap: ${
              tour[step.stopsReihenfolge].handicap
            }`
          }}</small>
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
              @click.prevent="auswahlEinstieg(step.stopsReihenfolge)"
            >
              Einstieg
            </v-btn>
            <v-btn
              v-if="stepStatus > 0"
              block
              color="error"
              @click.prevent="auswahlKeinEinstieg(step.stopsReihenfolge)"
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
      stepCurrent: 0,
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
      snackbarText: null,
      tourProgress: {}
    }
  },
  computed: {
    tour() {
      return this.$store.getters.tourCurrent
    },
    buttonTextStartStop() {
      if (this.$store.getters.tourCurrent.length && this.stepCurrent === 0) {
        return 'Starte Tour'
      } else if (this.stepCurrent === this.tour.length + 1) {
        return 'Beende Tour'
      } else {
        return null
      }
    }
  },
  methods: {
    starteBeendeTour() {
      if (this.stepCurrent === 0) {
        //Button Tour starten
        this.stepCurrent = 1
        this.$emit('start')
        this.tourProgress = this.$store.getters.tourCurrent
        this.tourProgress.forEach(element => {
          //temporär, falls key noch nicht existiert
          element.ausgestiegen = false
          element.eingestiegen = false
        })
      } else {
        //Button Tour beenden
        this.$emit('stop')

        //Snackbar
        this.snackbarText = 'Tour erfolgreich beendet'
        this.snackbar = true
      }
    },
    clickStop(nummerStop) {
      this.stepStatus = 1
      this.einstiegJaNein = null
      return nummerStop //nummerStop ist noch unused
    },
    auswahlEinstieg(nummerStop) {
      this.stepStatus = 0
      this.stepCurrent += 1
      this.selecteOptionsKeinEinstieg = [] //nach übergabe an die datenbank werte zurücksetzen

      //tour Progress anpassen (Einstiege, Ausstiege usw.)
      this.tourProgress[nummerStop].eingestiegen = true
      this.tourProgress[nummerStop].ausgestiegen = false

      //snackbar
      this.snackbarText = 'Zwischenhalt gespeichert'
      this.snackbar = true
    },
    auswahlKeinEinstieg(nummerStop) {
      this.stepStatus = 3

      //tour Progress anpassen (Einstiege, Ausstiege usw.)
      this.tourProgress[nummerStop].eingestiegen = false
      this.tourProgress[nummerStop].ausgestiegen = false
    },
    auswahlGrundKeinEinstieg(nummerStop) {
      this.auswahlEinstieg(nummerStop)
    },
    alleAuswaehlenAusstieg() {
      this.tourProgress.forEach(element => {
        element.ausgestiegen = true
        element.test = 88
      })
    }
  },
  components: {}
}
</script>

<style></style>
