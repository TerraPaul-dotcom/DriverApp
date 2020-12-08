<template>
  <div></div>
</template>

<script>
import api from '../api.js'

export default {
    methods: {
        async submitTourenAbgeschlossen(fahrerInput) {
        const res = await api.post(`/tourenAbgeschlossen`, fahrerInput)
        if (res.status === 200) {
            setTimeout(() => this.temporaereMethodeFürSubmitWegenTimeout(), 3000)
            
        }//TODO: try catch einbauen
      },
      temporaereMethodeFürSubmitWegenTimeout () {
        this.$store.dispatch('updateTourCurrentUebertragungAbgeschlossen', true)
        this.$store.dispatch('updateTourCurrentGestartet', false)
        this.$store.dispatch('updateLogin', null)
        this.$store.dispatch('updateTourCurrentAktuelleTourVonDatenbankErhalten', false)
        
      }
    },
    mounted () {
      
      },
    
    

}
</script>

<style>

</style>