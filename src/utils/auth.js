import Cookies from 'js-cookie'

const TokenKey = 'KHH-Mobi-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 180 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

