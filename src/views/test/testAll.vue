<template>
  <div ref="changeCss" class="indexContainer clearfix">
    <div class="content">
      <van-swipe v-if="indexData.homeInfo.advertiseLockStatus === '0'" class="topSwipe" :autoplay="5000" :duration="800">
        <van-swipe-item v-for="(item) in indexData.topAdvertiseList" :key="item.advertiseId">
          <a href="javascript:void(0)">
            <div class="slideImg" :style="{backgroundImage: 'url(' + item.imgPath + ')'}" @tap="activeOverlay" />
          </a>
        </van-swipe-item>
      </van-swipe>
      <!-- icon start-->
      <div class="iconArea">
        <div>
          <a v-if="iconArray.isShow1" href="javascript:void(0)" @click="targetLabourUnion('labourUnion')">
            <div class="imgBox"><img :src="iconArray.icon1"></div>{{ iconArray.name1 }}
          </a>
          <a v-if="iconArray.isShow2" href="javascript:void(0)" @click="targetFirstBrush">
            <div class="imgBox"><img :src="iconArray.icon2"></div>{{ iconArray.name2 }}
          </a>
          <a v-if="iconArray.isShow3" href="javascript:void(0)" @click="targetPlatinumCard">
            <div class="imgBox"><img :src="iconArray.icon3"></div>{{ iconArray.name3 }}
          </a>
          <a v-if="iconArray.isShow4" href="javascript:void(0)" @click="targNewGuestCeremony">
            <div class="imgBox"><img :src="iconArray.icon4"></div>{{ iconArray.name4 }}
          </a>
          <a href="http://www.bassd.cn/jch/pages/psbc/main">
            <div class="imgBox"><img src="../../assets/images/yulinNewImg/icon5.png"></div>{{ iconArray.name5 }}
          </a>
          <a href="https://m.yinfu365.com/akyc/themePurchase?bankId=1002&type=single">
            <div class="imgBox"><img src="../../assets/images/yulinNewImg/icon6.png"></div>{{ iconArray.name6 }}
          </a>
          <a href="https://m.yinfu365.com/akyc/integral/integralClassfication?bankId=&status=2&from=1&source=7&type=single&pageFrom=1&isReturn=1">
            <div class="imgBox"><img src="../../assets/images/yulinNewImg/icon7.png"></div>
            <div v-html="iconArray.name7" />
          </a>
          <a href="https://m.yinfu365.com/xyyc/integral/creditCardArea?bankId=">
            <div class="imgBox"><img src="../../assets/images/yulinNewImg/icon8.png"></div>{{ iconArray.name8 }}
          </a>
        </div>
      </div>
      <div>
        时间区间1：
        <div>{{ time.date1 }}</div>
      </div>
      <div>
        时间区间2：
        <div>{{ time.date2 }}</div>
      </div>
      <div v-for="(item, index) in cate.cateList" :key="index">
        <img :src="item.img" style="width: 80px; height: 80px">
        <p>{{ item.name }}</p>

      </div>
      <!-- icon end-->
      <div class="oneYuanBuyGoods">
        <a href="javascript:void(0)" class="oneYuanBuyMore" @click="targetLabourUnion('integrationGoodsList')" />
        <div class="oneYuanBuyList clearfix">
          <a v-for="(item,index) in indexData.unionGoodsList" :key="index" href="javascript:void(0)" class="oneYuanBuyLi" @click="handleDetails(item.goodsType, item.goodsId, item.type, 22)">
            <img :src="item.imgPath">
            <div class="name">
              {{ item.name }}
            </div>
            <div class="price">
              ￥<span>1</span>
            </div>showTime
          </a>
        </div>
      </div>
      <!-- 悦享首刷  start -->
      <a href="javascript:void(0)" class="cardBook" @click="handleDetails(firstBrushGoodsList.goodsType, firstBrushGoodsList.goodsId, firstBrushGoodsList.type, 23)">
        <!-- <img :src="firstBrushGoodsList.imgPath"> -->
        <img src="../../assets/images/yulinNewImg/firstBrush.png">
      </a>
      <div class="enjoyFirstBrush">
        <div class="outLinkLi clearfix">
          <a href="https://m.yinfu365.com/akyc/themePurchase?bankId=1001&type=single" class="weekCeremony">
            <img src="../../assets/images/yulinNewImg/weekCeremony.png">
          </a>
          <a href="https://m.yinfu365.com/akyc/integral/integralClassfication?bankId=&status=2&from=1&source=7&type=single&pageFrom=1&isReturn=1" class="byStages">
            <img src="../../assets/images/yulinNewImg/byStages.png">
          </a>
        </div>
      </div>
      <!-- 悦享首刷  end -->
      <!-- 底部版权 start-->
      <!-- <div class="bottomC">
        <a href="javascript:void(0)">由 “卡唤唤” 提供技术支持</a>
        <a href="tel:4001097717"><img src="../../assets/images/bottomBtn.png" /></a>
      </div> -->
      <!-- 底部版权 end-->
    </div>
    <!-- <tabbar /> -->
  </div>
</template>

<script>
import { getAES } from '@/utils'
import { Swipe, SwipeItem } from 'vant'
import { Tab, Tabs } from 'vant'
import { Icon } from 'vant'
import { Row, Col } from 'vant'
import $ from 'jquery'
import { Button } from 'vant'
// import { Dialog } from 'vant'

// import wx from 'weixin-js-sdk'
import BScroll from 'better-scroll'
// import { JsApiList } from '@/utils/const'
import { sendPc, getPc } from '@/utils'

export default {
  name: 'Index',
  components: {
    // Tabbar,
    // BottomTip,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Icon.name]: Icon,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button
    // [Dialog.name]: Dialog
  },
  data() {
    return {
      // JsApiList: JsApiList,
      indexData: {
        homeInfo: {
          advertiseLockStatus: '0'
        },
        topAdvertiseList: [
          {
            imgPath: 'https://img.yzcdn.cn/public_files/2017/10/24/1791ba14088f9c2be8c610d0a6cc0f93.jpeg'
          }
          // {
          //   imgPath: 'https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg'
          // }
        ], // 轮播图
        advertiseLockStatus: [],
        weChatTiedCardGoodsList: []
      },
      iconArray: {
        icon1: require('@/assets/images/yulinNewImg/icon1.png'),
        name1: '工会大礼包',
        isShow1: true,
        icon2: require('../../assets/images/yulinNewImg/icon2.png'),
        name2: '悦享首刷',
        isShow2: true,
        icon3: require('../../assets/images/yulinNewImg/icon3.png'),
        name3: '白金卡专区',
        isShow3: true,
        icon4: require('../../assets/images/yulinNewImg/icon4.png'),
        name4: '华润通新客',
        isShow4: true,
        name5: '悦享加油',
        name6: '周周好礼',
        name7: '免息分期',
        name8: '更多福利'

      },
      time: {
        date1: '',
        date2: ''
      },
      cate: {
        cateList: []
      },
      // invitationList: [],
      bankId: '',
      url: '',
      // 1：首页单个图片，
      // 2：首页微信绑卡礼满30减20，
      // 3：微信绑卡礼满30减20列表，
      // 4：首页年货欢乐购，
      // 7：年货欢乐购列表，
      // 8: 积分专区热门积分商品分类，
      // 9: 积分专区精品推荐，
      // 10：积分专区畅销礼品，
      // 11：微信绑卡礼活动细则图片
      goodsClassification: '',
      buyGoodsList: [],
      firstBrushGoodsList: []
    }
  },
  computed: {

  },
  created() {
    if (this.$route.query.bankId) {
      sessionStorage.setItem('bankId', this.$route.query.bankId)
    } else {
      if (sessionStorage.getItem('bankId')) {
        // 判断是否是ios微信
        if (/micromessenger/.test(navigator.userAgent.toLowerCase()) && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          location.replace('/ylyc' + this.$route.path + '?bankId=' + sessionStorage.getItem('bankId'))
        } else {
          this.$router.replace(this.$route.path + '?bankId=' + sessionStorage.getItem('bankId'))
        }
      }
    }
    // 判断是否是ios微信浏览器
    if (window.__wxjs_is_wkwebview === true) {
      this.url = this.$store.getters.url.split('#')[0]
    } else {
      this.url = window.location.href.split('#')[0]
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 将页面高度发送到pc端
      sendPc('.indexContainer')
      // 获取pc端返回的数据
      getPc(this, true)
    })

    if (this.$route.query.bankId) {
      this.bankId = this.$route.query.bankId
    }
  },
  destroyed() {

  },
  methods: {
    // 控制css代码
    controlCss() {
      this.$refs.changeCss.style.setProperty('--height', '400px')
    },
    // 对于机构 端返回数据进行处理
    processData() {
      console.log('111')
      console.log(this.indexData.topAdvertiseList)
      this.indexData.topAdvertiseList.forEach(item => {
        item.imgPath = item.img
      })
      this.controlCss()
    },
    goAllClassify() {
    },
    targetLabourUnion(name) {
      this.$router.push({ name: name, query: { pageFrom: 22, buyType: 2 }})
    },
    targetFirstBrush() {
      this.$router.push({ name: 'firstBrush', query: { pageFrom: 23 }})
    },
    targetPlatinumCard() {
      this.$router.push({ name: 'platinumCard', query: { pageFrom: 24 }})
    },
    targNewGuestCeremony() {
      this.$router.push({ name: 'newGuestCeremony' })
    },
    verScroll() {
      // const width = this.indexData.goodsTypeList.length * 106// 动态计算出滚动区域的大小，前面已经说过了，产生滚动的原因是滚动区域宽度大于父盒子宽度
      // this.$refs.cont.style.width = width + 'px' // 修改滚动区域的宽度
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.wrapper, {
            startX: 0, // 配置的详细信息请参考better-scroll的官方文档，这里不再赘述
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: 'vertical'
          })
        } else {
          this.scroll.refresh() // 如果dom结构发生改变调用该方法
        }
      })
    },
    handleDetails(type, id, productType, pageFrom) {
      this.$router.push({ name: 'goodsDetails', params: { type: getAES(type + ''), id: getAES(id + '') }, query: { buyType: 2, goodsClassification: 1, pageFrom: pageFrom, productType: productType }})
    },
    handleDetails3(type, id, productType) {
      this.$router.push({ name: 'goodsDetails', params: { type: getAES(type + ''), id: getAES(id + '') }, query: { buyType: 2, bankId: this.bankId, productType: productType, source: 4 }})
    },
    gotoGoodsList(value, advertiseId) {
      var arr = JSON.parse(value)
      var goodsInfoIdStr = ''
      var goodsCouponIdStr = ''
      for (const item of arr) {
        if (item.goodsType === '1' || item.goodsType === 1) {
          goodsInfoIdStr += item.goodsId + ','
        } else if (item.goodsType === '2' || item.goodsType === 2) {
          goodsCouponIdStr += item.goodsId + ','
        }
      }
      goodsInfoIdStr = goodsInfoIdStr.substring(0, goodsInfoIdStr.length - 1)
      goodsCouponIdStr = goodsCouponIdStr.substring(0, goodsCouponIdStr.length - 1)
      this.$router.push({ name: 'goodsList', params: { goodsInfoIdStr: goodsInfoIdStr === '' ? 0 : goodsInfoIdStr, goodsCouponIdStr: goodsCouponIdStr === '' ? 0 : goodsCouponIdStr, advertiseId: advertiseId }})
    },
    gotoActivityId(type, id) {
      if (type === 1) {
        this.goto('oneYuan', id)
      } else if (type === 2) {
        this.goto('discountLife', id)
      } else if (type === 3) {
        this.goto('shellRefueling', id)
      }
    },
    activeOverlay(e) {
      $('.image-overlay').addClass('active')
    },
    goto(there, id) {
      this.$router.push({ name: there, params: { id: getAES(id + '') }})
    },
    clickTips() {
      this.$dialog.alert({
        message: '研发中......'
      }).then(() => {
        // on close
      })
    }
  }
}
</script>

<style lang="less" scoped>
.indexContainer{
  --height: 200px;
  --urls: url('../../assets/images/yulinNewImg/ghBg.png') no-repeat;
  background: #ffffff;
  &>.content{
    padding-bottom: 110px;
    width: 100%;
    background: #F9F9F9;
    .topSwipe{
      width: 100%;
      height: 140px;
      .slideImg{
        position: relative;
        height: 100%;
        width: 100%;
        background-position: center top;
        background-size: 100% 100%;
        overflow: hidden;
        text-align: center;
      }
    }

    .oneYuanBuyGoods{
      margin: 8px 15px;
      height: var(--height);
      background: var(--urls);
      background-size: 100%;
      padding: 10px;
      padding-top: 18px;
      a{
        display: block;
      }
      .oneYuanBuyMore{
        height: 61px;
        margin-bottom: 12px;
        img{
          width: 100%;
        }
      }
      .oneYuanBuyList{
        a.oneYuanBuyLi{
          width: 105px;
          height: 180px;
          background: #ffffff;
          font-size: 13px;
          color: #333333;
          float: left;
          margin-right: 5px;
          margin-bottom: 5px;
          border-radius: 8px;
          .name{
            overflow: hidden;
            display:-webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient:vertical;
            display:flex;
            line-clamp:2;
            box-orient:vertical;
            text-align: justify;
            margin: 5px 6px 6px 7px;
          }
          .price{
            margin: 6px 11px 0 9px;
            font-size: 14px;
            color: #FF4444;
            span{
              font-size: 20px;
            }
          }
          &:nth-child(3){
            margin-right: 0;
          }
          &:nth-child(6){
            margin-right: 0;
          }
          img{
            width: 105px;
            height: 105px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          }
        }
      }
    }
     .cardBook{
       margin: 0 6px;
        img{
          width: 363px;
        }
      }
    .enjoyFirstBrush{
      margin: 0 15px 0 15px;
      a{
        display: block;
      }
      .outLinkLi{
        a{
          float: left;
          margin-right: 9px;
          &:nth-child(2){
            margin-right: 0;
          }
          img{
            width: 150px;
            height: 210px;
          }
        }
      }
    }
    .iconArea{
      margin: 10px 15px 0 15px;
      padding-top: 15px;
      border-radius: 3px;
      background: #ffffff;
      border-radius: 8px;
      div{
        >a{
          display: inline-grid;
          font-size: 13px;
          color: #666666;
          margin-bottom: 15px;
          margin-top: 4px;
          text-align: center;
          width: 80px;
          float: left;
          .imgBox{
            width: 58px;
            height: 58px;
            margin: 0 auto;
            margin-bottom: 3px;
            img{
              width: 100%;
              height: 100%;
              margin: 0 auto;
              margin-bottom: 8px;
              border-radius: 50%;
            }
          }
        }
      }
      &::after{
        content: '';
        clear: both;
        display: block;
      }
    }
    .adArea{
      // height: 140px;
      margin: 12px 12px 0;
      position: relative;
      z-index: 1;
      img{
        width: 100%;
        height: 100%;
        border-radius: 3px;
        display: block;
      }
    }
    .bottomC{
      height: 56.5px;
      position: relative;
      font-size: 12px;
      color: #666666;
      margin: 0px 12px;
      line-height: 36px;
      display: flex;
      padding-top: 6.5px;
      z-index: 1;
      a{
        &:first-child{
          width: 172.5px;
          padding-left: 30px;
          line-height: 36px;
          text-align: center;
        }
        &:nth-child(2){
          // position: absolute;
          display: block;
          width: 178.5px;
          text-align: center;
          img{
            width: 115px;
            height: 48px;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.indexContainer{
  .van-swipe__indicator{
    background-color: #c5c5c5;
  }
  .van-swipe__indicator--active{
    background-color: #ffffff;
  }
  .van-swipe__indicators{
    bottom: 13px;
    background: rgba(0,0,0,0.3);
    padding: 5px 6px;
    border-radius: 10px;
  }
}
.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: block;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: .4;
    &.active{
      opacity: .2;
    }
}
</style>
