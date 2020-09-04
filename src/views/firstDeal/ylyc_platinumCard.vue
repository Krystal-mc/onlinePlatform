<template>
  <div ref="changeCss" class="platinumCard clearfix">
    <div class="content">
      <div class="topContent">
        <!-- 两张背景图片 -->
        <img :src="topContent.topBgcImg">
        <p class="limits">{{ bottomContent.limits }}</p>
        <p class="times">活动时间：{{ bottomContent.timeStart }}-{{ bottomContent.timeEnd }}</p>
      </div>
      <div class="bottomContent">
        <!-- 商品图片 链接 -->
        <div class="platinumGood">
          <img :src="bottomContent.goodsImg">
          <a href="javascript:void(0)" @click="goodsDetail" />
        </div>
        <div class="rules">
          <img :src="topContent.titleImg" class="rulesTitle">
          <img :src="topContent.leftBgcImg">
          <img :src="topContent.rightBgcImg">
          <div
            class="txt"
            :style="`background:url(${topContent.ruleBoxBgc}) no-repeat`"
            v-html="bottomContent.activityRules"
          />
          <img :src="topContent.bottomBgc" class="bottomBgc">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendPc, getPc, processMobileData, gotoGoodsDetails } from '@/utils'
import { JsApiList } from '@/utils/const'
import { getIndexInfo } from '@/api/common'
import { wxShare } from '@/utils/wx'
import mixin from '@/utils/mixin'

export default {
  name: 'YlycPlatinumCard',
  components: {},
  mixins: [mixin],

  data() {
    return {
      JsApiList: JsApiList,
      queryForm: {
        actId: '',
        organId: '',
        relationId: ''
      },
      topContent: {
        topBgcImg: '',
        titleImg: '',
        // 活动细则背景图
        ruleBoxBgc: '',
        bottomBgc: '',
        // 中间小切图
        leftBgcImg: '',
        rightBgcImg: ''
      },
      bottomContent: {

      },
      // 活动
      shareGroup: {
        shareTitle: '',
        shareContent: '',
        shareImg: ''
      },
      url: ''
    }
  },
  computed: {},
  created() {
    // 获取参数
    this.getQueryForm()
    // 获取移动端数据
    this.getIndexInfo()
  },
  mounted() {
    this.$nextTick(() => {
      // 获取pc端返回的数据
      getPc(this, this.processData)
      // 将页面高度发送到pc端
      setTimeout(() => {
        sendPc('.platinumCard')
      }, 500)
    })
  },
  destroyed() {},
  methods: {
    // 获取需要从机构端得到数据发请求所需的参数（获取路由中携带参数）
    getQueryForm() {
      this.$route.query.actId &&
        (this.queryForm.actId = this.$route.query.actId)
      this.$route.query.organId &&
        (this.queryForm.organId = this.$route.query.organId)
      this.$route.query.pageId &&
        (this.queryForm.relationId = this.$route.query.pageId)
    },
    // // 对于机构 端返回数据进行处理
    processData() {
      // sendPc(".platinumCard");
    },
    // 获取机构端配置页面信息
    async getIndexInfo() {
      if (
        this.queryForm.actId &&
        this.queryForm.organId &&
        this.queryForm.relationId
      ) {
        const { data: result } = await getIndexInfo(this.queryForm)
        var info = result.data.tmplAttrGroup
        // 处理移动端数据
        processMobileData(info, this)
        // 微信分享页调取
        wxShare(
          this.shareGroup.shareTitle,
          this.shareGroup.shareContent,
          this.shareGroup.shareImg
        )
      }
    },

    // 商品详情跳转
    goodsDetail() {
      const queryStr = this.bottomContent.goodsUrl.route
      gotoGoodsDetails(this, queryStr)
    }
  }
}
</script>

<style lang="less" scoped>
.platinumCard {
  & > .content {
    .topContent {
      // height: 290px;
      //   background: url("../../assets/images/baoji/firstBruBg.png") no-repeat;
      background-size: cover;
      position: relative;
      img {
        width: 100%;
        display: block;
      }
      .limits {
        position: absolute;
        width: 100%;
        top: 204px;
        font-size: 12px;
        color: #fff;
      }
      .times {
        position: absolute;
        width: 100%;
        height: 31px;
        line-height: 31px;
        top: 242px;
        font-size: 13px;
        color: #2255d1;
      }
      p {
        text-align: center;
        margin: 0;
      }
    }
    .bottomContent {
      .platinumGood {
        position: absolute;
        top: 315px;
        margin: 0 18px 0 20px;
        > a {
          display: block;
          width: 170px;
          height: 40px;
          // background: #000;
          position: absolute;
          top: 228px;
          left: 84px;
        }
        img {
          width: 100%;
        }
      }
    }
    .rules {
      position: relative;
      background-color: #4e84fc;
      width: 100%;
      z-index: -2;
      .rulesTitle {
        // position: absolute;
        // top: 657px;
        margin: 30px 0 0 103px;
        width: 170px;
      }
      .bottomBgc {
        width: 100%;
        margin-bottom: -2px;
      }
      > img:nth-child(2) {
        position: absolute;
        width: 41px;
        left: -2px;
        bottom: 107px;
        z-index: -1;
      }
      > img:nth-child(3) {
        position: absolute;
        width: 41px;
        right: -6px;
        top: 120px;
        z-index: -1;
      }
      .txt {
        z-index: 1;
        // position: absolute;
        margin: 20px 18px 10px 20px;
        top: 713px;
        // background-size: 100% 100%;
        padding: 34px 17px;
        overflow: auto;
        // width: 303px;
        // // height: 207px;
        // position: absolute;
        // // overflow: auto;
        // top: 747px;
        // left: 35px;
        /deep/ p {
          margin: 0;
          font-size: 14px;
          color: #2255d2;
          line-height: 21px;
          text-align: justify;
        }
      }
    }
  }
}
</style>
<style  lang="less" scoped>
.platinumCard {
  .van-popup {
    overflow: inherit;
  }
}
</style>
