import router from './router'
import store from './store'
import { Toast } from 'vant'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import { delQueryString, getCurrQueryString, hasToken, hasOpenid, isWeiXin } from '@/utils'
import { whiteListName } from '@/utils/whiteList'
import { removeToken } from '@/utils/auth'
import { getWechatUserOpenId } from '@/api/user'
import Cookies from 'js-cookie'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 路由跳转时，如果没有加organId，则自动加上
  var nextFunc = function() {
    if (to.query.organId) {
      next()
      return
    }
    if (from.query.organId) {
      const toQuery = JSON.parse(JSON.stringify(to.query))

      toQuery.organId = from.query.organId
      // replace的路由，这里也要设置replace: true，目前活动异常提示页面（ActivityNotice）需要设置
      if (to.name === 'ActivityNotice') {
        next({
          path: to.path,
          query: toQuery,
          replace: true
        })
      } else {
        next({
          path: to.path,
          query: toQuery
        })
      }
    } else {
      next()
    }
  }
  // 判断未登录的时候跳到登录页organId有没有在query里
  var nextLoginFunc = function() {
    var organParam = ''
    if (typeof (getCurrQueryString('organId')) !== undefined && getCurrQueryString('organId') !== '' && getCurrQueryString('organId') !== false && to.fullPath.indexOf('organId=') === -1) {
      organParam = getCurrQueryString('organId')
      // 地址栏里有organId
      if (to.fullPath.indexOf('?') !== -1) {
        // ios要用location.href重定向，否则登录页wx分享相关有问题
        if (window.__wxjs_is_wkwebview === true) {
          location.href = '/login?redirect=' + encodeURIComponent(to.fullPath + '&organId=' + organParam)
        } else {
          next('/login?redirect=' + encodeURIComponent(to.fullPath + '&organId=' + organParam))
        }
      } else {
        // ios要用location.href重定向，否则登录页wx分享相关有问题
        if (window.__wxjs_is_wkwebview === true) {
          location.href = '/login?redirect=' + encodeURIComponent(to.fullPath + '?organId=' + organParam)
        } else {
          next('/login?redirect=' + encodeURIComponent(to.fullPath + '?organId=' + organParam))
        }
      }
    } else {
      if (window.__wxjs_is_wkwebview === true) {
        location.href = '/login?redirect=' + encodeURIComponent(to.fullPath)
      } else {
        next('/login?redirect=' + encodeURIComponent(to.fullPath))
      }
    }
  }

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 处理jssdk签名,兼容history模式
  if (!store.getters.wxUrl) {
    store.dispatch('user/setWxUrl', document.URL).then(() => {
    })
  }

  // determine whether the user has logged in
  if (hasToken()) {
    if (!hasOpenid() && isWeiXin()) {
      if (getCurrQueryString('code')) {
        const getOpenId = await getWechatUserOpenId({ code: getCurrQueryString('code') })
        var openid = getOpenId.data.data.openId
        Cookies.set('openid', openid, { expires: 180 })
      } else {
        // 走到这里肯定是非微信登录的，清除掉token
        removeToken()
        if (whiteListName.indexOf(to.name) !== -1) {
          // in the free login whitelist, go directly
          nextFunc()
        } else {
          // other pages that do not have permission to access are redirected to the login page.
          // ios要用location.href重定向，否则登录页wx分享相关有问题
          // if (window.__wxjs_is_wkwebview === true) {
          //   location.href = '/login?redirect=' + encodeURIComponent(to.fullPath)
          // } else {
          //   next('/login?redirect=' + encodeURIComponent(to.fullPath))
          // }
          nextLoginFunc()
          NProgress.done()
        }
      }
    }

    if (to.path === '/login') {
      if (to.query.redirect) {
        next({ path: decodeURIComponent(to.query.redirect) })
      } else {
        next({ path: '/' })
      }
      // next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasTel = store.getters.tel && store.getters.tel !== ''
      if (hasTel) {
        // 这里的判断为了解决router跳转到一个不存在的name时，会显示空白页面
        if (to.matched.length === 0) {
          next('/404')
        }
        nextFunc()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const userInfo = await store.dispatch('user/getInfo')
          // 这里判断url如果有code和state参数，就去掉
          var delCode = delQueryString(to.fullPath, 'code')
          var delState = delQueryString(delCode, 'state')

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/GenerateRoutesFromBackEnd', userInfo)
          // await store.dispatch('permission/GenerateRoutesFromBackEnd', userInfo)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          if (getCurrQueryString('code') && getCurrQueryString('state')) {
            // next({ path: delState, replace: true })

            // 添加organId ///////////////////////////////
            if (to.query.organId) {
              next({ path: delState, replace: true })
              return
            }
            if (from.query.organId) {
              const toQuery = JSON.parse(JSON.stringify(to.query))

              toQuery.organId = from.query.organId
              next({
                path: delState,
                query: toQuery,
                replace: true
              })
            } else {
              next({ path: delState, replace: true })
            }
            // ///////////////////////////////
          } else {
            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            // next({ ...to, replace: true })

            // 添加organId ///////////////////////////////
            if (to.query.organId) {
              next({ ...to, replace: true })
              return
            }
            if (from.query.organId) {
              const toQuery = JSON.parse(JSON.stringify(to.query))

              toQuery.organId = from.query.organId
              next({
                path: to.path,
                query: toQuery,
                replace: true
              })
            } else {
              next({ ...to, replace: true })
            }
            // ///////////////////////////////
          }
        } catch (error) {
          console.error(error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          Toast.fail('请求用户信息失败，请重试')
          // next('/login?redirect=' + encodeURIComponent(to.fullPath))
          nextLoginFunc()
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteListName.indexOf(to.name) !== -1) {
      // in the free login whitelist, go directly
      nextFunc()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // ios要用location.href重定向，否则登录页wx分享相关有问题
      // if (window.__wxjs_is_wkwebview === true) {
      //   location.href = '/login?redirect=' + encodeURIComponent(to.fullPath)
      // } else {
      //   next('/login?redirect=' + encodeURIComponent(to.fullPath))
      // }
      nextLoginFunc()
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
