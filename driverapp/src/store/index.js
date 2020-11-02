import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production", //In strict mode, whenever Vuex state is mutated outside of mutation handlers, an error will be thrown
  state: {
    dialog: { loginLogout: false, tourAuswahl: false, tourBeendet: false, NachrichtAnFahrer: true }, //Status der verschiedenen Dialoge
    tourCurrent: { tour: {}, dauer: '', gestartet: false } //aktuell geladene Tour
  },
  mutations: {
    updateLoginLogout(state, value) {
      state.dialog.loginLogout = value
    },
    updateTourAuswahl(state, value) {
      state.dialog.tourAuswahl = value
    },
    updateTourBeendet(state, value) {
      state.dialog.tourBeendet = value
    },
    updateNachrichtAnFahrer(state, value) {
      state.dialog.nachrichtAnFahrer = value
    },
    updateTourCurrent(state, value) {
      state.tourCurrent.tour = value
    },
    updateTourCurrentDauer(state, value) {
      state.tourCurrent.dauer = value
    },
    updateTourCurrentGestartet(state, value) {
      state.tourCurrent.gestartet = value
    },
  },
  actions: {
    updateLoginLogout(context, value) {
      context.commit("updateLoginLogout", value)
    },
    updateTourAuswahl(context, value) {
      context.commit("updateTourAuswahl", value)
    },
    updateTourBeendet(context, value) {
      context.commit("updateTourBeendet", value)
    },
    updateNachrichtAnFahrer(context, value) {
      context.commit("updateNachrichtAnFahrer", value)
    },
    updateTourCurrent(context, value) {
      context.commit("updateTourCurrent", value)
    },
    updateTourCurrentDauer(context, value) {
      context.commit("updateTourCurrentDauer", value)
    },
    updateTourCurrentGestartet(context, value) {
      context.commit("updateTourCurrentGestartet", value)
    },
  },
  getters: {
    dialogLoginLogout: state => state.dialog.loginLogout,
    dialogTourAuswahl: state => state.dialog.tourAuswahl,
    dialogTourBeendet: state => state.dialog.tourBeendet,
    dialogNachrichtAnFahrer: state => state.dialog.nachrichtAnFahrer,
    tourCurrent: state => state.tourCurrent.tour,
    tourCurrentAbschnitte: state => state.tourCurrent.tour.tourAbschnitte,
    tourCurrentDauer: state => state.tourCurrent.dauer,
    tourCurrentGestartet: state => state.tourCurrent.gestartet
  }
})
