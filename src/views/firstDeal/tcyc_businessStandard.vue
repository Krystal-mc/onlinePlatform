<template>
  <div class="tcBusinessBox clearfix">
    <!-- 顶部 -->
    <div class="topBox">
      <img :src="setData.businessContent.bgcImg">
      <!-- 表格 -->
      <div class="tableBox">
        <img :src="setData.businessContent.tableImg">
        <span>前{{ setData.businessContent.rankOne }}名</span>
        <span>{{ setData.businessContent.discountOne }}</span>
        <span>{{ setData.businessContent.rankTwo }}~{{ setData.businessContent.rankThree }}名</span>
        <span>{{ setData.businessContent.discountThree }}</span>
        <span>{{ setData.businessContent.rankFour }}~{{ setData.businessContent.rankFive }}名</span>
        <span>{{ setData.businessContent.discountFive }}</span>
        <p class="tableBottomRule tableBottomRule1">{{ setData.businessContent.tableBottomRule1 }}</p>
        <p class="tableBottomRule tableBottomRule2">{{ setData.businessContent.tableBottomRule2 }}</p>
        <p class="times">活动时间：{{ setData.businessContent.actTime }}</p>
      </div>

      <!-- 活动细则 -->
      <img :src="setData.businessContent.rulesImg" class="ruleImg" @click="rulesShow=true">
    </div>

    <!-- 商品列表 -->
    <div class="bottomBox">
      <van-tabs v-model="active" @click="tabChange">
        <van-tab name="goodsList1">
          <template #title>
            <span v-if="active==='goodsList1'" class="rank rankOne1">前{{ setData.businessContent.rankOne }}名</span>
            <span v-if="active!=='goodsList1'" class="rank rankOne2">前{{ setData.businessContent.rankOne }}名</span>
            <img v-if="userLogin && goodsListWhich.goodsList1.whiteInner" :src="setData.businessContent.standarTag" class="standarTagPosition standarTagPosition1">
            <img v-if="active==='goodsList1'" :src="setData.businessContent.activeTab1" class="tabImg tabImg1">
            <img v-if="active==='goodsList2'" :src="setData.businessContent.nullTab12" class="tabImg tabImg1">
            <img v-if="active==='goodsList3'" :src="setData.businessContent.nullTab13" class="tabImg tabImg1">
          </template>
        </van-tab>
        <van-tab name="goodsList2">
          <template #title>
            <span v-if="active=='goodsList2'" class="rank rankOne1">{{ setData.businessContent.rankTwo }}-{{ setData.businessContent.rankThree }}名</span>
            <span v-if="active!=='goodsList2'" class="rank rankOne2">{{ setData.businessContent.rankTwo }}-{{ setData.businessContent.rankThree }}名</span>
            <img v-if="userLogin && goodsListWhich.goodsList2.whiteInner" :src="setData.businessContent.standarTag" class="standarTagPosition standarTagPosition2">
            <img v-if="active==='goodsList1'" :src="setData.businessContent.nullTab21" class="tabImg tabImg1">
            <img v-if="active==='goodsList2'" :src="setData.businessContent.activeTab2" class="tabImg tabImg1">
            <img v-if="active==='goodsList3'" :src="setData.businessContent.nullTab23" class="tabImg tabImg1">
          </template>
        </van-tab>
        <van-tab name="goodsList3">
          <template #title>
            <span v-if="active==='goodsList3'" class="rank rankOne1">{{ setData.businessContent.rankFour }}-{{ setData.businessContent.rankFive }}名</span>
            <span v-if="active!=='goodsList3'" class="rank rankOne2">{{ setData.businessContent.rankFour }}-{{ setData.businessContent.rankFive }}名</span>
            <img v-if="userLogin && goodsListWhich.goodsList3.whiteInner" :src="setData.businessContent.standarTag" class="standarTagPosition standarTagPosition3">
            <img v-if="active==='goodsList1'" :src="setData.businessContent.nullTab31" class="tabImg tabImg1">
            <img v-if="active==='goodsList2'" :src="setData.businessContent.nullTab32" class="tabImg tabImg1">
            <img v-if="active==='goodsList3'" :src="setData.businessContent.activeTab3" class="tabImg tabImg1">
          </template>
        </van-tab>
      </van-tabs>

      <div class="listBox">
        <van-list
          v-model="loading"
          :offset="100"
          :finished="finished"
          class="clearfix"
          @load="onLoad"
        >
          <div class="van-clearfix">
            <div v-for="(item,index) in goodsList" :key="index" class="float-item singleBox">
              <!-- <div> -->
              <a @click="goto(item)">
                <img :src="item.skuImg">
                <p>{{ item.skuName }}</p>
                <div class="goodsListPrice">
                  <p>
                    ￥ <span class="price">{{ item.actPrice }}</span>
                    <!-- ￥ <span class="price">0</span> -->
                    <s v-if="lineActionPriceType==0">￥{{ item.organMarketPrice }}</s>
                    <s v-if="lineActionPriceType==1">￥{{ item.organSalePrice }}</s>
                    <span class="freeBuy">免费领取</span>
                  </p>
                </div>
              </a>
              <div v-if="userLogin && !goodsListWhich[active].whiteInner" class="iconStahdar">
                <span>
                  未达标
                </span>
              </div>

            </div>
          </div>

        </van-list>
        <!-- <div v-if="finished" class="bottomUnderline">
          -- 我是有底线的 --
        </div> -->
      </div>
    </div>

    <!-- 活动细则弹窗 -->
    <k-popup v-model="rulesShow">
      <div slot="text" class="ruleText" v-html="setData.businessContent.rulesText">
        <!-- <h3>活动细则</h3>
        <div v-html="goods.discountRule" /> -->
      </div>
    </k-popup>

    <!-- 您还未达标 -->
    <div v-if="userLogin">
      <div v-if="!goodsListWhich.goodsList1.whiteInner&&!goodsListWhich.goodsList2.whiteInner&&!goodsListWhich.goodsList3.whiteInner" class="standardResult">
        <img :src="setData.businessContent.standarImg">
      </div>
    </div>

    <div class="goHome" @click="goPageHome">
      <img :src="setData.businessContent.goHomeImg">
    </div>
  </div>
</template>

<script>
import mixin from '@/utils/mixin'
import { getPc, sendPc, isLogin, handleTime } from '@/utils'
import KPopup from '@/components/KPopup'
import { getGoodsListPage } from '@/api/common'
import { getActInfo } from '@/api/activity'
import { setTimeout } from 'timers'
import { containsWhiteList } from '@/api/user'

export default {
  name: 'TcycBusinessStandard',
  components: {
    KPopup
  },
  mixins: [mixin],
  data() {
    return {
      handleTime,
      userLogin: false,
      // 有商品列表时为true
      goodsListPage: true,
      // 是否需要判断在白名单中
      judgeWhiteInner: true,

      // 配置数据
      setData: {
        businessContent: {
          bgcImg: '',
          actTime: '',
          rulesImg: '',
          rulesText: '',
          // 排名
          // 享权益
          rankOne: '',
          discountOne: '',
          rankTwo: '',
          rankThree: '',
          discountThree: '',
          rankFour: '',
          rankFive: '',
          discountFive: '',
          goodsList1: [],
          goodsList2: [],
          goodsList3: [],
          goHomeImg: '',
          tableImg: '',
          tableBottomRule1: '',
          tableBottomRule2: '',
          // 未达标图片
          standarImg: '',
          // 已达标标签
          standarTag: '',
          // 标签图片
          // 选中1
          activeTab1: '',
          nullTab21: '',
          nullTab31: '',
          // 选中2
          activeTab2: '',
          nullTab12: '',
          nullTab32: '',
          activeTab3: '',
          nullTab13: '',
          nullTab23: ''

        },
        // 活动
        shareGroup: {
          shareTitle: '',
          shareContent: '',
          shareImg: ''
        }
      },
      active: 'goodsList1',
      loading: true,
      finished: false,
      goodsList: [],
      page: {
        // 第几页
        current: 1,
        // 显示条数
        size: 10,
        currPage: '',
        totalCount: '',
        totalPage: ''
      },
      // 划线价
      lineActionPriceType: '',
      // 细则
      rulesShow: false,

      goodsListWhich: {
        goodsList1: {
          whiteInner: ''
        },
        goodsList2: {
          whiteInner: ''
        },
        goodsList3: {
          whiteInner: ''
        }
      }

    }
  },
  async  created() {
    // 获取参数
    this.getQueryForm()
    this.beforeEnterAct()
    // 获取配置信息+处理数据
    await this.getIndexInfo()
    this.userLogin = isLogin()
    // this.userLogin = true
    this.judgeWhiteInner = !!this.userLogin
    this.getGoodsList('goodsList1')
    setTimeout(() => {
      this.getUnderLinePrice('goodsList1')
      this.userLogin && this.userStandard()
      this.initActive()
    }, 500)
  },
  mounted() {
    this.$nextTick(() => {
      // 获取pc端返回的数据
      getPc(this.setData, this.processData)
      setTimeout(() => {
        // 将页面高度发送到pc端
        sendPc('.tcBusinessBox')
      }, 500)
    })
  },
  methods: {
    // 对于机构 端返回数据进行处理
    processData() {
      // this.controlCss();
    },

    // 初始化active选中
    initActive() {
      // 登录
      if (this.userLogin) {
        if (this.goodsListWhich.goodsList1.whiteInner || !this.goodsListWhich.goodsList1.whiteInner && !this.goodsListWhich.goodsList2.whiteInner && !this.goodsListWhich.goodsList3.whiteInner) {
          this.active = 'goodsList1'
        } else if (this.goodsListWhich.goodsList2.whiteInner) {
          this.active = 'goodsList2'
        } else if (!this.goodsListWhich.goodsList2.whiteInner) {
          this.active = 'goodsList3'
        }
      }
    },

    // 判断用户是否在商品列表活动白名单中
    // 判断是否在白名单中
    async userStandard() {
      let goodsListActId = ''
      this.allInfo[0].attrList.forEach(async item => {
        if (item.formType === 13) {
          goodsListActId = JSON.parse(item.value).value
          const { data: result } = await containsWhiteList({ actId: goodsListActId })
          this.goodsListWhich[item.attrKey].whiteInner = result.data.singleData
          return
        }
      })
    },

    // 获取商品列表
    async  getGoodsList(attrKey) {
      const goodsListPageQuery = {
        actId: this.queryForm.actId,
        current: this.page.current,
        organId: this.queryForm.organId,
        relationId: this.queryForm.relationId,
        size: this.page.size,
        type: 1,
        attrKey: attrKey,
        groupKey: 'businessContent'
      }
      const { data: result } = await getGoodsListPage(goodsListPageQuery)
      var res = result.data
      if (res.totalCount === 0) {
        // 列表数组
        this.goodsList = []
        this.finished = true
      }
      this.goodsList = this.goodsList.concat(res.list)
      this.loading = false
      if (this.goodsList.length >= res.totalCount) {
        this.finished = true
      } else {
        this.page.current++
      }
    },

    // 获取划线价
    async getUnderLinePrice(attrKey) {
      let goodsListActId = ''
      let values = {}
      // 根据attrKey获取对应的活动id
      // TODO 这里要根据配置商品列表的类型判断，如果是活动全部商品0，取选择的活动actId，如果是指定商品1，取当前页面（this.queryForm.actId）的活动actId
      this.allInfo[0].attrList.forEach(item => {
        if (item.attrKey === attrKey) {
          values = JSON.parse(item.value)
          goodsListActId = values.type === 0 ? values.value : this.queryForm.actId
          return
        }
      })

      const { data: ress } = await getActInfo({ actId: goodsListActId })
      this.lineActionPriceType = ress.data.lineActionPriceType
    },

    onLoad() {
      // 获取商品列表
      this.getGoodsList(this.active)
    },

    tabChange(name) {
      // 初始化van-list有关商品列表数据
      this.loading = true
      this.finished = false
      this.goodsList = []
      this.page = {
        // 第几页
        current: 1,
        // 显示条数
        size: 10,
        currPage: '',
        totalCount: '',
        totalPage: ''
      }
      this.lineActionPriceType = ''
      // 获取商品列表
      this.getGoodsList(name)
      // 获取划线价
      this.getUnderLinePrice(name)
    }

  }

}
</script>

<style lang='less' scoped>
.tcBusinessBox{
  position: relative;
  .topBox{
    position: relative;
    background-color: #FFC2DD;
    >img:first-child{
      width: 100%;
      z-index: -2;
    }
    .tableBox{
      position:absolute;
      z-index: 1;
      width: 345px;
      padding: 20px 15px 16px;
      top: 125px;
      left: 15px;
      background-color: #fff;
      box-shadow:0px 3px 9px 0px rgba(246,149,191,1);
      border-radius:8px;
      img{
        width: 100%;
        margin-bottom: 6px;
      }
      >span{
        position:absolute;
        font-size: 13px;
        color:rgba(51,51,51,1);
        text-shadow:0px 3px 9px rgba(210,226,250,1);
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
      }
      >span:nth-of-type(1){
        left: 76px;
        top: 74px;
      }
      >span:nth-of-type(2){
        left: 197px;
        top: 74px;
      }
      >span:nth-of-type(3){
        left: 71px;
        top: 114px;
      }
      >span:nth-of-type(4){
        left: 197px;
        top: 114px;
      }
      >span:nth-of-type(5){
        left: 68px;
        top: 154px;
      }
      >span:nth-of-type(6){
        left: 197px;
        top: 154px;
      }
      .tableBottomRule{
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        color:rgba(153,153,153,1);
        line-height:18px;
        text-shadow:0px 3px 9px rgba(210,226,250,1);
      }
      .times{
        margin-top: 11px;
        font-size:13px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(242,102,146,1);
        text-shadow:0px 3px 9px rgba(210,226,250,1);
        text-align: center;

      }
    }
    .ruleImg{
      position:absolute;
      right: 0;
      top: 86px;
      width: 66px;
      box-shadow:0px 3px 9px 0px rgba(246,149,191,1);
    }
  }
  .bottomBox{
    padding: 15px;
    padding-bottom: 249px;
    background-color: #FFC2DD;
    >img{
      width: 100%;
      position:absolute;
      left: 0;
      top: 0;
    }
    /deep/.van-tabs__wrap{
      margin-bottom: 15px;
      position: relative;
      overflow: visible;
      height: 60px;
      .tabImg{
        width: 115px;
        height: 60px;
      }
      // 标签图片
      .standarTagPosition{
        position:absolute;
        width: 19px;
        height: 42px;
        top: -2px;
        left: 10px;
      }
      // 文字
      .rank{
        position:absolute;
        font-size:16px;
        font-family:DINAlternate-Bold,DINAlternate;
        font-weight:600;
        top: 12px;
        left: 36px;
      }
      .rankOne1{
        color:rgba(255,255,255,1);
      }
      .rankOne2{
        color:rgba(242,105,149,1);
      }
      .tabStandar{
        position:absolute;
        top: -5px;
        right: 5px;
        color: #000;
        font-size: 12px;
      }
      .van-tabs__line{
        height: 0;
      }
      .van-tab{
        padding: 0;
      }

      .van-tabs__nav{
        background:transparent;
      }

    &::after{
      border: none!important;
    }
    }
    .listBox{
      margin-top: 15px;
      .van-list{
      .singleBox{
        position: relative;
        float: left;
        width: 168px;
        height: 270px;
        background-color: #fff;
        // padding: 13px;
        // margin-right: 8px;
        margin-bottom: 10px;
        box-shadow:0px 3px 9px 0px rgba(246,149,191,1);
        border-radius:8px;
        a{
          img{
           width: 168px;
           height: 168px;
           border-radius:8px 8px 0 0;
          }
          >p{
            padding: 0 15px 0 13px;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            margin: 9px 0 12px;
            // text-align: justify;
            word-break: break-all;
            font-family:PingFangSC-Regular,PingFang SC;
            color:rgba(51,51,51,1);
            line-height:21px;
            text-shadow:0px 3px 9px rgba(210,226,250,1);
            height: 42px;
          }
          .goodsListPrice{
            padding-left: 13px;
            display: flex;
            font-size: 16px;
            >p{
              color: red;
              font-size: 14px;
              .price{
                display: inline-block;
                font-size: 22px;
                margin-right: 11px;
              }
              s{
                font-size: 14px;
                color:rgba(153,153,153,1);
                text-shadow:0px 3px 9px rgba(210,226,250,1);
              }
              .freeBuy{
                display: inline-block;
                width: 56px;
                height: 16px;
                line-height: 16px;
                background:#F695BF;
                border-radius:1px;
                font-size: 11px;
                color: #fff;
                text-align: center;
                margin-left: 11px;
                border-radius:1px;
              }
            }
          }
        }
        &:nth-child(even){
          // margin-right: 0;
          float: right;
        }
        .iconStahdar{
          position:absolute;
          width: 37px;
          height: 36px;
          line-height: 36px;
          background:rgba(251,231,231,1);
          border-radius:0px 0px 8px 8px;
          right: 20px;
          top: 0px;
          font-size: 11px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(255,68,68,1);
          text-align: center;
        }
      }
    }
      .bottomUnderline{
        text-align: center;
        font-size: 12px;
        margin-top: 30px;
        margin-bottom: 30px;
        color:#fff;
      }
    }
    .overText{
      text-align: center;
      margin-bottom: 50px;
    }
  }
  // 规格盒子
  .van-popup{
    overflow: visible;
    .ruleText{
      /deep/h6{
        font-size: 18px;
        color: #333333;
        margin-bottom: 18.5px;
      }
      /deep/p{
        margin: 0;
        font-size: 13px;
        line-height: 19.5px;
        color: #666666;
        text-align: justify;
      }
    }
  }
  .standardResult{
    position: fixed;
    bottom:0;
    left: 0;
    background-color: #FBE7E7;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    img{
      width: 90px;
    }

  }
  .goHome{
    position:fixed;
    right: 10px;
    bottom: 30px;
    width: 40px;
    height: 40px;
    img{
      width: 100%;
    }
  }
}
</style>
