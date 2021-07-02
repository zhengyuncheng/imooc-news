// Vuex

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		historyLists: []
	},
	mutations: {
		SET_HISTORY_LISTS(state, history) {
			state.historyLists = history
		}
	},
	actions: {
		set_history({commit, state}, history){
			let list = state.historyLists
			list.unshift(history)
			commit('SET_HISTORY_LISTS', list)
		}
	}
})

export default store