<template>
  <div class="confirmPay">
    <div class="info">
      <div class="price">¥ <span>{{ payTotalAmount }}</span></div>
    </div>

    <van-cell-group class="payForm">
      <van-field v-model="payForm.cardNo" class="cardNo" label="银行卡" :error-message="bankName" placeholder="请输入银行卡号" />
      <van-field v-model="payForm.tel" maxlength="11" clearable label="手机号" placeholder="请输入手机号" @input="telInput" />
      <van-field
        v-model="payForm.captcha"
        maxlength="6"
        center
        clearable
        label="验证码"
        placeholder="短信验证码"
      >
        <template #button>
          <van-button size="small" plain hairline type="info" :disabled="getCaptchaDisabled" @click="getCaptcha">{{ getCaptchaBtnText }}</van-button>
        </template>
      </van-field>
    </van-cell-group>

    <div class="safeAreaBottom">
      <van-button type="info" :loading="submitting" loading-text="确认付款..." block @click="confirmPay">确认付款</van-button>
    </div>
  </div>
</template>

<script>
import { getUnionPayInfo, getUnionPayCaptcha, doUnionPay } from '@/api/order'
import { validatePhoneNum } from '@/utils/validate'
import { wxHideBtn } from '@/utils/wx'
export default {
  name: 'ConfirmPay',
  data() {
    return {
      getCaptchaDisabled: true,
      getCaptchaBtnText: '获取验证码',
      txnTime: '',
      orderPayId: '',
      organId: '',
      submitting: false,
      payTotalAmount: '',
      bankName: '',
      payForm: {
        cardNo: '',
        tel: '',
        captcha: ''
      }
    }
  },
  created() {
    this.$route.query.orderPayId && (this.orderPayId = this.$route.query.orderPayId)
    this.$route.query.organId && (this.organId = this.$route.query.organId)
    this.getUnionPayInfo()
    this.wxHideBtn()
  },

  methods: {
    wxHideBtn() {
      wxHideBtn().then(res => {
      })
    },
    getUnionPayCaptcha() {
      getUnionPayCaptcha({
        orderPayId: this.orderPayId,
        payCardNo: this.payForm.cardNo,
        telephone: this.payForm.tel
      }).then(res => {
        this.$toast('已发送')
        this.txnTime = res.data.data.txnTime
      })
    },
    telInput(val) {
      if (!validatePhoneNum(val)) {
        this.getCaptchaDisabled = true
      } else {
        this.getCaptchaDisabled = false
      }
    },
    // 获取验证码
    getCaptcha() {
      this.getUnionPayCaptcha()
      this.getCaptchaDisabled = true
      var self = this
      var t = 60
      self.getCaptchaBtnText = '已发送(' + t + ')'
      var time = setInterval(() => {
        t--
        this.getCaptchaDisabled = true
        if (t === 0) {
          self.getCaptchaBtnText = '获取验证码'
          if (validatePhoneNum(this.payForm.tel)) {
            this.getCaptchaDisabled = false
          }
          clearInterval(time)
        } else {
          self.getCaptchaBtnText = '已发送(' + t + ')'
        }
      }, 1000)
    },
    // 确认付款
    confirmPay() {
      if (this.payForm.tel === '') {
        this.$toast.fail('请输入手机号')
        this.submitting = false
        return false
      }
      if (!validatePhoneNum(this.payForm.tel)) {
        this.$toast.fail('请输入正确的手机号')
        this.submitting = false
        return false
      }
      if (this.payForm.captcha === '') {
        this.$toast.fail('请输入验证码')
        this.submitting = false
        return false
      }
      doUnionPay({
        captcha: this.payForm.captcha,
        orderPayId: this.orderPayId,
        payCardNo: this.payForm.cardNo,
        txnTime: this.txnTime
      }).then(res => {
        this.$toast.success('支付成功')
        setTimeout(() => {
          this.$router.push({ name: 'PaySuccess', query: { orderIds: res.data.data.orderIds, organId: this.organId }})
        }, 2000)
      })
    },
    getUnionPayInfo() {
      getUnionPayInfo({
        orderPayId: this.orderPayId
      }).then(res => {
        this.payTotalAmount = res.data.data.payAmount
        this.payForm.cardNo = res.data.data.payCardNo
        this.bankName = res.data.data.bankName
      })
    }
  }
}
</script>

<style lang="less" scoped>
.confirmPay {
  background: #F7F8FA;
  min-height: 100%;
  .info{
    width: 100%;
    text-align: center;
    padding-top: 50px;
    padding-bottom: 50px;
    .price{
      font-weight: 700;
      color: #FF4444;
      font-size: 14px;
      line-height:24px;
      span{
        font-size: 30px;
      }
    }
  }
  .payForm{
    width:345px;
    height:160px;
    background:#ffffff;
    border-radius:8px;
    margin: 0 auto;
    &:after{
      border-width: 0;
    }
    /deep/ .van-cell{
      &::after{
        left: 87px;
      }
      &:first-child{
        border-radius:8px 8px 0px 0px;
      }
      &:nth-child(3){
        border-radius:0px 0px 8px 8px;
      }
      .van-field__label{
        width: 60px;
      }
    }
    .cardNo{
      /deep/ .van-field__error-message{
        color: #969799;
      }
    }
  }

  .safeAreaBottom{
    button{
      border-radius: 0;
    }
  }
}
</style>
