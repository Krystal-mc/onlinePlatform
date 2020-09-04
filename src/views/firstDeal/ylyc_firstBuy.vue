<template>
  <div ref="changeCss" class="firstBrush clearfix">
    <div class="content">
      <div class="topContent">
        <img :src="topContent.backgroundImg">
        <a href="javascript:void(0)" class="ruleBtn" @click="rulesShow = true">
          <img :src="topContent.activityRulesTag">
        </a>
        <p class="limits">
          {{ topContent.limitOne }}
          <br>
          {{ topContent.limitTwo }}
        </p>
        <p class="times">活动时间：{{ topContent.activityTimeStart }}~ {{ topContent.activityTimeEnd }}</p>
      </div>
      <div class="bottomContent">
        <div class="buys">
          <a href="javascript:void(0)" @click="gotoGoodsDetail1">
            <img :src="bottomContent.buyImg1" class="img1">
          </a>
          <a href="javascript:void(0)">
            <img :src="bottomContent.buyImg2" class="img2">
            <a href="javascript:void(0)" class="store store1" @click="gotoStore2" />
            <a href="javascript:void(0)" class="buy buy1" @click="gotoGoodsDetail2" />
          </a>
          <a href="javascript:void(0)">
            <img :src="bottomContent.buyImg3" class="img3">
            <a href="javascript:void(0)" class="store store2" @click="gotoStore3" />
            <a href="javascript:void(0)" class="buy buy2" @click="gotoGoodsDetail3" />
          </a>
        </div>
      </div>
      <van-popup v-model="rulesShow">
        <template>
          <div class="rules">
            <div class="txt" v-html="topContent.activityDetails" />
          </div>
          <div class="close" @click="rulesShow = false">
            <svg-icon icon-class="close" />
          </div>
        </template>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { getPc, sendPc, gotoGoodsDetails } from '@/utils'
import { JsApiList, vanguardStoreList } from '@/utils/const'
import mixin from '@/utils/mixin'

export default {
  name: 'YlycFirstBrush',
  components: {

  },
  mixins: [mixin],
  data() {
    return {
      queryForm: {
        actId: '',
        organId: '',
        relationId: ''
      },
      // 头部
      topContent: {
        backgroundImg: '',
        // 活动限制
        limitOne: '',
        limitTwo: '',
        // 活动时间
        activityTimeStart: '即日起',
        activityTimeEnd: '2020年12月',
        // 活动细则
        activityRulesTag: '',
        activityDetails: '<h6>活动细则</h6>'
      },
      // 尾部
      bottomContent: {
        buyImg1: '',
        buyUrl1: {},
        buyImg2: '',
        buyUrl2: {},
        storeUrl2: {},
        buyImg3: '',
        buyUrl3: {},
        storeUrl3: {}
      },
      JsApiList: JsApiList,
      // 活动
      shareGroup: {
        shareTitle: '',
        shareContent: '',
        shareImg: ''
      },

      indexData: {
        unionGoodsList: [],
        homeInfo: {},
        advertiseLockStatus: [],
        integralGoodsList: []
      },
      url: '',
      rulesShow: false,
      storeList: vanguardStoreList
    }
  },

  created() {
    this.getQueryForm()
    this.getIndexInfo()
    // this.getActInfo()
  },
  mounted() {
    this.$nextTick(() => {
      // 获取pc端返回的数据
      getPc(this, this.processData)
      setTimeout(() => {
        // 将页面高度发送到pc端
        sendPc('.firstBrush')
      }, 500)
    })
  },
  destroyed() {},
  methods: {
    // 获取需要从机构端得到数据发请求所需的参数（获取路由中携带参数）
    // getQueryForm() {
    //   this.$route.query.actId &&
    //     (this.queryForm.actId = this.$route.query.actId)
    //   this.$route.query.organId &&
    //     (this.queryForm.organId = this.$route.query.organId)
    //   this.$route.query.pageId &&
    //     (this.queryForm.relationId = this.$route.query.pageId)
    // },

    // 对于机构 端返回数据进行处理
    processData() {
      // this.controlCss();
    },

    // 获取机构端配置页面信息
    // async getIndexInfo() {
    //   if (
    //     this.queryForm.actId &&
    //     this.queryForm.organId &&
    //     this.queryForm.relationId
    //   ) {
    //     const { data: result } = await getIndexInfo(this.queryForm)
    //     var info = result.data.tmplAttrGroup
    //     // 处理移动端数据
    //     processMobileData(info, this)
    //     // 微信分享页调取
    //     wxShare(
    //       this.shareGroup.shareTitle,
    //       this.shareGroup.shareContent,
    //       this.shareGroup.shareImg
    //     )
    //   }
    // },
    // 商品详情
    gotoGoodsDetail1() {
      const queryStr = this.bottomContent.buyUrl1.route
      gotoGoodsDetails(this, queryStr)
    },
    gotoGoodsDetail2() {
      const queryStr = this.bottomContent.buyUrl2.route
      gotoGoodsDetails(this, queryStr)
    },
    gotoStore2() {
      const path = this.bottomContent.storeUrl2.route
      const query = {
        pageId: this.bottomContent.storeUrl2.targetRelationId
      }
      this.getActInfo(path, query)
    },
    gotoGoodsDetail3() {
      const queryStr = this.bottomContent.buyUrl3.route
      gotoGoodsDetails(this, queryStr)
    },
    gotoStore3() {
      const path = this.bottomContent.storeUrl3.route
      const query = {
        pageId: this.bottomContent.storeUrl3.targetRelationId
      }
      this.getActInfo(path, query)
    }
  }
}
</script>

<style lang="less" scoped>
.firstBrush {
  --height: 200px;
  --urls: url("../../assets/images/yulinNewImg/ghBg.png") no-repeat;
  background: #ffffff;
  & > .content {
    background: #f7f8fa;
    .topContent {
      position: relative;
      img {
        width: 100%;
      }
      .limits {
        position: absolute;
        width: 100%;
        top: 135px;
        font-size: 11px;
        color: #fff;
        text-align: center;
      }
      .times {
        position: absolute;
        top: 179px;
        height: 23px;
        line-height: 23px;
        font-size: 11px;
        color: #e02020;
        text-align: center;
        width: 100%;
      }
      p {
        text-align: center;
        margin: 0;
      }
      .ruleBtn {
        position: absolute;
        top: 30px;
        right: 0;
        img {
          width: 63px;
          height: 31px;
        }
      }
    }
    .bottomContent {
      background-size: 100%;
      padding-bottom: 0;
      min-height: 450px;
      position: relative;
      top: -54px;
      .buys {
        margin: 0 15px;
        font-size: 11px;
        color: #ffffff;
        & > a {
          display: block;
          position: relative;
          margin-bottom: 10px;
          &:first-child {
            border-radius: 8px;
            box-shadow: 0px 2px 8px 0px rgba(239, 216, 216, 0.6),
              0px 3px 9px 0px rgba(237, 233, 233, 1);
          }
          &:nth-child(2) {
            border-radius: 8px;
            box-shadow: 0px 2px 8px 0px rgba(239, 216, 216, 0.6);
          }
          &:nth-child(3) {
            border-radius: 8px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 2px 8px 0px rgba(239, 216, 216, 0.6);
          }
        }
        img {
          display: block;
          width: 100%;
        }
        .store {
          position: absolute;
          width: 65px;
          height: 27px;
        }
        .store1 {
          left: 22px;
          top: 91px;
        }
        .store2 {
          left: 187px;
          top: 91px;
        }
        .buy {
          position: absolute;
          width: 65px;
          height: 27px;
          // background: rgba(0,0,0,0.6);
        }
        .buy1 {
          left: 87px;
          top: 91px;
        }
        .buy2 {
          left: 251px;
          top: 91px;
        }
      }
    }

    .rules {
      width: 325px;
      height: 460px;
      padding: 17.5px 20.5px 23px 21.5px;
      position: relative;
      overflow: auto;
      .txt {
        /deep/h6 {
          margin: 0;
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #333333;
          margin-bottom: 18.5px;
        }
        /deep/p {
          margin: 0;
          font-size: 13px;
          line-height: 19.5px;
          color: #666666;
          text-align: justify;
        }
      }
    }
    .close {
      position: absolute;
      right: 15px;
      top: -8px;
      width: 23.5px;
      height: 38.5px;
      background: #fe5a74;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      text-align: center;
      color: #ffffff;
      line-height: 38.5px;
      font-size: 14px;
    }
  }
  .van-popup {
    overflow: inherit;
  }
}
</style>
