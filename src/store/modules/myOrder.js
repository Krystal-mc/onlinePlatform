const state = {
  orderStatus: ''
}

const mutations = {
  SET_ORDER_STATUS: (state, orderStatus) => {
    state.orderStatus = orderStatus
  }
}

const actions = {
  setOrderStatus({ commit }, orderStatus) {
    commit('SET_ORDER_STATUS', orderStatus)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
