<template>
  <div class="notice">
    <div>
      <img src="../../assets/img/activityNotice.png">
      <div v-if="showActivityNotice==='wait'">活动未开启</div>
      <div v-if="showActivityNotice==='over'">活动已结束</div>
      <van-button round type="info" @click="goBack">返回</van-button>
    </div>
    <k-footer />
  </div>
</template>

<script>
import KFooter from '@/components/KFooter/index.vue'

export default {
  name: 'ActivityNotice',
  components: {
    KFooter
  },

  data() {
    return {
      showActivityNotice: ''

    }
  },
  created() {
    // 获取活动是否结束
    this.showActivityNotice = this.$route.query.showActivityNotice
  },
  methods: {

    goBack() {
      this.$router.go(-1)
    }
  }

}
</script>

<style lang="less" scoped>
.notice{
  >div:first-child{
    position: relative;
    top: 150px;
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
