<template>
  <div class="tcFirstBuyBox clearfix">
    <!-- 顶部 -->
    <div class="topBox">
      <img :src="setData.firstBuyContent.bgcImg">
      <!-- <p>*仅限新用户专享{{ setData.firstBuyContent.limitText1 }}</p> -->
      <p class="times">活动时间：{{ setData.firstBuyContent.actTime }}</p>
      <!-- 活动细则 -->
      <img :src="setData.firstBuyContent.rulesImg" class="rulesImg" @click="rulesShow=true">
    </div>
    <!-- 中间 -->
    <div class="middleBox">
      <div>
        <img :src="setData.firstBuyContent.middleImg" @click="gotoGoodsDetail">
      </div>
    </div>
    <!-- 商品列表 -->
    <div class="bottomBox">
      <div>
        <img :src="setData.firstBuyContent.featurGiftsImg">
      </div>
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
                    ￥ <span>{{ item.actPrice }}</span>
                    <s v-if="lineActionPriceType==0">￥{{ item.organMarketPrice }}</s>
                    <s v-if="lineActionPriceType==1">￥{{ item.organSalePrice }}</s>
                  </p>
                </div>
              </a>
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
      <div slot="text" class="ruleText" v-html="setData.firstBuyContent.rulesText">
        <!-- <h3>活动细则</h3>
        <div v-html="goods.discountRule" /> -->
      </div>
    </k-popup>

    <div class="goHome" @click="goPageHome">
      <img :src="setData.firstBuyContent.goHomeImg">
    </div>
  </div>
</template>

<script>
import mixin from '@/utils/mixin'
import { getPc, sendPc, gotoGoodsDetails, handleTime } from '@/utils'
import KPopup from '@/components/KPopup'
import { getActInfo } from '@/api/activity'
import { getGoodsListPage } from '@/api/common'

export default {
  name: 'TcycFirstBuy',
  components: {
    KPopup
  },
  mixins: [mixin],
  data() {
    return {
      handleTime,
      // 有商品列表时为true
      goodsListPage: true,

      // 细则
      rulesShow: false,
      // 配置数据
      setData: {
        firstBuyContent: {
        // 背景图
          bgcImg: '',
          limitText1: '',
          limitText2: '',
          actTime: '',
          rulesImg: '',
          rulesText: '',
          middleImg: '',
          // 话费跳转
          phoneMoneryUrl: {},
          featurGiftsImg: '',
          goHomeImg: '',
          // 商品数据
          goodsList: []
        },
        // 活动
        shareGroup: {
          shareTitle: '',
          shareContent: '',
          shareImg: ''
        }
      },

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
      lineActionPriceType: ''

    }
  },
  async  created() {
    // 获取参数
    this.getQueryForm()
    this.beforeEnterAct()
    // 获取配置信息+处理数据
    await this.getIndexInfo()
    this.getGoodsList('goodsList')
    setTimeout(() => {
      this.getUnderLinePrice('goodsList')
    }, 500)
  },
  mounted() {
    this.$nextTick(() => {
      // 获取pc端返回的数据
      getPc(this.setData, this.processData)
      setTimeout(() => {
        // 将页面高度发送到pc端
        sendPc('.tcFirstBuyBox')
      }, 500)
    })
  },
  methods: {
    // 对于机构 端返回数据进行处理
    processData() {
      // this.controlCss();
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
        groupKey: 'firstBuyContent'
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
      // debugger
      // 根据attrKey获取对应的活动id
      // TODO 这里要根据配置商品列表的类型判断，如果是活动全部商品，取选择的活动actId，如果是指定商品，取当前页面（this.queryForm.actId）的活动actId
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
      this.getGoodsList('goodsList')
    },

    // 跳转充话费详情页
    gotoGoodsDetail() {
      const queryStr = this.setData.firstBuyContent.phoneMoneryUrl.route
      gotoGoodsDetails(this, queryStr)
    },

    // 跳转首页
    goHome() {

    }

  }

}
</script>

<style lang='less' scoped>
.tcFirstBuyBox{
  position: relative;
  .topBox{
    margin-bottom: 0;
    background-color: #9EE1EA;
    >img:nth-child(1){
      width: 100%;
    }
    .times{
      position:absolute;
      width: 100%;
      left: 0;
      top: 186px;
      text-align: center;
      font-size:12px;
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(21,156,178,1);
    }
    .rulesImg{
      position:absolute;
      width: 59px;
      right: 0;
      top: 21px;
    }
  }
  .middleBox{
    background-color: #9EE1EA;
    >div{
      padding: 0 15px;
      img{
        width: 100%;
        box-shadow:0px 3px 9px 0px rgba(72,186,205,1);
      }
    }
  }
  .bottomBox{
    padding-top: 25px;
    padding-bottom: 249px;
    background-color: #9EE1EA;
    >div:first-child{
      margin: 0 60px;
      img{
        width: 100%;
      }
    }
    .listBox{
      padding: 8px 15px;
      .van-list{
      margin-top: 10px;
      .singleBox{
        float: left;
        width: 168px;
        height: 270px;
        background-color: #fff;
        padding: 13px;
        // margin-right: 8px;
        margin-bottom: 10px;
        border-radius:8px;
        box-shadow:0px 3px 9px 0px rgba(72,186,205,1);
        a{
          img{
           width: 140px;
           height: 140px;
          }
          >p{
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            margin: 10px 0 30px;
            // text-align: justify;
            word-break: break-all;
            font-family:PingFangSC-Regular,PingFang SC;
            color:rgba(51,51,51,1);
            line-height:21px;
            margin: 22px 0 12px 0;
            height: 42px;

          }
          .goodsListPrice{
            display: flex;
            font-size: 16px;
            >p{
              color: red;
              font-size: 14px;
              span{
                display: inline-block;
                font-size: 22px;
                margin-right: 15px;
              }
              s{
                font-size: 14px;
                color: #999;
              }
            }
          }
        }
        &:nth-child(even){
          // margin-right: 0;
          float: right;
        }
        // &:nth-child(odd){
        //   float: right;
        // }
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
