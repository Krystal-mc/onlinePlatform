<template>
  <div class="myOrder-container">
    <div class="inner-container">
      <van-tabs v-model="tabActive" @change="tabChange">
        <van-tab title="全部">
          <tabsList v-if="orderStatus === ''" />
        </van-tab>
        <van-tab title="待付款">
          <tabsList v-if="orderStatus === 0" />
        </van-tab>
        <van-tab title="待收货">
          <tabsList v-if="orderStatus === 2" />
        </van-tab>
        <van-tab title="已完成">
          <tabsList v-if="orderStatus === 3" />
        </van-tab>
        <van-tab title="已取消">
          <tabsList v-if="orderStatus === 4" />
        </van-tab>
      </van-tabs>
      <KFooter />
    </div>
    <a v-show="!tabbarShow" class="bankIndex" @click="bankIndex">
      <svg-icon icon-class="bankIndex" />
    </a>
    <ylycTabbar v-if="tabbarShow" />
  </div>
</template>

<script>
import { AddressList } from 'vant'
import ylyc from '@/components/KTabbar/ylyc'
import { goodsStatusMap, couponStatusMap, rechargeStatusMap } from '@/utils/const'
import KFooter from '@/components/KFooter'
import tabsList from '@/views/order/components/tabsList'
import { wxHideBtn } from '@/utils/wx'
import { getHomeAttr, getActIndexPage } from '@/api/common'

export default {
  name: 'MyOrder',
  components: {
    [AddressList.name]: AddressList,
    'KFooter': KFooter,
    'tabsList': tabsList,
    'ylycTabbar': ylyc
  },
  data() {
    return {
      tabbarShow: false,
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
      actId: '',
      organId: '',
      homeUrl: ''
    }
  },
  watch: {

  },
  created() {
  },
  mounted() {
    this.$route.query.actId && (this.actId = this.$route.query.actId)
    this.$route.query.organId && (this.organId = this.$route.query.organId)
    if (typeof (this.$store.getters.orderStatus) !== 'undefined') {
      var tabVal = this.$store.getters.orderStatus
      if (tabVal === '') {
        this.orderStatus = '' // 全部
        this.tabActive = 0
      } else if (tabVal === 0) {
        this.orderStatus = 0 // 待付款
        this.tabActive = 1
      } else if (tabVal === 2) {
        this.orderStatus = 2 // 待收货
        this.tabActive = 2
      } else if (tabVal === 3) {
        this.orderStatus = 3 // 已完成
        this.tabActive = 3
      } else if (tabVal === 4) {
        this.orderStatus = 4 // 已完成
        this.tabActive = 4
      }
    } else {
      this.tabActive = 0
    }
    this.getHomeAttr()
    wxHideBtn().then(res => {})
  },
  destroyed() {
  },
  methods: {
    bankIndex() {
      this.$router.push({ path: this.homeUrl })
    },
    // 获取首页地址
    getHomeAttr() {
      getHomeAttr({ organId: this.organId }).then(res => {
        if (res.data.data.url === '') {
          this.getActIndexPage()
          this.tabbarShow = false
        } else {
          this.homeUrl = res.data.data.url
          this.tabbarShow = true
        }
      })
    },
    // 根据活动Id获取对应首页
    getActIndexPage() {
      getActIndexPage({ actId: this.actId }).then(res => {
        this.homeUrl = res.data.data.url
      })
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
    gotoDetails() {
      this.$router.push({ name: 'OrderDetails' })
    },
    tabChange(index) {
      /** *
       * 0：待付款，1：待发货，2：已发货/未使用/待充值，3：已收货/已完成/已充值，4：已取消
       */
      if (index === 0) {
        this.orderStatus = '' // 全部
      } else if (index === 1) {
        this.orderStatus = 0 // 待付款
      } else if (index === 2) {
        this.orderStatus = 2 // 待收货
      } else if (index === 3) {
        this.orderStatus = 3 // 已完成
      } else if (index === 4) {
        this.orderStatus = 4 // 已取消
      }
      this.$store.dispatch('myOrder/setOrderStatus', this.orderStatus)
    }
  }
}
</script>

<style lang="less" scoped>
.myOrder-container{
    background: #F7F8FA;
    overflow: auto;
    height: 100%;
    padding-bottom: 60px;
    .bankIndex{
      position: fixed;
      bottom: 15px;
      right: 20px;
      font-size: 40px;
    }
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
        margin-top: 30px;
      }
      img{
        width: 150px;
        height: 146px;
      }
    }
}
</style>
