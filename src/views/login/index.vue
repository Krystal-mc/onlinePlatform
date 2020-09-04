<template>
  <div class="loginContainer">
    <div class="logo">
      <img :src="require('@/assets/img/khh-logo.png')">
    </div>
    <van-form @submit="onSubmit">
      <van-field
        v-model="loginForm.telephone"
        label=""
        maxlength="11"
        clearable
        placeholder="请输入手机号"
        @input="telInput"
      >
        <template #left-icon>
          <svg-icon class="tel-icon" icon-class="tel" />
        </template>
      </van-field>
      <div class="clearfix">
        <van-field
          v-model="loginForm.captcha"
          class="captcha"
          maxlength="6"
          clearable
          label=""
          placeholder="请输入验证码"
        >
          <template #left-icon>
            <svg-icon class="captcha-icon" icon-class="captcha" />
          </template>
        </van-field>
        <div class="divider van-hairline--right" />
        <button type="button" class="getCaptcha" :disabled="getCaptchaDisabled" @click="getCaptcha">{{ getCaptchaBtnText }}</button>
      </div>

      <van-button class="loginBtn" round block type="info" :loading="loading" :disabled="loading || loginDisabled" loading-text="登录中..." native-type="submit">
        登录
      </van-button>
    </van-form>

    <div class="protocol">登录即代表同意 <a @click="openPopup">《用户使用协议》</a></div>
    <van-popup v-model="protocolShow" position="bottom">
      <div class="protocolTop">
        <h1>用户使用协议</h1>
        <van-icon name="cross" @click="protocolClose" />
      </div>
      <protocol-txt />
    </van-popup>
  </div>
</template>

<script>
import { validatePhoneNum, sixNumber } from '@/utils/validate'
import { sendSms, getIp, getGps } from '@/api/common'
import { updateProfile } from '@/api/my'
import { BaseUrl, GetCodes } from '@/utils/const'
import { hasOpenid, getQueryString, isWeiXin, getCurrentPosition } from '@/utils'
import { wxShare } from '@/utils/wx'
import wx from 'weixin-js-sdk'
import protocolTxt from './protocolTxt.vue'
import $ from 'jquery'

export default {
  name: 'Login',
  components: {
    protocolTxt
  },
  data() {
    return {
      BaseUrl,
      GetCodes,
      loading: false,
      getCaptchaDisabled: true,
      getCaptchaBtnText: '获取验证码',
      loginForm: {
        telephone: '',
        captcha: '',
        secretKey: ''
      },
      redirect: undefined,
      otherQuery: {},
      // 用户注册相关信息
      // 注册来源活动ID
      regActId: '',
      // 注册地，中文
      regAddress: '',
      // 	注册使用网络IP
      regIp: '',
      // 注册来源机构ID
      regOrganId: '',
      // 注册来源网址
      regSourceUrl: '',
      // 协议弹出显示
      protocolShow: false
    }
  },
  computed: {
    loginDisabled() {
      return this.loginForm.telephone === '' || this.loginForm.captcha === ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.regActId = getQueryString('actId', this.redirect)
    this.regOrganId = getQueryString('organId', this.redirect)
  },
  mounted() {
    // 键盘弹出时，隐藏底部协议
    var winHeight = $(window).height() // 获取当前页面高度
    $(window).resize(function() {
      var thisHeight = $(this).height()
      if (winHeight - thisHeight > 50) {
        // 当软键盘弹出，在这里面操作
        $('.protocol').hide()
      } else {
        // 当软键盘收起，在此处操作
        $('.protocol').show()
      }
    })
    // TODO 替换登录页分享图片和分享内容
    wxShare('卡唤唤', '欢迎访问卡唤唤', '')
    // 获取用户IP
    getIp().then(res => {
      this.regIp = res.data.result.ip
    })
  },
  methods: {
    sendMsg() {
      sendSms({
        sendType: 1,
        telephone: this.loginForm.telephone
      }).then(res => {
        this.loginForm.secretKey = res.data.data.smsSecretKey
      })
    },
    // 获取验证码
    getCaptcha() {
      this.sendMsg()
      this.getCaptchaDisabled = true
      var self = this
      var t = 60
      self.getCaptchaBtnText = '已发送(' + t + ')'
      var time = setInterval(() => {
        t--
        this.getCaptchaDisabled = true
        if (t === 0) {
          self.getCaptchaBtnText = '获取验证码'
          if (validatePhoneNum(this.loginForm.telephone)) {
            this.getCaptchaDisabled = false
          }
          clearInterval(time)
        } else {
          self.getCaptchaBtnText = '已发送(' + t + ')'
        }
      }, 1000)
    },
    onSubmit() {
      if (this.loginForm.telephone === '') {
        this.$toast.fail('请输入手机号')
        return false
      }
      if (!validatePhoneNum(this.loginForm.telephone)) {
        this.$toast.fail('手机号格式错误')
        return false
      }
      if (this.loginForm.captcha === '') {
        this.$toast.fail('请输入验证码')
        return false
      }
      if (!sixNumber(this.loginForm.captcha)) {
        this.$toast.fail('验证码格式错误')
        return false
      }
      this.loading = true
      this.$store.dispatch('user/login', this.loginForm).then(res => {
        // 判断是否是微信
        // console.warn(res.data.data.user)
        // 根据是否有regIp，判断用户是否是第一次登录，如果第一次登录，需要获取用户登录的IP和gps
        const regIp = res.data.data.user.regIp
        // 第一次登录
        if (regIp === '') {
          // 存储用户注册相关信息（除去经纬度和注册地）
          updateProfile({
            regActId: this.regActId,
            regIp: this.regIp,
            regOrganId: this.regOrganId,
            regSourceUrl: this.redirect
          }).then(res => {})
          if (isWeiXin()) {
            wx.getLocation({
            // 目前用的都是腾讯地图，所以统一用gcj02 https://www.cnblogs.com/langzou/p/10402501.html
              type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: res => {
                getGps(res.latitude, res.longitude).then(response => {
                  this.regAddress = response.data.result.address
                  updateProfile({
                    regLng: res.longitude,
                    regLat: res.latitude,
                    regAddress: this.regAddress
                  }).then(res => {})
                })
              },
              cancel: res => {
              },
              complete: res => {
                this.loading = false
                this.redirectPage()
              }
            })
          } else {
            getCurrentPosition().then(res => {
              getGps(res.coords.latitude, res.coords.longitude).then(response => {
                this.regAddress = response.data.result.address
                updateProfile({
                  regLng: res.coords.longitude,
                  regLat: res.coords.latitude,
                  regAddress: this.regAddress
                }).then(res => {})
              })
            }).catch((err) => {
              switch (err.code) {
                case err.PERMISSION_DENIED:
                  break
                case err.POSITION_UNAVAILABLE:
                  break
                case err.TIMEOUT:
                  break
                case err.UNKNOWN_ERROR:
                  break
              }
            }).finally(() => {
              this.loading = false
              this.redirectPage()
            })
          }
        } else {
          this.redirectPage()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    redirectPage() {
      // 登录后根据是否有openid判断是普通跳转还是微信转接跳转
      if (isWeiXin()) {
        if (hasOpenid()) {
        // 有openid，普通跳转
          this.$router.push({ path: this.redirect || '/' })
        } else {
        // 没有openid，微信转接跳转
          location.href = this.BaseUrl + 'appid=' + this.GetCodes.appid + '&redirect_uri=' +
                encodeURIComponent(window.location.origin + (this.redirect || '/')) + '&response_type=' +
                this.GetCodes.response_type + '&scope=' + this.GetCodes.scope + '&state=' +
                this.GetCodes.state + this.GetCodes.wechat_redirect
        }
      } else {
        this.$router.push({ path: this.redirect || '/' })
      }
    },
    telInput(val) {
      if (!validatePhoneNum(val)) {
        this.getCaptchaDisabled = true
      } else {
        this.getCaptchaDisabled = false
      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },

    // 弹出层协议
    openPopup() {
      this.protocolShow = true
    },
    protocolClose() {
      this.protocolShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.loginContainer{
  padding: 62px 32px 0 32px;
  height: 100%;
  .logo{
    text-align: center;
    font-size: 0;
    margin-bottom: 48px;
    img{
      width: 53px;
      display: inline-block;
    }
  }
  .van-cell{
    padding-left: 0;
    padding-right: 0;
    padding-top: 15px;
    padding-bottom: 15px;
    font-size: 16px;
    margin-top: 16px;
    &:after{
      left: 0;
      right: 0;
    }
    .tel-icon{
      font-size: 19px;
    }
    .captcha-icon{
      font-size: 18.2px;
    }
    /deep/ .van-field__left-icon{
      margin-right: 15px;
    }
  }
  .captcha{
    width: 210px;
    margin-right: 7px;
    float: left;
    overflow: visible;
    &:after{
      right: -101px;
    }
  }
  .divider{
    float: left;
    width: 1px;
    height: 20px;
    margin-top: 34px;
  }
  .getCaptcha{
    border: none;
    background: transparent;
    margin: 0;
    padding: 0;
    float: left;
    display: block;
    padding-top: 15px;
    margin-left: 13px;
    margin-top: 20px;
    color: #333333;
    font-size: 15px;
    line-height: 20px;
    &::after{
      border: none;
    }
    &:active{
      color: #CCCCCC;
    }
    &[disabled]{
      color: #CCCCCC;
    }
  }
  .loginBtn{
    margin-top: 40px;
    font-size: 16px;
  }
  .protocol{
    position: absolute;
    width: 100%;
    left: 0;
    text-align: center;
    bottom: 30px;
    font-size: 11px;
    color: #999;
    &>a{
      color:#0091FF;
    }
  }
  .van-popup{
    padding: 20px 18px 10px 19px;
    height: 500px !important;
    .protocolTop{
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    h1{
      font-size: 16px;
      font-weight:Medium;
      color:rgba(50,50,51,1);
     }
    }

  }

}

</style>
