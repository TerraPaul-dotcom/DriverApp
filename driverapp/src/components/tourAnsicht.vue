<template>
  <div id="app">
    <!-- Hinweis falls keine Tour ausgewählt -->
    <span v-if="!tourAbschnitte.length"
      >Keine Tour Ausgewählt, bitte Tour auswählen.</span
    >

    <!-- Nachricht an Fahrer*in -->
    <v-alert
      v-model="this.$store.getters.dialogNachrichtAnFahrer"
      color="blue-grey"
      dense
      dismissible
      type="info"
    >
      Aktuelle Nachricht an Fahrer*in: Schüler Karl Weber ist krank und muss
      nicht abgeholt werden.
    </v-alert>

    <!-- Progress Bar -->
    <v-progress-linear
      :value="(abschnittCurrent / tourAbschnitte.length) * 100"
      color="primary"
      v-if="abschnittCurrent <= tourAbschnitte.length && abschnittCurrent >= 0"
    ></v-progress-linear>

    <!-- Tour Ansicht -->
    <v-stepper
      class="d-flex flex-column mb-6"
      v-model="abschnittCurrent"
      vertical
      v-if="
        abschnittCurrent <= tourAbschnitte.length &&
          abschnittCurrent >= 0 &&
          tourGesamtFortschritt.tourAbschnitte.length
      "
    >
      <div v-for="(abschnitt, j) in tourAbschnitte" :key="j">
        <!-- Abschnitt Titel mit Name und Adresse etc. -->
        <v-stepper-step
          :step="j"
          icon="message"
          :complete="abschnittCurrent > j"
          v-if="abschnittCurrent <= j"
          >{{
            `${abschnitt.haltepunktStrasseUndNummer}, ${abschnitt.haltepunktOrt} (${abschnitt.uhrzeitBeginnStrFormatiertHhMm})`
          }}
          <small>{{ `${abschnitt.nameSchuleOderSchueler}` }}</small>
          <v-btn
            color="primary"
            @click.prevent="abschnittClickStop()"
            :disabled="abschnittStatus > 0"
            block
            v-if="j === abschnittCurrent"
            class="mt-2"
            >{{ `Stop` }}
          </v-btn>
        </v-stepper-step>
        <!-- Abschnitt Content -->
        <v-stepper-content :step="j">
          <!-- If Schüler -->
          <v-card class=" px-3 pb-2" max-width="500" v-if="abschnittStatus > 0">
            <div
              v-if="abschnitt.istEsEinSchueler === true && abschnittStatus > 0"
            >
              <div class="text-center text-uppercase">
                <div class="py-2">{{ abschnitt.nameSchuleOderSchueler }}:</div>
              </div>
              <v-btn
                block
                class="mb-2"
                color="success"
                @click.prevent="schuelerAuswahlEinstieg(j)"
              >
                Einstieg
              </v-btn>

              <v-btn
                block
                color="error"
                elevation="1"
                @click.prevent="schuelerAuswahlKeinEinstieg(j)"
                class="mb-2"
              >
                Kein Einstieg
              </v-btn>

              <v-card
                class="py-2 px-1"
                v-if="abschnittStatus === 3"
                elevation="1"
              >
                <v-list>
                  <v-list-item-group v-model="ausgewaehlteOptionenKeinEinstieg">
                    <v-list-item
                      v-for="(item, i) in ausgewaehlteOptionenKeinEinstieg"
                      :key="i"
                    >
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item"
                          @click.prevent="schuelerAuswahlGrundKeinEinstieg()"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </div>

            <!-- If Schule -->
            <div
              v-if="abschnitt.istEsEineSchule === true && abschnittStatus > 0"
            >
              <span>{{ textEinOderAusstiegBeiSchule }}</span>
              <v-spacer></v-spacer>

              <v-switch
                v-for="(person, k) in tourAbschnitte"
                :key="k"
                :label="person.nameSchuleOderSchueler"
                :true-value="true"
                :false-value="false"
                color="success"
                v-model="ausstiegEinstiegAuswahl[k]"
                class="ml-4"
              >
              </v-switch>
              <v-btn
                @click.prevent="schuelerAlleAuswaehlenAusstiegEinstieg()"
                small
                class="ml-4 mb-4"
                >Alle Auswählen</v-btn
              >
              <v-btn
                @click.prevent="schuleClickOkNachAuswaehlen()"
                small
                block
                class="ml-4 mb-4"
                >Ok</v-btn
              >
            </div>
          </v-card>
        </v-stepper-content>
      </div>
    </v-stepper>

    <!-- Start-Stop-Button -->

    <v-btn
      rounded
      block
      color="primary"
      elevation="2"
      @click.prevent="starteBeendeTour()"
      v-if="
        (abschnittCurrent === -1 && tourAbschnitte.length) ||
          abschnittCurrent === tourAbschnitte.length
      "
      class="my-5"
    >
      {{ buttonTextStartStop }}
    </v-btn>
    <div class="text-center">
      <small
        v-if="
          (abschnittCurrent === -1 && tourAbschnitte.length) ||
            abschnittCurrent === tourAbschnitte.length
        "
        >Aktuell ausgewählte Tour: "{{ this.tourGesamt.tourName }}"</small
      >
    </div>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" timeout="10000">
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- tourBeendet-Dialog -->
    <tourBeendet @tourReset="tourReset()" />
  </div>
</template>

<script>
import tourBeendet from './tourBeendet'

export default {
  data() {
    return {
      abschnittCurrent: -1, //-1. Tour noch nicht gestartet, 0. erster Abschnitt, 1. zweiter Abschnitt ...usw
      abschnittStatus: 0, //Status pro Abschnitt. 0. Noch keine Eingabe, 1. Stop geklickt 2. Auswahl Einstieg Ja, 3. Auswahl Einstieg Nein, 4. Auswahl Grund kein Einstieg, 5. Weiterfahrt geklickt
      einstiegJaNein: null, //Auswahl ob Schüler*in zugestiegen ist
      ausgewaehlteOptionenKeinEinstieg: ['Krankheit', 'Unklar'], //Optionen falls keine Einstieg
      snackbar: false, //toggle Anzeige snackbar
      snackbarText: null,
      tourGesamtFortschritt: [], //Kopie der aktuellen Tour. In dieses Objekt werden updates geschrieben. TODO: entscheiden ob besser direkt in store geschrieben wird.
      ausstiegEinstiegAuswahl: [], //Hilfsvariable, um mehrere schülerinnen auswählen zu können
      geolocation: null //abfrage der geolocation
    }
  },
  components: {
    tourBeendet //Popup sobald tour beendet ist
  },
  computed: {
    tourAbschnitte() {
      return this.$store.getters.tourCurrentAbschnitte
    },
    tourGesamt() {
      return this.$store.getters.tourCurrent
    },
    buttonTextStartStop() {
      if (this.tourAbschnitte.length && this.abschnittCurrent === -1) {
        return `Starte Tour`
      } else if (this.abschnittCurrent === this.tourAbschnitte.length) {
        return 'Beende Tour'
      } else {
        return null
      }
    },
    textEinOderAusstiegBeiSchule() {
      //Text ändert sich, je nachdem ob Hintour oder Rücktour
      if (this.tourGesamt.rueckfahrtAsStringMini === 'H') {
        return 'Ausgestiegene Schüler*innen auswählen'
      } else if (this.tourGesamt.rueckfahrtAsStringMini === 'R') {
        return 'Eingestiegene Schüler*innen auswählen'
      } else return ''
    }
  },
  methods: {
    starteBeendeTour() {
      if (this.abschnittCurrent === -1) {
        this.$store.dispatch('updateTourCurrentGestartet', true)
        this.$emit('startTimer')
        this.abschnittCurrent = 0
        this.tourGesamtFortschritt = this.tourGesamt
        this.tourGesamtFortschritt.tourAbschnitte.forEach(element => {
          //TODO: hier entscheiden, ob es dieses zusatz braucht oder ob man besser direkt in des store schreibt
          //temporär, falls key noch nicht existiert
          element.ausgestiegen = null
          element.eingestiegen = null
        })
        this.getGpsLocation()
      } else {
        //Button Tour beenden
        this.$emit('stopTimer')
        this.$store.dispatch('dialogUpdateTourBeendet', true)
        this.$store.dispatch('updateTourCurrentGestartet', false)
        this.getGpsLocation()
      }
    },
    abschnittClickStop(nummerAbschnitt) {
      this.abschnittStatus = 1
      this.einstiegJaNein = null
      return nummerAbschnitt //nummerAbschnitt ist noch unused
    },
    schuelerAuswahlEinstieg(nummerAbschnitt) {
      this.abschnittStatus = 0
      this.abschnittCurrent += 1
      this.ausgewaehlteOptionenKeinEinstieg = [] //nach übergabe an die datenbank werte zurücksetzen für den nächsten Abschnit
      //tourAbschnitte Progress anpassen (Einstiege, Ausstiege usw.)
      this.tourGesamtFortschritt.tourAbschnitte[ //TODO: hier entscheiden ob und wohin das geschrieben wird. eventuell direkt ins store tour object?
        nummerAbschnitt
      ].eingestiegen = new Date()
      this.tourGesamtFortschritt.tourAbschnitte[
        nummerAbschnitt
      ].ausgestiegen = null
    },
    schuelerAuswahlKeinEinstieg(nummerAbschnitt) {
      this.abschnittStatus = 3
      this.tourGesamtFortschritt.tourAbschnitte[ //TODO: hier entscheiden ob und wohin das geschrieben wird. eventuell direkt ins store tour object?
        nummerAbschnitt
      ].eingestiegen = null
      this.tourGesamtFortschritt.tourAbschnitte[
        nummerAbschnitt
      ].ausgestiegen = null
    },
    schuelerAuswahlGrundKeinEinstieg(nummerAbschnitt) {
      this.schuelerAuswahlEinstieg(nummerAbschnitt) //TODO: vorübergehende Lösung, hier wird grund für nicht einstieg noch nirgends hingeschrieben
    },
    schuelerAlleAuswaehlenAusstiegEinstieg() { //TODO: temporäre lösung um alle schülerinnen auszuwählen
      this.ausstiegEinstiegAuswahl = []
      for (let i = 0; i < this.tourAbschnitte.length; i++) {
        this.ausstiegEinstiegAuswahl.push(true)
      }
    },
    schuleClickOkNachAuswaehlen() { //TODO: temporäre Lösung für den Prototyp
      this.abschnittStatus = 0
      this.abschnittCurrent += 1
    },
    tourReset() {
      this.$emit('resetTimer')
      this.$store.dispatch('dialogUpdateTourBeendet', false)
      this.$store.dispatch('updateTourCurrent', [])
      this.$store.dispatch('updateTourCurrentGestartet', false)
      this.abschnittStatus = 0
      this.einstiegJaNein = null
      this.abschnittCurrent = -1
      this.ausgewaehlteOptionenKeinEinstieg = []
      this.tourGesamtFortschritt = []
      this.ausstiegEinstiegAuswahl = []
    },
    getGpsLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.geolocation = position

            //snackbar
            this.snackbarText = `Geloggte GPS Position: ${this.geolocation.coords.latitude}; ${this.geolocation.coords.longitude}`
            this.snackbar = true
          },
          function(error) {
            alert(error.message)
          },
          {
            enableHighAccuracy: true,
            timeout: 5000
          }
        )
      } else {
        alert('Die Abfrage der Geokoordinaten wird von Ihrem Browser nicht unterstützt.') 
      }
    }
  }
}
</script>

<style></style>
