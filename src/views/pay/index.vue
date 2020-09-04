<template>
  <div class="pay">
    <div class="info">
      <div class="price">¥ <span>{{ payTotalAmount }}</span></div>
      <p>支付金额</p>
    </div>

    <div v-if="gpsFlag && ipFlag" class="unionPay">
      <h2 class="clearfix">
        <img src="../../assets/img/unionPay.png">
        <span>银联支付</span>
      </h2>
      <van-cell-group class="cardNum">
        <van-cell v-if="userBankCardList.length>0" title="银行卡号" :value="payCardNo" is-link @click="cardListShow = true" />
        <van-field v-else v-model="payCardNo" type="digit" placeholder="请输入卡号" />
      </van-cell-group>
      <div class="unionpayIntro" v-html="unionpayIntro" />
    </div>

    <div class="safeAreaBottom">
      <van-button v-if="gpsFlag && ipFlag" type="info" :loading="posNum < 2 || submitting" loading-text="下一步..." block @click="payOrder">下一步</van-button>
      <van-button v-else :disabled="!gpsFlag || !ipFlag" type="info" block>{{ NotInLimitArea }}</van-button>
    </div>

    <van-popup
      v-model="cardListShow"
      class="selCard"
      closeable
      position="bottom"
      :safe-area-inset-bottom="true"
    >
      <ul class="cardList">
        <li v-for="(item,index) in userBankCardList" :key="index" @click="selCardNo(item)">
          {{ item.cardNo }}
        </li>
      </ul>

      <van-button v-if="gpsFlag && ipFlag" type="info" block @click="addCardShow = true">使用其他银行卡支付</van-button>
    </van-popup>

    <van-dialog ref="addCardDialog" v-model="addCardShow" title="银行卡号" show-cancel-button :before-close="beforeClose" @confirm="payOrder('new')">
      <van-cell-group class="dialogInput">
        <van-field v-model="newPayCardNo" label="" clearable placeholder="请输入银行卡号" />
      </van-cell-group>
    </van-dialog>

    <!-- 跳转银联页面表单 -->
    <div id="payForm" v-html="payFormHtml" />
  </div>
</template>

<script>
import { getConfirmPayInfo, payOrder } from '@/api/order'
import { getActInfo } from '@/api/activity'
import { validateBankCard } from '@/utils/validate'
import { getGps, getIp } from '@/api/common'
import { wxHideBtn } from '@/utils/wx'
import { inLimitArea, isWeiXin, getCurrentPosition } from '@/utils'
import { NotInLimitArea } from '@/views/goods/const'
import wx from 'weixin-js-sdk'
export default {
  name: 'Pay',
  data() {
    return {
      NotInLimitArea,
      addCardShow: false,
      payFormHtml: '',
      cardListShow: false,
      submitting: false,
      organId: '',
      actId: '',
      orderIds: '',
      payTotalAmount: '',
      payCardNo: '',
      // 新增卡号
      newPayCardNo: '',
      payType: '',
      userBankCardList: [],
      gpsFlag: true,
      ipFlag: true,
      // gps和ip接口是否调用完成
      posNum: 0,
      actInfo: {},
      // 银联支付提示
      unionpayIntro: ''
    }
  },
  async created() {
    this.$route.query.orderIds && (this.orderIds = this.$route.query.orderIds)
    this.$route.query.actId && (this.actId = this.$route.query.actId)
    this.$route.query.organId && (this.organId = this.$route.query.organId)
    this.getConfirmPayInfo()
    await this.getActInfo()
    this.getGps()
    this.getIp()
  },

  methods: {
    // 获取位置失败通用方法
    getPosFail(type) {
      this.$dialog.alert({
        title: '提示',
        message: '获取位置失败，请刷新后重试'
      }).then(() => {
        this.posNum++
        if (type === 'ip') {
          this.ipFlag = false
        } else if (type === 'gps') {
          this.gpsFlag = false
        }
      })
    },
    getGps() {
      if (isWeiXin()) {
        // 禁用微信按钮
        wxHideBtn().then(wxRes => {
          wx.getLocation({
            // 目前用的都是腾讯地图，所以统一用gcj02 https://www.cnblogs.com/langzou/p/10402501.html
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: res => {
              getGps(res.latitude, res.longitude).then(res => {
                this.posNum++
                this.gpsFlag = inLimitArea(res.data.result.ad_info.adcode, this.actInfo.gpsAddress)
              }).catch(res => {
              // 根据gps获取位置接口出错
                this.getPosFail('gps')
              })
            },
            fail() {
              this.getPosFail('gps')
            },
            cancel: res => {
              this.$dialog.confirm({
                title: '提示',
                message: '如果不同意获取地理位置，可能无法参加活动，是否要重新授权？',
                confirmButtonText: '是',
                cancelButtonText: '否'
              }).then(() => {
                // on confirm
                this.getGps()
              }).catch(() => {
                // on cancel
              })
              this.posNum++
              this.gpsFlag = false
            },
            complete: res => {
              // this.$toast.success(res)
            }
          })
        }).catch(res => {
          // getJsapiTicket出错
          this.getPosFail('gps')
        })
      } else {
        getCurrentPosition().then(res => {
          getGps(res.coords.latitude, res.coords.longitude).then(res => {
            this.posNum++
            this.gpsFlag = inLimitArea(res.data.result.ad_info.adcode, this.actInfo.gpsAddress)
          }).catch(res => {
          // 根据gps获取位置接口出错
            this.getPosFail('gps')
          })
        }).catch((err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              var currFullPath = this.$route.fullPath
              // h5拒绝后，可能不会再弹出授权确认弹窗了，所以如果用户拒绝过一次后，再次得到{code: 1, message: "User denied Geolocation"}都提示“获取位置失败，请联系客服”
              // refuseNum：非微信浏览器获取经纬度，拒绝次数
              if (currFullPath.indexOf('&refuseNum=1') !== -1) {
                this.$dialog.alert({
                  title: '提示',
                  message: '获取位置失败，请联系客服'
                })
              } else {
                this.$dialog.confirm({
                  title: '提示',
                  message: '如果不同意获取地理位置，可能无法参加活动，是否要重新授权？',
                  confirmButtonText: '是',
                  cancelButtonText: '否'
                }).then(() => {
                  // on confirm
                  if (currFullPath.indexOf('&refuseNum=1') === -1) {
                    location.href = this.$route.fullPath + '&refuseNum=1'
                  }
                }).catch(() => {
                  // on cancel
                })
              }
              break
            case err.POSITION_UNAVAILABLE:
              this.$dialog.alert({
                title: '提示',
                message: '获取位置失败，请刷新或更换浏览器后重试'
              })
              break
            case err.TIMEOUT:
              this.$dialog.alert({
                title: '提示',
                message: '获取位置失败，请刷新或更换浏览器后重试'
              })
              break
            case err.UNKNOWN_ERROR:
              this.$dialog.alert({
                title: '提示',
                message: '获取位置失败，请刷新或更换浏览器后重试'
              })
              break
          }
          this.posNum++
          this.gpsFlag = false
        })
      }
    },
    // 通过IP获取用户位置
    getIp() {
      getIp().then(res => {
        this.posNum++
        this.ipFlag = inLimitArea(res.data.result.ad_info.adcode, this.actInfo.ipAddress)
      }).catch(res => {
        // 根据ip获取位置接口出错
        this.getPosFail('ip')
      })
    },
    // 选择卡号
    selCardNo(item) {
      this.payCardNo = item.cardNo
      this.cardListShow = false
    },
    // 获取活动基本信息
    async getActInfo() {
      const res = await getActInfo({
        actId: this.actId
      })
      this.actInfo = res.data.data
      this.payType = res.data.data.payType - 0
    },
    // 获取订单支付所需信息
    getConfirmPayInfo() {
      getConfirmPayInfo({
        orderIds: this.orderIds
      }).then(res => {
        this.payTotalAmount = res.data.data.payTotalAmount
        this.unionpayIntro = res.data.data.unionpayIntro
        // TODO 暂时去掉多张卡的情况
        // this.userBankCardList = res.data.data.userBankCardList
        // this.userBankCardList.forEach(item => {
        //   if (item.defaultStatus === 1) {
        //     this.payCardNo = item.cardNo
        //   }
        // })
      })
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        if (this.newPayCardNo === '' || !validateBankCard(this.newPayCardNo)) {
          done(false)
        }
      } else {
        done()
      }
    },
    // 下一步
    payOrder(param) {
      this.submitting = true
      if (param === 'new') {
        if (this.newPayCardNo === '') {
          this.$toast.fail('请输入卡号')
          this.submitting = false
          return false
        }
        if (!validateBankCard(this.newPayCardNo)) {
          this.$toast.fail('请输入正确的银行卡号')
          this.submitting = false
          return false
        }
      } else {
        if (this.payCardNo === '') {
          this.$toast.fail('请输入卡号')
          this.submitting = false
          return false
        }
        if (!validateBankCard(this.payCardNo)) {
          this.$toast.fail('请输入正确的银行卡号')
          this.submitting = false
          return false
        }
      }

      payOrder({
        orderIds: this.orderIds,
        payCardNo: param === 'new' ? this.newPayCardNo : this.payCardNo,
        payType: this.payType
      }).then(res => {
        if (res.data.data.status === 0) {
          // 跳转银联
          this.payFormHtml = res.data.data.resultData
          this.$nextTick(function() {
            document.all.pay_form.submit()
          })
        } else if (res.data.data.status === 1) {
          // 跳转confirmPay页面
          this.$router.push({ name: 'ConfirmPay', query: { orderPayId: res.data.data.orderPayId, organId: this.organId, actId: this.actId }})
          this.submitting = false
        }
      }).catch(res => {
        this.submitting = false
        // 弹窗确定按钮loading改为false
        this.$refs.addCardDialog.loading.confirm = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pay {
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
    p{
      color: #666666;
      font-size: 14px;
      margin-top: 5px;
    }
  }
  .unionPay{
    width:345px;
    min-height:180px;
    background:#ffffff;
    border-radius:8px;
    margin: 0 auto;
    padding: 16px;
    h2{
      img{
        width: 27px;
        height: 17px;
        float: left;
        margin-right: 5px;
      }
      span{
        color: #333333;
        font-size: 16px;
        float: left;
      }
    }
    .cardNum{
      margin-top: 20px;
      &::after{
        border-width: 0 0 1px 0;
      }
      .van-cell{
        padding-left: 0;
        padding-right: 0;
        padding-bottom: 10px;
        .van-cell__value{
          flex: auto;
        }
      }
    }
    .unionpayIntro{
      margin-top: 10px;
      font-size:13px;
      color: #FF4444;
      line-height:20px;
    }
  }
  .safeAreaBottom{
    button{
      border-radius: 0;
    }
  }

  .selCard{
    height: 40%;
    .cardList{
      width: 100%;
      li{
        height: 50px;
        border: 1px solid #999999;
        text-align: center;
      }
    }
  }

  .dialogInput{
    border: 1px solid #DCDDE0;
    margin: 12px 24px 24px 24px;
  }

  #payForm{
    display: none;
  }
}
</style>
