/**
 * 宣传页路由（adPage）
 */

const adPageRouter = [
  // 榆林-更多福利
  {
    path: '/adPage/ylyc/moreBenefits',
    name: 'YlycMoreBenefits',
    component: () => import('@/views/adPage/ylyc_moreBenefits'),
    meta: { title: '更多福利' }
  },
  // 榆林-新客领券
  {
    path: '/adPage/ylyc/collectCode',
    name: 'YlycCollectCode',
    component: () => import('@/views/adPage/ylyc_collectCode')
  }
]

export default adPageRouter
