<template>
  <div id="app">
  <v-app id="inspire">
    <v-stepper
      v-model="e6"
      vertical
    >
      <v-stepper-step
        :complete="e6 > 1"
        step="1"
      >
        Waldstraße 15, 74382 Waldhausen
        <small>Nina Meier</small>
      </v-stepper-step>
  
      <v-stepper-content step="1">
        <v-card
          color="grey lighten-1"
          class="mb-12"
          height="100px"
        ><br>Feld öffnet sich bei Auswahl, "kein Einstieg" mit Optionen warum Einstieg nicht erfolgreich.</v-card>
        
        <v-btn
          color="primary"
          @click="e6 = 2"
        >
          Person eingestiegen
        </v-btn>
        <v-btn text>
          Kein Einstieg
        </v-btn>
        
      </v-stepper-content>
  
      <v-stepper-step
        :complete="e6 > 2"
        step="2"
      >
        Ziegelstraße, stadt
      </v-stepper-step>
  
      <v-stepper-content step="2">
        <v-card
          color="grey lighten-1"
          class="mb-12"
          height="200px"
        ></v-card>
        <v-btn
          color="primary"
          @click="e6 = 3"
        >
          Continue
        </v-btn>
        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>
  
      <v-stepper-step
        :complete="e6 > 3"
        step="3"
      >
        Oberstraße, ort
      </v-stepper-step>
  
      <v-stepper-content step="3">
        <v-card
          color="grey lighten-1"
          class="mb-12"
          height="200px"
        ></v-card>
        <v-btn
          color="primary"
          @click="e6 = 4"
        >
          Continue
        </v-btn>
        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>
  
      <v-stepper-step step="4">
        Zwischenstraße, ort
      </v-stepper-step>
      <v-stepper-content step="4">
        <v-card
          color="grey lighten-1"
          class="mb-12"
          height="200px"
        ></v-card>
        <v-btn
          color="primary"
          @click="e6 = 1"
        >
          Continue
        </v-btn>
        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>
    </v-stepper>
  </v-app>
</div>
</template>

<script>
export default {
    data () {
    return {
      e6: 1,
      
    }
  }
}
</script>

<style>

</style>