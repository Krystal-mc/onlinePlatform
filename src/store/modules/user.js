import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, loopArr } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const state = {
  token: getToken(),
  tel: '',
  wxUrl: '',
  userId: '',
  avatar: '',
  introduction: '',
  roles: [],
  nickname: '',
  realName: '',
  organId: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_TEL: (state, tel) => {
    state.tel = tel
  },
  SET_WXURL: (state, wxUrl) => {
    state.wxUrl = wxUrl
  },
  SET_ID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_REALNAME: (state, realName) => {
    state.realName = realName
  },
  SET_ORGANID: (state, organId) => {
    state.organId = organId
  }
}

const actions = {
  // ios微信分享用到的url
  setWxUrl({ commit }, wxUrl) {
    commit('SET_WXURL', wxUrl)
  },
  // user login
  login({ commit }, userInfo) {
    const { telephone, captcha, secretKey } = userInfo
    return new Promise((resolve, reject) => {
      login({ telephone: telephone.trim(), captcha: captcha, secretKey: secretKey }).then(response => {
        const { data } = response
        // console.log(data)
        commit('SET_TOKEN', data.data.token)
        setToken(data.data.token)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        commit('SET_TEL', data.data.telephone)
        commit('SET_ID', data.data.id)
        commit('SET_AVATAR', data.data.headImg)
        commit('SET_NICKNAME', data.data.nickname)
        commit('SET_REALNAME', data.data.realName)
        commit('SET_ORGANID', data.data.organId)
        // 后台拼装菜单
        var trueMenu = {}
        if (data.data.menuList) {
          trueMenu = {
            menu: loopArr(data.data.menuList)
          }
        } else {
          trueMenu = {
            menu: [{ path: '*', redirect: '/404', hidden: true }]
          }
        }
        resolve(trueMenu)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 更新token
  updateToken({ commit, state }, token) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', token) // vuex
      setToken(token) // cookie
      resolve()
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_TEL', '')
        commit('SET_ID', '')
        commit('SET_AVATAR', '')
        commit('SET_NICKNAME', '')
        commit('SET_REALNAME', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_TEL', '')
      removeToken()
      Cookies.remove('openid')
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
