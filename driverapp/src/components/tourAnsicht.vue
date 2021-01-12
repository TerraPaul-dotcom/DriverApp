<template>
  <div id="app">
    <!-- login falls nicht eingeloggt -->
    <login
      v-if="!this.$store.getters.tourCurrentAktuelleTourVonDatenbankErhalten"
    ></login>

    <div v-if="this.$store.getters.tourCurrentAktuelleTourVonDatenbankErhalten">
      <!-- Hinweis falls keine Tour ausgewählt -->
      <span v-if="!tourAbschnitte.length"
        >Keine Tour Ausgewählt, bitte Tour auswählen.
      </span>

      <!-- Nachricht an Fahrer*in -->
      <v-alert
        v-model="dialogNachrichtAnFahrer"
        color="blue-grey"
        dense
        dismissible
        type="info"
      >
        <small> Aktuelle Nachricht an Fahrer*in</small>
      </v-alert>

      <!-- Progress Bar -->
      <v-progress-linear
        :value="(abschnittCurrent / tourAbschnitte.length) * 100"
        color="primary"
        v-if="
          abschnittCurrent <= tourAbschnitte.length && abschnittCurrent >= 0
        "
      ></v-progress-linear>

      <!-- Tour Ansicht -->
      <v-stepper
        class="d-flex flex-column mb-6"
        v-model="abschnittCurrent"
        vertical
        v-if="abschnittCurrent < tourAbschnitte.length && abschnittCurrent >= 0"
      >
        <div v-for="(abschnitt, j) in tourAbschnitte" :key="j">
          <!-- Abschnitt Titel mit Name und Adresse etc. -->
          <v-stepper-step
            :step="j"
            :complete="abschnittCurrent > j"
            :rules="[
              () =>
                schuelerEingestiegen[j] === true ||
                schuelerEingestiegen[j] === undefined ||
                abschnitt.istEsEineSchule ||
                tourGesamt.rueckfahrtAsStringMini === 'H'
            ]"
            v-if="abschnittCurrent <= j"
            error-icon="$info"
          >
            <small
              v-if="
                schuelerEingestiegen[j] == false &&
                  tourGesamt.rueckfahrtAsStringMini === 'R'
              "
              >Stopp entfällt</small
            >
            {{
              `${abschnitt.haltepunktStrasseUndNummer}, ${abschnitt.haltepunktOrt} (${abschnitt.uhrzeitBeginnStrFormatiertHhMm})`
            }}
            <small>{{ `${abschnitt.nameSchuleOderSchueler}` }}</small>
            <!-- if Schüler Einstieg oder Ausstieg -->
            <v-btn
              color="primary"
              @click.prevent="abschnittClickStop(j)"
              :disabled="abschnittStatus > 0"
              block
              v-if="
                j === abschnittCurrent &&
                  (schuelerEingestiegen[j] == true ||
                    schuelerEingestiegen[j] === undefined ||
                    abschnitt.istEsEineSchule)
              "
              class="mt-2"
              >{{ `Stop` }}
            </v-btn>
            <!-- if Schüler*in nicht aussteigt bei Rücktour weil er/sie nicht eingestiegen ist -->
            <div
              v-if="
                j === abschnittCurrent &&
                  schuelerEingestiegen[j] == false &&
                  !abschnitt.istEsEineSchule &&
                  tourGesamt.rueckfahrtAsStringMini === 'R'
              "
            >
              <div class="text-center">
                <div class="py-2">Nicht eingestiegen</div>
              </div>
              <v-btn
                color="primary"
                @click.prevent="
                  schuelerAuswahlEinstiegOderAusstieg('ausstieg', j, false)
                "
                :disabled="abschnittStatus > 0"
                block
                class="mt-2"
                >{{ `Ok` }}
              </v-btn>
            </div>
          </v-stepper-step>
          <!-- Abschnitt Content -->
          <v-stepper-content :step="j">
            <!-- If Schüler -->
            <v-card
              class=" px-3 pb-2"
              max-width="500"
              v-if="abschnittStatus > 0"
            >
              <div
                v-if="
                  abschnitt.istEsEinSchueler === true && abschnittStatus > 0
                "
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
                    @click.prevent="
                      schuelerAuswahlEinstiegOderAusstieg('einstieg', j, true)
                    "
                  >
                    Einstieg
                  </v-btn>

                  <v-btn
                    block
                    color="error"
                    elevation="1"
                    @click.prevent="
                      schuelerAuswahlEinstiegOderAusstieg('einstieg', j, false)
                    "
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
                    @click.prevent="
                      schuelerAuswahlEinstiegOderAusstieg('ausstieg', j, true)
                    "
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
                    :label="String(person.nameSchuleOderSchueler)"
                    :true-value="true"
                    :false-value="false"
                    color="success"
                    v-model="ausstiegEinstiegAuswahl[k]"
                    :disabled="schuelerEingestiegen[k] == false"
                    v-show="
                      person.idSchule ===
                        tourAbschnitte[abschnittCurrent].idSchule &&
                        !person.istEsEineSchule
                    "
                  >
                  </v-switch>
                </div>

                <!-- if Rücktour -->
                <div v-if="tourGesamt.rueckfahrtAsStringMini === 'R'">
                  <v-btn
                    @click.prevent="
                      schuleAlleAuswaehlenAusstiegEinstieg(
                        tourAbschnitte[abschnittCurrent].idSchule
                      )
                    "
                    small
                    class="ml-4 mb-4"
                    >Alle Auswählen</v-btn
                  >
                  <div
                    v-for="(person, k) in tourAbschnitte"
                    :key="k"
                    v-show="
                      person.idSchule ===
                        tourAbschnitte[abschnittCurrent].idSchule &&
                        !person.istEsEineSchule
                    "
                  >
                    <v-switch
                      :label="person.nameSchuleOderSchueler"
                      :true-value="true"
                      :false-value="false"
                      color="success"
                      v-model="ausstiegEinstiegAuswahl[k]"
                    >
                    </v-switch>
                    <!-- Option für fehlenden Einstieg auswählen -->
                    <!-- TODO: momentan ist grundKeinEinstieg nicht required, überlegen ob das required werden soll und wann -->
                    <v-select
                      :items="optionenKeinEinstieg"
                      :label="person.nameSchuleOderSchueler"
                      item-text="beschriftung"
                      item-value="id"
                      hint="Grund für fehlenden Einstieg"
                      dense
                      persistent-hint
                      v-show="!ausstiegEinstiegAuswahl[k]"
                      v-model="ausgewaehlteOptionenKeinEinstieg[k]"
                    ></v-select>
                  </div>
                </div>
                <v-btn
                  @click.prevent="
                    schuleClickOkNachAuswaehlen(
                      tourAbschnitte[abschnittCurrent].idSchule
                    )
                  "
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
        :disabled="
          this.tourGesamt.tourName === '' ||
            this.tourGesamt.tourName === null ||
            this.tourGesamt.tourName === undefined
        "
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

    <apiSendeAbgeschlosseneTour ref="apiSendeAbgeschlosseneTour" />
  </div>
</template>

<script>
import tourBeendet from './tourAnsichtTourBeendet'
import apiSendeAbgeschlosseneTour from './tourAnsichtApiSendeAbgeschlosseneTour'
import login from './tourAnsichtLogin'


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
      ausgewaehlteOptionenKeinEinstieg: [],
      snackbar: false, //toggle Anzeige snackbar
      snackbarText: null,
      ausstiegEinstiegAuswahl: [],
      geolocation: null, //abfrage der geolocation TODO: Wird variable weiterhin gebraucht??
      tourFahrerInput: {tourAbschnitte: []},
      //Header: Start/Ende Date, Start/Ende GPS, Name Fahrer, TourId,
      //Abschnitte: Stop Date, Stop GPS, Schule/Schüler, Name Schüler*innen, Einstieg pro Schüler ja/nein, Ausstieg pro Schüler ja/nein,
      abschnittFahrerInput: {},
      dialogNachrichtAnFahrer: true,
      schuelerEingestiegen: [] //Wenn Schüler*in nicht einsteigt, wird hier true an die entsprechende Stelle geschrieben. Array wird dann genutzt um, Schüler für den Ausstieg auszublenden.
    }
  },
  components: {
    tourBeendet, //Popup sobald tour beendet ist
    apiSendeAbgeschlosseneTour,
    login
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
  mounted() {
    this.noSleep(true)
  },
  methods: {
    async starteBeendeTour() {
      //Tour starten
      this.noSleep(false)
      if (this.abschnittCurrent === -1) {
        
        this.$store.dispatch('updateTourCurrentGestartet', true)
        this.$emit('startTimer')
        this.abschnittCurrent = 0
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
          tourStop: null,
          tourAbschnitte: [],
          tourStartGpsX: '',
          tourStartGpsY: '',
          tourStopGpsX: '',
          tourStopGpsY: ''
        }
        try {
          const position = await this.getGpsLocation()
          this.tourFahrerInput.tourStartGpsX = position[0]
          this.tourFahrerInput.tourStartGpsY = position[1]
        } catch (e) {
          this.tourFahrerInput.tourStartGpsX = e
          this.tourFahrerInput.tourStartGpsY = e
        }
      } else {
        //Tour beenden
        this.$emit('stopTimer')
        this.tourFahrerInput.tourStop = new Date()
          .toISOString()
          .replace(/.\d+Z$/g, 'Z')
        this.tourFahrerInput.fahrerId = this.tourGesamt.fahrerId
        this.tourFahrerInput.benutzer = this.$store.getters.login.benutzerHashed
        this.tourFahrerInput.passwort = this.$store.getters.login.passwortHashed
        this.$store.dispatch('dialogUpdateTourBeendet', true)
        try {
          const position = await this.getGpsLocation()
          this.tourFahrerInput.tourStopGpsY = position[0]
          this.tourFahrerInput.tourStopGpsX = position[1]
        } catch (e) {
          this.tourFahrerInput.tourStopGpsY = e
          this.tourFahrerInput.tourStopGpsX = e
        } finally {
          this.$refs.apiSendeAbgeschlosseneTour.submitTourenAbgeschlossen(
            this.tourFahrerInput
          ) // greife auf methode in Componente apiSendeAbgeschlosseneTour zu
        }
      }
    },
    async abschnittClickStop(nummerAbschnitt) {
      const date = new Date().toISOString().replace(/.\d+Z$/g, 'Z')
      this.abschnittStatus = 1
      this.einstiegJaNein = null
      this.ausstiegEinstiegAuswahl = []
      this.abschnittFahrerInput = {
        tourAbschnittId: this.tourAbschnitte[nummerAbschnitt].tourAbschnittId,
        abschnittStop: date,
        idSchuleOderSchueler: this.tourAbschnitte[nummerAbschnitt]
          .idSchuleOderSchueler,
        abschnittGpsX: '',
        abschnittGpsY: '',
        idSchule: this.tourAbschnitte[nummerAbschnitt].idSchule, //wird verwendet bei Schule Abschnitten
        idSchueler: this.tourAbschnitte[nummerAbschnitt].idSchueler, //wird verwendet bei Schule Abschnitten
        nameSchuleOderSchueler: this.tourAbschnitte[nummerAbschnitt]
          .nameSchuleOderSchueler, //wird verwendet bei Schule Abschnitten
        istEsEineSchule: this.tourAbschnitte[nummerAbschnitt].istEsEineSchule //wird verwendet um bei Schulen nur Schüler*innen anzuzeigen
      }
      try {
        const position = await this.getGpsLocation()
        this.abschnittFahrerInput.abschnittGpsX = position[0]
        this.abschnittFahrerInput.abschnittGpsY = position[1]
      } catch (e) {
        this.abschnittFahrerInput.abschnittGpsX = e
        this.abschnittFahrerInput.abschnittGpsY = e
      }
      //TODO: GPS position abrufen und einfügen, achtung gefahr, dass anfangsgps genommen wird mit globaler variable, besser lokale variante um sicher zu gehen.
    },
    schuelerAuswahlEinstiegOderAusstieg(
      einstiegOderAusstieg,
      nummerAbschnitt,
      erfolgreich
    ) {
      this.schuelerEingestiegen[nummerAbschnitt] = erfolgreich
      if (einstiegOderAusstieg === 'einstieg') {
        if (erfolgreich) {
          this.abschnittStatus = 0
          this.abschnittCurrent += 1
        } else {
          this.abschnittStatus = 3
        }
      }
      if (einstiegOderAusstieg === 'ausstieg') {
        if (!erfolgreich) this.abschnittClickStop(nummerAbschnitt) //TODO: Ist es bad style hier eine andere methode aufzurufen?
        this.abschnittStatus = 0
        this.abschnittCurrent += 1
      }
      this.abschnittFahrerInput.belegungsaenderung = [
        {
          schuelerId: this.tourAbschnitte[nummerAbschnitt].idSchueler,
          erfolgreich: erfolgreich,
          einstiegOderAusstieg: einstiegOderAusstieg,
          auswahlGrundKeinEinstieg: null
        }
      ]
      if (!(einstiegOderAusstieg === 'einstieg' && !erfolgreich)) this.tourFahrerInput.tourAbschnitte.push(this.abschnittFahrerInput)
    },
    schuelerAuswahlGrundKeinEinstieg() {
      this.abschnittFahrerInput.belegungsaenderung[0].auswahlGrundKeinEinstieg = this.optionenKeinEinstieg[
        this.ausgewaehlteOptionenKeinEinstieg
      ].id
      this.tourFahrerInput.tourAbschnitte.push(this.abschnittFahrerInput)
      this.ausgewaehlteOptionenKeinEinstieg = null
      this.abschnittStatus = 0
      this.abschnittCurrent += 1
    },
    schuleAlleAuswaehlenAusstiegEinstieg(idSchule) {
      //TODO: Alle Auswählen funktioniert nicht!
      //this.ausstiegEinstiegAuswahl = []
      for (let i = 0; i < this.tourAbschnitte.length; i++) {
        if (
          this.schuelerEingestiegen[i] ||
          this.tourGesamt.rueckfahrtAsStringMini === 'R'
        ) {
          this.ausstiegEinstiegAuswahl[i] = true
        }
        return idSchule
      }
    },
    schuleClickOkNachAuswaehlen(idSchule) {
      //if Hintour
      if (this.tourGesamt.rueckfahrtAsStringMini === 'H') {
        this.abschnittFahrerInput.belegungsaenderung = []
        for (let i = 0; i < this.tourAbschnitte.length; i++) {
          let schueler = {
            schuelerId: this.tourAbschnitte[i].idSchueler,
            schulId: this.tourAbschnitte[i].idSchule,
            erfolgreich: this.ausstiegEinstiegAuswahl[i]
              ? this.ausstiegEinstiegAuswahl[i]
              : false,
            einstiegOderAusstieg: 'ausstieg',
            auswahlGrundKeinEinstieg: null
          }
          if (schueler.schuelerId && schueler.schulId === idSchule)
            this.abschnittFahrerInput.belegungsaenderung.push(schueler)
        }
        this.tourFahrerInput.tourAbschnitte.push(this.abschnittFahrerInput)
      }
      //if Rücktour
      if (this.tourGesamt.rueckfahrtAsStringMini === 'R') {
        this.abschnittFahrerInput.belegungsaenderung = []
        for (let i = 0; i < this.tourAbschnitte.length; i++) {
          let schueler = {
            schuelerId: this.tourAbschnitte[i].idSchueler,
            schulId: this.tourAbschnitte[i].idSchule,
            erfolgreich: this.ausstiegEinstiegAuswahl[i] ? true : false,
            einstiegOderAusstieg: 'einstieg',
            auswahlGrundKeinEinstieg:
              this.ausgewaehlteOptionenKeinEinstieg[i] &&
              !this.ausstiegEinstiegAuswahl[i]
                ? this.ausgewaehlteOptionenKeinEinstieg[i]
                : null
          }
          if (schueler.schuelerId && schueler.schulId === idSchule) {
            this.abschnittFahrerInput.belegungsaenderung.push(schueler)
            this.schuelerEingestiegen[i] = this.ausstiegEinstiegAuswahl[i]
              ? true
              : false
          }
        }
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
      this.$store.dispatch('updateTourCurrentUebertragungAbgeschlossen', false)
      this.abschnittStatus = 0
      this.einstiegJaNein = null
      this.abschnittCurrent = -1
      this.tourFahrerInput = {tourAbschnitte: []}
      this.ausstiegEinstiegAuswahl = []
      this.schuelerEingestiegen = []
    },
    getGpsLocation() {
      return new Promise(function(resolve, reject) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              resolve([position.coords.latitude, position.coords.longitude])
            },
            () => {
              reject('Fehler bei Abruf der Geolocation')
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
    },
    noSleep (state) {
      let noSleep = new this.$NoSleep()
      if (state){
        document.addEventListener('click',
        function enableNoSleep () {
          noSleep.enable()
          document.removeEventListener('click', enableNoSleep, false)
        },
        false)
        console.log('enable');
      }
      else {
        let noSleep = new this.$NoSleep()
        noSleep.disable()
        console.log('disable');
      }
    }
  },
  
}
</script>

<style></style>
