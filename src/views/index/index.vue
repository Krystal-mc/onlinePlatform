<template>
  <div class="indexContainer clearfix">
    这是测试首页
    <a class="logout" @click="logout">退出</a>
    <van-button @click="chooseImage">选图</van-button>
    <br>
    <br>
    <br>
    <br>
    <van-button @click="testAddress">测试地址列表</van-button>
    <br>
    {{ dataVal.fullAddress }}
    <br>
    {{ dataVal.name }}

    <van-popup v-model="addressListShow">
      <div class="addressAddContent">
        <addressManage :head-show="headShow" :addr-list-type="addrListType" @selectAddress="selectAddress" />
      </div>
    </van-popup>
    <ylycTabbar />
  </div>
</template>

<script>
import { logout } from '@/api/user'
import ylyc from '@/components/KTabbar/ylyc'
import { wxHideBtn } from '@/utils/wx'
import wx from 'weixin-js-sdk'
import addressManage from '@/views/address/addressManage'

export default {
  name: 'Index',
  components: {
    addressManage,
    'ylycTabbar': ylyc
  },
  data() {
    return {
      flag: '',
      addressListShow: false,
      // 地址管理列表的顶部是否显示(0隐藏，1显示)
      headShow: 0,
      // 判断是收货地址还是自提地址（1是收货地址，2是自提地址）
      addrListType: 1,
      dataVal: ''
    }
  },
  computed: {

  },
  watch: {
    '$route.hash': function(newval, oldVal) {
      console.log(this.$route)
      const hashVal = newval
      if (hashVal === '#ShippingAddress' || hashVal === '#PickUpAddress' || hashVal === '#AddressAdd') {
        this.addressListShow = true
      } else {
        this.addressListShow = false
      }
    }
  },
  created() {

  },
  mounted() {
    // 模拟微信getWxTicket接口延迟的情况
    setTimeout(() => {
      wxHideBtn().then(res => {
        this.flag = res
      })
    }, 5000)
  },
  destroyed() {

  },
  methods: {
    selectAddress(data) {
      console.log(data)
      this.dataVal = data
    },
    testAddress() {
      if (this.addrListType === 1) {
        this.addressListShow = true
        if (this.$route.fullPath.indexOf('#ShippingAddress') === -1) {
          this.$router.push({ path: this.$route.fullPath + '#ShippingAddress' })
        }
      } else if (this.addrListType === 2) {
        this.addressListShow = true
        if (this.$route.fullPath.indexOf('#PickUpAddress') === -1) {
          this.$router.push({ path: this.$route.fullPath + '#PickUpAddress' })
        }
      }
    },
    chooseImage() {
      if (this.flag) {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function(res) {
            var localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            console.log(localIds)
          }
        })
      } else {
        this.$toast('网络请求中，请稍后重试！')
      }
    },
    logout() {
      logout().then(res => {
        this.$store.dispatch('user/resetToken').then(() => {
          this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath }})
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.indexContainer{
  background: #ffffff;
  .logout{
    display: block;
    width: 200px;
    height: 100px;
    line-height: 100px;
    color: #fff;
    text-align: center;
    background: #0091FF;
  }
  /deep/ .van-popup.van-popup--center{
    width: 100%;
    height: 100%;
  }
  .addressAddContent{
    height: 100%;
  }
}
</style>

