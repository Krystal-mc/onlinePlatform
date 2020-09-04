<template>
  <div class="footer-container">
    <div class="footer">
      <div class="img"><img :src="require('@/assets/images/myOrder/footerIcon.png')"></div>
      <div class="txt">卡唤唤提供技术支持</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
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
  },
  destroyed() {
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.footer-container{
    background: #F7F8FA;
    overflow: auto;
    height: 100%;
    .footer{
      height: 14px;
      position: absolute;
      bottom: 30px;
      width: 100%;
      text-align: center;
      font-size: 11px;
      color: #999999;
      // line-height: 14px;
      // height: 14px;
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
}
</style>
