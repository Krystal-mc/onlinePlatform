<template>
  <div ref="myContainer" class="my-container">
    <!-- 我的1 -->
    <!-- <tabbar /> -->
    <div class="k-my-infor">
      <img v-if="avatar" :src="avatar" class="avatar">
      <img v-else :src="require('@/assets/img/defaultAvatar.png')" class="avatar">
      <div class="k-my-login-state">
        <div v-if="!loggedIn" class="k-my-login-btn" @click="loginBtn">
          <a href="javascript:void(0)">立即登录</a>
        </div>
        <div v-if="loggedIn" class="k-my-name">
          <span v-if="realName !== ''">{{ realName }}</span>
          <span v-else>{{ userName }}</span>
          <div class="k-my-phone">
            {{ tel }}
          </div>
        </div>
      </div>
      <div v-if="loggedIn" class="k-my-setup" @click="goSetup">
        <a href="javascript:void(0)">
          <svg-icon icon-class="kMySetting" />
        </a>
      </div>
    </div>
    <div class="k-my-order">
      <h6>我的订单</h6>
      <div class="k-my-order-category">
        <ul>
          <li @click="goMyorder(0)">
            <div class="k-my-svg">
              <svg-icon icon-class="kTobepaid" />
              <div v-if="orderPendPayCount>0" class="k-my-badge">{{ orderPendPayCount }}</div>
            </div>
            <div class="name">待付款</div>
          </li>
          <li @click="goMyorder(2)">
            <div class="k-my-svg">
              <svg-icon icon-class="kTobereceived" />
              <div v-if="orderPendReceiptCount > 0" class="k-my-badge">{{ orderPendReceiptCount }}</div>
            </div>
            <div class="name">待收货</div>
          </li>
          <li @click="goMyorder(3)">
            <div class="k-my-svg">
              <svg-icon icon-class="kTobeComplete" />
              <div class="k-my-badge" />
            </div>
            <div class="name">已完成</div>
          </li>
          <li @click="goMyorder('')">
            <div class="k-my-svg">
              <svg-icon icon-class="kAllorder" />
            </div>
            <div class="name">全部订单</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="k-my-function">
      <div class="k-my-grounp">
        <div v-for="(item,index) in menuList" :key="index">
          <van-cell v-if="item.show" value="" is-link>
            <template #title>
              <span class="custom-title">{{ item.name }}</span>
              <svg-icon :icon-class="item.icon" class="k-my-fun-icon" />
            </template>
          </van-cell>
        </div>
      </div>
      <div class="k-my-grounp" @click="addressManage">
        <van-cell value="" is-link>
          <template #title>
            <span class="custom-title">地址管理</span>
            <svg-icon icon-class="kMyAddress" class="k-my-fun-icon" />
          </template>
        </van-cell>
      </div>
      <div class="k-my-grounp">
        <!-- <van-cell value="" is-link>
          <template #title>
            <span class="custom-title">常见问题</span>
            <svg-icon icon-class="kMyProblem" class="k-my-fun-icon" />
          </template>
        </van-cell> -->
        <van-cell value="" is-link @click="contactUs">
          <template #title>
            <span class="custom-title">联系客服</span>
            <svg-icon icon-class="kMyContact" class="k-my-fun-icon" />
          </template>
        </van-cell>
      </div>
    </div>
    <a v-show="!tabbarShow" class="bankIndex" @click="bankIndex">
      <svg-icon icon-class="bankIndex" />
    </a>
    <ylycTabbar v-if="tabbarShow" />
  </div>
</template>

<script>
import ylyc from '@/components/KTabbar/ylyc'
import { getImgPath, isLogin } from '@/utils/index'
import { getBasisOrgan, getUserProfile } from '@/api/my'
import { wxHideBtn } from '@/utils/wx'
import { getHomeAttr, getActIndexPage } from '@/api/common'

export default {
  name: 'UserCenter',
  components: {
    'ylycTabbar': ylyc
  },
  data() {
    return {
      tabbarShow: false,
      loggedIn: false,
      avatar: '',
      userName: '',
      realName: '',
      tel: '',
      fullPath: '',
      // avatarBg: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3482128345,2137456532&fm=26&gp=0.jpg'
      avatarBg: '../../assets/img/k-my-bg.png',
      organId: '',
      actId: '',
      menuList: [
        {
          name: '我的K米',
          icon: 'kMyMi',
          code: '',
          show: false
        },
        {
          name: '我的推荐',
          icon: 'kMyRecommen',
          code: '',
          show: false
        }
      ],
      // 订单待付款数量
      orderPendPayCount: '',
      // 订单待收货数量
      orderPendReceiptCount: '',
      // 订单待发货数量
      orderPendShipCount: '',
      // 我的K米数量
      useKmiTotalCount: '',
      homeUrl: ''
    }
  },
  watch: {

  },
  created() {
  },
  async mounted() {
    if (isLogin()) {
      this.loggedIn = true
      this.getUserProfile()
    } else {
      this.loggedIn = false
    }
    this.$store.getters.nickname && (this.userName = this.$store.getters.nickname)
    this.$store.getters.realName && (this.realName = this.$store.getters.realName)
    this.$store.getters.avatar && (this.avatar = getImgPath(this.$store.getters.avatar, 'list'))
    this.$route.query.organId && (this.organId = this.$route.query.organId)
    this.$route.query.actId && (this.actId = this.$route.query.actId)
    this.$store.getters.tel && (this.tel = this.$store.getters.tel)
    this.fullPath = this.$route.fullPath
    this.controlCss()
    this.getBasisOrgan()
    this.getHomeAttr()

    wxHideBtn().then(res => {})
  },
  destroyed() {
  },
  methods: {
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
    bankIndex() {
      this.$router.push({ path: this.homeUrl })
    },
    goSetup() {
      this.$router.push({ name: 'PersonalData' })
    },
    contactUs() {
      this.$router.push({ name: 'Contact' })
    },
    addressManage() {
      this.$router.push({ name: 'AddressManage', query: { isTarget: 1 }})
    },
    goMyorder(orderType) {
      this.$router.push({ name: 'MyOrder', query: { actId: this.actId }})
      this.$store.dispatch('myOrder/setOrderStatus', orderType)
    },
    // 控制css代码
    controlCss() {
      this.$refs.myContainer.style.setProperty('--avatarBg', `url(${this.avatarBg}) no-repeat #F7F8FA`)
    },
    // 立即登录
    loginBtn() {
      this.$router.push({ name: 'Login', query: { redirect: this.fullPath }})
    },
    getBasisOrgan() {
      getBasisOrgan({
        organId: this.organId
      }).then(response => {
        this.prodList = response.data.data.prodList
        this.prodList.forEach((element, index) => {
          this.menuList.forEach(element1 => {
            if (element.code === element1.code) {
              element1.show = true
            }
          })
        })
      })
    },
    // 获取我的页面订单显示的数量
    getUserProfile() {
      getUserProfile().then(response => {
        this.orderPendPayCount = response.data.data.orderPendPayCount
        this.orderPendReceiptCount = response.data.data.orderPendReceiptCount
        this.orderPendShipCount = response.data.data.orderPendShipCount
        this.useKmiTotalCount = response.data.data.useKmiTotalCount
      })
    }
  }
}
</script>

<style lang="less" scoped>
.my-container{
  --avatarBg: '';
    background: url("../../assets/img/k-my-bg.png") no-repeat #F7F8FA;
    // background: var(--avatarBg);
    background-size: 100%;
    height: 100%;
    .bankIndex{
      position: fixed;
      bottom: 15px;
      right: 20px;
      font-size: 40px;
    }
    .k-my-infor{
        display: flex;
        padding: 38px 21px 30px 15px;
        color: #ffffff;
        .avatar{
            width: 60px;
            height: 60px;
            border-radius: 12px;
            margin-right: 20px;
        }
        .k-my-login-state{
            flex: 1;
            display: flex;
            .k-my-login-btn{
                line-height: 60px;
                font-size: 22px;
            }
            .k-my-name{
                font-size: 18px;
                padding-top: 6px;
                .k-my-phone{
                    font-size: 14px;
                    margin-top: 14px;
                }
            }
        }
        .k-my-setup{
            font-size: 19px;
            margin-top: 7px;
        }
    }
    .k-my-order{
        width: 345px;
        height: 115px;
        background: #ffffff;
        border-radius: 8px;
        margin: 0 15px;
        padding: 15px 10px;
        h6{
            margin: 0;
            font-size: 16px;
            color: #333333;
            margin-bottom: 15px;
        }
        .k-my-order-category{
            ul{
                display: flex;
                li{
                    flex: 1;
                    text-align: center;
                    height: 50px;
                    font-size: 13px;
                    color: #333333;
                    .k-my-svg{
                        height: 30px;
                        width: 30px;
                        margin: 0 auto;
                        margin-bottom: 6px;
                        text-align: center;
                        line-height: 30px;
                        position: relative;
                    }
                    .name{
                        font-size: 13px;
                    }
                    .k-my-badge{
                        position: absolute;
                        top: 5px;
                        right: 2px;
                        box-sizing: border-box;
                        min-width: 16px;
                        padding: 0 3px;
                        color: #fff;
                        font-weight: 500;
                        font-size: 12px;
                        font-family: Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif;
                        line-height: 14px;
                        text-align: center;
                        background-color: #ee0a24;
                        border: 1px solid #fff;
                        border-radius: 16px;
                        -webkit-transform: translate(50%, -50%);
                        transform: translate(50%, -50%);
                        -webkit-transform-origin: 100%;
                        transform-origin: 100%;
                    }
                    &:nth-child(1){
                        .k-my-svg{
                            font-size: 22px;
                        }
                    }
                    &:nth-child(2){
                        .k-my-svg{
                            font-size: 22px;
                        }
                    }
                    &:nth-child(3){
                        .k-my-svg{
                            font-size: 22px;
                        }
                    }
                    &:nth-child(4){
                        border-left: 1px solid #F5F5F5;
                        font-size: 30px;
                        .k-my-svg{
                            font-size: 30px;
                        }
                    }
                }
            }
        }
    }
    .k-my-function{
        margin: 10px 15px;
        font-size: 14px;
        color: #333333;
        .k-my-fun-icon{
            float: left;
            margin-top: 4px;
            margin-right: 6px;
            font-size: 14px;
        }
        .k-my-grounp{
            margin-bottom: 10px;
            border-radius: 8px;
            background: #ffffff;
            .van-cell{
                background: none;
            }
        }
        .custom-title{
            font-size: 14px;
        }
    }
}
</style>
