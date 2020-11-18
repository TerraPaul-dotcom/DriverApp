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
            setTimeout(() => this.temporaereMethodeFürSubmitWegenTimeout(), 7000)
            
        }
      },
      temporaereMethodeFürSubmitWegenTimeout () {
        this.$store.dispatch('updateTourCurrentUebertragungAbgeschlossen', true)
        this.$store.dispatch('updateTourCurrentGestartet', false)
        
      }
    },
    mounted () {
      
      },
    
    

}
</script>

<style>

</style>