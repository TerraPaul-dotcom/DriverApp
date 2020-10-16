<template>
  <div>
    {{ tour[1].straße + tour[1].name }}
    <v-btn
    rounded
    dark
    elevation="2"
    v-bind:color="type === false ? 'success' : 'error'"
    small
    @click.prevent = "toggleType()"
    >
    {{ text }}
    </v-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: true,
      text: 'Starte Tour',
      tour: [
        //Test Tour. Array of Objects, ), Reihenfolge beginnt mit 0
        {
          straße: "Seebahnstraße 44",
          ort: "Waldburg",
          name: "Nina Meier",
          stopsReihenfolge: 0,
        },
        {
          straße: "Ottostraße 34",
          ort: "Waldburg",
          name: "Olga Müller",
          stopsReihenfolge: 1,
        },
        {
          straße: "Friedensstrasse 23",
          ort: "Hasenburg",
          name: "Hannes Fritz",
          stopsReihenfolge: 2,
        },
        {
          straße: "Eckstraße 22",
          ort: "Mittfelden",
          name: "Karsten Hagen",
          stopsReihenfolge: 3,
        }
      ]
    }
  },
  methods: {
    toggleType () {
      this.type = !this.type
      this.text = this.type ? 'Starte Tour' : 'Beende Tour'
    }
  }

}
</script>

<style>

</style>