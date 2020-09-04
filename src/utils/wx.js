import { getWxTicket } from '@/api/common'
import wx from 'weixin-js-sdk'
import { JsApiList } from '@/utils/const'
import store from '@/store'
/**
 *分享
 * @param title 标题
 * @param desc 描述
 * @param img 图片
 */

export function wxShare(title, desc, img) {
  let wxUrl = ''
  // 判断是否是ios微信浏览器
  if (window.__wxjs_is_wkwebview === true) {
    wxUrl = store.getters.wxUrl.split('#')[0]
  } else {
    wxUrl = window.location.href.split('#')[0]
  }
  // 分享的当前页的链接
  const thisUrl = location.href.split('#')[0]
  return new Promise((resolve, reject) => {
    getWxTicket({
      url: encodeURIComponent(wxUrl)
    }).then(res => {
      const wxData = res.data.data
      wx.config({
        debug: false, // 生产环境需要关闭debug模式
        appId: wxData.appId, // appId通过微信服务号后台查看
        timestamp: wxData.timestamp, // 生成签名的时间戳
        nonceStr: wxData.nonceStr, // 生成签名的随机字符串
        signature: wxData.signature, // 签名
        jsApiList: JsApiList
      })
      wx.ready(function() {
      // 分享朋友
        wx.updateAppMessageShareData({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: thisUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: img, // 分享图标
          success: function() {
            // 用户点击了分享后执行的回调函数
          }
        })
        // 分享朋友圈
        wx.updateTimelineShareData({
          title: title, // 分享标题
          link: thisUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: img, // 分享图标
          success: function() {
          // 用户点击了分享后执行的回调函数
          }
        })
        // 显示所有功能按钮
        wx.showAllNonBaseMenuItem()
        resolve(true)
      })
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

/**
 *隐藏所有非基础按钮接口
 */
export function wxHideBtn() {
  let wxUrl = ''
  // 判断是否是ios微信浏览器
  if (window.__wxjs_is_wkwebview === true) {
    wxUrl = store.getters.wxUrl.split('#')[0]
  } else {
    wxUrl = window.location.href.split('#')[0]
  }
  return new Promise((resolve, reject) => {
    getWxTicket({
      url: encodeURIComponent(wxUrl)
    }).then(res => {
      const wxData = res.data.data
      wx.config({
        debug: false, // 生产环境需要关闭debug模式
        appId: wxData.appId, // appId通过微信服务号后台查看
        timestamp: wxData.timestamp, // 生成签名的时间戳
        nonceStr: wxData.nonceStr, // 生成签名的随机字符串
        signature: wxData.signature, // 签名
        jsApiList: JsApiList
      })
      wx.ready(function() {
        wx.hideAllNonBaseMenuItem()
        resolve(true)
      })
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}
