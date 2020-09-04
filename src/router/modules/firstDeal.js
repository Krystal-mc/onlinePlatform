/**
 * 首刷激活路由（firstDeal）
 */

const firstDealRouter = [
  // 榆林
  // 榆林-悦享首刷
  {
    path: '/firstDeal/ylyc/firstBuy',
    name: 'YlycFirstBuy',
    component: () => import('@/views/firstDeal/ylyc_firstBuy'),
    meta: { title: '悦享首刷' }
  },
  // 榆林-白金卡购物
  {
    path: '/firstDeal/ylyc/platinumCard',
    name: 'YlycPlatinumCard',
    component: () => import('@/views/firstDeal/ylyc_platinumCard'),
    meta: { title: '白金卡购物' }
  },
  // 榆林-工会大礼包
  {
    path: '/firstDeal/ylyc/unionGiftPackage',
    name: 'UnionGiftPackage',
    component: () => import('@/views/firstDeal/ylyc_unionGiftPackage'),
    meta: { title: '白金卡购物' }
  },

  // 铜川
  // 铜川-悦享首刷
  {
    path: '/firstDeal/tcyc/firstBuy',
    name: 'TcycFirstBuy',
    component: () => import('@/views/firstDeal/tcyc_firstBuy'),
    meta: { title: '悦享首刷' }
  },
  // 铜川-分期享好礼
  {
    path: '/firstDeal/tcyc/stageStandar',
    name: 'TcycStageStandar',
    component: () => import('@/views/firstDeal/tcyc_stageStandar'),
    meta: { title: '悦享分期-达标送好礼' }
  },
  // 铜川-收单商户达标礼遇
  {
    path: '/firstDeal/tcyc/businessStandard',
    name: 'TcycBusinessStandard',
    component: () => import('@/views/firstDeal/tcyc_businessStandard'),
    meta: { title: '收单商户-达标礼遇' }
  },

  // 汉中
  // 汉中--员工生日礼
  {
    path: '/firstDeal/hzyc/staffBirstday',
    name: 'HzycStaffBirstday',
    component: () => import('@/views/firstDeal/hzyc_staffBirstday'),
    meta: { title: '员工生日祝福礼' }
  }
]

export default firstDealRouter
