<template>
  <v-dialog
    v-model="this.$store.getters.dialogTourBeendet"
  >
    <template v-slot:activator="{}">
      <!-- <v-btn
          color="primary"
          dark
          v-on="on"
        >
          Open Dialog
        </v-btn> -->
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.prevent="tourReset()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Tour</v-toolbar-title>
        <v-spacer></v-spacer>
        
      </v-toolbar>
      <v-list three-line subheader>
        <v-subheader>Zusammenfassung Tour</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Dauer</v-list-item-title>
            <v-list-item-subtitle
              >{{ this.$store.getters.tourCurrentDauer }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>  
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  data() {
    return {
      notifications: false
    }
  },
  props: {
    dialogUser: Boolean,
    on: null,
  },
  methods: {
    tourReset() {
      this.$store.dispatch('updateTourBeendet', false)
      this.$emit('tourReset')
    }
  },
  components: {
  }
}
</script>

<style></style>
