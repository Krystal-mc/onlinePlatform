<template>
  <div class="paySuccess">
    <div class="top">
      <img src="../../assets/img/paySuccess.png">
      <h2>支付成功</h2>
      <p>实付<span>¥</span>{{ payTotalAmount }}</p>
      <div class="btn">
        <van-button plain hairline round type="default" @click="backIndex">回到首页</van-button>
        <van-button plain hairline round type="info" @click="myOrder">查看订单</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { paySuccess } from '@/api/order'
import { getHomeAttr, getActIndexPage } from '@/api/common'
import { wxHideBtn } from '@/utils/wx'
export default {
  name: 'PaySuccess',
  data() {
    return {
      orderIds: '',
      organId: '',
      payTotalAmount: '',
      homePath: '',
      actId: ''
    }
  },
  created() {
    this.$route.query.orderIds && (this.orderIds = this.$route.query.orderIds)
    this.$route.query.organId && (this.organId = this.$route.query.organId)
    this.$route.query.actId && (this.actId = this.$route.query.actId)
    this.paySuccess()
    this.getHomeAttr()
    this.wxHideBtn()
  },

  methods: {
    wxHideBtn() {
      wxHideBtn().then(res => {
      })
    },
    backIndex() {
      this.$router.push({ path: this.homePath })
    },
    // 获取首页链接
    getHomeAttr() {
      getHomeAttr({
        organId: this.organId
      }).then(res => {
        this.homePath = res.data.data.url
        if (this.homePath === '') {
          this.getActIndexPage()
        }
      })
    },
    // 根据活动Id获取对应首页
    getActIndexPage() {
      getActIndexPage({ actId: this.actId }).then(res => {
        this.homePath = res.data.data.url
      })
    },
    // 获取支付成功信息
    paySuccess() {
      paySuccess({
        orderIds: this.orderIds
      }).then(res => {
        this.payTotalAmount = res.data.data.payTotalAmount
      })
    },
    // 查看订单
    myOrder() {
      this.$router.push({ name: 'MyOrder', query: { organId: this.organId }})
    }
  }
}
</script>

<style lang="less" scoped>
.paySuccess {
  background: #F7F8FA;
  min-height: 100%;
  .top{
    width: 100%;
    height: 210px;
    background: #ffffff;
    text-align: center;
    padding-top: 20px;
    img{
      width: 46px;
      margin-bottom: 10px;
    }
    h2{
      font-size:20px;
      font-weight:700;
      line-height:24px;
      color: #333333;
      margin-bottom: 5px;
    }
    p{
      font-size:14px;
      color: #999999;
      line-height: 14px;
      span{
        margin: 0 3px;
      }
    }
    .btn{
      margin-top: 30px;
      button{
        width:110px;
        height:36px;
        &:first-child{
          margin-right: 12.5px;
        }
        &:nth-child(2){
          margin-left: 12.5px;
        }
      }
    }
  }
}
</style>
