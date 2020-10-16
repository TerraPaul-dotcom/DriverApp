import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



export default new Vuex.Store ({
    strict: process.env.NODE_ENV !== 'production', //In strict mode, whenever Vuex state is mutated outside of mutation handlers, an error will be thrown
    state: {
        dialog: {loginLogout: false, tourAuswahl: false}, //Status der verschiedenen Dialoge
        tourCurrent: {tour: {}} //aktuell geladene Tour
    },
    mutations: {
        updateLoginLogout (state, value) {
            state.dialog.loginLogout = value
        },
        updateTourAuswahl (state, value) {
            state.dialog.tourAuswahl = value
        },
        updateTourCurrent (state, value) {
            state.tourCurrent.tour = value
        }
    },
    actions: {
        updateLoginLogout (context, value) {
            context.commit('updateLoginLogout', value)
        },
        updateTourAuswahl (context, value) {
            context.commit('updateTourAuswahl', value)
        },
        updateTourCurrent (context, value) {
            context.commit('updateTourCurrent', value)
        }
    },
    getters: {
        dialogLoginLogout: (state) => state.dialog.loginLogout,
        dialogTourAuswahl: (state) => state.dialog.tourAuswahl,
        tourCurrent: (state) => state.tourCurrent.tour
    }
    
})