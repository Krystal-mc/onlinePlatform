<template>
  <div ref="changeCss" class="unionGiftPackage clearfix">
    <div class="content">
      <div class="topContent">
        <img :src="unionGiftPackage.labUniTop">
        <a href="javascript:void(0)" class="ruleBtn" @click="rulesShow = true">
          <img :src="unionGiftPackage.labUniRule">
        </a>
        <p class="times">{{ unionGiftPackage.times }}</p>
      </div>
      <div class="bottomContent">
        <div class="oneyuanBuyFifty1">
          <!-- 一元购50元精品超市电子券 -->
          <img :src="unionGiftPackage.oneyuanBuyFifty1">
          <a href="javascript:void(0)" class="suportStore" @click.stop.prevent="supportStore(22)" />
          <a href="javascript:void(0)" class="buyNow" @click.stop.prevent="handleDetails(unionGiftPackage.oneyuanBuyFifty1Target.targetActId, unionGiftPackage.oneyuanBuyFifty1Target.targetSkuId)" />
          <img :src="unionGiftPackage.ballTop2" class="ballTop">
        </div>
        <div class="oneyuanBuyFifty2">
          <!-- 一元购50元精品超市电子券 -->
          <img :src="unionGiftPackage.oneyuanBuyFifty2">
          <a href="javascript:void(0)" class="suportStore" @click.stop.prevent="showVanguardStoreList" />
          <a href="javascript:void(0)" class="buyNow" @click.stop.prevent="handleDetails(unionGiftPackage.oneyuanBuyFifty2Target.targetActId, unionGiftPackage.oneyuanBuyFifty2Target.targetSkuId)" />
          <img :src="unionGiftPackage.ballTop" class="ballTop2">
        </div>
        <div class="topTitle">
          <img :src="unionGiftPackage.labUniTop2">
          <!-- <a href="javascript:void(0)" class="moreGoods" @click="moreGoods">更多商品<svg-icon icon-class="rightArrow" /></a> -->
          <a :href="moreGoods.targetUrl" class="moreGoods">更多商品<svg-icon icon-class="rightArrow" /></a>
          <!-- <a href="http://testkhh.yinfu365.com/goods/goodsList" class="moreGoods">更多商品<svg-icon icon-class="rightArrow" /></a> -->
        </div>
        <div class="goodsList">
          <div class="guessYouLike">
            <div class="content clearfix">
              <van-list
                v-model="loading"
                class="clearfix"
                :finished="finished"
                :offset="100"
                @load="onLoad"
              >
                <a v-for="(item,index) in unionGiftPackage.allGoodsList" :key="index" href="javascript:void(0)" @click="goto(item.skuId)">
                  <div class="product">
                    <img :src="item.skuImg">
                  </div>
                  <div class="info">
                    <div class="top">
                      <h4 class="name">{{ item.skuName }}</h4>
                      <p class="price">尊享价  ￥<span>1</span>
                        <span class="oldPri">￥88</span>
                      </p>
                    </div>
                  </div>
                </a>
              </van-list>
              <div v-if="finished" class="noGoods">
                <div class="text">我是有底线的</div>
              </div>
            </div>
            <img v-if="unionGiftPackage.allGoodsList.length > 1" :src="unionGiftPackage.ballTop" class="oneBall oneBall1">
            <img v-if="unionGiftPackage.allGoodsList.length > 1" :src="unionGiftPackage.ballTop" class="oneBall oneBall2">
            <img v-if="unionGiftPackage.allGoodsList.length > 1" :src="unionGiftPackage.ballTop" class="oneBall oneBall3">
            <img v-if="unionGiftPackage.allGoodsList.length > 1" :src="unionGiftPackage.ballTop2" class="twoBall1">
          </div>
        </div>

      </div>
      <van-popup v-model="rulesShow">
        <template>
          <div class="rules">
            <div class="txt">
              <h6>活动细则</h6>
              <p v-html="unionGiftPackage.rulesTxt" />
              <!-- <p>1、本活动仅限2020年邮储银行榆林市分行新办工会卡用户及存量未激活工会卡用户参与；</p>
              <p>2、下单需在榆林区域内完成支付（含12县域）；</p>
              <p>3、活动期间，单卡以下活动仅享受优惠一次；</p>
              <p>4、活动中涉及的所有电子卡券有效期至2021年3月31日，一经售出，不退不换；</p>
              <p>5、选择购买“精美礼品”的客户需填写完整的收货信息，兑换成功后1-7个工作日内发货；</p>
              <p>6、选择购买超市代金券的客户 ，购买成功后，可在“我的订单”中查看“电子券”。使用时请打开“电子券”出示给收银台工作人员即可进行核销，该券码需一次性完成核销，不可分次使用（超市详情信息可在购买页面查看）；</p>
              <p>7、领取成功后的电子券需妥善保存，不予外泄，持卡人收到的电子券码可至对应商户进行核销；</p>
              <p>8、特惠活动，不开具发票，敬请谅解；</p>
              <p>9、如有疑问，请拨打客服电话:400-109-7717(周一至周五10:00—18:00,周末及节假日9:00—13:00)。</p> -->
            </div>
          </div>
          <div class="close" @click="rulesShow = false"><svg-icon icon-class="close" /></div>
        </template>
      </van-popup>
    </div>
    <van-popup v-model="storeShow">
      <template>
        <div class="rules">
          <div class="storeList">
            <a v-for="(item,index) in storeList" :key="index" href="javascript:void(0)">
              <div class="storeInfor">
                <h6>{{ item.name }}<span>{{ item.county }}</span></h6>
                <p>{{ item.addressDetail }}</p>
              </div>
            </a>
          </div>
        </div>
        <div class="close" @click="storeShow = false"><svg-icon icon-class="close" /></div>
      </template>
    </van-popup>
  </div>
</template>

<script>
import { List } from 'vant'
import $ from 'jquery'
import { Button } from 'vant'
import { PullRefresh } from 'vant'
import { Popup } from 'vant'
import { getPc, sendPc, processMobileData } from '@/utils'
import { getIndexInfo, getGoodsListPage, vanguardStoreList } from '@/api/common'
import { wxShare } from '@/utils/wx'

export default {
  name: 'UnionGiftPackage',
  components: {
    [List.name]: List,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [PullRefresh.name]: PullRefresh
  },
  data() {
    return {
      unionGiftPackage: {
        labUniTop: '',
        times: '',
        oneyuanBuyFifty1: '',
        oneyuanBuyFifty2: '',
        oneyuanBuyFifty1Target: '',
        oneyuanBuyFifty2Target: '',
        labUniTop2: '',
        labUniRule: '',
        rulesTxt: '',
        ballTop: '',
        ballTop2: '',
        allGoodsList: [],
        moreGoods: ''
      },
      // 以上是可配置属性
      storeShow: false,
      url: '',
      allGoodsList: [],
      page: {
        // 第几页
        current: 1,
        // 显示条数
        size: 10,
        currPage: '',
        totalCount: '',
        totalPage: ''
      },
      goodsList: [],
      refreshing: false,
      rulesShow: false,
      allLoad: false,
      unionRecommendGoodsCoupon: [],
      storeList: vanguardStoreList,
      allGoodsListVal: [],
      allGoodsListAll: '',
      idGrounp: {
        attrKey: '',
        groupKey: '',
        actId: '6688319742702260224',
        organId: '1286593245347672066',
        relationId: '1283296628481818626'
      },

      loading: false,
      finished: false,
      tmplAttrGroup: [],
      shareGroup: {
        shareTitle: 'YOU生活-榆林市分行',
        shareContent: '工会大礼包，1元购价值88元精选礼品',
        shareImg: 'https://m.yinfu365.com/ylycFile/public/home/202006/20200629205917735083a4d8c458165.png'
      }
    }
  },
  computed: {

  },
  created() {
    this.initPage()
  },
  mounted() {
    // this.getUnionHome()
    // this.getWxTicket({
    //   homeShareTitle: 'YOU生活-榆林市分行',
    //   homeShareContent: '工会大礼包，1元购价值88元精选礼品',
    //   homeShareImgPath: 'https://m.yinfu365.com/ylycFile/public/home/202006/20200629205917735083a4d8c458165.png'
    // })
    document.title = 'YOU生活-榆林市分行'
    this.$nextTick(() => {
      // 将页面高度发送到pc端
      sendPc('.unionGiftPackage')
      // 获取pc端返回的数据
      getPc(this, true)
    })
    wxShare(this.shareGroup.shareTitle, this.shareGroup.shareContent, this.shareGroup.shareImg)
  },
  destroyed() {

  },
  methods: {
    onLoad() {
      this.getIndexInfo()
    },
    initPage() {
      this.$route.query.organId && (this.idGrounp.organId = this.$route.query.organId)
      this.$route.query.actId && (this.idGrounp.actId = this.$route.query.actId)
      this.$route.query.pageId && (this.idGrounp.relationId = this.$route.query.pageId)
      // this.getIndexInfo()
    },
    showVanguardStoreList() {
      this.storeShow = true
    },
    handleDetails(actId, skuId) {
      this.$router.push({ name: 'GoodsDetails', query: { actId: actId, skuId: skuId, organId: this.idGrounp.organId }})
    },
    supportStore(supplierId) {
      this.$router.push({ name: 'supportStore', query: { supplierId: supplierId }})
    },
    moreGoods() {
      this.$router.push({ name: 'GoodsList', query: { }})
    },
    // verScroll() {
    //   // const width = this.indexData.goodsTypeList.length * 106// 动态计算出滚动区域的大小，前面已经说过了，产生滚动的原因是滚动区域宽度大于父盒子宽度
    //   // this.$refs.cont.style.width = width + 'px' // 修改滚动区域的宽度
    //   this.$nextTick(() => {
    //     if (!this.scroll) {
    //       this.scroll = new BScroll(this.$refs.wrapper, {
    //         startX: 0, // 配置的详细信息请参考better-scroll的官方文档，这里不再赘述~
    //         click: true,
    //         scrollX: true,
    //         scrollY: false,
    //         eventPassthrough: 'vertical'
    //       })
    //     } else {
    //       this.scroll.refresh() // 如果dom结构发生改变调用该方法
    //     }
    //   })
    // },
    // 从接口获取模板信息
    getIndexInfo() {
      getIndexInfo({
        actId: this.idGrounp.actId,
        organId: this.idGrounp.organId,
        relationId: this.idGrounp.relationId
      }).then(response => {
        var resData = response.data.data.tmplAttrGroup
        this.tmplAttrGroup = resData
        processMobileData(resData, this, this.getGoodsListPage)
        console.log(this.unionGiftPackage.oneyuanBuyFifty1Target)
      })
    },
    // fun && fun(groupKey, attrKey, attrId, vue[item.attrKey][attr.attrKey])
    getGoodsListPage(groupKey, attrKey, attrId) {
      getGoodsListPage({
        actId: this.idGrounp.actId,
        attrId: attrId,
        current: this.page.current,
        organId: this.idGrounp.organId,
        relationId: this.idGrounp.relationId,
        size: this.page.size,
        type: 1,
        attrKey: attrKey,
        groupKey: groupKey
      }).then(response => {
        var res = response.data.data
        if (res.totalCount === 0) {
          this.unionGiftPackage.allGoodsList = []
          this.finished = true
        }
        // this.page.totalCount = res.totalCount
        this.unionGiftPackage.allGoodsList = this.unionGiftPackage.allGoodsList.concat(res.list)
        this.loading = false
        if (this.unionGiftPackage.allGoodsList.length >= res.totalCount) {
          this.finished = true
        } else {
          this.page.current++
        }
        // this.goodsList = response.data.data
        // this.unionGiftPackage.allGoodsList = response.data.data.list
        // if (callback) {
        //   this.unionGiftPackage.allGoodsList = response.data.data.list
        // } else {
        //   this.unionGiftPackage.allGoodsList = this.unionGiftPackage.allGoodsList.concat(response.data.data.list)
        // }
        // this.loading = false
        // if (callback) {
        //   callback()
        // }
        // if (response.data.data.list.length < response.data.data.pageSize) {
        //   this.finished = true
        // } else {
        //   this.page.current++
        // }
      })
    },
    activeOverlay(e) {
      $('.image-overlay').addClass('active')
    },
    goto(skuId) {
      this.$router.push({ name: 'GoodsDetails', query: { actId: this.idGrounp.actId, skuId: skuId }})
    },
    active() {
      $('.returnBtn').addClass('active')
    },
    removeActive() {
      $('.returnBtn').removeClass('active')
    },
    clickTips() {
      this.$dialog.alert({
        message: '建设中，敬请期待…'
      }).then(() => {
        // on close
      })
    }
  }
}
</script>

<style lang="less" scoped>
.unionGiftPackage{
  background: #83C9FF;
  height: 100%;
  overflow: auto;
  &>.content{
    .topContent{
      background-size: cover;
      position: relative;
      img{
        width: 100%;
      }
      p{
        text-align: center;
        margin: 0;
      }
      .txt{
        position: absolute;
        top: 219px;
        width: 100%;
      }
      .tips{
        font-size: 13px;
        color: #ffffff;
        line-height: 18px;
      }
      .times{
        font-size: 12px;
        color: #2D79E2;
        position: absolute;
        top: 203px;
        text-align: center;
        width: 100%;
        line-height: 26px;
      }
      .ruleBtn{
        position: absolute;
        right: 0;
        top: 21px;
        img{
          width: 61px;
          height: 27px;
        }
      }

    }
    .bottomContent{
      padding-bottom: 49px;
      min-height: 450px;
      .topTitle{
        position: relative;
        img{
          width: 100%;
          display: block;
        }
        .moreGoods{
          position: absolute;
          top: 27px;
          right: 19px;
          color: #ffffff;
          font-size: 11px;
          line-height: 38px;
          .svg-icon{
            margin-left: 3px;
          }
        }
      }
      .oneyuanBuyFifty1{
        position: relative;
        padding: 0 6px;
        margin-top: 10px;
        img{
          width: 363px;
          display: block;
        }
        >a{
          position: absolute;
          width: 67px;
          height: 27px;
          top: 96px;
        }
        .suportStore{
          left: 37px;
        }
        .buyNow{
          left: 102px;
        }
        .ballTop{
          position: absolute;
          width: 35px;
          // height: 42px;
          top: -15px;
          left: 0;
        }
      }
      .oneyuanBuyFifty2{
        position: relative;
        padding: 0 6px;
        img{
           width: 363px;
           display: block;
        }
        >a{
          position: absolute;
          width: 67px;
          height: 27px;
          top: 96px;
          // background: rgba(255,0,0,0.3);
        }
        .suportStore{
          left: 202px;
        }
        .buyNow{
          left: 267px;
        }
        .ballTop2{
          width: 23px;
          height: 22px;
          position: absolute;
          bottom: 10px;
          right: 0;
        }
      }
    }
    .return{
      position: absolute;
      top: 12px;
      left: 15px;
      z-index: 100;
      font-size: 14px;
      svg{
        font-size: 22px;
      }
    }
     .guessYouLike{
       margin: 0px 15px 0 15px;
       position: relative;
       top: -25px;
       .oneBall{
         width: 23px;
         height: 22px;
         position: absolute;
       }
       .oneBall1{
         top: 207px;
         right: -15px;
       }
       .oneBall2{
         top: 425px;
         left: -10px;
       }
       .oneBall3{
         top: 511px;
         right: -10px;
       }
       .twoBall1{
         position: absolute;
         top: 90px;
         left: -15px;
         width: 35px;
         height: 42px;
       }
      .content{
        margin-top: 15px;
        // margin-bottom: 10px;
          a{
            list-style: none;
            width: 168px;
            height: 270px;
            background: #D7ECFF;
            float: left;
            margin-right: 9px;
            overflow: hidden;
            padding-top: 16px;
            margin-bottom: 10px;
            padding-bottom: 35px;
            position: relative;
            border-radius: 8px;
            box-shadow:0px 3px 9px 0px rgba(16,116,212,1);
            img{
              width: 50px;
            }
            &:nth-child(even){
              margin-right: 0;
            }
            .product{
              text-align: center;
              img{
                width: 140px;
                height: 140px;
                margin: 0 auto;
              }
            }
          h4{
            margin: 5px 13px;
            font-size: 14px;
            font-weight: normal;
            overflow: hidden;
            color: #333333;
            line-height: 21px;
            overflow: hidden;
            display:-webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient:vertical;
            word-break: break-all;
            flex-shrink: 0;
          }
          p{
            margin: 0;
            font-size: 14px;
            color: #FF4444;
            position: absolute;
            bottom: 15px;
            width: 100%;
            padding-left: 13px;
            height: 28px;
            line-height: 28px;
            i{
              font-style: normal;
              font-size: 8px;
              border: 1px solid #FF7558;
              color: #FF7558;
              border-radius: 7.5px;
              margin-top: 4px;
              margin-right: 10px;
              float: right;
              min-width: 37px;
              display: inline-block;
              text-align: center;
              height: 14px;
              line-height: 14px;
            }
            span{
              // color: #999999;
              margin-left: 4px;
              font-size: 20px;
            }
            span.oldPri{
              text-decoration:line-through;
              font-size: 14px;
              color: #999999;
              float: right;
              margin-right: 21px;
              margin-top: 2px;
            }
          }

          &:nth-child(even){
            margin-right: 0;
          }
        }
        .noGoods{
          font-size: 12px;
          color: #ffffff;
          text-align: center;
          margin-top: 73px;
          position: relative;
          &::after{
            content: '';
            display: block;
            position: absolute;
            width: 30px;
            height: 1px;
            border-bottom: 1px dashed #ffffff;
            left: 98px;
            top: 5px;
          }
          &::before{
            content: '';
            display: block;
            position: absolute;
            width: 30px;
            height: 1px;
            border-bottom: 1px dashed #ffffff;
            right: 98px;
            top: 5px;
          }
        }
      }
    }
    .rules{
      width: 325px;
      height: 460px;
      padding: 17.5px 20.5px 23px 21.5px;
      position: relative;
      overflow: auto;
      h6{
        margin: 0;
        font-size:18px;
        font-family:PingFang SC;
        font-weight:400;
        color:#333333;
        margin-bottom: 18.5px;
      }
      p{
        margin: 0;
        font-size: 13px;
        line-height: 19.5px;
        color: #666666;
        text-align: justify;
      }
    }
    .close{
      position: absolute;
      right: 15px;
      top: -8px;
      width: 23.5px;
      height: 38.5px;
      background: #0091FF;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      text-align: center;
      color: #ffffff;
      line-height: 38.5px;
      font-size: 14px;
    }
  }
  .storeList{
    padding-top: 10px;
      >a{
        height: 80px;
        display: block;
        background: #ffffff;
        margin-top: 10px;
        display: flex;
        padding: 8px;
        border-bottom: 1px solid #ccc;
        img{
          width: 64px;
          height: 64px;
          margin-right: 8px;
          border-radius: 5px;
        }
        .storeInfor{
          flex: 1;
          h6{
            font-size: 16px;
            margin: 0;
            font-weight: normal;
            span{
              font-size: 14px;
              color: #0091FF;
              float: right;
            }
          }
          p{
            margin: 0;
            font-size: 14px;
            color: #969799;
            margin-top: 8px;
          }
        }
      }
    }
    .rules{
      width: 325px;
      height: 460px;
      padding: 17.5px 20.5px 23px 21.5px;
      position: relative;
      overflow: auto;
      h6{
        margin: 0;
        font-size:18px;
        font-family:PingFang SC;
        font-weight:400;
        color:#333333;
        margin-bottom: 18.5px;
      }
      p{
        margin: 0;
        font-size: 13px;
        line-height: 19.5px;
        color: #666666;
        text-align: justify;
      }
    }
    .close{
      position: absolute;
      right: 15px;
      top: -8px;
      width: 23.5px;
      height: 38.5px;
      background: #FE5A74;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      text-align: center;
      color: #ffffff;
      line-height: 38.5px;
      font-size: 14px;
    }
}
</style>
<style lang="less">
.unionGiftPackage{
   .van-popup{
    overflow: inherit;
  }
}
</style>
