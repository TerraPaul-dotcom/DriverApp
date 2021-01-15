<template>
  <div>
    </div>
</template>

<script>
import api from '../api.js'

export default {
  methods: {
    async submitTourenAbgeschlossen(fahrerInput) {
      const res = await api.post(`/tourenAbgeschlossen`, fahrerInput)
      if (res.status === 200) {
        this.updateStore()
      } //TODO: try catch einbauen
    },
    updateStore() {
      this.$store.dispatch('updateTourCurrentUebertragungAbgeschlossen', true)
      this.$store.dispatch('updateTourCurrentGestartet', false)
      this.$store.dispatch('updateTourCurrentBeendet', false)
      this.$store.dispatch('updateLogin', null)
      this.$store.dispatch(
        'updateTourCurrentAktuelleTourVonDatenbankErhalten',
        false
      )
    },
    submitTourenRepeatedly(fahrerInput) {
      let i = 0
      let f = this.submitTourenAbgeschlossen()
      console.log(fahrerInput)
      f(fahrerInput)
      //this.submitTourenAbgeschlossen(fahrerInput)
     /*  while (i < 100) {
        (function(i) {
          setTimeout(function() {
            console.log(i);
            f(fahrerInput);
          }, 5000 * i);
        })
        (i++)
      }  */

      
    }
  },
  mounted() {
    /* if (this.$store.getters.tourCurrentBeendet) {
      this.$store.dispatch('dialogUpdateTourBeendet', true)
      const fahrerInputLocalStorage = localStorage.getItem('tourFahrerInput')
      const fahrerInputLocalStorageGeparsed = JSON.parse(fahrerInputLocalStorage)
      this.submitTourenRepeatedly(fahrerInputLocalStorageGeparsed)
    } */
  }
}
</script>

<style></style>
