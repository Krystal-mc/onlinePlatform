import request from '@/utils/request'

// 获取用户详细信息
export function getUserInfoById(query) {
  return request({
    url: '/user-wechat/wechat/user/getUserInfoById',
    method: 'get',
    params: query
  })
}

// 修改个人信息
export function updateProfile(data) {
  return request({
    url: '/user-wechat/wechat/user/updateProfile',
    method: 'post',
    data
  })
}

// 所有收货地址
export function getUserAddressList(query) {
  return request({
    url: '/user-wechat/userAddress/getUserAddressList',
    method: 'get',
    params: query
  })
}

// 获取收货地址详情
export function getUserAddressById(query) {
  return request({
    url: '/user-wechat/userAddress/getUserAddressById',
    method: 'get',
    params: query
  })
}

// 添加修改收货地址
export function saveUserAddress(data) {
  return request({
    url: '/user-wechat/userAddress/saveUserAddress',
    method: 'post',
    data
  })
}

// 自提点收货地址列表
export function getReceiveAddressList(query) {
  return request({
    url: '/user-wechat/userAddress/getReceiveAddressList',
    method: 'get',
    params: query
  })
}

// 删除收货地址
export function deleteUserAddressById(data) {
  return request({
    url: '/user-wechat/userAddress/deleteUserAddressById',
    method: 'post',
    data
  })
}

// 修改用户头像
export function mediaDownload(query) {
  return request({
    url: '/user-wechat/wechat/user/mediaDownload',
    method: 'get',
    params: query
  })
}

// 获取机构下的基础属性（包含开通的产品集合）
export function getBasisOrgan(query) {
  return request({
    url: '/user-wechat/wechat/user/getBasisOrgan',
    method: 'get',
    params: query
  })
}

// 获取个人中心相关信息
export function getUserProfile(query) {
  return request({
    url: '/user-wechat/wechat/user/getUserProfile',
    method: 'get',
    params: query
  })
}
