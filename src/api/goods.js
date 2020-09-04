import request from '@/utils/request'

/**
 * 商品相关接口
 */

// 商品详情
export function goodsDetails(query) {
  return request({
    url: '/user-wechat/goods/detail',
    method: 'get',
    params: query
  })
}

// 获取京东商品轮播图
export function getSkuImgList(query) {
  return request({
    url: '/common-service/common/jd/product/getSkuImgList',
    method: 'get',
    params: query
  })
}

// 根据skuId获取商品详情大字段
export function getIntroduction(query) {
  return request({
    url: '/common-service/common/jd/product/getIntroduction',
    method: 'get',
    params: query
  })
}

// 京东商品预计送达时间
export function getNewStockAndPromiseTips(query) {
  return request({
    url: '/user-wechat/goods/getNewStockAndPromiseTips',
    method: 'get',
    params: query
  })
}

// 根据skuId获取京东商品可售性状态
export function getSkuCheck(query) {
  return request({
    url: '/common-service/common/jd/product/getSkuCheck',
    method: 'get',
    params: query
  })
}

// 根据skuId获取商品上下架状态
export function getSkuState(query) {
  return request({
    url: '/common-service/common/jd/product/getSkuState',
    method: 'get',
    params: query
  })
}
