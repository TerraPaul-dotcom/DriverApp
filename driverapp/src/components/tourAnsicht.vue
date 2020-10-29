<template>
  <div id="app">
    <span v-if="!this.tourAbschnitte.length"
      >Keine Tour Ausgewählt, bitte Tour auswählen.</span
    >
    <!-- Austieg Schule -->
      <v-card class="mb-4" v-if="this.stepCurrent === this.tourAbschnitte.length + 1">
        
          <v-card-title>Ausstieg</v-card-title>
          <v-card-subtitle>Ausgestiegene Schüler*innen auswählen</v-card-subtitle>
           <v-spacer></v-spacer>

          <v-switch
          v-for="(ausstieg, k) in tourGesamtFortschritt"
          :key="k"
          :label="`${tourGesamtFortschritt[k].nachname}, ${tourGesamtFortschritt[k].vorname}`"
          :true-value="true"
          :false-value="false"
          color="success"
          v-model="ausstiegAuswahl[k]"
          class="ml-4">
          </v-switch>

          <v-btn @click.prevent="alleAuswaehlenAusstieg()" small class="ml-4 mb-4">Alle Auswählen</v-btn>
        
      </v-card>
      


    <!-- Start-Stop-Button -->
    <v-btn
      rounded
      block
      color="primary"
      elevation="2"
      @click.prevent="starteBeendeTour()"
      v-if="
        (stepCurrent === 0 && tourAbschnitte.length) ||
          stepCurrent === tourAbschnitte.length + 1
      "
      class="my-5"
    >
      {{ buttonTextStartStop }}
    </v-btn>

    <!-- Progress Bar -->
    <v-progress-linear
      :value="((stepCurrent - 1) / tourAbschnitte.length) * 100"
      color="primary"
      v-if="stepCurrent <= tourAbschnitte.length"
    ></v-progress-linear>

    <!-- Tour Ansicht -->
    <v-stepper
      class="d-flex flex-column mb-6"
      v-model="stepCurrent"
      vertical
      v-if="stepCurrent <= tourAbschnitte.length"
    >
      <div v-for="(abschnitt, j) in tourAbschnitte" :key="j">
        <v-stepper-step
          :step="j + 1"
          :complete="stepCurrent > j + 1"
          v-if="stepCurrent - 1 <= j"
          >{{
            `${abschnitt.haltepunktStrasseUndNummer}, ${
              abschnitt.haltepunktOrt
            }`
          }}
          <small>{{
            `${abschnitt.nameSchuleOderSchueler}, Hilfsmittel: ${
              abschnitt.hilfsmittellll?abschnitt.hilfsmittellll:'-'
            }`
          }}</small>
        </v-stepper-step>

        <v-stepper-content :step="j + 1">
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
              @click.prevent="auswahlEinstieg(j)"
            >
              Einstieg
            </v-btn>
            <v-btn
              v-if="stepStatus > 0"
              block
              color="error"
              @click.prevent="auswahlKeinEinstieg(j)"
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

    <!-- tourBeendet-Dialog -->
      <tourBeendet @tourReset="tourReset()"/>
  </div>
</template>

<script>
import tourBeendet from './tourBeendet'

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
      tourGesamtFortschritt: [],
      ausstiegAuswahl: []
    }
  },
  components: {
    tourBeendet
  },
  computed: {
    tourAbschnitte() {
      return this.$store.getters.tourCurrentAbschnitte
    },
    tourGesamt() {
      return this.$store.getters.tourCurrent
    },
    buttonTextStartStop() {
      if (this.tourAbschnitte.length && this.stepCurrent === 0) {
        return 'Starte Tour'
      } else if (this.stepCurrent === this.tourAbschnitte.length + 1) {
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
        this.tourGesamtFortschritt = this.tourGesamt
        this.tourGesamtFortschritt.tourAbschnitte.forEach(element => {
          //temporär, falls key noch nicht existiert
          element.ausgestiegen = null
          element.eingestiegen = null
        })
      } else {
        //Button Tour beenden
        this.$emit('stop')
        this.$store.dispatch('updateTourBeendet', true)

        //Snackbar
        this.snackbarText = 'Tour erfolgreich beendet'
        this.snackbar = true
      }
    },
    clickStop(nummerAbschnitt) {
      this.stepStatus = 1
      this.einstiegJaNein = null
      return nummerAbschnitt //nummerAbschnitt ist noch unused
    },
    auswahlEinstieg(nummerAbschnitt) {
      this.stepStatus = 0
      this.stepCurrent += 1
      this.selecteOptionsKeinEinstieg = [] //nach übergabe an die datenbank werte zurücksetzen

      //tourAbschnitte Progress anpassen (Einstiege, Ausstiege usw.)
      this.tourGesamtFortschritt.tourAbschnitte[nummerAbschnitt].eingestiegen = new Date.now()
      this.tourGesamtFortschritt.tourAbschnitte[nummerAbschnitt].ausgestiegen = null

      //snackbar
      this.snackbarText = 'Zwischenhalt gespeichert'
      this.snackbar = true
    },
    auswahlKeinEinstieg(nummerAbschnitt) {
      this.stepStatus = 3

      //tourAbschnitte Progress anpassen (Einstiege, Ausstiege usw.)
      this.tourGesamtFortschritt.tourAbschnitte[nummerAbschnitt].eingestiegen = null
      this.tourGesamtFortschritt.tourAbschnitte[nummerAbschnitt].ausgestiegen = null
    },
    auswahlGrundKeinEinstieg(nummerAbschnitt) {
      this.auswahlEinstieg(nummerAbschnitt)
    },
    alleAuswaehlenAusstieg() {
      this.ausstiegAuswahl = []
      for (let i = 0; i < this.tourGesamtFortschritt.length; i++){
        this.ausstiegAuswahl.push(true)
      }
    },
    tourReset() {
      this.$emit('reset')
      this.$store.dispatch('updateTourBeendet', false)
      this.stepStatus = 0
      this.einstiegJaNein = null
      this.stepCurrent = 0
      this.$store.dispatch('updateTourCurrent', [])
    }
  },
}
</script>

<style></style>
