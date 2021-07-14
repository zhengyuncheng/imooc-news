// Vuex

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		historyLists: uni.getStorageSync('__history') || []
	},
	mutations: {
		SET_HISTORY_LISTS(state, history) {
			uni.setStorageSync('__history', history)
			state.historyLists = history
		},
		CLEAR_HISTORY(state, history){
			// uni.setStorageSync('__history', [])
			uni.removeStorageSync('__history') //清理本地缓存
			state.historyLists = []
		}
	},
	actions: {
		set_history({commit, state}, history){
			let list = state.historyLists
			list.unshift(history)
			commit('SET_HISTORY_LISTS', list)
		},
		clear_history({commit}) {
			commit('CLEAR_HISTORY')
		}
	}
})

export default store