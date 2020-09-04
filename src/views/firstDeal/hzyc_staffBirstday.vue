<template>
  <div ref="changeCss" class="staffBirstday clearfix">
    <div class="topContent">
      <!-- 背景图 -->
      <img :src="mainContent.backGroundImg">
      <!-- 本机构logo图片 -->
      <img :src="mainContent.organLogo">
      <!-- 福利内容图片 -->
      <img :src="mainContent.welfareImg">
      <!-- 立即领取按钮图片 -->
      <img :src="mainContent.receiveBtnImg" @click="gotoDetails">
      <p class="acrTartContent">活动对象：{{ mainContent.actTarget }}</p>
      <p class="actTime">活动时间：{{ mainContent.actTime }}</p>

    </div>

    <div class="bottomContent">
      <div class="rulesBigBox">
        <!-- 上面 -->
        <img :src="mainContent.rulesTopBoxImg">
        <!-- 中间 -->
        <div :style="`background:url(${mainContent.rulesMiddleBoxImg}) no-repeat;`">
          <h6>活动细则：</h6>
          <!-- v-html="mainContent.rulesText" -->
          <div v-html="mainContent.rulesText" />

        </div>
        <!-- 下面 -->
        <img :src="mainContent.rulesBottomBoxImg">
      </div>
      <div class="bottom">
        <img :src="mainContent.BottomCakeImg">
      </div>
    </div>
    <!-- /返回个人中心 -->
    <img :src="mainContent.userContentIcon" @click="gotoUserContent">
  </div>
</template>

<script>
import { sendPc, getPc } from '@/utils'
import { JsApiList } from '@/utils/const'
import mixin from '@/utils/mixin'

export default {
  name: 'HzycStaffBirstday',
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
      mainContent: {
        backGroundImg: '',
        organLogo: '',
        actTarget: '',
        actTime: '',
        welfareImg: '',
        receiveBtnImg: '',
        // receiveUrl: '',
        // 规则
        rulesTopBoxImg: '',
        rulesMiddleBoxImg: '',
        rulesBottomBoxImg: '',
        rulesText: '',
        BottomCakeImg: '',
        userContentIcon: ''

      },
      // 活动
      shareGroup: {
        shareTitle: '',
        shareContent: '',
        shareImg: ''
      }
    }
  },
  created() {
    // 获取参数(mixin中)
    this.getQueryForm()
    // 判断活动预告
    this.beforeEnterAct()
    // 获取机构配置页面信息（mixin中）
    this.getIndexInfo()
  },
  mounted() {
    this.$nextTick(() => {
      // 获取pc端返回的数据
      getPc(this, this.processData)
      // 将页面高度发送到pc端
      setTimeout(() => {
        sendPc('.staffBirstday')
      }, 500)
    })
  },
  destroyed() {},
  methods: {
    // // 对于机构 端返回数据进行处理
    processData() {
      // sendPc(".staffBirstday");
    },

    // 立即领取
    gotoDetails() {
      this.$router.push({ path: '/goods/goodsList', query: { actId: this.queryForm.actId, organId: this.queryForm.organId, searchShow: 1, sortShow: 1, columnsNum: 1 }})
    },

    // 返回个人中心
    gotoUserContent() {
      this.$router.push({ path: '/my/userCenter', query: { organId: this.queryForm.organId, actId: this.queryForm.actId }})
    }

  }
}
</script>

<style lang="less" scoped>
.staffBirstday {
    background-color: #FFEFEB;
    .topContent{
       position: relative;
       text-align: center;
       >img:nth-child(1){
           width: 100%;
       }
       >img:nth-child(2){
           position:absolute;
           left: 12.5px;
           top: 16.8px;
           width: 155px;
       }
       >img:nth-child(3){
           position:absolute;
           left: 50%;
           top: 326px;
           transform: translateX(-50%);
           width: 158.5px;

       }
       >img:nth-child(4){
           position:absolute;
           left: 50%;
           top: 372px;
           transform: translateX(-50%);
           width: 226.2px;
       }
       p{
           position:absolute;
           left: 50%;
           transform: translateX(-50%);
           font-size: 11px;
           font-weight: 400;
           color: #666;
           // 不换行
           white-space: nowrap
       }
       .acrTartContent{
           top: 288px;

       }
       .actTime{
           top: 305.5px;
       }
    }
    .bottomContent{
        .rulesBigBox{
            padding:0 23.5px;

            >div{
                background-size:100% 100%!important;
                h6{
                margin:0 21px;
                font-size: 15px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #FF7DA9;
                margin-bottom: 10px;
                }
                >div{
                    margin:0 21px;
                    font-size: 12px;
                    color: #333;
                    /deep/p{
                        width: 100%;
                        line-height: 17px;
                    }
                }
            }
            img{
                width: 100%;
                display: block;
            }
        }
        .bottom{
            position: relative;
            height: 123px;
            img{
                position:absolute;
                width: 100%;
                bottom: 0;
            }
        }
    }
    >img{
        position:fixed;
        width: 40px;
        bottom: 15px;
        right: 20px;
    }

}
</style>
<style  lang="less" scoped>
.staffBirstday {
  .van-popup {
    overflow: inherit;
  }
}
</style>
