路由命名规范
====

此文档定义了路由的path、name，以及引用的组件文件的路径命名规范
----

## 1.活动产品：
----

| 产品名称        | 产品编码
| -------------- | ---------------------------------------------
| 首页            | homePage
| 宣传页          | adPage
| 首刷激活        | firstDeal
| 本地商圈        | localBiz
| K米商城         | kmiMall


### 规范说明：
```
1.path: 
   a: 模板页：'/产品编码/项目名称/页面名称'
   b: 公共页：'/产品编码/页面名称'
2.name: 
   a: 模板页：'项目名称+页面名称' （驼峰、首字母大写）
   b: 公共页：'页面名称' （驼峰、首字母大写）
3.文件路径: 
   a: 模板页：/产品编码/项目名称_页面名称.vue
   b: 公共页：/产品编码/页面名称.vue
```


例子
----

```js
  // 榆林-首页
  {
    path: '/homePage/ylyc/index',
    name: 'YlycIndex',
    component: () => import('@/views/homePage/ylyc_index'),
    meta: { title: 'YOU生活-榆林市分行' }
  },
  // 榆林-工会大礼包
  {
    path: '/firstDeal/ylyc/labourUnion',
    name: 'YlycLabourUnion',
    component: () => import('@/views/firstDeal/ylyc_labourUnion'),
    meta: { title: '工会大礼包' }
  },
  // 榆林-商圈商户列表
  {
    path: '/localBiz/merchantList',
    name: 'MerchantList',
    component: () => import('@/views/localBiz/merchantList'),
    meta: { title: '商户列表' }
  }

```

## 2.其他模块：
----

### 规范说明：
```
1.path: '/模块名称/页面名称'
2.name: '页面名称' （驼峰、首字母大写）
3.文件路径: /模块名称/页面名称.vue
```


例子
----

```js
  // 商品详情
  {
    path: '/goods/goodsDetails',
    name: 'GoodsDetails',
    component: () => import('@/views/goods/goodsDetails'),
    meta: { title: '商品详情' }
  },
  // 我的订单列表
  {
    path: '/order/orderList',
    name: 'OrderList',
    component: () => import('@/views/order/orderList'),
    meta: { title: '我的订单' }
  }

```


更新时间
----

该文档最后更新于： 2020-7-23 11:32:29