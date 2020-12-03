<template>
  <v-card>
    <v-list three-line subheader>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Anmeldung</v-list-item-title>
          <v-list-item-subtitle
            >Bitte melden Sie sich an um die aktuelle Tour zu
            starten.</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        ><v-text-field
          v-model="benutzer"
          label="Benutzer*in"
          outlined
        ></v-text-field
      ></v-list-item>
      <v-list-item
        ><v-text-field
          v-model="passwort"
          label="Passwort"
          outlined
          type="password"
        ></v-text-field
      ></v-list-item>
      <v-list-item><v-btn
      @click.prevent="loginSendenUndTourAnfordern(benutzer, passwort)"
      >Anmelden</v-btn></v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import md5 from 'md5'
import api from '../api.js'

export default {
  data() {
    return {
      notifications: false,
      benutzer: '',
      passwort: ''
    }
  },
  props: {
    dialogUser: Boolean,
    on: null
  },
  methods: {
    toggleDisplayLoginLogout() {
      this.$store.dispatch('dialogUpdateLoginLogout', false)
    },
     async loginSendenUndTourAnfordern(benutzer, passwort) {
      try {
        const res = await api.post(`/tour`, {benutzer: md5(benutzer), passwort: md5(passwort)})
        if (res.status === 200) {
          this.$store.dispatch('updateLogin', {benutzerHashed: md5(benutzer), passwortHashed: md5(passwort)})
        }//TODO: try catch einbauen
      } catch (err) {
        console.log(err)
      }
    } 
  },
  mounted() {
    this.$store.dispatch('updateLogin', {benutzerHashed: md5('benutzer'), passwortHashed: md5('passwort')})
  }
}
</script>

<style></style>
