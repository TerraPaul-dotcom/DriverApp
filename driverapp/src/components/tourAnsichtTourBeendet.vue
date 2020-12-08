<template>
  <v-dialog v-model="this.$store.getters.dialogTourBeendet">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.prevent="tourReset()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Tour</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-list three-line subheader>
        <v-subheader>Speicherung</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Speichern</v-list-item-title>
            <v-list-item-title>
              <v-progress-circular
                indeterminate
                color="primary"
                v-if="!$store.getters.tourCurrentUebertragungAbgeschlossen"
              ></v-progress-circular>
              <v-list-item-subtitle
                ><v-icon
                  light
                  right
                  color="success"
                  v-if="$store.getters.tourCurrentUebertragungAbgeschlossen"
                >
                  mdi-checkbox-marked-circle
                </v-icon>
                {{ progress }}</v-list-item-subtitle
              >
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-subheader>Zusammenfassung Tour</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Dauer</v-list-item-title>
            <v-list-item-subtitle>TODO: Eventuell hier Wert anzeigen</v-list-item-subtitle>
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
  computed: {
    progress() {
      return this.$store.getters.tourCurrentUebertragungAbgeschlossen
        ? 'Tour wurde erfolgreich übertragen'
        : 'Tour wird an die Datenbank übertragen'
    }
  },
  props: {
    dialogUser: Boolean,
    on: null
  },
  methods: {
    tourReset() {
      this.$emit('tourReset')
    }
  },
  components: {}
}
</script>

<style></style>
