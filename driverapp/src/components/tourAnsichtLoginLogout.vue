<template>
  <v-dialog
    v-model="this.$store.getters.dialogLoginLogout"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.prevent="toggleDisplayLoginLogout()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Benutzer*in</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogUser = false"> Save </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-list three-line subheader>
        <v-subheader>User Controls</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Content filtering</v-list-item-title>
            <v-list-item-subtitle
              >Set the content filtering level to restrict apps that can be
              downloaded</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list three-line subheader>
        <v-subheader>General</v-subheader>
        <v-list-item>
          <v-list-item-action>
            <v-checkbox v-model="notifications"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Notifications</v-list-item-title>
            <v-list-item-subtitle
              >beschreibung...</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <br />
      <br />
      <br />
      <v-row justify="center">
        <v-btn elevation="4">Login / Logout</v-btn>
      </v-row>
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
    on: null
  },
  methods: {
    toggleDisplayLoginLogout() {
      this.$store.dispatch('dialogUpdateLoginLogout', false)
    }
  },
  components: {}
}
</script>

<style></style>
