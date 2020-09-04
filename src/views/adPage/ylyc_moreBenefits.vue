<template>
  <!-- 榆林邮储-更多福利 -->
  <div class="creditCardContent clearfix">
    <div class="nav">
      <a class="leftArrow" @click="back">
        <img src="http://khh-test.oss-cn-beijing.aliyuncs.com/developImage/20200708/6686459616525553664.png">
      </a>
    </div>
    <div class="content">
      <div class="imgLists">
        <div class="integralTitle">
          <img :src="title.img" class="img-icon" alt="">
          <span class="title">{{ title.content }}</span>
        </div>
        <div v-for="(item, index) in benefit.imgList" :key="index">
          <div v-if="item.type == 0">
            <img :src="item.img" alt="">
          </div>
          <div v-if="item.type == 1">
            <a :href="item.targetUrl">
              <img :src="item.img" alt="">
            </a>
          </div>
          <div v-if="item.type == 2 || item.type == 3">
            <div @click="breakPage(item)">
              <img :src="item.img" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="bottomC">
        <a href="javascript:void(0)">由 “卡唤唤” 提供技术支持</a>
        <a href="tel:4001097717"><img src="http://khh-test.oss-cn-beijing.aliyuncs.com/developImage/20200708/6686460028402012160.png"></a>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { JsApiList } from '@/utils/const'
import { sendPc, getPc, processMobileData } from '@/utils'
import { getIndexInfo } from '@/api/common'
import { wxShare } from '@/utils/wx'

export default {
  name: 'CreditCard',
  components: {
  },
  data() {
    return {
      JsApiList: JsApiList,
      url: 'https://m.yinfu365.com/xyyc/integral/creditCardArea?bankId=',
      bankId: '',
      title: {
        img: '',
        content: '更多福利'
      },
      benefit: {
        imgList: []
      },
      // 分享图片
      shareGroup: {
        shareTitle: '',
        shareContent: '',
        shareImg: ''
      },
      actId: '',
      organId: '',
      relationId: ''
    }
  },
  computed: {

  },
  created() {
    // 获取页面传递的值
    this.getLocationData()
    // 获取移动端数据
    this.init()
  },
  mounted() {
    document.title = '精选福利'
    if (this.$route.query.bankId) {
      this.bankId = this.$route.query.bankId
    }
    this.$nextTick(() => {
      // 获取pc端返回的数据
      getPc(this, this.processData)
      // 将页面高度发送到pc端
      sendPc('.creditCardContent')
    })
  },
  destroyed() {
  },
  methods: {
    // 获取页面传递的值
    getLocationData() {
      if (this.$route.query.actId) {
        this.actId = this.$route.query.actId
      }
      if (this.$route.query.organId) {
        this.organId = this.$route.query.organId
      }
      if (this.$route.query.pageId) {
        this.relationId = this.$route.query.pageId
      }
    },
    // 获取移动端数据
    init() {
      if (!this.actId || !this.organId || !this.relationId) {
        return false
      }
      var data = {
        actId: this.actId,
        organId: this.organId,
        relationId: this.relationId
      }
      getIndexInfo(data).then(res => {
        var info = res.data.data.tmplAttrGroup
        // 处理移动端数据
        processMobileData(info, this)
        // 微信分享页时调取
        wxShare(this.shareGroup.shareTitle, this.shareGroup.shareContent, this.shareGroup.shareImg)
      })
    },
    back() {
      this.$router.go(-1)
    },
    processData() {
      setTimeout(() => {
        sendPc('.creditCardContent')
      }, 300)
    },
    // 跳转页面
    breakPage(item) {
      var data = {
        actId: this.actId,
        organId: this.organId,
        relationId: item.targetRelationId
      }
      // 当跳转详情页时处理
      if (item.type === '3') {
        data.skuId = item.targetSkuId
      }
      this.$router.push({ path: item.route, query: data })
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
    }
  }
}
</script>

<style lang="less" scoped>
 .creditCardContent{
   img{
     width: 100%;
     display: block;
   }
   .img-icon{
     height: 20px;
     width: auto;
     display: inline-block;
     vertical-align: center;
     margin-right: 5px;
   }
   .title{
     line-height: 20px;
     vertical-align: top;
     display: inline-block
   }
   .imgLists{
     margin: 0 12px;
     .integralTitle{
        font-size: 18px;
        line-height: 18px;
        font-weight: bold;
        margin-top: 19.4px;
        margin-bottom: 15px;
        .more{
          font-size: 12px;
          color: #3f78f7;
          float: right;
          font-weight: normal;
        }
      }
      img{
        margin-bottom: 10px;
      }
   }
    .nav{
      position: relative;
      width: 350px;
      height: 40px;
      margin: 10px auto 0;
      border-radius: 4px;
      background: #F5F5F5;
      margin-bottom: 10px;
      .indexBtn{
        z-index: 9;
        position: absolute;
        right: 10px;
        top: 7px;
        width: 26px;
        height: 26px;
        border-radius: 40px;
        color: #666666;
        text-align: center;
        line-height: 26px;
        font-size: 18px;
        // background: rgba(0,0,0,.5);
        &.active{
          background: rgba(0,0,0,.3);
        }
      }
      .leftArrow{
        display: block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        img{
          display: inline-block;
          width: 9px;
          vertical-align: middle;
          margin-top: -2px;
        }
      }
      &>span{
        position: absolute;
        display: inline-block;
        right: 22.5px;
        top: 0;
        height: 40px;
        line-height: 40px;
        font-size: 15px;
        color: #444444;
        span{
          color: #ea3232;
        }
      }
    }
     .bottomC{
      // width: 100%;
      height: 83.5px;
      background: #ffffff;
      position: relative;
      font-size: 12px;
      color: #999999;
      margin: 0px 12px;
      line-height: 36px;
      display: flex;
      padding-top: 6.5px;
      a{
        &:first-child{
          width: 172.5px;
          padding-left: 30px;
          line-height: 63px;
          text-align: center;
        }
        &:nth-child(2){
          // position: absolute;
          display: block;
          width: 178.5px;
          img{
            width: 150px;
            height: 63px;
          }
        }
      }
    }
 }
</style>
