<template>
  <div class="tabbar">
    <van-tabbar v-model="active" @change="changeActive">
      <van-tabbar-item icon="index" :to="homeUrl">
        <span class="name">首页</span>
        <template slot="icon" slot-scope="props">
          <div v-if="props.active" class="quan" />
          <div class="iconBox">
            <svg-icon v-if="props.active" slot="icon" class="activeIcon" icon-class="nIndexActive" />
            <svg-icon v-else slot="icon" icon-class="nIndexNoActive" />
          </div>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/order/myOrder">
        <span class="name">订单</span>
        <template slot="icon" slot-scope="props">
          <div v-if="props.active" class="quan" />
          <div class="iconBox">
            <svg-icon v-if="props.active" slot="icon" class="activeIcon" icon-class="nOrderActive" />
            <svg-icon v-else slot="icon" icon-class="nOrderNoActive" />
          </div>
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="index_my" to="/my/userCenter">
        <span class="name">我的</span>
        <template slot="icon" slot-scope="props">
          <div v-if="props.active" class="quan" />
          <div class="iconBox">
            <svg-icon v-if="props.active" slot="icon" class="activeIcon" icon-class="nMyActive" />
            <svg-icon v-else slot="icon" icon-class="nMyNoActive" />
          </div>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'
import { getHomeAttr, getActIndexPage } from '@/api/common'

export default {
  name: 'YlycTabbar',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  props: {

  },
  data() {
    return {
      active: 0,
      organId: '',
      homeUrl: '',
      homePath: '',
      actId: ''
    }
  },
  mounted() {
    if (this.$route.query.organId) {
      this.organId = this.$route.query.organId
    }
    if (this.$route.query.actId) {
      this.actId = this.$route.query.actId
    }
    this.getHomeAttr()
    this.$nextTick(function() {
      if (this.$route.path === this.homePath) {
        this.$store.dispatch('tabbar/toggleTabbar', 0)
        this.active = this.$store.getters.tabbar
      }
      if (this.$route.path === '/order/myOrder') {
        this.$store.dispatch('tabbar/toggleTabbar', 1)
        this.active = this.$store.getters.tabbar
      }
      if (this.$route.path === '/my/userCenter') {
        this.$store.dispatch('tabbar/toggleTabbar', 2)
        this.active = this.$store.getters.tabbar
      }
    })
  },
  methods: {
    changeActive() {
      this.$store.dispatch('tabbar/toggleTabbar', this.active)
    },
    getHomeAttr() {
      getHomeAttr({ organId: this.organId }).then(response => {
        if (response.data.data.url !== '') {
          this.homeUrl = response.data.data.url
          if (this.homeUrl.indexOf('?') !== -1) {
            this.homePath = this.homeUrl.split('?')[0]
          }
        } else {
          this.getActIndexPage()
        }
      })
    },
    getActIndexPage() {
      getActIndexPage({ actId: this.actId }).then(response => {
        this.homeUrl = response.data.data.url
        if (this.homeUrl.indexOf('?') !== -1) {
          this.homePath = this.homeUrl.split('?')[0]
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tabbar {
  .van-tabbar-item{
    position: relative;
    .quan{
      position: absolute;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #ffffff;
      top: -11px;
      left: 50%;
      margin-left: -30px;
      z-index: 1;
    }
    /deep/ .van-tabbar-item__text{
      width: 100%;
      text-align: center;
    }
    /deep/ .name{
      z-index: 3;
      position: relative;
    }
    /deep/ .van-tabbar-item__icon{
      z-index: 2;
    }
  }
  .iconBox{
    width: 26px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    font-size: 18px;
    z-index: 5;
    position: relative;
  }
  .van-tabbar{
    z-index: 19!important;
    transition:all 0.5s;
  }
  .van-tabbar-item--active{
    color: #4077F5;
    .activeIcon{
      animation: shakeTopx1 0.2s linear forwards;
    }
    .iconBox{
      transition:all 1s;
    }
  }
  @keyframes shakeTopx1 {
    0%{
      transform:scale(1);
    }
    50%{
      transform:scale(0.75);
    }
    100%{
      transform:scale(1);
    }
  }
}
</style>
