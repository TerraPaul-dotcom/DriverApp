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
            
        }
      }
    },
    mounted () {
        
    }

}
</script>

<style>

</style>