import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



export default new Vuex.Store ({
    strict: process.env.NODE_ENV !== 'production', //In strict mode, whenever Vuex state is mutated outside of mutation handlers, an error will be thrown
    state: {
        dialog: {loginLogout: false} //Status der verschiedenen Dialoge
    },
    mutations: {
        updateLoginLogout (state, value) {
            state.dialog.loginLogout = value
        }
    },
    actions: {
        updateLoginLogout (context, value) {
            context.commit('updateLoginLogout', value)
        }
    },
    getters: {
        dialogLoginLogout: (state) => state.dialog.loginLogout
    }
    
})