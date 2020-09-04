<template>
  <div class="indexContainer clearfix">

    <div>
      <img :src="setData.mainActivityIndex.firstBuyImg" @click="gotoFirstBuy">
    </div>
    <div>
      <img :src="setData.mainActivityIndex.stageStandardImg" @click="gotoStageStandar">
    </div>
    <div>
      <img :src="setData.mainActivityIndex.businessStandardImg" @click="gotoBusinessStandar">
    </div>
    <div class="twoExtral clearfix">
      <img :src="setData.extralLink.leftImg" @click="gotoLeft">
      <img :src="setData.extralLink.rightImg" @click="gotoRight">
    </div>
    <div class="bottom">
      <img :src="setData.extralLink.bottomImg" @click="gotoBottom">
    </div>
    <tcycTabbar />
  </div>
</template>

<script>
import mixin from '@/utils/mixin'
import { getPc, sendPc } from '@/utils'
import tcyc from '@/components/KTabbar/ylyc'

export default {
  name: 'TcycIndex',
  components: {
    'tcycTabbar': tcyc
  },
  mixins: [mixin],
  data() {
    return {
      setData: {
        mainActivityIndex: {
          firstBuyImg: '',
          firstBuyUrl: {},
          stageStandardImg: '',
          stageStandardUrl: {},
          businessStandardImg: '',
          businessStandardUrl: {}
        },
        extralLink: {
          leftImg: '',
          leftUrl: {},
          rightImg: '',
          rightUrl: {},
          bottomImg: '',
          bottomUrl: {}
        },
        // 活动
        shareGroup: {
          shareTitle: '',
          shareContent: '',
          shareImg: ''
        }
      }

    }
  },
  async created() {
    // 获取参数
    this.getQueryForm()
    // 获取配置信息+处理数据
    await this.getIndexInfo()
  },
  mounted() {
    this.$nextTick(() => {
      // 获取pc端返回的数据
      getPc(this.setData, this.processData)
      setTimeout(() => {
        // 将页面高度发送到pc端
        sendPc('.indexContainer')
      }, 500)
    })
  },
  methods: {
    // 对于机构 端返回数据进行处理
    processData() {
      // this.controlCss();
    },
    // 跳转悦享首刷页面
    gotoFirstBuy() {
      const path = this.setData.mainActivityIndex.firstBuyUrl.route
      const query = {
        pageId: this.setData.mainActivityIndex.firstBuyUrl.targetRelationId
      }
      this.getActInfo(path, query)
    },
    gotoStageStandar() {
      const path = this.setData.mainActivityIndex.stageStandardUrl.route
      const query = {
        pageId: this.setData.mainActivityIndex.stageStandardUrl.targetRelationId
      }
      this.getActInfo(path, query)
    },
    gotoBusinessStandar() {
      const path = this.setData.mainActivityIndex.businessStandardUrl.route
      const query = {
        pageId: this.setData.mainActivityIndex.businessStandardUrl.targetRelationId
      }
      this.getActInfo(path, query)
    },
    gotoLeft() {
      const path = this.setData.extralLink.leftUrl.targetUrl
      window.location.href = path
    },
    gotoRight() {
      const path = this.setData.extralLink.rightUrl.targetUrl
      window.location.href = path
    },
    gotoBottom() {
      const path = this.setData.extralLink.bottomUrl.targetUrl
      window.location.href = path
    }
  }

}
</script>

<style lang='less' scoped>
.indexContainer{
    padding: 15px;
    >div:nth-child(1),
    >div:nth-child(2),
    >div:nth-child(3),
    >div:nth-child(5){
        width: 100%;
        margin-bottom: 13px;
        img{
            width: 100%;
        }
    }
    .twoExtral{
        margin-bottom: 13px;
        img{
            width: 167px;
            float: left;
        }
        >img:first-child{
            margin-right: 10px;
        }
    }
    .bottom{
      margin-top: 15px;
      margin-bottom: 98px!important;
    }

}

</style>
