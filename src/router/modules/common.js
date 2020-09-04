/**
 * 公共页面路由
 */

const commonRouter = [
  {
    path: '/redirect',
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: { title: '登录' }
  },
  {
    path: '/goods/goodsDetails',
    name: 'GoodsDetails',
    component: () => import('@/views/goods/goodsDetails')
  },
  {
    path: '/goods/goodsList',
    name: 'GoodsList',
    component: () => import('@/views/goods/goodsList'),
    meta: { title: '商品列表' }
  },
  {
    path: '/404',
    component: () => import('@/views/exception/404'),
    hidden: true
  },
  // 活动是否开启
  {
    path: '/activityNotice',
    name: 'ActivityNotice',
    component: () => import('@/views/exception/activityNotice')
  },
  // 用户中心首页
  {
    path: '/my/userCenter',
    name: 'UserCenter',
    component: () => import('@/views/my/index'),
    meta: { title: '个人中心' }
  },
  // 联系我们
  {
    path: '/my/contact',
    name: 'Contact',
    component: () => import('@/views/my/contact'),
    meta: { title: '联系我们' }
  },
  // 个人资料
  {
    path: '/my/personalData',
    name: 'PersonalData',
    component: () => import('@/views/my/personalData'),
    meta: { title: '个人资料' }
  },
  // 新增地址
  {
    path: '/address/addressAdd',
    name: 'AddressAdd',
    component: () => import('@/views/address/addressAdd'),
    meta: { title: '新增地址' }
  },
  // 编辑地址
  {
    path: '/address/addressEdit',
    name: 'AddressEdit',
    component: () => import('@/views/address/addressEdit'),
    meta: { title: '编辑地址' }
  },
  // 地址管理
  {
    path: '/address/addressManage',
    name: 'AddressManage',
    component: () => import('@/views/address/addressManage'),
    meta: { title: '地址管理' }
  },
  // 我的订单
  {
    path: '/order/myOrder',
    name: 'MyOrder',
    component: () => import('@/views/order/index'),
    meta: { title: '我的订单' }
  },
  // 我的订单详情
  {
    path: '/order/orderDetails',
    name: 'OrderDetails',
    component: () => import('@/views/order/orderDetails'),
    meta: { title: '订单详情' }
  },
  // 物流详情
  {
    path: '/order/logistics',
    name: 'Logistics',
    component: () => import('@/views/order/logistics'),
    meta: { title: '物流详情' }
  },
  // 订单确认
  {
    path: '/order/confirmOrder',
    name: 'ConfirmOrder',
    component: () => import('@/views/order/confirmOrder'),
    meta: { title: '确认订单' }
  },
  // 支付页面
  {
    path: '/pay/index',
    name: 'Pay',
    component: () => import('@/views/pay/index'),
    meta: { title: '支付' }
  },
  // 确认付款页面
  {
    path: '/pay/confirmPay',
    name: 'ConfirmPay',
    component: () => import('@/views/pay/confirmPay'),
    meta: { title: '确认付款' }
  },
  // 支付成功
  {
    path: '/pay/paySuccess',
    name: 'PaySuccess',
    component: () => import('@/views/pay/paySuccess'),
    meta: { title: '支付成功' }
  }

]

export default commonRouter
