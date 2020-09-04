<template>
  <div class="addressManage-container">
    <van-tabs v-model="tabActive" @change="tabChange">
      <van-tab title="收货地址">
        <div class="addressList">
          <van-radio-group v-model="addressCheck">
            <van-cell-group class="clearfix addrContB">
              <van-cell v-for="(item,index) in list" :key="index" title="单选框 1" class="addrCont" clickable @click="address1Method(index, item)">
                <template #title>
                  <van-radio :name="item.id" />
                  <div class="addressLi">
                    <div class="name">{{ item.name }} <span class="tel">{{ item.telephone }}</span><span v-if="item.defaultStatus === 1" class="default">默认</span></div>
                    <div v-if="item.type === 1" class="placeName">{{ item.placeName }}</div>
                    <div class="address">{{ item.fullAddress }}</div>
                    <div class="edit" @click.stop.prevent="goEditPage(item.id, 0, item.actId)">
                      <svg-icon icon-class="editAddress" />
                    </div>
                  </div>
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <div class="safeAreaBottom">
          <van-button v-if="isTarget === 1" type="info" @click="addAddress('0')">新建收货地址</van-button>
        </div>
        <div v-if="isTarget === 1 && list.length === 0" class="noData">
          <img :src="require('@/assets/img/noAddr.png')" class="noDataImg">
          <p>您还没有收货地址哦~</p>
        </div>
      </van-tab>
      <van-tab title="自提地址">
        <div class="addressList">
          <van-radio-group v-model="addressCheck">
            <van-cell-group class="clearfix addrContB">
              <van-cell v-for="(item,index) in list" :key="index" title="单选框 1" class="addrCont" clickable @click="address1Method(index, item)">
                <template #title>
                  <van-radio :name="item.id" />
                  <div class="addressLi">
                    <div class="name">{{ item.name }} <span class="tel">{{ item.telephone }}</span><span v-if="item.defaultStatus === 1" class="default">默认</span></div>
                    <div v-if="item.type === 1" class="placeName">{{ item.placeName }}</div>
                    <div class="address">{{ item.fullAddress }}</div>
                    <div class="edit" @click.stop.prevent="goEditPage(item.id, 1, item.actId)">
                      <svg-icon icon-class="editAddress" />
                    </div>
                  </div>
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <div class="safeAreaBottom">
          <van-button v-if="hasActId && isTarget === 2" type="info" @click="addAddress('1')">新建自提点</van-button>
        </div>
        <div v-if="isTarget === 2 && list.length === 0" class="noData">
          <img :src="require('@/assets/img/noAddr.png')" class="noDataImg">
          <p>您还没有收货地址哦~</p>
        </div>
      </van-tab>
    </van-tabs>
    <van-overlay v-if="addressAddShow" :show="addressAddShow" :lock-scroll="false">
      <div class="addressAddContent">
        <addressAdd :msgtype="oprType" :addretype="addressType" :address-id="addressId" @updateAddSuccess="getSuccessFlag" @delete="delAddress" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
// TODO 从商品详情进来，要不要做收货地址或自提点的隐藏
import { getUserAddressList } from '@/api/my'
import addressAdd from '@/views/address/addressAdd'
import $ from 'jquery'
import { wxHideBtn } from '@/utils/wx'

export default {
  name: 'AddressManage',
  components: {
    addressAdd
  },
  props: {
    // 判断是否显示地址列表顶部
    'headShow': {
      type: Number,
      default: null,
      required: false
    },
    // 判断是收货地址还是自提地址
    'addrListType': {
      type: Number,
      default: null,
      required: false
    },
    // 自提地址需要的actId
    'actId': {
      type: String,
      default: '',
      required: false
    },
    // 默认选中的地址Id
    'selAddressId': {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      addressType: 0,
      tabActive: 0,
      list: [],
      hasActId: false,
      addressAddShow: false,
      fullPath: '',
      address1: '',
      address2: '',
      oprType: '0',
      showTitleTxt: '首页',
      addretype: 0,
      successFlag: '',
      selectAddress: '',
      headShow1: true,
      addressId: '',
      addressCheck: '',
      // 页面引入了地址管理还是从别的页面跳转过来的
      isTarget: ''
    }
  },
  watch: {
    '$route.hash': function(newval, oldVal) {
      const hashVal = newval
      if (hashVal === '#ShippingAddress') {
        this.addressAddShow = false
        this.addressType = 0
        this.getUserAddressList()
      } else if (hashVal === '#PickUpAddress') {
        this.addressAddShow = false
        this.addressType = 1
        this.getUserAddressList()
      } else if (hashVal === '#AddressAdd') {
        this.addressAddShow = true
      } else {
        this.addressAddShow = false
        this.oprType = ''
      }
    },
    'oprType': function(newVal, oldVal) {
      this.oldVal = newVal
    },
    'addrListType': function(newVal, oldVal) {
      this.isTarget = newVal
    },
    'addressAddShow': function(newVal, oldVal) {
      if (newVal === false) {
        this.getUserAddressList()
      }
    },
    'headShow': function(newVal, oldVal) {
      if (newVal === 0) {
        $('.van-tabs .van-tabs__wrap.van-hairline--top-bottom').hide()
      } else {
        $('.van-radio').hide()
      }
    }
  },
  created() {
  },
  mounted() {
    if (this.actId) {
      this.hasActId = true
    }
    this.selAddressId && (this.addressCheck = this.selAddressId)
    // 是否隐藏地址列表顶部
    if (this.headShow === 0) {
      $('.van-tabs__wrap.van-hairline--top-bottom').hide()
    } else {
      $('.van-radio').hide()
    }
    if (this.$route.query.isTarget) {
      this.isTarget = this.$route.query.isTarget
    } else {
      this.isTarget = this.addrListType
    }
    // 判断编辑弹框是否显示
    if (this.$route.hash === '#ShippingAddress') {
      this.addressType = 0
      this.getUserAddressList()
    } else if (this.$route.hash === '#PickUpAddress') {
      this.addressType = 1
      this.tabActive = 1
      this.getUserAddressList()
    } else if (this.$route.hash === '#AddressAdd') {
      this.addressType = 0
      this.getUserAddressList()
    } else {
      this.addressAddShow = false
      this.isTarget = 1
      this.addressType = 0
      this.getUserAddressList()
    }
    wxHideBtn().then(res => {})
  },
  destroyed() {
  },
  methods: {
    delAddress(id) {
      this.addressAddShow = false
      // 删除了选中的地址，清除父组件中选择的地址
      if (id === this.addressCheck) {
        this.addressCheck = ''
      }
      if (this.addressCheck === '') {
        this.$emit('selectAddress', {
          id: ''
        })
      }
      this.$router.go(-1)
    },
    getSuccessFlag(data) {
      this.successFlag = data
    },
    address1Method(index, item) {
      this.selectAddress = item
      this.addressCheck = item.id
      this.$emit('selectAddress', this.selectAddress)
      this.$router.go(-1)
    },
    tabChange(index, title) {
      this.addressType = index
      this.addretype = index
      this.isTarget = index + 1
      this.getUserAddressList()
    },
    // 获取地址列表
    getUserAddressList() {
      getUserAddressList({
        actId: this.actId,
        type: this.addressType
      }).then(response => {
        this.list = response.data.data.list
        this.$nextTick(() => {
          if (this.headShow === 0) {
            $('.addrCont .van-cell__title .van-radio').show()
          } else {
            $('.addrCont .van-cell__title .van-radio').hide()
          }
        })
      })
    },
    addAddress(type) {
      this.oprType = '0'
      this.addretype = type
      this.addressId = ''
      this.addressAddShow = true
      this.$router.push({ path: this.$route.fullPath.split('#')[0] + '#AddressAdd' })
    },
    // 去编辑页
    goEditPage(id, type, actId) {
      this.oprType = id
      this.addressId = id
      this.addretype = type
      this.addressAddShow = true
      this.$router.push({ path: this.$route.fullPath.split('#')[0] + '#AddressAdd' })
    }
  }
}
</script>

<style lang="less" scoped>
.addressManage-container{
    background: #F7F8FA;
    height: 100%;
    overflow: auto;
    padding-bottom: 99px;
    .addressAddContent{
      height: 100%;
    }
    /deep/ .van-overlay{
      z-index: 101;
    }
    /deep/ .van-popup{
      width: 100%;
      height: 100%;
      padding-top: 10px;
      background: #F7F8FA;
    }

    .addressList{
       /deep/ .van-cell__title{
        // width: 25px;
        flex: inherit;
        padding-top: 10px;
        display: flex;
        width: 100%;
        &:active{
          background: #ffffff;
        }
        .van-radio__icon{
          margin-top: -30px;
        }
      }
      .addrContB{
        // display: inline-block;
        &:active{
          background: #ffffff;
        }
        &::after{
          content: '';
          clear: both;
          display: block;
        }
      }
      .addrCont{
        margin-top: 10px;
        float: left;
        &:active{
          background: #ffffff;
        }
      }
      .addressLi{
        background: #ffffff;
        margin-top: 1px;
        padding: 1px 70px 12px 16px;
        position: relative;
        min-height: 88px;
        flex: 1;
        .name{
          font-size: 16px;
          color: #323233;
          margin-bottom: 5px;
          line-height: 20px;
          .tel{
            margin-left: 20px;
          }
          .default{
            margin-left: 10px;
            background: #0091FF;
            color: #ffffff;
            font-size: 12px;
            padding: 2px 4px;
            border-radius: 2px;
          }
        }
        .placeName{
          font-size: 14px;
          color: #0091FF;
          margin-bottom: 5px;
          line-height: 18px;
        }
        .address{
          font-size: 14px;
          color: #969799;
          line-height: 18px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .edit{
          position: absolute;
          right: 21px;
          top: 26px;
        }
      }
    }
    .safeAreaBottom{
      .van-button{
        width: 100%;
        height: 49px;
        font-size: 16px;
      }
    }
    .noData{
      height: 164px;
      margin-top: 45%;
      text-align: center;
      .noDataImg{
        width: 140px;
      }
      p{
        font-size: 13px;
        color: #666666;
        margin-top: 37px;
      }
    }
    .van-tabs{
      height: 100%;
    }
    /deep/ .van-tabs__content{
      // padding-bottom: 59px;
    }
    .van-tag--danger{
        background: #0091FF;
        border-radius: 2px;
    }
    /deep/ .van-tabs__line{
      background-color: #0091FF;
    }
}
</style>
