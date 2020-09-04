const state = {
  tabbar: ''
}

const mutations = {
  TOGGLE_TABBAR: (state, tabbar) => {
    state.tabbar = tabbar
  }
}

const actions = {
  toggleTabbar({ commit }, tabbar) {
    commit('TOGGLE_TABBAR', tabbar)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

