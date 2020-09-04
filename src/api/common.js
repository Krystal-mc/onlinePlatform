import request from '@/utils/request'
import axios from 'axios'
import jsonpAdapter from 'axios-jsonp'

// 发送短信验证码
export function sendSms(data) {
  return request({
    url: '/common-service/common/sms/captcha/send',
    method: 'post',
    data
  })
}

// 文件上传
export function upload(data) {
  return request({
    url: '/common-service/common/oss/upload',
    method: 'post',
    data
  })
}

// 通过用户IP，获取用户位置
export function getIp() {
  return new Promise((resolve, reject) => {
    axios({
      url: 'https://apis.map.qq.com/ws/location/v1/ip?key=OFGBZ-ATVA3-FU23D-3C2OB-BVIV5-XZBDC&output=jsonp',
      adapter: jsonpAdapter,
      callbackParamName: 'callback'
    }).then((res) => {
      if (res.data.status === 0) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch((res) => {
      reject(res)
    })
  })
}

// 通过用户Gps（纬度，经度），获取用户位置
export function getGps(latitude, longitude) {
  return new Promise((resolve, reject) => {
    axios({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=OFGBZ-ATVA3-FU23D-3C2OB-BVIV5-XZBDC&output=jsonp',
      adapter: jsonpAdapter,
      callbackParamName: 'callback'
    }).then((res) => {
      if (res.data.status === 0) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch((res) => {
      reject(res)
    })
  })
}

// 获取手机号码归属地
export function getTelSegment(tel) {
  return new Promise((resolve, reject) => {
    axios({
      url: 'https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=' + tel,
      adapter: jsonpAdapter,
      callbackParamName: 'callback'
    }).then((res) => {
      if (res.data.province !== '') {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch((res) => {
      reject(res)
    })
  })
}

// 获取微信权限验证的参数，微信分享用到
export function getWxTicket(query) {
  return request({
    url: '/user-wechat/wechat/user/getJsapiTicket',
    method: 'get',
    params: query
  })
}

// 获取省市区
export function getDistrictList(query) {
  return request({
    url: '/common-service/sys/common/district/getDistrictList',
    method: 'get',
    params: query
  })
}

// 获取活动页面信息
export function getIndexInfo(query) {
  return request({
    url: '/user-wechat/actPage/getIndexInfo',
    method: 'get',
    params: query
  })
}

// 获取活动页面信息
export function goodsDetail(query) {
  return request({
    url: '/user-wechat/goods/detail',
    method: 'get',
    params: query
  })
}

// 查询活动商品列表
export function getGoodsListPage(query) {
  return request({
    url: '/user-wechat/actConfig/getGoodsListPage',
    method: 'get',
    params: query
  })
}

// 获取商品列表
export function getGoodsList(query) {
  return request({
    url: '/user-wechat/goods/list',
    method: 'get',
    params: query
  })
}

// 获取首页属性
export function getHomeAttr(query) {
  return request({
    url: '/user-wechat/actPage/getHomeAttr',
    method: 'get',
    params: query
  })
}

// 根据活动Id获取对应首页
export function getActIndexPage(query) {
  return request({
    url: '/user-wechat/actPage/getActIndexPage',
    method: 'get',
    params: query
  })
}
