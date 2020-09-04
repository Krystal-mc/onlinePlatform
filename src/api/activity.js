import request from '@/utils/request'

/**
 * 活动相关接口
 */

// 获取活动基本信息
export function getActInfo(query) {
  return request({
    url: '/user-wechat/actConfig/getActInfo',
    method: 'get',
    params: query
  })
}
