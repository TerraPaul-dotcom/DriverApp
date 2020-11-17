<template>
  <div></div>
</template>

<script>
import api from '../api.js'

export default {
    methods: {
        async submitTourenAbgeschlossen(fahrerInput) {
            console.log(fahrerInput)
        const res = await api.post(`/tourenAbgeschlossen`, fahrerInput)
        if (res.status === 200) {
            console.log('tourAbgeschlossen übertragen');
        }
      }
    },
    mounted () {
        
    }

}
</script>

<style>

</style>