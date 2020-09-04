import '@babel/polyfill'
import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import App from './App'
import store from './store'
import router from './router'
import VueTouch from 'vue-touch'
Vue.use(VueTouch, { name: 'v-touch' })

// 图片预览
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview, {
  tapToClose: true,
  fullscreenEl: false,
  closeEl: false,
  history: true
})

// 引入Vant
import './utils/vant'

import '@/styles/index.less' // global css

import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// android禁止用户调整微信webview字体
;(function() {
  if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
    handleFontSize()
  } else {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', handleFontSize, false)
    } else if (document.attachEvent) {
      // IE浏览器，非W3C规范
      document.attachEvent('onWeixinJSBridgeReady', handleFontSize)
    }
  }
  function handleFontSize() {
    // 设置网页字体为默认大小
    WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 })
    // 重写设置网页字体大小的事件
    WeixinJSBridge.on('menu:setfont', function() {
      WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 })
    })
  }
})()

// Android 微信h5页面键盘弹出时滚动页面
const u = navigator.userAgent
if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { // 安卓手机
  window.addEventListener('resize', function() {
    // Document 对象的activeElement 属性返回文档中当前获得焦点的元素。
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      // console.log('安卓触发', document.activeElement.tagName)
      window.setTimeout(function() {
        document.activeElement.scrollIntoView(true)
      }, 50)
    }
  })
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
