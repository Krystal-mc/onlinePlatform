<template>
  <div class="orderDetails-container">
    <div class="top">
      <div v-if="orderDetails.orderStatus === 0" class="goodsState clearfix waitPay">
        <span class="tips">等待买家付款
          <p><van-count-down :time="orderDetails.cancelDiffMillis" format="mm" @finish="finish" />分钟后自动取消订单</p>
        </span>
        <img :src="require('@/assets/images/myOrder/waitPay.png')">
      </div>
      <div v-if="orderDetails.orderStatus === 1" class="goodsState clearfix waitDeliverGoods">
        <span class="tips">待发货<p>已付款等待商家发货</p></span>
        <img :src="require('@/assets/images/myOrder/waitDeliverGoods.png')">
      </div>
      <div v-if="orderDetails.orderStatus === 2 && orderDetails.orderType === 1" class="goodsState clearfix waitRecharge">
        <span class="tips">待充值<p>已付款待充值</p></span>
        <img :src="require('@/assets/images/myOrder/waitRecharge.png')">
      </div>
      <div v-if="orderDetails.orderStatus === 2 && orderDetails.orderType === 2 && orderDetails.convertType !== 1" class="goodsState clearfix waitUse">
        <span class="tips">未使用<p>已购买未使用</p></span>
        <img :src="require('@/assets/images/myOrder/waitUse.png')">
      </div>
      <div v-if="orderDetails.orderStatus === 3 && orderDetails.orderType === 2" class="goodsState clearfix alreadyUse">
        <span class="tips">已使用</span>
        <img :src="require('@/assets/images/myOrder/alreadyUse.png')">
      </div>
      <div v-if="orderDetails.orderStatus === 2 && orderDetails.orderType === 0" class="goodsState clearfix alreadyDeliverGoods">
        <span class="tips">已发货<p>请您耐心等待</p></span>
        <img :src="require('@/assets/images/myOrder/alreadyDeliverGoods.png')">
      </div>
      <div v-if="orderDetails.orderStatus === 3 && orderDetails.orderType === 0" class="goodsState clearfix alreadyComplete">
        <span class="tips">已完成</span>
        <img :src="require('@/assets/images/myOrder/alreadyComplete.png')">
      </div>
      <div v-if="orderDetails.orderStatus === 3 && orderDetails.orderType === 1" class="goodsState clearfix alreadyRecharge">
        <span class="tips">已充值</span>
        <img :src="require('@/assets/images/myOrder/alreadyRecharge.png')">
      </div>
      <div v-if="orderDetails.orderStatus === 2 && orderDetails.orderType === 2 && orderDetails.convertType === 1" class="goodsState clearfix alreadyRecharge">
        <span class="tips">已付款</span>
        <img :src="require('@/assets/images/myOrder/alreadyPaid.png')">
      </div>
      <div v-if="orderDetails.orderStatus === 4" class="goodsState clearfix cancelled">
        <span class="tips">已取消
          <p v-if="orderDetails.cancelReasonType === 0">超时未支付，系统自动取消订单</p>
          <p v-if="orderDetails.cancelReasonType === 1">您已取消订单</p>
          <p v-if="orderDetails.cancelReasonType === 2">客服通过后台取消了订单</p>
        </span>
        <img :src="require('@/assets/images/myOrder/cancelled.png')">
      </div>
    </div>
    <div class="content">
      <!-- 物流 -->
      <!-- <div v-if="(orderDetails.orderStatus === 2 || orderDetails.orderStatus === 3) && orderDetails.orderType === 0" class="commonCss">
        <a href="javascript:void(0)" class="logistics" @click="goLogistics">
          <span class="logIcon">
            <svg-icon icon-class="logistics" class="logIcon" />
          </span>
          <div class="infor">
            <p class="txt">{{ orderDetails.orderDeliveryVO.content }}</p>
            <p class="time">{{ orderDetails.orderDeliveryVO.updateTime }}</p>
          </div>
          <span class="arrow"><van-icon name="arrow" /></span>
        </a>
      </div> -->
      <!-- 收货人信息 -->
      <div v-if="orderDetails.orderType === 0" class="commonCss personInfor">
        <div class="name">{{ orderDetails.receiverName }} <span>{{ orderDetails.receiverTelephone }}</span></div>
        <div class="address">
          <span class="locIcon">
            <svg-icon icon-class="location" />
          </span>
          <span class="address">{{ orderDetails.fullAddress }}</span>
        </div>
      </div>
      <!-- 链接地址的券码 -->
      <div v-if="orderDetails.orderType === 2 && couponLink === 1" class="commonCss">
        <div v-for="(item,index) in orderDetails.orderCouponList" :key="index" class="couponCode1">
          <span>有效期：{{ item.validityBeginTime | parseTime('{y}-{m}-{d}') }}~{{ item.validityEndTime | parseTime('{y}-{m}-{d}') }}</span>
          <a :href="item.couponCode">
            <van-button type="info" round class="btn">查看券码</van-button>
          </a>
        </div>
      </div>
      <!-- 二维码的券码 -->
      <div v-if="orderDetails.orderType === 2 && couponString === 1" class="commonCss1 couponCode2">
        <van-collapse v-model="activeName" accordion>
          <van-collapse-item v-for="(item1,index1) in orderDetails.orderCouponList" :key="index1" :name="index1+''">
            <template #title>
              <div>券码： {{ item1.couponCode }}</div>
            </template>
            <template #value>
              <div class="valueBox">
                <span v-if="item1.convertType === 1 && orderDetails.orderStatus === 2 && item1.status === 1" class="noShop"> 已付款</span>
                <span v-else class="noShop" :class="item1.status === 1?'noUse':''"> {{ couponCodeMap(item1.status) }} </span>
              </div>
            </template>
            <div class="couponCode2Content">
              <img class="img" :src="item1.qrCodeImg">
              <p class="code">券码：{{ item1.couponCode }}</p>
              <p class="time">有效期：{{ item1.validityBeginTime | parseTime('{y}-{m}-{d}') }}~{{ item1.validityEndTime | parseTime('{y}-{m}-{d}') }}</p>
              <div v-if="item1.status === 2" class="watermark"><svg-icon icon-class="copo_locked" /></div>
              <div v-if="item1.status === 3" class="watermark"><svg-icon icon-class="copo_used" /></div>
              <div v-if="item1.status === 4" class="watermark"><svg-icon icon-class="copo_expired" /></div>
              <div v-if="item1.status === 5" class="watermark"><svg-icon icon-class="copo_voided" /></div>
              <div v-if="item1.status === 2 || item1.status === 3 || item1.status === 4 || item1.status === 5" class="mask" />
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
      <!-- 商品信息 -->
      <div class="commonCss goodsInfor">
        <div v-for="(item,index) in orderDetails.orderItemList" :key="index" class="goodsLi" href="javascript:void(0)">
          <img class="img" :src="getImgPath(item.skuImg, 'list')">
          <div class="goodsName">
            <h5>{{ item.skuName }}</h5>
            <p v-for="(item2,index2) in JSON.parse(item.skuProperty)" :key="index2">
              <span v-if="item2.key">{{ item2.key }}</span>
              <span v-if="item2.value">{{ item2.value }}</span>
            </p>
          </div>
          <div class="numStatic">
            <h6 class="price"><span>￥</span>{{ item.salePrice }}</h6>
            <p class="num">×{{ item.goodsCount }}</p>
          </div>
        </div>
      </div>
      <!-- 金额信息 -->
      <div class="commonCss1 detailsInfor">
        <van-cell-group>
          <van-cell title="商品合计">
            <template #default>
              <span class="amount"><span>￥</span>{{ orderDetails.orderAmountVO.goodsAmount }}</span>
            </template>
          </van-cell>
          <van-cell v-if="orderDetails.orderType === 0" title="运费">
            <template #default>
              <span class="describe">{{ orderDetails.orderAmountVO.freightAmount }}</span>
            </template>
          </van-cell>
          <van-cell title="优惠">
            <template #default>
              <span class="amount"><span>￥</span>{{ orderDetails.orderAmountVO.discountAmount }}</span>
            </template>
          </van-cell>
          <van-cell title="优惠说明">
            <template #default>
              <span class="describe">{{ orderDetails.orderAmountVO.discountIntro }}</span>
            </template>
          </van-cell>
          <!-- 根据订单状态判断是实付还是应付 -->
          <van-cell :title="(orderDetails.orderStatus === 0 || orderDetails.orderStatus === 4) ? '应付' : '实付'">
            <template #default>
              <span class="actualPay"><span>￥</span>{{ orderDetails.orderAmountVO.payAmount }}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 支付卡号和充值手机号 -->
      <div class="commonCss1 payMode">
        <van-cell-group>
          <van-cell v-if="orderDetails.orderStatus !== 0 && orderDetails.orderStatus !== 4 && (orderDetails.payType === 0 && orderDetails.orderAmountVO.payAmount)" title="支付卡号">
            <template #default>
              <span>{{ orderDetails.payCardNo }}</span>
            </template>
          </van-cell>
          <van-cell v-if="orderDetails.orderType === 1" title="充值手机号">
            <template #default>
              <span>{{ orderDetails.rechargeTelephone }}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
      <!-- 关于订单的一些信息 -->
      <div class="commonCss1 orderInfor">
        <van-cell-group>
          <van-cell title="订单编号">
            <template #default>
              <span>{{ orderDetails.orderCode }}</span>
            </template>
          </van-cell>
          <van-cell title="下单时间">
            <template #default>
              <span>{{ orderDetails.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </van-cell>
          <van-cell v-if="orderDetails.orderStatus !== 0 && orderDetails.orderStatus !== 4 && (orderDetails.payType === 0 && orderDetails.orderAmountVO.payAmount)" title="支付方式">
            <template #default>
              <span v-if="orderDetails.payType === 0">未支付</span>
              <span v-if="orderDetails.payType === 1">银联支付</span>
              <span v-if="orderDetails.payType === 2">微信支付</span>
              <span v-if="orderDetails.payType === 3">支付宝</span>
            </template>
          </van-cell>
          <van-cell v-if="orderDetails.orderStatus !== 0 && orderDetails.orderStatus !== 4 && (orderDetails.payType === 0 && orderDetails.orderAmountVO.payAmount)" title="支付时间">
            <template #default>
              <span>{{ orderDetails.payTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </van-cell>
          <!-- TODO 使用时间 sendTime(确认一下，sendTime发货时间就是使用时间吗？) -->
          <van-cell v-if="orderDetails.orderStatus === 3 && orderDetails.orderType === 1" title="使用时间">
            <template #default>
              <span>{{ orderDetails.sendTime }}</span>
            </template>
          </van-cell>
          <van-cell v-if="(orderDetails.orderStatus === 2 || orderDetails.orderStatus === 3) && orderDetails.orderType === 0" title="发货时间">
            <template #default>
              <span>{{ orderDetails.sendTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </van-cell>
          <van-cell v-if="orderDetails.orderStatus === 3 && orderDetails.orderType === 0" title="完成时间">
            <template #default>
              <span>{{ orderDetails.finishTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </van-cell>
          <van-cell v-if="orderDetails.orderStatus === 4" title="取消时间">
            <template #default>
              <span>{{ orderDetails.cancelTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>
    <!-- 操作按钮 -->
    <div class="btnGrounp">
      <van-button v-if="orderDetails.orderStatus === 0" type="default" round class="btn" @click="cancelUserOrder">取消订单</van-button>
      <van-button v-if="orderDetails.orderStatus === 0" type="default" round class="btn btnAct" @click="payOrder(orderDetails.id, orderDetails.actId)">去付款</van-button>
      <van-button v-if="(orderDetails.orderStatus === 2 || orderDetails.orderStatus === 3) && orderDetails.orderType === 0" type="default" round class="btn btnAct" @click="goLogistics(orderDetails.expressCode, orderDetails.expressNum, orderDetails.orderCode, orderDetails.id)">查看物流</van-button>
      <van-button v-if="(orderDetails.orderStatus === 2) && orderDetails.orderType === 0" type="default" round class="btn btnAct" @click="confirmReceiveOrder">确认收货</van-button>
    </div>
  </div>
</template>

<script>
import { orderDetail } from '@/api/order'
import { Collapse, CollapseItem } from 'vant'
import { CountDown } from 'vant'
import { couponCodeMap } from '@/utils/const'
import { cancelUserOrder, confirmReceiveOrder } from '@/api/order'
import { wxHideBtn } from '@/utils/wx'
import { getImgPath } from '@/utils/index'

export default {
  name: 'OrderDetails',
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [CountDown.name]: CountDown
  },
  data() {
    return {
      getImgPath,
      activeName: '0',
      orderDetails: {
        // 收货地址-区名称
        areaName: '',
        // 取消时间
        cancelTime: '',
        // 剩余取消时间
        cancelDiffMillis: '',
        // 	收货地址-市名称
        cityName: '',
        // 	创建时间
        createTime: '',
        // 	收货地址-详细地址
        detailAddress: '',
        // 	完成时间
        finishTime: '',
        // 	收货地址-完整全地址
        fullAddress: '',
        // id	主键ID
        id: '',
        // 订单编号
        orderCode: '',
        // 订单所包含的金额信息
        orderAmountVO: {
          // 优惠金额
          discountAmount: '',
          // 优惠说明
          discountIntro: '',
          // 运费金额
          freightAmount: '',
          // 商品合计
          goodsAmount: '',
          // K米抵扣金额
          kmiAmount: '',
          // 实付金额
          payAmount: '',
          // 退款金额
          refundAmount: '',
          // 	使用K米数量
          useKmi: ''
        },
        orderCouponList1: [],
        // 订单所包含的券码信息集合
        orderCouponList: [{
          // 券码
          couponCode: '',
          // 券码类型（0：字符串，1：链接地址）
          couponType: '',
          // 二维码图片
          qrCodeImg: '',
          // 状态（0：未售出，1：未使用，2：已锁定，3：已使用，4：已过期，5：已作废）
          status: '',
          // 	有效期开始时间
          validityBeginTime: '',
          // 有效期结束时间
          validityEndTime: '',
          // 券码核销方式
          convertType: ''
        }],
        //
        orderItemList: [
          {
            // 第三方机构编码，从机构表获取，如：京东、云中鹤的机构编码
            externalOrganCode: '',
            // 第三方sku商品ID
            externalSkuId: '',
            // 购买数量
            goodsCount: '',
            //	商品ID
            goodsId: '',
            // 	商品类型（0：实物商品，1：虚拟商品，2：卡券商品）
            goodsType: '',
            // 	退款数量
            refundCount: '',
            // 	退款状态（0：未退款，1：退款中，2：退款完成）
            refundStatus: '',
            // 	商品销售价（单价）
            salePrice: '',
            // 	商品销售价（合计）
            saleTotalPrice: '',
            // 	商品sku编码
            skuCode: '',
            // 	商品skuId
            skuId: '',
            // 	商品主图
            skuImg: '',
            // 	商品sku名称
            skuName: '',
            // 	商品sku属性值，JSON串
            skuProperty: '[]',
            // 	供应商ID
            suppId: ''
          }
        ],
        // 所包含的配送信息
        orderDeliveryVO: {
          // 内容
          content: '',
          // 物流更新时间
          updateTime: ''
        },
        // 	订单状态（0：待付款，1：待发货，2：已发货/未使用/待充值，3：已收货/已完成/已充值，4：已取消）
        orderStatus: '',
        // 	订单类型（0：实物订单，1：虚拟订单，2：卡券订单）
        orderType: '',
        // 	支付卡号
        payCardNo: '',
        //	付款时间
        payTime: '',
        // 	支付类型（0：未支付，1：银联支付，2：微信支付，3：支付宝）
        payType: '',
        // 	收货地址-省名称
        provinceName: '',
        // 	收货人姓名
        receiverName: '',
        // 	收货人手机号
        receiverTelephone: '',
        // 	充值手机号，只有充话费活动会用到该字段
        rechargeTelephone: '',
        // 	发货时间
        sendTime: '',
        // 	收货地址-街道名称
        streetName: '',
        // 取消状态
        cancelReasonType: 0,
        // 快递公司编码
        expressCode: '',
        // 快递公司名称
        expressName: '',
        // 	快递单号
        expressNum: '',
        // 券码核销方式
        convertType: ''
      },

      // 券码类型是链接
      couponLink: '',
      // 券码类型是字符串
      couponString: ''
    }
  },
  watch: {

  },
  created() {
  },
  mounted() {
    this.initPage()
    wxHideBtn().then(res => {})
  },
  destroyed() {
  },
  methods: {
    couponCodeMap(param) {
      return couponCodeMap.get(param + '')
    },
    goLogistics(expressCode, expressNum, orderCode, orderId) {
      if (expressCode === 'JD') {
        this.$router.push({ name: 'Logistics', query: { orderId: orderId }})
      } else {
        var url = location.href.split('#')[0]
        location.href = 'https://m.kuaidi100.com/index_all.html?type=' + expressCode + '&postid=' + expressNum + '&callbackurl=' + url
      }
    },
    initPage() {
      if (this.$route.query.orderId) {
        this.orderId = this.$route.query.orderId
      }
      this.orderDetail()
    },
    orderDetail() {
      orderDetail({
        orderId: this.orderId
      }).then(response => {
        this.orderDetails = response.data.data
        if (this.orderDetails.orderCouponList) {
          this.orderDetails.convertType = this.orderDetails.orderCouponList[0].convertType
          if (this.orderDetails.orderCouponList[0] && this.orderDetails.orderCouponList[0].couponType === 0) {
            this.couponString = 1
          } else if (this.orderDetails.orderCouponList[0] && this.orderDetails.orderCouponList[0].couponType === 1) {
            this.couponLink = 1
          }
        }
      })
    },
    // 倒计时结束去刷新页面
    finish() {
      this.orderDetail()
    },
    // 取消订单
    cancelUserOrder() {
      this.$dialog.confirm({
        title: '标题',
        message: '确定取消吗？'
      }).then(() => {
        cancelUserOrder({
        // 订单ID
          orderId: this.orderId,
          // 父订单编号，多订单合并付款时用到
          parentCode: ''
        }).then(response => {
          this.$toast.success({
            message: response.data.msg,
            duration: 3000
          })
          this.orderDetail()
        })
      }).catch(() => {
        // on cancel
      })
    },
    // 用户确认收货
    confirmReceiveOrder() {
      this.$dialog.confirm({
        title: '标题',
        message: '确定收货吗？'
      }).then(() => {
        // on confirm
        confirmReceiveOrder({
          orderId: this.orderId
        }).then(response => {
          this.$toast.success({
            message: response.data.msg,
            duration: 3000
          })
          this.orderDetail()
        })
      }).catch(() => {
        // on cancel
      })
    },
    payOrder(orderId, actId) {
      this.$router.push({ name: 'Pay', query: { orderIds: orderId, organId: this.organId, actId: actId }})
    }
  }
}
</script>

<style lang="less" scoped>
.orderDetails-container{
    background: #F7F8FA;
    height: 100%;
    overflow: auto;
    h1,h2,h3,h4,h5,h6,p{
      margin: 0;
      font-weight: normal;
    }
    .top{
        height: 120px;
        background: #0091FF;
        .goodsState{
            padding-left: 70px;
            .tips{
                font-size: 20px;
                color: #ffffff;
                line-height: 24px;
                float: left;
                p{
                    font-size: 11px;
                    margin-top: 5px;
                }
                /deep/ .van-count-down{
                  font-size: 12px;
                  color: #ffffff;
                  line-height: 2;
                  float: left;
                }
            }
            img{
              float: right;
            }
        }
        .waitPay{
            text-align: center;
            padding-top: 17px;
            .tips{
              margin-top: 3px;
            }
            img{
                width: 95px;
                height: 52px;
                margin-right: 68px;
            }
        }
        .waitDeliverGoods{
            padding-top: 20px;
            img{
                width: 95px;
                height: 55px;
                margin-right: 64px;
            }
        }
        .waitRecharge{
            padding-top: 10px;
            .tips{
                margin-top: 10px;
            }
            img{
                width: 75px;
                height: 69px;
                margin-right: 71px;
            }
        }
        .waitUse{
            padding-top: 12px;
            .tips{
                margin-top: 8px;
            }
            img{
                width: 89px;
                height: 67px;
                margin-right: 68px;
            }
        }
        .alreadyUse{
            padding-top: 9px;
            .tips{
                margin-top: 24px;
            }
            img{
                width: 111px;
                height: 77px;
                margin-right: 60px;
            }
        }
        .alreadyDeliverGoods{
            padding-top: 20px;
            .tips{
            }
            img{
                width: 101px;
                height: 60px;
                margin-top: 2px;
                margin-right: 70px;
            }
        }
        .alreadyComplete{
            padding-top: 15px;
            .tips{
                margin-top: 18px;
            }
            img{
                width: 172px;
                height: 61px;
                margin-right: 34px;
            }
        }
        .alreadyRecharge{
            padding-top: 9px;
            .tips{
              margin-top: 24px;
            }
            img{
              width: 94px;
              height: 79px;
              margin-right: 70px;
            }
        }
        .cancelled{
            padding-left: 60px;
            padding-top: 10px;
            .tips{
                margin-top: 10px;
            }
            img{
                width: 94px;
                height: 79px;
                margin-right: 60px;
            }
        }
    }
    .content{
        position: relative;
        top: -30px;
        padding-bottom: 44px;
        .commonCss{
            background: #ffffff;
            margin: 0 15px 10px 15px;
            border-radius: 8px;
            min-height: 44px;
            padding: 13px 15px 13px 16px;
            font-size: 14px;
            color: #999999;
        }
        .commonCss1{
          margin: 0 15px 10px 15px;
          border-radius: 8px;
          /deep/ .van-collapse-item:nth-child(1) .van-cell.van-cell--clickable{
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          }
          /deep/ .van-collapse-item:last-child .van-cell.van-cell--clickable{
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
          /deep/ .van-collapse-item:last-child .van-collapse-item__content{
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
        }
        .logistics{
            display: flex;
            .logIcon{
                font-size: 14px;
                margin-top: 14px;
            }
            .infor{
                margin-left: 10px;
                margin-right: 19px;
                flex: 1;
                .txt{
                    height: 42px;
                    font-size: 14px;
                    color: #0091FF;
                    line-height: 21px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    word-break: break-all;
                }
                .time{
                    font-size: 11px;
                    color: #999999;
                    margin-top: 11px;
                }
            }
            .arrow{
                margin-top: 23px;
                float: right;
            }
        }
        .personInfor{
            padding: 18px 20px 18px 16px;
            .name{
                font-size: 16px;
                color: #323233;
                line-height: 20px;
                margin-top: 5px;
                margin-bottom: 6px;
                padding-left: 24px;
            }
            .address{
                font-size: 14px;
                color: #666666;
                line-height: 21px;
                display: flex;
                .locIcon{
                    font-size: 13px;
                }
                span.address{
                    font-size: 14px;
                    margin-left: 12px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    word-break: break-all;
                }
            }
        }
        .couponCode1{
            font-size: 11px;
            color: #333333;
            display: flex;
            line-height: 30px;
            margin-bottom: 30px;
            &:last-child{
              margin-bottom: 0;
            }
            span{
                flex: 1;
            }
            .btn{
                width: 90px;
                height: 30px;
            }
        }
        .couponCode2{
            position: relative;
            text-align: center;
            .valueBox{
              font-size: 12px;
              color: #969799;
              .noUse{
                color:#0091FF;
              }
            }
            .couponCode2Content{
              position: relative;
              text-align: center;
            }
            .img{
                width: 120px;
                height: 120px;
                margin-bottom: 14px;
            }
            .code{
                font-size: 16px;
                color: #333333;
                min-height: 40px;
                background: #F7F8FA;
                line-height: 24px;
                text-align: center;
                border-radius: 8px;
                margin-bottom: 17px;
                word-break: break-all;
                padding: 4px 10px;
            }
            .watermark{
                font-size: 90px;
                position: absolute;
                right: 0px;
                top: 10px;
                display: inline-flex;
            }
            .mask{
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0px;
                background: rgba(255,255,255,0.59);
            }
            .time{
              font-size: 11px;
            }
            /deep/ .van-cell{
              display: -webkit-box;
            }
        }
        .goodsInfor{
            .goodsLi{
                margin-bottom: 19px;
                &:last-child{
                    margin-bottom: 0;
                }
                display: flex;
                .img{
                    width: 102px;
                    height: 102px;
                    margin-right: 15px;
                    border-radius: 4px;
                }
                .goodsName{
                    margin-right: 6px;
                    width: 118px;
                    h5{
                    font-size: 13px;
                    color: #333333;
                    line-height: 21px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    word-break: break-all;
                    }
                    p{
                    font-size: 11px;
                    color: #999999;
                    line-height: 14px;
                    margin-top: 2px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    word-break: break-all;
                    }
                }
                .numStatic{
                    text-align: right;
                    width: 72px;
                    .price{
                    font-size: 14px;
                    line-height: 21px;
                    color: #333333;
                    span{
                        font-size: 11px;
                    }
                    }
                    .num{
                    font-size: 11px;
                    color: #999999;
                    margin-top: 5px;
                    }
                    .goodState{
                    font-size: 11px;
                    color: #FF4444;
                    margin-top: 8px;
                    }
                }
                }
        }
        .detailsInfor{
          /deep/ .van-cell-group{
            border-radius: 8px;
            .van-cell{
              &:nth-child(1){
                border-radius: 8px;

              }
            }
          }
            .amount{
                    font-size: 16px;
                    color: #333333;
                    span{
                        font-size: 11px;
                    }
                }
                .describe{
                    color: #969799;
                }
            .actualPay{
                color: #FF4444;
            }
        }
        .payMode{
          margin: 0 15px 10px 15px;
          border-radius: 8px;
        }
    }
    .btnGrounp{
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #ffffff;
        text-align: right;
        padding-bottom: 6px;
        .btn{
            width: 165px;
            height: 36px;
            margin-right: 15px;
            margin-top: 7px;
        }
        .btnAct{
            border: 1px solid #0091FF;
            color: #0091FF;
        }
    }
    /deep/ .van-collapse-item__content{
      text-align: left;
    }
    /deep/ .van-cell__title{
      text-align: left;
    }
}
</style>
