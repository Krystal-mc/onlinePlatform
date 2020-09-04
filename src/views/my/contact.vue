<template>
  <div class="contact-container">
    <div class="tel">
      <h5>客服电话</h5>
      <!-- <a class="tel" :tel="400-109-7717">400-109-7717</a> -->
      <a class="tel" href="tel:4001097717">400-109-7717</a>
      <p>周一至周五10:00 - 18:00，周末及节假日9:00 - 13:00</p>
    </div>
    <div class="tips">
      <h4>小贴士</h4>
      <p> 1、致电前，请准备好您的支付银行卡号、下单手机号 等相关数据，方便客服快速解决您的问题。</p>
      <p>  2、如遇高峰时段用户来电比较多，客服可能无法及时 接听，请您耐心等待或稍后再试。</p>
    </div>
  </div>
</template>

<script>
import { wxHideBtn } from '@/utils/wx'

export default {
  name: 'Contact',
  components: {
  },
  data() {
    return {

    }
  },
  watch: {

  },
  created() {
  },
  mounted() {
    wxHideBtn().then(res => {})
  },
  destroyed() {
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.contact-container{
    background: #F7F8FA;
    height: 100%;
    padding-top: 24px;
    h4,h5,h6,p{
        margin: 0;
        font-weight: normal;
    }
    .tel{
        margin: 0px 15px 25px 15px;
        background: #ffffff;
        border-radius: 8px;
        height: 150px;
        padding-top: 27px;
        text-align: center;
        h5{
            font-size: 18px;
            color: #323233;
            margin-bottom: 25px;
        }
        .tel{
            font-size: 24px;
            color: #FF4444;
        }
        p{
            margin-top: 25px;
            font-size: 11px;
            color: #999999;
        }
    }
    .tips{
        margin: 0 15px;
        h4{
            font-size: 16px;
            color: #323233;
            margin-bottom: 10px;
        }
        p{
            font-size: 14px;
            color: #999999;
            line-height: 21px;
        }
    }
}
</style>
