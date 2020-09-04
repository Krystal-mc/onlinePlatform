/**
 * 全局变量
 */
const JsApiList = [
  // 需要调用的JS接口列表
  'checkJsApi', // 判断当前客户端版本是否支持指定JS接口
  'chooseImage',
  'updateAppMessageShareData', // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
  'updateTimelineShareData', // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'getLocation',
  'openLocation',
  // 上传图片
  'uploadImage'
]

const BaseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?'
const GetCodes = {
  // 公众号的唯一标识
  appid: 'wx6ed8375249d91af2',
  // 返回类型，请填写code
  response_type: 'code',
  // 应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid），snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且， 即使在未关注的情况下，只要用户授权，也能获取其信息 ）
  scope: 'snsapi_userinfo',
  // 重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
  state: 'test',
  // 必须带此参数
  wechat_redirect: '#wechat_redirect'
}

export const goodsStatusMap = new Map([
  ['0', '待付款'],
  ['1', '待发货'],
  ['2', '已发货'],
  ['3', '已收货'],
  ['4', '已取消']
])

export const couponStatusMap = new Map([
  ['0', '待付款'],
  ['1', '待发货'],
  ['2', '未使用'],
  ['3', '已完成'],
  ['4', '已取消']
])

export const rechargeStatusMap = new Map([
  ['0', '待付款'],
  ['1', '待发货'],
  ['2', '待充值'],
  ['3', '已充值'],
  ['4', '已取消']
])

export const couponCodeMap = new Map([
  ['0', '未售出'],
  ['1', '未使用'],
  ['2', '已锁定'],
  ['3', '已使用'],
  ['4', '已过期'],
  ['5', '已作废']
])

export {
  JsApiList,
  BaseUrl,
  GetCodes
}
