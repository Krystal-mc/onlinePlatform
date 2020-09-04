<template>
  <div ref="changeCss" class="indexContainer clearfix">
    <div class="content">
      <div class="topSwipeContainer">
        <van-swipe class="topSwipe" :autoplay="5000" :duration="800">
          <van-swipe-item v-for="(item) in indexData.topAdvertiseList" :key="item.advertiseId">
            <a href="javascript:void(0)">
              <img :src="item.img" @click="gotoTargetPage(item)">
            </a>
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- icon start-->
      <div class="iconArea">
        <!-- <div> -->
        <div>
          <a href="javascript:void(0)" @click="targetLabourUnion">
            <div class="imgBox">
              <img :src="iconArray.icon1">
            </div>
            {{ iconArray.name1 }}
          </a>
          <a href="javascript:void(0)" @click="targetFirstBrush">
            <div class="imgBox">
              <img :src="iconArray.icon2">
            </div>
            {{ iconArray.name2 }}
          </a>
          <a href="javascript:void(0)" @click="targetPlatinumCard">
            <div class="imgBox">
              <img :src="iconArray.icon3">
            </div>
            {{ iconArray.name3 }}
          </a>
          <a href="javascript:void(0)" @click="targNewGuestCeremony">
            <div class="imgBox">
              <img :src="iconArray.icon4">
            </div>
            {{ iconArray.name4 }}
          </a>
        </div>
        <div>
          <a href="javascript:void(0)" @click="targPlatinumCardComeOn">
            <div class="imgBox">
              <img :src="iconArray.icon5">
            </div>
            {{ iconArray.name5 }}
          </a>
          <a href="javascript:void(0)" @click="targWeeklyGifts">
            <div class="imgBox">
              <img :src="iconArray.icon6">
            </div>
            {{ iconArray.name6 }}
          </a>
          <a href="javascript:void(0)" @click="targFreeInterest">
            <div class="imgBox">
              <img :src="iconArray.icon7">
            </div>
            {{ iconArray.name7 }}
          </a>
          <a href="javascript:void(0)" @click="targMoreBenefits">
            <div class="imgBox">
              <img :src="iconArray.icon8">
            </div>
            {{ iconArray.name8 }}
          </a>
        </div>

        <!-- </div> -->
      </div>
      <!-- icon end-->

      <!-- 一元购 -->
      <div
        class="oneYuanBuyGoods"
        :style="`background: url(${middleGoodsList.middleBgcImg}) no-repeat;`"
      >
        <div class="oneYuanBuyList">
          <a href="javascript:void(0)" class="oneYuanBuyLi" @click="gotoOneBuy1">
            <img :src="middleGoodsList.unionGoodsImg1">
          </a>
          <a href="javascript:void(0)" @click="gotoOneBuy2">
            <img :src="middleGoodsList.unionGoodsImg2">
          </a>
        </div>
      </div>

      <!-- 悦享首刷  start -->
      <a href="javascript:void(0)" class="cardBook" @click="handleDetails">
        <img :src="firstBrush.firstBrushImg">
      </a>

      <!-- 周周好礼，免息分期购 -->
      <div class="enjoyFirstBrush">
        <div class="outLinkLi">
          <a href="javascript:void(0)" class="weekCeremony" @click="gotoBottomOne">
            <img :src="bottomAcitvityList.activityImg1">
          </a>
          <a href="javascript:void(0)" @click="gotoBottomTwo">
            <img :src="bottomAcitvityList.activityImg2">
          </a>
        </div>
      </div>
    </div>
    <ylycTabbar />
  </div>
</template>

<script>
import { sendPc, getPc, processMobileData, gotoGoodsDetails } from '@/utils'
import { JsApiList } from '@/utils/const'
import { getIndexInfo } from '@/api/common'
import { wxShare } from '@/utils/wx'
import mixin from '@/utils/mixin'
import ylyc from '@/components/KTabbar/ylyc'

export default {
  name: 'YlycIndex',
  components: {
    'ylycTabbar': ylyc
  },
  mixins: [mixin],
  data() {
    return {
      JsApiList: JsApiList,
      queryForm: {
        actId: '',
        organId: '',
        relationId: ''
      },
      indexData: {
        // 轮播图
        topAdvertiseList: [
          {
            imgPath:
              'https://img.yzcdn.cn/public_files/2017/10/24/1791ba14088f9c2be8c610d0a6cc0f93.jpeg'
          }
        ]
      },
      iconArray: {
        icon1: '',
        name1: '工会大礼包',
        url1: {},
        isShow1: true,
        icon2: '',
        name2: '悦享首刷',
        url2: {},
        isShow2: true,
        icon3: '',
        name3: '白金卡专区',
        url3: {},
        isShow3: true,
        icon4: '',
        name4: '华润通新客',
        url4: {},
        isShow4: true,
        icon5: '',
        name5: '白金卡加油',
        url5: {},
        isShow5: true,
        icon6: '',
        name6: '周周好礼',
        url6: {},
        isShow6: true,
        icon7: '',
        name7: '免息分期',
        url7: {},
        isShow7: true,
        icon8: '',
        name8: '更多福利',
        url8: {},
        isShow8: true
      },

      // 中间商品图片
      middleGoodsList: {
        // 背景切图
        middleBgcImg: '',
        // 中间商品
        unionGoodsImg1: '',
        unionGoodsUrl1: '',
        unionGoodsImg2: '',
        unionGoodsUrl2: ''
      },
      // 月享首刷
      firstBrush: {
        // 悦享首刷图片
        firstBrushImg: '',
        // 链接
        firstBrushUrl: ''
      },
      // 下边活动列表
      bottomAcitvityList: {
        activityImg1: '',
        activityUrl1: '',
        activityImg2: '',
        activityUrl2: ''
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
    this.getQueryForm()
    this.getIndexInfo()
  },
  mounted() {
    this.$nextTick(() => {
      // 获取pc端返回的数据
      getPc(this, this.processData)
      // 将页面高度发送到pc端
      setTimeout(() => {
        sendPc('.indexContainer')
      }, 500)
    })
  },
  destroyed() {},
  methods: {
    getQueryForm() {
      this.$route.query.actId &&
        (this.queryForm.actId = this.$route.query.actId)
      this.$route.query.organId &&
        (this.queryForm.organId = this.$route.query.organId)
      this.$route.query.pageId &&
        (this.queryForm.relationId = this.$route.query.pageId)
    },
    // 对于机构 端返回数据进行处理
    processData() {
      // this.controlCss()
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
    // 轮播图跳转
    gotoTargetPage(target) {
      const path = target.route
      const query = {
        pageId: target.targetRelationId
      }
      this.getActInfo(path, query)
    },
    // icon跳转
    targetLabourUnion(name) {
      const path = this.iconArray.url1.route
      const query = {
        pageId: this.iconArray.url1.targetRelationId
      }
      this.getActInfo(path, query)
    },
    targetFirstBrush() {
      const path = this.iconArray.url2.route
      const query = {
        pageId: this.iconArray.url2.targetRelationId
      }
      this.getActInfo(path, query)
    },
    targetPlatinumCard() {
      const path = this.iconArray.url3.route
      const query = {
        pageId: this.iconArray.url3.targetRelationId
      }
      // this.getActInfo(path, query)
      // 跳转
      this.getActInfo(path, query)
    },
    targNewGuestCeremony() {
      const path = this.iconArray.url4.route
      const query = {
        pageId: this.iconArray.url4.targetRelationId
      }
      this.getActInfo(path, query)
    },
    targPlatinumCardComeOn() {
      const path = this.iconArray.url5.route
      const query = {
        pageId: this.iconArray.url5.targetRelationId
      }
      this.getActInfo(path, query)
    },
    targWeeklyGifts() {
      const path = this.iconArray.url6.route
      const query = {
        pageId: this.iconArray.url6.targetRelationId
      }
      this.getActInfo(path, query)
    },
    targFreeInterest() {
      const path = this.iconArray.url7.route
      const query = {
        pageId: this.iconArray.url7.targetRelationId
      }
      this.getActInfo(path, query)
    },
    targMoreBenefits() {
      const path = this.iconArray.url8.route
      const query = {
        pageId: this.iconArray.url8.targetRelationId
      }
      this.getActInfo(path, query)
    },

    // 一元购
    gotoOneBuy1() {
      const queryStr = this.middleGoodsList.unionGoodsUrl1.route
      gotoGoodsDetails(this, queryStr)
    },
    gotoOneBuy2() {
      const queryStr = this.middleGoodsList.unionGoodsUrl2.route
      gotoGoodsDetails(this, queryStr)
    },

    // 悦享首刷
    handleDetails() {
      const queryStr = this.firstBrush.firstBrushUrl.route
      gotoGoodsDetails(this, queryStr)
    },

    // 底部跳转
    gotoBottomOne() {
      const path = this.bottomAcitvityList.activityUrl1.route
      const query = {
        pageId: this.bottomAcitvityList.activityUrl1.targetRelationId
      }
      this.getActInfo(path, query)
    },
    gotoBottomTwo() {
      const path = this.bottomAcitvityList.activityUrl2.route
      const query = {
        pageId: this.bottomAcitvityList.activityUrl2.targetRelationId
      }
      this.getActInfo(path, query)
    }
  }
}
</script>

<style lang="less" scoped>
.indexContainer {
  background: #ffffff;
  & > .content {
    padding-bottom: 110px;
    width: 100%;
    background: #f7f8fa;
    .topSwipeContainer {
      background: #ffffff;
      padding: 16px 15px;
      width: 100%;
      height: 192px;

      .topSwipe {
        z-index: 1;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        border-radius: 8px;
        img {
          width: 100%;
        }
      }
    }
    .iconArea {
      margin: 10px 15px 0 15px;
      padding-top: 15px;
      border-radius: 3px;
      background: #ffffff;
      border-radius: 8px;
      div {
        display: flex;
        justify-content: space-around;
        margin-top: 3px;
        a {
          font-size: 13px;
          color: #666;
          margin-bottom: 15px;
          margin-top: 4px;
          text-align: center;
          .imgBox {
            width: 62px;
            height: 60px;
            margin: 0 auto;
            margin-bottom: 3px;
            img {
              width: 100%;
            }
          }
        }
      }
      &::after {
        content: "";
        clear: both;
        display: block;
      }
    }
    .oneYuanBuyGoods {
      margin: 8px 15px;
      // height: 466px;
      background-size: 100% 100% !important;
      padding: 10px;
      padding-top: 77px;

      .oneYuanBuyList {
        padding: 4px 4px 0 4px;
        overflow: hidden;
        a {
          display: block;
          width: 100%;
          margin-top: 4px;
          img {
            width: 100%;
          }
        }
      }
    }
    .cardBook {
      display: block;
      margin: 0 9px;
      img {
        width: 100%;
      }
    }
    .enjoyFirstBrush {
      margin: 0 15px 0 15px;
      .outLinkLi {
        display: flex;
        a {
          width: 50%;
          img {
            width: 100%;
          }
        }
        .weekCeremony {
          margin-right: 9px;
        }
      }
    }

    .adArea {
      // height: 140px;
      margin: 12px 12px 0;
      position: relative;
      z-index: 1;
      img {
        width: 100%;
        height: 100%;
        border-radius: 3px;
        display: block;
      }
    }
  }
}
</style>
<style lang="less">
.indexContainer {
  .van-swipe__indicator {
    background: rgba(235, 237, 240, 1);
    opacity: 0.3;
  }
  .van-swipe__indicator--active {
    width: 12px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 1);
    opacity: 1;
  }
  .van-swipe__indicators {
    bottom: 13px;
    // background: rgba(0,0,0,0.3);
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
  opacity: 0.4;
  &.active {
    opacity: 0.2;
  }
}
</style>
