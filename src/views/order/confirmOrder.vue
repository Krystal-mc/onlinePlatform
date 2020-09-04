<template>
  <div class="confirmOrder">
    <template v-if="goodsType === 0">
      <div v-if="addressId !== ''" class="address" @click="showAddress">
        <h2>
          <span>{{ addressDetails.name }}</span>
          <span>{{ addressDetails.telephone }}</span>
        </h2>
        <p>
          <span class="icon"><svg-icon icon-class="address" /></span>
          <van-icon class="arrow" name="arrow" />
          <span class="fullAddress van-multi-ellipsis--l2">{{ addressDetails.fullAddress }}</span>
        </p>
      </div>
      <div v-else class="noAddress" @click="showAddress">
        <p>
          <span class="icon"><svg-icon icon-class="address" /></span>
          <van-icon class="arrow" name="arrow" />
          <span class="fullAddress">请选择地址</span>
        </p>
      </div>
    </template>

    <div class="goods">
      <div v-for="(item,index) in orderItemList" :key="index" class="goodsItem">
        <!-- <van-image :src="getImgPath(item.skuImg,'list')" /> -->
        <img :src="getImgPath(item.skuImg,'list')">
        <div class="content">
          <h2 class="van-multi-ellipsis--l2">{{ item.skuName }}</h2>
          <h4 class="van-multi-ellipsis--l2">
            <span v-for="(prop,propIndex) in JSON.parse(item.skuProperty)" :key="propIndex">{{ prop.value }}</span>
          </h4>
          <div class="price"><i>¥</i><span>{{ item.salePrice }}</span></div>
          <van-stepper v-if="item.batchStatus === 1" v-model="item.goodsCount" :min="item.batchCount" disabled class="goodsCount" @change="goodsCountChange" />
          <van-stepper v-else v-model="item.goodsCount" class="goodsCount" @change="goodsCountChange" />
        </div>
      </div>
    </div>

    <!-- 实物快递商品 -->
    <div v-if="goodsType === 0 && actInfo.receiveAddressType === 0" class="goodsPrice">
      <van-cell-group>
        <van-cell title="商品合计">
          <template #default>
            <i class="rmb">¥</i>
            <span class="money">{{ calcAmount.goodsAmount }}</span>
          </template>
        </van-cell>
        <van-cell title="运费" value="包邮" />
      </van-cell-group>
    </div>
    <!-- 虚拟、卡券、自提 -->
    <div v-else class="goodsPrice coupon">
      <van-cell-group>
        <van-cell title="商品合计">
          <template #default>
            <i class="rmb">¥</i>
            <span class="money">{{ calcAmount.goodsAmount }}</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div v-if="orderDiscount.discountAmount !== '' && orderDiscount.discountAmount > 0" class="discount">
      <van-cell-group>
        <van-cell title="优惠金额">
          <template #default>
            <i class="rmb">¥</i>
            <span class="money">{{ calcAmount.discountAmount }}</span>
          </template>
        </van-cell>
        <van-cell title="优惠说明">
          <template #default>
            <div class="van-ellipsis">{{ orderDiscount.discountIntro }}</div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 话费充值 -->
    <div v-if="externalOrganCode === 'LGHF'" class="addCredit">
      <van-cell-group>
        <van-field v-model="rechargeTelephone" clearable type="tel" maxlength="11" label="充值手机号" placeholder="请输入手机号码" />
      </van-cell-group>
    </div>

    <van-submit-bar v-if="gpsFlag && ipFlag" class="submitBar" :loading="posNum < 2 || submitting" :price="calcAmount.payAmountCent - 0" button-type="info" :button-text="submitText" @submit="submitOrder" />
    <van-submit-bar v-else class="submitBar" :disabled="!gpsFlag || !ipFlag" :tip="NotInLimitArea" tip-icon="info-o" :price="calcAmount.payAmountCent - 0" button-type="info" :button-text="submitText" />

    <!-- 收货地址 -->
    <van-overlay v-if="addressManageshow" :duration="0" :z-index="100" :show="addressManageshow" :lock-scroll="false">
      <address-manage :head-show="headShow" :sel-address-id="addressId" :addr-list-type="addrListType" @selectAddress="selectAddress" />
    </van-overlay>
  </div>
</template>

<script>
// TODO 京东商品相关检查接口
import { getImgPath } from '@/utils'
import { getUserAddressById } from '@/api/my'
import { getActInfo } from '@/api/activity'
import { inLimitArea, isWeiXin, getCurrentPosition } from '@/utils'
import { generateConfirmOrder, calcConfirmOrder, submitOrder } from '@/api/order'
import { NotInLimitArea } from '@/views/goods/const'
import addressManage from '@/views/address/addressManage'
import { getGps, getIp, getTelSegment } from '@/api/common'
import { wxHideBtn } from '@/utils/wx'
import Cookies from 'js-cookie'
import wx from 'weixin-js-sdk'
import { validatePhoneNum } from '@/utils/validate'
import $ from 'jquery'
import {
  SubmitBar,
  Stepper
} from 'vant'

export default {
  name: 'ConfirmOrder',
  components: {
    addressManage,
    [SubmitBar.name]: SubmitBar,
    [Stepper.name]: Stepper
  },

  data() {
    return {
      // 地址管理列表的顶部是否显示(0隐藏，1显示)
      headShow: 0,
      // 判断是收货地址还是自提地址（1是收货地址，2是自提地址）
      addrListType: '',
      NotInLimitArea,
      addressManageshow: false,
      submitOrderLoading: true,
      getImgPath,
      organId: '',
      actId: '',
      storageId: '',
      externalOrganCode: '',
      externalSkuId: '',
      goodsCount: '',
      goodsId: '',
      goodsType: '',
      skuId: '',
      addressId: '',
      // 地址详情
      addressDetails: {},
      // 下单商品
      orderItemList: [],
      // 计算价格
      calcAmount: {
        goodsAmount: '',
        payAmount: '',
        payAmountCent: ''
      },
      // 优惠内容
      orderDiscount: {},
      // 活动信息
      actInfo: {},
      gpsFlag: true,
      ipFlag: true,
      // gps和ip接口是否调用完成
      posNum: 0,
      // 正在提交
      submitting: false,
      // 充值手机号
      rechargeTelephone: '',
      orderParam: {
        // 活动ID
        actId: '',
        // 收货地址ID
        addressId: '',
        // 订单推荐人的推荐人
        againReferrer: '',
        // 买家留言
        buyMsg: '',
        // 购物车id数组
        cartIdList: [],
        // 优惠券id
        couponId: '',
        // 下单所在地(中文详细地址)
        createAddress: '',
        // 	商品总数
        goodsCount: '',
        // 主键ID
        id: '',
        // 下单IP
        ip: '',
        // 	K米抵扣金额
        kmiAmount: '',
        // 下单微信openId
        openId: '',
        // 订单中所包含的商品对象集合
        orderItemList: [{
          // 第三方机构编码
          externalOrganCode: '',
          // 第三方sku商品ID
          externalSkuId: '',
          // 购买数量
          goodsCount: '',
          // 商品ID
          goodsId: '',
          // 商品类型（0：实物商品，1：虚拟商品，2：卡券商品）
          goodsType: '',
          // 商品skuId
          skuId: '',
          // 商品库ID
          storageId: ''
        }],
        // 订单类型（0：实物订单，1：虚拟订单，2：卡券订单）
        orderType: '',
        // 机构ID
        organId: '',
        // 支付卡号
        payCardNo: '',
        // 产品编码
        prodCode: '',
        // 充值手机号，只有充话费活动会用到该字段
        rechargeTelephone: '',
        // 订单推荐人
        referrer: '',
        // 下单地纬度
        lat: '',
        // 下单地经度
        lng: '',
        // 使用K米数量
        useKmi: ''
      },
      // 充值手机号码归属地
      telSegment: ''
    }
  },
  computed: {
    // 本次购买的商品总数量
    totalGoodsCount() {
      var sum = 0
      this.orderItemList.forEach(item => {
        sum += item.goodsCount
      })
      return sum
    },
    submitText() {
      if (this.calcAmount.payAmount === 0) {
        return '免费领取'
      } else {
        return '提交订单'
      }
    }
  },
  watch: {
    '$route.hash': function(newval, oldVal) {
      const hashVal = newval
      if (hashVal === '#ShippingAddress' || hashVal === '#PickUpAddress' || hashVal === '#AddressAdd') {
        this.addressManageshow = true
      } else {
        this.addressManageshow = false
      }
    }
  },
  async created() {
    // TODO 可能为0的参数，要判断是否是undefined
    this.$route.query.organId && (this.organId = this.$route.query.organId)
    this.$route.query.actId && (this.actId = this.$route.query.actId)
    this.$route.query.storageId && (this.storageId = this.$route.query.storageId)
    this.$route.query.externalOrganCode && (this.externalOrganCode = this.$route.query.externalOrganCode)
    this.$route.query.externalSkuId && (this.externalSkuId = this.$route.query.externalSkuId)
    typeof (this.$route.query.goodsCount) !== 'undefined' && (this.goodsCount = this.$route.query.goodsCount)
    this.$route.query.goodsId && (this.goodsId = this.$route.query.goodsId)
    typeof (this.$route.query.goodsType) !== 'undefined' && (this.goodsType = this.$route.query.goodsType - 0)
    this.$route.query.skuId && (this.skuId = this.$route.query.skuId)
    this.$route.query.addressId && (this.addressId = this.$route.query.addressId)

    // 充值手机号默认填充当前登录用户手机号
    this.rechargeTelephone = this.$store.getters.tel
    this.addressId !== '' && this.getUserAddressById()
    this.generateConfirmOrder()
    await this.getActInfo()
    this.getIp()
    this.getGps()
  },
  mounted() {
    // 键盘弹出时，隐藏底部van-submit-bar
    var winHeight = $(window).height() // 获取当前页面高度
    $(window).resize(function() {
      var thisHeight = $(this).height()
      if (winHeight - thisHeight > 50) {
        // 当软键盘弹出，在这里面操作
        $('.submitBar').hide()
      } else {
        // 当软键盘收起，在此处操作
        $('.submitBar').show()
      }
    })
  },
  methods: {
    // 选择地址
    selectAddress(item) {
      // 删除了选中的地址
      if (item.id === '') {
        this.addressId = ''
      } else {
        this.addressId = item.id
        this.addressDetails.name = item.name
        this.addressDetails.telephone = item.telephone
        this.addressDetails.fullAddress = item.fullAddress
      }
    },
    // 打开地址列表
    showAddress() {
      this.addressManageshow = true
      if (this.actInfo.receiveAddressType === 0) {
        this.addrListType = 1
        if (this.$route.fullPath.indexOf('#ShippingAddress') === -1) {
          this.$router.push({ path: this.$route.fullPath.split('#')[0] + '#ShippingAddress' })
        }
      } else {
        this.addrListType = 2
        if (this.$route.fullPath.indexOf('#PickUpAddress') === -1) {
          this.$router.push({ path: this.$route.fullPath.split('#')[0] + '#PickUpAddress' })
        }
      }
    },
    // 提交订单
    async submitOrder() {
      this.submitting = true
      // 构建提交订单所需参数
      this.orderParam.actId = this.actId
      this.orderParam.addressId = this.addressId
      // this.orderParam.addressId = '1290192144951955458'
      this.orderParam.goodsCount = this.totalGoodsCount
      this.orderParam.openId = Cookies.get('openid')
      this.orderParam.orderItemList = this.orderItemList
      this.orderParam.orderType = this.orderItemList[0].goodsType
      this.orderParam.organId = this.organId
      this.orderParam.prodCode = this.actInfo.prodCode

      // 判断实物商品必须传收货地址
      // 实物商品
      if (this.goodsType === 0) {
        if (this.orderParam.addressId === '') {
          this.$toast.fail('请设置收货地址')
          this.submitting = false
          return false
        }
      }
      // 充话费
      if (this.externalOrganCode === 'LGHF') {
        this.orderParam.rechargeTelephone = this.rechargeTelephone
        if (!validatePhoneNum(this.orderParam.rechargeTelephone)) {
          this.$toast.fail('请输入正确的手机号')
          this.submitting = false
          return false
        }
        // 验证手机号码归属地
        var addressArr = []
        this.actInfo.phoneLocal !== '' && (addressArr = this.actInfo.phoneLocal.split(','))
        if (addressArr.length > 0) {
          await this.getTelSegment(this.orderParam.rechargeTelephone)
          var flag = addressArr.findIndex(e => {
            return e.indexOf(this.telSegment) !== -1
          })
          if (flag === -1) {
            this.$toast.fail('充值手机号码归属地不满足活动参与条件')
            this.submitting = false
            return false
          }
        }
      }
      // 免费领取时的确认弹窗
      if (this.calcAmount.payAmount === 0) {
        this.$dialog.confirm({
          title: '提示',
          message: '<span style="color: #333333; font-size: 4.26667vw;">确认要提交订单吗？</span>\n<span style="color: #999999">提交后不可撤销</span>'
        }).then(() => {
          this.confirmSubmitOrder()
        }).catch(() => {
          this.submitting = false
        })
      } else {
        this.confirmSubmitOrder()
      }
    },
    // 提交订单
    confirmSubmitOrder() {
      submitOrder(this.orderParam).then(res => {
        this.submitting = false
        if (res.data.data.payAmount === 0) {
          // 0元商品
          this.$router.push({ name: 'MyOrder', query: { organId: this.organId, actId: this.actId }})
        } else {
          this.$router.push({ name: 'Pay', query: { orderIds: res.data.data.orderIds, organId: this.organId, actId: this.actId }})
        }
      }).catch(res => {
        this.submitting = false
        // 京东商品价格变更
        if (res.data.code === 3019) {
          this.$dialog.alert({
            title: '提示',
            message: res.data.msg
          }).then(async() => {
            this.generateConfirmOrder()
            await this.getActInfo()
            this.getIp()
            this.getGps()
          })
        }
      })
    },
    // 获取活动基本信息
    async getActInfo() {
      const res = await getActInfo({
        actId: this.actId
      })
      this.actInfo = res.data.data
    },
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
              this.orderParam.lat = res.latitude
              this.orderParam.lng = res.longitude
              getGps(res.latitude, res.longitude).then(res => {
                this.posNum++
                this.orderParam.createAddress = res.data.result.address
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
          this.orderParam.lat = res.coords.latitude
          this.orderParam.lng = res.coords.longitude
          getGps(res.coords.latitude, res.coords.longitude).then(res => {
            this.posNum++
            this.orderParam.createAddress = res.data.result.address
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
        this.orderParam.ip = res.data.result.ip
        this.ipFlag = inLimitArea(res.data.result.ad_info.adcode, this.actInfo.ipAddress)
      }).catch(res => {
        // 根据ip获取位置接口出错
        this.getPosFail('ip')
      })
    },
    // 获取手机号码归属地
    async getTelSegment(tel) {
      const res = await getTelSegment(tel)
      this.telSegment = res.data.province
    },
    // 商品数量变化重新计算价格
    goodsCountChange(value) {
      calcConfirmOrder({
        actId: this.actId,
        cartIdList: [],
        orderItemModel: {
          externalOrganCode: this.externalOrganCode,
          externalSkuId: this.externalSkuId,
          goodsCount: value,
          goodsId: this.goodsId,
          goodsType: this.goodsType,
          skuId: this.skuId,
          storageId: this.storageId
        }
      }).then(res => {
        this.calcAmount = res.data.data
      })
    },
    // 获取地址详情
    getUserAddressById() {
      getUserAddressById({
        id: this.addressId
      }).then(res => {
        this.addressDetails = res.data.data
      })
    },
    // 初始加载订单相关信息
    generateConfirmOrder() {
      generateConfirmOrder({
        actId: this.actId,
        cartIdList: [],
        orderItemModel: {
          externalOrganCode: this.externalOrganCode,
          externalSkuId: this.externalSkuId,
          goodsCount: this.goodsCount,
          goodsId: this.goodsId,
          goodsType: this.goodsType,
          skuId: this.skuId,
          storageId: this.storageId
        }
      }).then(res => {
        this.orderItemList = res.data.data.orderItemList
        this.calcAmount = res.data.data.calcAmount
        this.orderDiscount = res.data.data.orderDiscount
      })
    }
  }
}
</script>

<style lang="less" scoped>
.confirmOrder {
  width: 100%;
  min-height: 100%;
  background: #F7F8FA;
  padding: 10px 15px;
  .address{
    width: 100%;
    height: 104px;
    background: #ffffff;
    border-radius:8px;
    padding: 20px 16px;
    h2{
      font-size: 16px;
      color: #333333;
      font-weight:700;
      padding-left: 24px;
      margin-bottom: 6px;
      span{
        margin-right: 16px;
        &:nth-child(2){
          margin-right: 0;
        }
      }
    }
    p{
      font-size:14px;
      color: #666666;
      line-height:21px;
      .icon{
        float: left;
        height: 42px;
        svg{
          font-size: 14px;
          margin-right: 10px;
        }
      }
      .fullAddress{
        width: 270px;
      }
      .arrow{
        float: right;
        line-height:21px;
        color: #969799;
      }
    }
  }
  .noAddress{
    width: 100%;
    height: 56px;
    border-radius:8px;
    background: #ffffff;
    padding: 18px 17px 18px 16px;
    p{
      font-size:16px;
      color: #333333;
      line-height:20px;
      font-weight:700;
      .icon{
        float: left;
        height: 20px;
        svg{
          font-size: 14px;
          margin-right: 10px;
        }
      }
      .arrow{
        float: right;
        line-height:21px;
        color: #969799;
      }
    }
  }
  .goods{
    margin-top: 10px;
    .goodsItem{
      width: 100%;
      height: 146px;
      border-radius:8px;
      background: #ffffff;
      padding: 22px 12px 21px 16px;
      .van-image{
        float: left;
      }
      /deep/ img{
        display: block;
        float: left;
        width: 103px;
        border-radius:4px;
        margin-right: 18px;
      }
      .content{
        margin-left: 121px;
        width: 196px;
        height: 103px;
        position: relative;
        h2{
          font-size:14px;
          line-height:20px;
          font-weight:400;
          margin-bottom: 3px;
          color: #333333;
        }
        h4{
          font-size:11px;
          line-height:14px;
          color: #999999;
          font-weight:400;
          span{
            margin-right: 6px;
          }
        }
        .price{
          position: absolute;
          bottom: 0;
          left: 0;
          color: #333333;
          font-weight:700;
          line-height:16px;
          i{
            font-size: 11px;
            font-style: normal;
            margin-right: 5px;
          }
          span{
            font-size: 16px;
          }
        }
        .goodsCount{
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
    }
  }
  .goodsPrice{
    width: 100%;
    margin-top: 10px;
    .van-cell-group{
      background: transparent;
      &:after{
        border-width: 0;
      }
      /deep/ .van-cell{
        &:first-child{
          border-radius:8px 8px 0px 0px;
        }
        &:nth-child(2){
          border-radius:0px 0px 8px 8px;
        }
      }
      .rmb{
        font-size: 11px;
        font-style: normal;
        margin-right: 5px;
        color: #333333;
      }
      .money{
        font-size: 16px;
        color: #333333;
      }
    }
    &.coupon{
      .van-cell-group{
        background: transparent;
        &:after{
          border-width: 0;
        }
        /deep/ .van-cell{
          &:first-child{
            border-radius:8px;
          }
        }
        .rmb{
          font-size: 11px;
          font-style: normal;
          margin-right: 5px;
          color: #333333;
        }
        .money{
          font-size: 16px;
          color: #333333;
        }
      }
    }
  }

  .addCredit{
    width: 100%;
    margin-top: 10px;
    .van-cell-group{
      background: transparent;
      &:after{
        border-width: 0;
      }
      /deep/ .van-cell{
        &:first-child{
          border-radius:8px;
        }
      }
      .rmb{
        font-size: 11px;
        font-style: normal;
        margin-right: 5px;
        color: #333333;
      }
      .money{
        font-size: 16px;
        color: #333333;
      }
    }
  }

  .discount{
    width: 100%;
    margin-top: 10px;
    .van-cell-group{
      background: transparent;
      &:after{
        border-width: 0;
      }
      /deep/ .van-cell{
        &:first-child{
          border-radius:8px 8px 0px 0px;
        }
        &:nth-child(2){
          border-radius:0px 0px 8px 8px;
        }
      }
      .rmb{
        font-size: 11px;
        font-style: normal;
        margin-right: 5px;
        color: #FF4444;
      }
      .money{
        font-size: 16px;
        color: #FF4444;
      }
    }
  }

  .van-submit-bar{
    .van-submit-bar__bar{
      padding-right: 0;
      padding-left: 30px;
      .van-submit-bar__text{
        text-align: left;
      }
      .van-submit-bar__price{
        color: #FF4444;
      }
      .van-submit-bar__price--integer{
        margin-left: 5px;
      }
      .van-button{
        width: 188px;
        height: 50px;
        border-radius: 0;
        .van-button__text{
          font-size: 16px;
        }
      }
    }
  }
}
</style>
