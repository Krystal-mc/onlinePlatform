import request from '@/utils/request'
// 订单列表
export function orderList(query) {
  return request({
    url: '/user-wechat/order/list',
    method: 'get',
    params: query
  })
}

// 用户取消订单
export function cancelUserOrder(data) {
  return request({
    url: '/user-wechat/order/cancelUserOrder',
    method: 'post',
    data
  })
}

// 用户确认收货
export function confirmReceiveOrder(data) {
  return request({
    url: '/user-wechat/order/confirmReceiveOrder',
    method: 'post',
    data
  })
}

// 根据ID获取物流信息
export function orderTrack(query) {
  return request({
    url: '/user-wechat/order/track',
    method: 'get',
    params: query
  })
}

// 根据ID获取订单详情
export function orderDetail(query) {
  return request({
    url: '/user-wechat/order/detail',
    method: 'get',
    params: query
  })
}

// 订单发起支付
export function payOrder(data) {
  return request({
    url: '/user-wechat/order/payOrder',
    method: 'post',
    data
  })
}

// 用户支付成功的回调
export function paySuccess(query) {
  return request({
    url: '/user-wechat/order/paySuccess',
    method: 'get',
    params: query
  })
}

// 结算/立即购买，生成订单信息
export function generateConfirmOrder(data) {
  return request({
    url: '/user-wechat/order/generateConfirmOrder',
    method: 'post',
    data
  })
}

// 提交订单，保存订单信息
export function submitOrder(data) {
  return request({
    url: '/user-wechat/order/submitOrder',
    method: 'post',
    data
  })
}

// 动态计算订单包含商品价格
export function calcConfirmOrder(data) {
  return request({
    url: '/user-wechat/order/calcConfirmOrder',
    method: 'post',
    data
  })
}

// 订单确认支付
export function getConfirmPayInfo(query) {
  return request({
    url: '/user-wechat/order/confirmPay',
    method: 'get',
    params: query
  })
}

// 银联-确认支付详情
export function getUnionPayInfo(query) {
  return request({
    url: '/user-wechat/order/unionpay/confirmPay',
    method: 'get',
    params: query
  })
}

// 银联-发起支付
export function doUnionPay(data) {
  return request({
    url: '/user-wechat/order/unionpay/doPay',
    method: 'post',
    data
  })
}

// 银联-发送消费短信验证码
export function getUnionPayCaptcha(data) {
  return request({
    url: '/user-wechat/order/unionpay/consumeSms',
    method: 'post',
    data
  })
}
