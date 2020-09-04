<template>
  <div class="logistics-container">
    <div class="top">
      <div class="infor">
        <span>快递公司：</span>
        {{ logisticsInfor.expressName }}
      </div>
      <div class="infor">
        <span>快递单号：</span>
        {{ logisticsInfor.expressNum }}
      </div>
    </div>
    <div class="logisticsProcess">
      <van-steps direction="vertical" :active="1">
        <van-step>
          <h3>{{ logisticsInfor.fullAddress }}</h3>
        </van-step>
        <van-step v-for="(item,index) in logisticsInfor.recordList" :key="index">
          <h3>{{ item.content }}</h3>
          <p>{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script>
import { Step, Steps } from 'vant'
import { orderTrack } from '@/api/order'

export default {
  name: 'Logistics',
  components: {
    [Step.name]: Step,
    [Steps.name]: Steps
  },
  data() {
    return {
      orderId: '',
      logisticsInfor: {
        // 快递公司编码
        expressCode: '',
        // 快递公司名称
        expressName: '',
        // 快递单号
        expressNum: '',
        // 地址
        fullAddress: '',
        // 物流记录集合
        recordList: []
      }
    }
  },
  watch: {

  },
  created() {
  },
  mounted() {
    this.$route.query.orderId && (this.orderId = this.$route.query.orderId)
    this.orderTrack()
  },
  destroyed() {
  },
  methods: {
    orderTrack() {
      orderTrack({
        orderId: this.orderId
      }).then(response => {
        this.logisticsInfor = response.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.logistics-container{
    background: #F7F8FA;
    height: 100%;
    overflow: auto;
    .top{
        background: #0091FF;
        padding: 12px 22px;
        margin: 9px 15px 10px 15px;
        color: #ffffff;
        font-size: 14px;
        border-radius: 8px;
        .infor{
            margin: 6px 0;
        }
    }
    .logisticsProcess{
        background: #ffffff;
        border-radius: 8px;
        margin: 0 15px;
        padding: 15px;
        font-size: 12px;
        color: #999999;
    }
    /deep/ .van-step--vertical .van-step__line{
        // width: 2px;
    }
    /deep/ .van-step__circle{
        width: 8px;
        height: 8px;
        background: #c8c9cc;
    }
    /deep/ .van-step__icon--active, .van-step__title--active{
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3388FF;
        border: 6px solid #E1F2FF;
        h3{
            color: #333333!important;
        }
        p{
         color: #333333!important;
        }
        &::before{
            content: '';
            width: 8px;
            height: 8px;
            color: #ffffff;
        }
    }
    /deep/ .van-step--finish{
        .van-step__circle{
            width: 20px;
            height: 20px;
        }
        .van-step__circle::before{
            content: '收';
            margin-left: 4px;
            line-height: 20px;
            font-size: 11px;
            color: #ffffff;
            font-style:normal;
        }
    }
    /deep/ .van-step__icon, .van-step__title h3{
        margin: 0;
        font-weight: normal;
        font-size: 12px;
        color: #999999;
    }
    /deep/ .van-step__icon, .van-step__title h3 span{
        color: #0091FF;
    }
    /deep/ .van-step__icon, .van-step__title p{
        margin: 0;
        font-size: 11px;
    }
    /deep/ .van-step--finish .van-step__line{
      background: #F7F8FA;
    }
}
</style>
