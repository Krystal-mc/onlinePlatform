import axios from 'axios'
import { Toast, Dialog } from 'vant'
import router from '@/router'
import store from '@/store'
import { getToken } from '@/utils/auth'
import md5 from 'blueimp-md5'
import { removeToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token && config.baseURL !== '') {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Y-UserToken'] = getToken()
    }
    // sign签名算法
    var str = ''
    if (config.method === 'post') {
      if (config.data) {
        str = encodeURIComponent(JSON.stringify(config.data)) + '&'
      }
    } else if (config.method === 'get') {
      if (config.params) {
        // 请求参数键的数组
        var arr = Object.keys(config.params).sort()
        for (const elem of arr.values()) {
          if (config.params[elem] !== '' && typeof (config.params[elem]) !== 'undefined' && config.params[elem] !== null) {
            str += elem + '=' + encodeURIComponent(config.params[elem]) + '&'
          }
        }
      }
    }

    str += 'apiUrl=' + config.url
    str += '&secret=' + 'FESD4tTls33fopBgFPbSxDSGGEWDZ1UEfZr691Ak8ngnpSL1zWuR9gdddDGR'
    if (config.baseURL !== '') {
      config.headers['sign'] = md5(decodeURIComponent(str)).toUpperCase()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // 状态码不等于200 弹出错误提示   判断是否存在res.code，为了避免调用外部接口时弹出空的错误信息框
    if (res.code && res.code !== 200) {
      if (res.code === 500 || res.code === 501) {
        Dialog.alert({
          title: '提示',
          message: res.msg
        })
      } else if (res.code === 404) {
        router.push('/404')
      } else {
        Toast.fail(res.msg)
      }
      if (res.code === 403) {
        removeToken()
        setTimeout(() => {
          Toast('2秒后将跳转到登录页')
        }, 1000)
        setTimeout(() => {
          location.reload()
        }, 2000)
      }
      return Promise.reject(response)
    } else {
      // code === 200时
      return Promise.resolve(response)
    }
  },
  error => {
    console.log('err' + error)
    Toast.fail(error.message, 5)
    return Promise.reject(error)
  }
)

export default service
