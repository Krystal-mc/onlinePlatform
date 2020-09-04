/**
 * 本地商圈路由（localBiz）
 */

const localBizRouter = [
  // 门店列表
  {
    path: '/localBiz/storeList',
    name: 'StoreList',
    component: () => import('@/views/localBiz/storeList'),
    meta: { title: '商户列表' }
  },
  // 简易版门店列表
  {
    path: '/localBiz/storeListSimple',
    name: 'StoreListSimple',
    component: () => import('@/views/localBiz/storeListSimple'),
    meta: { title: '门店列表' }
  },
  // 门店详情
  {
    path: '/localBiz/storeDetail',
    name: 'StoreDetail',
    component: () => import('@/views/localBiz/storeDetail'),
    meta: { title: '门店详情' }
  }
]

export default localBizRouter
