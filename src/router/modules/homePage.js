/**
 * 首页路由（homePage）
 */

const homePageRouter = [
  // 榆林
  {
    path: '/homePage/ylyc/index',
    name: 'YlycIndex',
    component: () => import('@/views/homePage/ylyc_index'),
    meta: { title: '榆林首页' }
  },

  // 铜川
  {
    path: '/homePage/tcyc/index',
    name: 'TcycIndex',
    component: () => import('@/views/homePage/tcyc_index'),
    meta: { title: '悦享邮惠，达标礼遇' }
  }
]

export default homePageRouter
