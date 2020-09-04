<template>
  <div class="notFound">
    <div>
      <img src="../../assets/img/404.png">
      <div>页面走丢了~</div>
      <van-button round type="info" @click="goBack">返回</van-button>
    </div>
    <k-footer />
  </div>

</template>

<script>
import KFooter from '@/components/KFooter/index.vue'

export default {
  name: 'Page404',
  components: {
    KFooter
  },
  computed: {
    message() {
      return '您访问的页面不存在......'
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.notFound{
  >div:first-child{
    position: relative;
    top: 180px;
    text-align: center;
    img{
      width: 180px;
    }
    >div{
      font-size: 13px;
      color: #666;
      margin-top: 40px;
      margin-bottom: 13px;
    }
    .van-button{
      width: 110px;
      height: 36px;
      background-color: #0091FF;
    }
  }
}
</style>
