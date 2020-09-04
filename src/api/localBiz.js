import request from '@/utils/request'

export function getMerchantList(data) {
  return request({
    url: '/user-wechat/wechat/user/getMerchantList',
    method: 'post',
    data
  })
}
