<template>
  <div class="tabs-container">
    <div class="orderList">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <!-- finished-text="已全部加载完" -->
        <van-list
          v-model="loading"
          class="goodsList clearfix"
          :finished="finished"
          :offset="100"
          :immediate-check="true"
          @load="getOrderList"
        >
          <div v-for="(item,index) in myOrderList" :key="index" class="orderLi">
            <div class="activeName">
              <!-- 首刷1元购活动 -->
              {{ item.actName }}
              <!-- 订单状态 start-->
              <template v-if="item.orderType === 0">
                <span v-if="item.orderStatus === 3" class="state state1">{{ goodsStatusMap(item.orderStatus) }}</span>
                <span v-else class="state"><span v-if="item.convertType === 1">已付款</span><span v-else>{{ goodsStatusMap(item.orderStatus) }}</span></span>
              </template>
              <template v-if="item.orderType === 1">
                <span v-if="item.orderStatus === 3" class="state state1">{{ rechargeStatusMap(item.orderStatus) }}</span>
                <span v-else class="state"><span v-if="item.convertType === 1">已付款</span><span v-else>{{ rechargeStatusMap(item.orderStatus) }}</span></span>
              </template>
              <template v-if="item.orderType === 2">
                <span v-if="item.orderStatus === 3" class="state state1">{{ couponStatusMap(item.orderStatus) }}</span>
                <span v-else class="state"><span v-if="item.convertType === 1">已付款</span><span v-else>{{ couponStatusMap(item.orderStatus) }}</span></span>
              </template>
              <!-- 订单状态 end-->
            </div>
            <a href="javascript:void(0)" @click="gotoDetails(item.id)">
              <div v-for="(item1,index1) in item.orderItemList" :key="index1" class="goodsInfor" href="javascript:void(0)">
                <img v-if="item1.skuImg" class="img" :src="getImgPath(item1.skuImg,'list')">
                <div class="goodsName">
                  <h5>{{ item1.skuName }}</h5>
                  <p v-for="(item2,index2) in JSON.parse(item1.skuProperty)" :key="index2">
                    <span v-if="item2.key">{{ item2.key }}</span>
                    <span v-if="item2.value">{{ item2.value }}</span>
                  </p>
                </div>
                <div class="numStatic">
                  <h6 class="price"><span>￥</span>{{ item1.salePrice }}</h6>
                  <p class="num">×{{ item1.goodsCount }}</p>
                  <p class="goodState">
                    <span v-if="item1.refundStatus === 1">退货中</span>
                    <span v-if="item1.refundStatus === 2">退货完成</span>
                  </p>
                </div>
              </div>
              <div class="statistics">
                共{{ item.goodsCount }}件商品，合计<span class="symbol">￥</span>{{ item.goodsAmount }}<span class="payment"><span v-if="item.orderStatus === 0 || item.orderStatus === 4">应付</span><span v-else>实付</span><span class="symbol">￥</span>{{ item.payAmount }}</span>
              </div>
            </a>
            <div class="buttonGrounp">
              <van-button v-if="item.orderStatus === 0" type="default" round class="btn" @click="cancelUserOrder(item.id)">取消订单</van-button>
              <van-button v-if="item.orderStatus === 0" type="default" round class="btn btnAct" @click="payOrder(item.id, item.actId)">去付款</van-button>
              <van-button v-if="(item.orderStatus === 2 || item.orderStatus === 3) && item.orderType === 0" type="default" round class="btn" @click="goLogistics(item.expressCode, item.expressNum, item.orderCode, item.id)">查看物流</van-button>
              <van-button v-if="(item.orderStatus === 2) && item.orderType === 0" type="default" round class="btn btnAct" @click="confirmReceiveOrder(item.id)">确认收货</van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div v-if="myOrderList.length < 1" class="noData">
      <img :src="require('@/assets/images/myOrder/noData.png')">
      <p>目前没有任何订单哦~</p>
    </div>
  </div>
</template>

<script>
import { AddressList } from 'vant'
import { orderList, cancelUserOrder, confirmReceiveOrder } from '@/api/order'
import { goodsStatusMap, couponStatusMap, rechargeStatusMap } from '@/utils/const'
import { getImgPath } from '@/utils/index'

export default {
  name: 'Tabs',
  components: {
    [AddressList.name]: AddressList
  },
  data() {
    return {
      getImgPath,
      tabActive: 0,
      chosenAddressId: '1',
      list: [
        {
          id: '1',
          name: '张三',
          tel: '13000000000',
          address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
          isDefault: true
        },
        {
          id: '2',
          name: '李四',
          tel: '1310000000',
          address: '浙江省杭州市拱墅区莫干山路 50 号'
        }
      ],
      noData: false,
      page: {
        current: 1,
        size: 10
      },
      orderStatus: '',
      myOrderList: [],
      refreshing: false,
      loading: false,
      finished: false,
      organId: ''
    }
  },
  computed: {

  },
  watch: {
  },
  created() {

  },
  beforeCreate() {
  },
  mounted() {
    this.$route.query.organId && (this.organId = this.$route.query.organId)
    this.orderStatus = this.$store.getters.orderStatus
  },
  beforeDestroy() {
  },
  destroyed() {
  },
  methods: {
    getOrderList() {
      this.orderList()
    },
    goodsStatusMap(param) {
      return goodsStatusMap.get(param + '')
    },
    couponStatusMap(param) {
      return couponStatusMap.get(param + '')
    },
    rechargeStatusMap(param) {
      return rechargeStatusMap.get(param + '')
    },
    gotoDetails(orderId) {
      this.$router.push({ name: 'OrderDetails', query: { orderId: orderId }})
    },
    // 获取物流信息，京东跳转Logistics页面，其他的跳转第三方
    goLogistics(expressCode, expressNum, orderCode, orderId) {
      if (expressCode === 'JD') {
        this.$router.push({ name: 'Logistics', query: { orderId: orderId }})
      } else {
        var url = location.href.split('#')[0]
        location.href = 'https://m.kuaidi100.com/index_all.html?type=' + expressCode + '&postid=' + expressNum + '&callbackurl=' + url
      }
    },
    onRefresh() {
      this.loading = true
      this.page.current = 1
      this.myOrderList = []
      var self = this
      self.orderList(function() {
        self.finished = false
        self.refreshing = false
        self.loading = false
      })
    },
    // 获取订单列表
    orderList(callback) {
      orderList({
        current: this.page.current,
        size: this.page.size,
        // 某列排序
        column: '',
        // 订单状态
        orderStatus: this.orderStatus,
        // 排序方式,可用值:ascend,descend
        orderType: ''
      }).then(response => {
        if (callback) {
          this.myOrderList = response.data.data.list
        } else {
          this.myOrderList = this.myOrderList.concat(response.data.data.list)
        }
        this.loading = false
        if (callback) {
          callback()
        }
        if (response.data.data.list.length < response.data.data.pageSize) {
          this.finished = true
        } else {
          this.page.current++
        }
      })
    },
    // 取消订单
    cancelUserOrder(orderId) {
      this.$dialog.confirm({
        title: '',
        message: '确定取消吗？'
      }).then(() => {
        // on confirm
        cancelUserOrder({
        // 订单ID
          orderId: orderId,
          // 父订单编号，多订单合并付款时用到
          parentCode: ''
        }).then(response => {
          this.$toast.success({
            message: response.data.msg,
            duration: 3000
          })
          this.onRefresh()
        })
      }).catch(() => {
        // on cancel
      })
    },
    // 用户确认收货
    confirmReceiveOrder(orderId) {
      this.$dialog.confirm({
        title: '',
        message: '确定收货吗？'
      }).then(() => {
        confirmReceiveOrder({
          orderId: orderId
        }).then(response => {
          this.$toast.success({
            message: response.data.msg,
            duration: 3000
          })
          this.onRefresh()
        })
      }).catch(() => {
        // on cancel
      })
    },
    // 订单发起支付
    payOrder(orderId, actId) {
      this.$router.push({ name: 'Pay', query: { orderIds: orderId, organId: this.organId, actId: actId }})
    }
  }
}
</script>

<style lang="less" scoped>
.tabs-container{
    background: #F7F8FA;
    height: 100%;
    h1,h2,h3,h4,h5,h6,p{
      margin: 0;
      font-weight: normal;
    }
    .inner-container{
      padding-bottom: 44px;
      position: relative;
      min-height: 100%;
    }
    .van-address-list__bottom{
        padding: 0;
    }
    .van-button--round{
        border-radius: 0;
    }
    .van-address-list__add{
        margin: 0;
    }
    .van-button{
        background: #0091FF;
        border: 0;
    }
    .van-address-list{
        padding-top: 11px;
    }
    .van-address-item{
        border-radius: 0;
    }
    .van-tag--danger{
        background: #0091FF;
        border-radius: 2px;
    }
    /deep/ .van-tab{
      flex-basis: 20%!important;
    }
    /deep/ .van-tabs__line{
      background-color: #0091FF;
    }
    .orderList{
      margin: 10px 15px 30px 15px;
      .orderLi{
        border-radius: 8px;
        margin-bottom: 10px;
        background: #ffffff;
        .activeName{
          height: 40px;
          border-bottom: 1px solid #F5F5F5;
          line-height: 40px;
          font-size: 16px;
          color: #333333;
          padding: 0 15px;
          .state{
            float: right;
            font-size: 11px;
            color: #0091FF;
          }
          .state1{
            color: #333333;
          }
        }
        .goodsInfor{
          padding: 10px 15px;
          display: flex;
          .img{
            width: 102px;
            height: 102px;
            margin-right: 15px;
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
        .statistics{
          padding: 0px 15px;
          font-size: 13px;
          color: #666666;
          text-align: right;
          .symbol{
            font-size: 11px;
          }
          .payment{
            font-size: 14px;
            color: #333333;
            margin-left: 20px;
            font-weight: bold;
            .symbol{
              font-size: 11px;
            }
          }
        }
        .buttonGrounp{
          padding: 18px 15px 15px 15px;
          text-align: right;
          .btn{
            width: 90px;
            height: 30px;
            margin-left: 15px;
            margin-top: 7px;
            background: none;
            border-radius: 30px;
            border: 1px solid #CCCCCC;
          }
          .btnAct{
              border: 1px solid #0091FF;
              color: #0091FF;
          }
        }
      }
    }
    .footer{
      height: 14px;
      position: absolute;
      bottom: 30px;
      width: 100%;
      text-align: center;
      font-size: 11px;
      color: #999999;
      .img{
        display: inline-block;
        vertical-align: middle;
        img{
          width: 12px;
          height: 14px;
          margin-right: 6px;
        }
      }
      .txt{
        display: inline-block;
      }
    }
    .noData{
      text-align: center;
      font-size: 13px;
      color: #666666;
      height: 190px;
      margin-top: 154px;
      p{
        margin: 0;
        margin-top: 20px;
      }
      img{
        width: 150px;
        height: 146px;
      }
    }
}
</style>
