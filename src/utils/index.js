/**
 * 通用工具类
 */
import md5 from 'blueimp-md5'
import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth' // get token from cookie

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function createSignForUpload(data, url) {
  var str = ''
  if (data) {
    console.log(data)
    // 请求参数键的数组
    var arr = Object.keys(data).sort()
    for (const elem of arr.values()) {
      if (data[elem] !== '') {
        str += elem + '=' + data[elem] + '&'
      }
    }
  }

  str += 'apiUrl=' + url
  str += '&secret=' + 'EqqGKISZZ9kXT4mvci6dQm92NjrcEwEP0YQxO4cMs3iznaHtdrJFS8MRUwHTJXmp'
  console.log(str)
  return md5(decodeURI(str)).toUpperCase()
}

// TODO 目前只是在url上做了处理，ID会以加密的形式展现，但是后台没有控制数据权限，a用户可以处理b用户的业务
function getAesString(data, key, iv) { // 加密
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  var encrypted = CryptoJS.AES.encrypt(data, key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
  // return encrypted.toString() // 返回的是base64格式的密文
  return encrypted.ciphertext.toString() // 返回的是hex格式的密文 url必须用这个，因为base64有/
}
function getDAesString(encrypted, key, iv) { // 解密
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  var data = CryptoJS.enc.Hex.parse(encrypted) // 需要先使用方法CryptoJS.enc.Hex.parse转为十六进制
  var encryptedBase64Str = CryptoJS.enc.Base64.stringify(data) // 再使用CryptoJS.enc.Base64.stringify将其变为Base64编码的字符串
  var decrypted = CryptoJS.AES.decrypt(encryptedBase64Str, key, // 此时才可以传入CryptoJS.AES.decrypt方法中对其进行解密
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
  return decrypted.toString(CryptoJS.enc.Utf8)
}
export function getAES(data) { // 加密 只接受字符串参数
  var key = 'e0etzb0q2m4oxxpt' // 密钥
  var iv = '1234567812345678'
  var encrypted = getAesString(data, key, iv) // 密文
  // var encrypted1 = CryptoJS.enc.Utf8.parse(encrypted)
  return encrypted
}

export function getDAes(data) { // 解密 只接受字符串参数
  var key = 'e0etzb0q2m4oxxpt' // 密钥
  var iv = '1234567812345678'
  var decryptedStr = getDAesString(data, key, iv)
  return decryptedStr
}

// 处理修改菜单的节点 处理sonList为[]的情况, 并且禁止选中自己及自己的孩子节点
export function rebulidObj(obj, id) {
  for (var a in obj) {
    if (obj[a] != null) {
      if (a === 'sonList') {
        if (obj[a].length === 0) {
          obj[a] = ''
        }
      }
      if (a === 'menuId') {
        if (obj[a] === id) {
          obj['disabled'] = true
        }
      }
      if (typeof (obj[a]) === 'object') {
        rebulidObj(obj[a], id)
      }
    }
  }
}

/** 数字金额大写转换(可以处理整数,小数,负数) */
export function smalltoBIG(n) {
  var fraction = ['角', '分']
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
  var head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  var s = ''
  for (var i = 0; i < fraction.length; i++) {
    // console.warn(n * 10 * Math.pow(10, i) + 0.0001)
    // console.warn(Math.floor(n * 10 * Math.pow(10, i) + 0.0001) % 10)
    s += (digit[Math.floor(n * 10 * Math.pow(10, i) + 0.0001) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (var k = 0; k < unit[0].length && n > 0; k++) {
    var p = ''
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][k] + s
  }
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
}

// 阿拉伯数字转中文数字
// 节内转换算法
var chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
var chnUnitSection = ['', '万', '亿', '万亿', '亿亿']
var chnUnitChar = ['', '十', '百', '千']
function SectionToChinese(section) {
  var strIns = ''
  var chnStr = ''
  var unitPos = 0
  var zero = true
  while (section > 0) {
    var v = section % 10
    if (v === 0) {
      if (!zero) {
        zero = true
        chnStr = chnNumChar[v] + chnStr
      }
    } else {
      zero = false
      strIns = chnNumChar[v]
      strIns += chnUnitChar[unitPos]
      chnStr = strIns + chnStr
    }
    unitPos++
    section = Math.floor(section / 10)
  }
  return chnStr
}
// 转换算法主函数
export function NumberToChinese(num) {
  var unitPos = 0
  var strIns = ''
  var chnStr = ''
  var needZero = false

  if (num === 0) {
    return chnNumChar[0]
  }
  while (num > 0) {
    var section = num % 10000
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr
    }
    strIns = SectionToChinese(section)
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0]
    chnStr = strIns + chnStr
    needZero = (section < 1000) && (section > 0)
    num = Math.floor(num / 10000)
    unitPos++
  }
  return chnStr
}

// 获取元素的纵坐标
export function getTop(e) {
  var offset = e.offsetTop
  if (e.offsetParent != null) offset += getTop(e.offsetParent)
  return offset
}

// 获取私有图片
export function getRealUrl(url, token) {
  if (url.indexOf('/private/') !== -1) {
    return url + '?token=' + token
  } else {
    return url
  }
}

// 关闭当前页签，打开指定的页签
export function redirect(thisObj, targetName) {
  let closeIndex = ''
  let closeIndex2 = ''
  for (const [index, elem] of thisObj.$store.getters.visitedViews.entries()) {
    if (thisObj.$route.name === elem.name) {
      closeIndex = index
      break
    }
  }
  for (const [index, elem] of thisObj.$store.getters.visitedViews.entries()) {
    if (targetName === elem.name) {
      closeIndex2 = index
      break
    }
  }
  setTimeout(() => {
    var view = thisObj.$store.getters.visitedViews[closeIndex]
    var view2 = thisObj.$store.getters.visitedViews[closeIndex2]
    thisObj.$store.dispatch('delVisitedView', view).then((views) => {
      if (view2) {
        // console.log('列表页打开了，需要先关闭再打开')
        thisObj.$store.dispatch('delVisitedView', view2).then((views) => {
          thisObj.$router.push({ name: targetName })
        })
      } else {
        // console.log('列表页没打开，直接打开列表页')
        thisObj.$router.push({ name: targetName })
      }
    })
  }, 1000)
}

// 获取uuid
export function getUUID() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  var uuid = s.join('')
  return uuid
}

// 模板页向父级项目发送数据
// val 类似： '.class' '#id'
export function sendPc(val) {
  window.parent.postMessage({
    data: {
      code: 'success',
      height: document.querySelector(val).offsetHeight
    }
  }, '*')
}

// 模板页获取从父级项目传回来的数据
// obj代表 this
// fun代表 传入的处理数据函数
export function getPc(obj, fun) {
  window.addEventListener('message', event => {
    if (event && event.data && event.data.sendData) {
      const receiveData = event.data.sendData
      for (const key in receiveData) {
        if (obj.hasOwnProperty(key) && obj[key] && receiveData[key]) {
          // this.goods[key] = receiveData[key]
          for (const keyChild in receiveData[key]) {
            if (obj[key].hasOwnProperty(keyChild) && (receiveData[key][keyChild] || receiveData[key][keyChild] === 0)) {
              obj[key][keyChild] = receiveData[key][keyChild]
            }
          }
        }
      }
      fun()
    }
  })
}

// 处理移动端数据
// info代表从接口返回的数据
// vue 代表this
// fun 回调函数
export function processMobileData(info, vue, fun, userStandard) {
  info.length > 0 && info.forEach(item => {
    // 首先判断this下有该属性组
    if (vue.hasOwnProperty(item.attrKey)) {
      // 接着判断传入数据有属性
      if (item.attrList && item.attrList.length > 0) {
        item.attrList.forEach(attr => {
          // 判断属性存在
          if (vue[item.attrKey].hasOwnProperty(attr.attrKey)) {
            if (attr.formType === 14 || attr.formType === 16 || attr.formType === 17) {
              // 当为轮播图和类目列表时
              attr.value && (vue[item.attrKey][attr.attrKey] = JSON.parse(attr.value))
            } else if (attr.formType === 13) {
              // 当为商品时处理
              var groupKey = item.attrKey
              var attrKey = attr.attrKey
              var attrId = attr.id
              // 该商品列表所属的活动id
              var goodsListActId = JSON.parse(attr.value).value
              fun && fun(groupKey, attrKey, attrId, [item.attrKey][attr.attrKey], goodsListActId)
              // 需要判断是否达标时
              userStandard && userStandard(attrKey, goodsListActId)
            } else {
              vue[item.attrKey][attr.attrKey] = attr.value
            }
          }
        })
      }
    }
  })
}

// 获取当前地址的query参数值
export function getCurrQueryString(name) {
  var url = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var newUrl = window.location.search.substr(1).match(url)
  if (newUrl != null) {
    return unescape(newUrl[2])
  } else {
    return false
  }
}

// 是否有openid
export function hasOpenid() {
  return typeof (Cookies.get('openid')) === 'string' && Cookies.get('openid').length > 0 && Cookies.get('openid') !== 'undefined'
}
// 是否有token
export function hasToken() {
  return typeof (getToken()) === 'string' && getToken().length > 0 && getToken() !== 'undefined'
}

// 删除url query参数值
export function delQueryString(url, ref) {
  var str = ''

  if (url.indexOf('?') !== -1) { str = url.substr(url.indexOf('?') + 1) } else { return url }
  var arr = ''
  var returnurl = ''
  if (str.indexOf('&') !== -1) {
    arr = str.split('&')
    for (const i in arr) {
      if (arr[i].split('=')[0] !== ref) {
        returnurl = returnurl + arr[i].split('=')[0] + '=' + arr[i].split('=')[1] + '&'
      }
    }
    return url.substr(0, url.indexOf('?')) + '?' + returnurl.substr(0, returnurl.length - 1)
  } else {
    arr = str.split('=')
    if (arr[0] === ref) { return url.substr(0, url.indexOf('?')) } else { return url }
  }
}

// 获取url中query参数值
export function getQueryString(name, url) {
  var thisUrl = ''
  if (url) {
    thisUrl = url.substr(url.indexOf('?'))
  } else {
    thisUrl = window.location.search
  }
  var url1 = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var newUrl = thisUrl.substr(1).match(url1)
  if (newUrl != null) {
    return unescape(newUrl[2])
  } else {
    return ''
  }
}

// 判断是否是微信浏览器
export function isWeiXin() {
  return /micromessenger/.test(navigator.userAgent.toLowerCase())
}

// 判断是否登录
export function isLogin() {
  if (isWeiXin()) {
    return hasOpenid() && hasToken()
  } else {
    return hasToken()
  }
}

/**
 * 获取某种类型图片的路径
 * @param path 图片全路径
 * @param type 想要获取的图片类型[small: 压缩图(aa.jpg)，list: 方图(aa_list.jpg)，big: 原图(aa_big.jpg)]
 */
export function getImgPath(path, type) {
  // 最终返回值
  var finalPath = ''
  if (path.indexOf('360buyimg') !== -1) {
    // 京东图片(京东的small和big取的都是n12)
    // 前缀：http://img13.360buyimg.com/n0/
    // 其中 n0(最大图 800*800px)、n1(350*350px)、n2(160*160px)、n3(130*130px)、n4(100*100px)、n7(220*220px)为图片大小。注意：n0带有京东水印，其余的n1-n4不带，12 大图无水印的 。
    finalPath = path
    type === 'list' && (finalPath = finalPath.replace('/n12/', '/n7/'))
    type === 'small' && (finalPath = finalPath.replace('/n7/', '/n12/'))
    type === 'big' && (finalPath = finalPath.replace('/n7/', '/n12/'))
  } else if (path.indexOf('qlogo.cn') !== -1) {
    // 前缀：http://thirdwx.qlogo.cn
    // 例：http://thirdwx.qlogo.cn/mmopen/vi_32/GbuyyY3icEfGB1XySye5HBkDz41zGdcm1vdh192elWr9ZeibBPj8T5cCbdzNPmXWeFoWLMKWUTjyeGJyicRvwCPCw/132
    // 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
    // lastInd 是最后一个斜杠 '/' 的索引；path.substring(0, lastInd + 1) 为最后一个斜杠之前的内容
    var lastInd = path.lastIndexOf('\/')
    type === 'small' && (finalPath = path.substring(0, lastInd + 1) + '0')
    type === 'list' && (finalPath = path.substring(0, lastInd + 1) + '132')
    type === 'big' && (finalPath = path.substring(0, lastInd + 1) + '0')
  } else {
    // 去掉文件后缀（如：.jpg）左边的路径
    var leftPath = path.substring(0, path.lastIndexOf('.'))
    // 获取图片不带_list或_big、不带文件名后缀的路径noImgTypePath
    // 如果传的path是压缩图，noImgTypePath就等于leftPath
    var noImgTypePath = leftPath
    // 图片文件的后缀（如：.jpg）
    var imgType = path.substring(path.lastIndexOf('.'))
    // 如果传的path不是压缩图，则需要去掉_list或_big
    leftPath.indexOf('_list') !== -1 && (noImgTypePath = leftPath.substring(0, leftPath.indexOf('_list')))
    leftPath.indexOf('_big') !== -1 && (noImgTypePath = leftPath.substring(0, leftPath.indexOf('_big')))

    type === 'small' && (finalPath = noImgTypePath + imgType)
    type === 'list' && (finalPath = noImgTypePath + '_list' + imgType)
    type === 'big' && (finalPath = noImgTypePath + '_big' + imgType)
  }
  return finalPath
}

// 树形选择控件数据处理
// 对应value title
export function handleSelectTreeData(arr) {
  arr.forEach(item => {
    // this.$set(item, 'title', item.value)
    // this.$set(item, 'value', item.key)
    item['title'] = item.value
    item['value'] = item.key
    if (item.children.length > 0) {
      handleSelectTreeData(item.children)
    }
  })
}

// 跳转商品详情
export function gotoGoodsDetails(vue, queryStr) {
  // queryStr获取的参数
  vue.$router.push({ path: '/goods/goodsDetails?' + queryStr })
}

/**
 * 判断用户当前位置是否在限制区域内
 * @param position 用户当前位置adcode
 * @param limitArea 限制的区域，编码逗号隔开字符串
 */
export function inLimitArea(position, limitArea) {
  // 活动没有限制ip或gps
  if (limitArea === '') {
    return true
  }
  var pos = position + ''
  var arr = limitArea.split(',')
  var province = []
  var city = []
  arr.forEach(item => {
    // 限制到省
    if (item.substring(2) === '0000') {
      province.push(item.substring(0, 2))
    } else {
    // 限制到市
      city.push(item.substring(0, 4))
    }
  })
  // 是否满足省的限制
  var provinceFlag = ''
  if (province.length > 0) {
    provinceFlag = province.findIndex(function(value, index, arr) {
      return value === pos.substring(0, 2)
    })
  }
  // 是否满足市的限制
  var cityFlag = ''
  if (city.length > 0) {
    cityFlag = city.findIndex(function(value, index, arr) {
      return value === pos.substring(0, 4)
    })
  }
  return (provinceFlag !== '' && provinceFlag !== -1) || (cityFlag !== '' && cityFlag !== -1)
}

// 处理时间
export function handleTime(time) {
  const time1 = time.substring(0, 4)
  const time2 = time.substring(5, 7)
  const time3 = time.substring(8, 10)
  return time1 + '年' + time2 + '月' + time3 + '日'
}

// 非微信浏览器调用html5 getCurrentPosition获取经纬度
// 文档：https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function showPosition(position) {
        resolve(position)
      }, function showError(error) {
        console.warn(error)
        reject(error)
      }, {
        enableHighAccuracy: true, // 是否使用其最高精度来表示结果
        maximumAge: 30000, // 位置缓存有效时间，超出重新获取定位
        timeout: 10000 // 超时时间
      })
    } else {
      alert('该浏览器不支持获取地理位置，请更换浏览器重试')
    }
  })
}
