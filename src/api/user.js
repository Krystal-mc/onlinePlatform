import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/user-wechat/wechat/user/login',
    method: 'post',
    data
  })
}

// 根据Token获取用户信息
export function getInfo() {
  return request({
    url: '/user-wechat/wechat/user/getUserInfoByToken',
    method: 'get'
  })
}

// 根据code获取微信用户信息详细信息
export function getWechatUserOpenId(query) {
  return request({
    url: '/user-wechat/wechat/user/greetUser',
    method: 'get',
    params: query
  })
}

// 注销接口暂时不需要 所以直接返回一个promise对象，并且通过
export function logout() {
  // return new Promise((resolve, reject) => {
  //   resolve()
  // })
  return request({
    url: '/user-wechat/wechat/user/logout',
    method: 'post'
  })
}

// 手机号是否包含在白名单中
export function containsWhiteList(query) {
  return request({
    url: '/user-wechat/actConfig/containsWhiteList',
    method: 'get',
    params: query
  })
}
