<template>
  <div id="app">
    <!-- Hinweis falls keine Tour ausgewählt -->
    <span v-if="!tourAbschnitte.length"
      >Keine Tour Ausgewählt, bitte Tour auswählen.
    </span>

    {{ abschnittFahrerInput }}

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
      v-if="abschnittCurrent <= tourAbschnitte.length && abschnittCurrent >= 0"
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
            @click.prevent="abschnittClickStop(j)"
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
              <!-- If Hintour -->
              <div v-if="tourGesamt.rueckfahrtAsStringMini === 'H'">
                <div class="text-center text-uppercase">
                  <div class="py-2">
                    {{ abschnitt.nameSchuleOderSchueler }}:
                  </div>
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
                    <v-list-item-group
                      v-model="ausgewaehlteOptionenKeinEinstieg"
                    >
                      <v-list-item
                        v-for="(item, i) in optionenKeinEinstieg"
                        :key="i"
                      >
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="item.beschriftung"
                            @click.prevent="
                              ausgewaehlteOptionenKeinEinstieg = i
                              schuelerAuswahlGrundKeinEinstieg()
                            "
                          ></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-card>
              </div>
              <!-- if Rücktour -->
              <div v-if="tourGesamt.rueckfahrtAsStringMini === 'R'">
                <div class="text-center text-uppercase">
                  <div class="py-2">
                    {{ abschnitt.nameSchuleOderSchueler }}:
                  </div>
                </div>
                <v-btn
                  block
                  class="mb-2"
                  color="success"
                  @click.prevent="schuelerAuswahlAusstieg(j)"
                >
                  Ausstieg
                </v-btn>
              </div>
            </div>

            <!-- If Schule -->
            <div
              v-if="abschnitt.istEsEineSchule === true && abschnittStatus > 0"
            >
              <span>{{ textEinOderAusstiegBeiSchule }}</span>
              <v-spacer></v-spacer>

              <!-- if Hintour -->
              <div v-if="tourGesamt.rueckfahrtAsStringMini === 'H'">
                <v-switch
                  v-for="(person, k) in tourFahrerInput.tourAbschnitte"
                  :key="k"
                  :label="person.nameSchuleOderSchueler"
                  :true-value="true"
                  :false-value="false"
                  color="success"
                  v-model="ausstiegEinstiegAuswahl[k]"
                  class="ml-4"
                >
                </v-switch>
              </div>

              <!-- if Rücktour -->
              <div v-if="tourGesamt.rueckfahrtAsStringMini === 'R'">
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
              </div>
              <v-btn
                @click.prevent="schuleAlleAuswaehlenAusstiegEinstieg()"
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

      <template v-slot:action="{attrs}">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- tourBeendet-Dialog -->
    <tourBeendet @tourReset="tourReset()" />

    <apiKommunikation ref="apiKommunikation" />
  </div>
</template>

<script>
import tourBeendet from './tourBeendet'
import apiKommunikation from './apiKommunikation'

export default {
  data() {
    return {
      abschnittCurrent: -1, //-1. Tour noch nicht gestartet, 0. erster Abschnitt, 1. zweiter Abschnitt ...usw
      abschnittStatus: 0, //Status pro Abschnitt. 0. Noch keine Eingabe, 1. Stop geklickt 2. Auswahl Einstieg Ja, 3. Auswahl Einstieg Nein, 4. Auswahl Grund kein Einstieg, 5. Weiterfahrt geklickt
      einstiegJaNein: null, //Auswahl ob Schüler*in zugestiegen ist
      optionenKeinEinstieg: [
        {beschriftung: 'DT', id: 97},
        {beschriftung: 'Krankheit', id: 90},
        {beschriftung: 'Nicht gefahren', id: 98},
        {beschriftung: 'Schüleraustausch', id: 93},
        {beschriftung: 'Sonstiger', id: 91},
        {beschriftung: 'Umzug', id: 92},
        {beschriftung: 'Urlaub', id: 94},
        {beschriftung: 'xxxx', id: 95},
        {beschriftung: 'yyyyy', id: 96}
      ], //Optionen falls keine Einstieg
      ausgewaehlteOptionenKeinEinstieg: null,
      snackbar: false, //toggle Anzeige snackbar
      snackbarText: null,
      ausstiegEinstiegAuswahl: [],
      geolocation: null, //abfrage der geolocation TODO: Wird variable weiterhin gebraucht??
      tourFahrerInput: {tourAbschnitte: []},
      //Header: Start/Ende Date, Start/Ende GPS, Name Fahrer, TourId,
      //Abschnitte: Stop Date, Stop GPS, Schule/Schüler, Name Schüler*innen, Einstieg pro Schüler ja/nein, Ausstieg pro Schüler ja/nein,
      abschnittFahrerInput: {}
    }
  },
  components: {
    tourBeendet, //Popup sobald tour beendet ist
    apiKommunikation
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
    async starteBeendeTour() {
      //Tour starten
      if (this.abschnittCurrent === -1) {
        this.$store.dispatch('updateTourCurrentGestartet', true)
        this.$emit('startTimer')
        this.abschnittCurrent = 0
        const position = await this.getGpsLocation()
        const date = new Date().toISOString().replace(/.\d+Z$/g, 'Z')
        this.tourFahrerInput = {
          tourID: this.tourGesamt.tourId,
          fahrzeugId: this.tourGesamt.fahrzeugId,
          sonderfahrtId: this.tourGesamt.sonderfahrtId,
          fahrerId: this.tourGesamt.fahrerId,
          mitBetriebshofKuerzel: this.tourGesamt.mitBetriebshofKuerzel,
          begleitpersonAbholenJaNein: this.tourGesamt
            .begleitpersonAbholenJaNein,
          tourStart: date,
          tourStartGpsX: position[0],
          tourStartGpsY: position[1],
          tourAbschnitte: []
        }
        //TODO: GPS position wird nicht in fahrerinput gespeichert
      } else {
        //Tour beenden
        this.$emit('stopTimer')
        const position = await this.getGpsLocation()
        this.tourFahrerInput.tourStop = new Date()
          .toISOString()
          .replace(/.\d+Z$/g, 'Z')
        this.tourFahrerInput.fahrerId = this.tourGesamt.fahrerId
        this.tourFahrerInput.tourStopGpsX = position[0]
        this.tourFahrerInput.tourStopGpsY = position[1]
        this.$store.dispatch('dialogUpdateTourBeendet', true)
        /* const tourFahrerInputJson = JSON.stringify(this.tourFahrerInput)
        console.log(tourFahrerInputJson) */
        this.$refs.apiKommunikation.submitTourenAbgeschlossen(
          this.tourFahrerInput
        ) // greife auf methode in Componente apiKommunikation zu
      }
    },
    async abschnittClickStop(nummerAbschnitt) {
      this.abschnittStatus = 1
      this.einstiegJaNein = null
      const position = await this.getGpsLocation()
      const date = new Date().toISOString().replace(/.\d+Z$/g, 'Z')
      this.abschnittFahrerInput = {
        tourAbschnittId: this.tourAbschnitte[nummerAbschnitt].tourAbschnittId,
        tourId: this.tourAbschnitte[nummerAbschnitt].tourId,
        fahrzeugId: this.tourAbschnitte[nummerAbschnitt].fahrzeugId,
        fahrerId: this.tourAbschnitte[nummerAbschnitt].fahrerId,
        abschnittGpsX: position[0],
        abschnittGpsY: position[1],
        abschnittStop: date,
        idSchuleOderSchueler: this.tourAbschnitte[nummerAbschnitt]
          .idSchuleOderSchueler
      }
      //TODO: GPS position abrufen und einfügen, achtung gefahr, dass anfangsgps genommen wird mit globaler variable, besser lokale variante um sicher zu gehen.
    },

    schuelerAuswahlEinstieg(nummerAbschnitt) {
      this.abschnittStatus = 0
      this.abschnittCurrent += 1
      this.abschnittFahrerInput.einstieg = {
        [this.tourAbschnitte[nummerAbschnitt].idSchuleOderSchueler]: true
      }
      this.abschnittFahrerInput.auswahlGrundKeinEinstieg = null
      this.tourFahrerInput.tourAbschnitte.push(this.abschnittFahrerInput)
      return nummerAbschnitt
    },
    schuelerAuswahlAusstieg(nummerAbschnitt) {
      this.abschnittStatus = 0
      this.abschnittCurrent += 1
      this.abschnittFahrerInput.ausstieg = {
        [this.tourAbschnitte[nummerAbschnitt].idSchuleOderSchueler]: true
      }
      this.tourFahrerInput.tourAbschnitte.push(this.abschnittFahrerInput)
      return nummerAbschnitt
    },
    schuelerAuswahlKeinEinstieg(nummerAbschnitt) {
      this.abschnittStatus = 3
      this.abschnittFahrerInput.einstieg = {
        [this.tourAbschnitte[nummerAbschnitt].idSchuleOderSchueler]: false
      }
    },
    schuelerAuswahlGrundKeinEinstieg(nummerAbschnitt) {
      this.abschnittFahrerInput.auswahlGrundKeinEinstieg = this.optionenKeinEinstieg[
        this.ausgewaehlteOptionenKeinEinstieg
      ].id
      this.tourFahrerInput.tourAbschnitte.push(this.abschnittFahrerInput)
      this.ausgewaehlteOptionenKeinEinstieg = null
      this.abschnittStatus = 0
      this.abschnittCurrent += 1
      return nummerAbschnitt
    },
    schuleAlleAuswaehlenAusstiegEinstieg() {
      this.ausstiegEinstiegAuswahl = []
      for (let i = 0; i < this.tourAbschnitte.length; i++) {
        this.ausstiegEinstiegAuswahl.push(true)
      }
    },
    schuleClickOkNachAuswaehlen() {
      //if Hintour
      if (this.tourGesamt.rueckfahrtAsStringMini === 'H') {
        let ausstieg = {}
        for (let i = 0; i < this.tourFahrerInput.tourAbschnitte.length; i++) {
          ausstieg[
            this.tourFahrerInput.tourAbschnitte[i].idSchuleOderSchueler
          ] = this.ausstiegEinstiegAuswahl[i]
            ? this.ausstiegEinstiegAuswahl[i]
            : false
        }
        this.abschnittFahrerInput.ausstieg = ausstieg
        this.tourFahrerInput.tourAbschnitte.push(this.abschnittFahrerInput)
      }
      //if Rücktour
      if (this.tourGesamt.rueckfahrtAsStringMini === 'R') {
        let einstieg = {}
        for (let i = 0; i < this.tourAbschnitte.length; i++) {
          einstieg[
            this.tourAbschnitte[i].idSchuleOderSchueler
          ] = this.ausstiegEinstiegAuswahl[i]
        }
        this.abschnittFahrerInput.einstieg = einstieg
        this.tourFahrerInput.tourAbschnitte.push(this.abschnittFahrerInput)
      }
      this.abschnittStatus = 0
      this.abschnittCurrent += 1
    },
    tourReset() {
      this.$emit('resetTimer')
      this.$store.dispatch('dialogUpdateTourBeendet', false)
      this.$store.dispatch('updateTourCurrent', {
        tourAbschnitte: [null, null]
      })
      this.$store.dispatch('updateTourCurrentGestartet', false)
      this.abschnittStatus = 0
      this.einstiegJaNein = null
      this.abschnittCurrent = -1
      this.tourFahrerInput = []
      this.ausstiegEinstiegAuswahl = []
    },
    getGpsLocation() {
      return new Promise(function(resolve, reject) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            /* position => {
              this.geolocation = [position.coords.latitude, position.coords.longitude]
              resolve},
            function(error) {
              alert(error.message)
              reject(error.message)
            },
            {
              enableHighAccuracy: true,
              timeout: 5000
            } */
            position => {
              resolve([position.coords.latitude, position.coords.longitude])
            },
            position => {
              reject('Fehler bei Abruf der Geolocation' + position)
            },
            {
              //TODO: hier error handling bauen
              enableHighAccuracy: true,
              timeout: 5000
            }
          )
        } else {
          alert(
            'Die Abfrage der Geokoordinaten wird von Ihrem Browser nicht unterstützt.'
          )
          reject
        }
      })
    }
  }
}
</script>

<style></style>
