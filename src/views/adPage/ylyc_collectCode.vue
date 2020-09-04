<template>
  <!-- 榆林-新客领券 -->
  <div ref="collectCode" class="newGuestCeremony clearfix">
    <div class="content">
      <div class="return">
        <a class="leftArrow" @click="back">
          <img src="http://khh-test.oss-cn-beijing.aliyuncs.com/developImage/20200708/6686459616525553664.png">
        </a>
      </div>
      <div class="code-top">
        <p class="times">活动时间：即日起-{{ content.dateRange }}</p>
        <img :src="img.img1" class="code-bg1" alt="">
      </div>
      <div class="descInfor">
        <div class="info">
          {{ content.info }}
        </div>
      </div>
      <div class="storeList">
        <div class="store-top">
          免费领取
        </div>
        <img class="store-img" :src="img.img2" alt="">
        <img class="store-bottom-img" :src="img.img1" alt="">
        <div class="store-all">
          <!-- <div v-for="(item, index) in content.storeList" :key="index" class="storeItem">
            <div class="store-bold">20元</div>
            <div class="store-bold">{{ item.name }}</div>
            <div class="store-a" @click="supportStore(item.router)">
              支持门店
            </div>
          </div> -->
          <div class="storeItem">
            <div class="store-bold">{{ content.price1 }}元</div>
            <div class="store-bold">{{ content.name1 }}</div>
            <div class="store-a" @click="supportStore(content.router1)">
              支持门店
            </div>
          </div>
          <div class="storeItem">
            <div class="store-bold">{{ content.price2 }}元</div>
            <div class="store-bold">{{ content.name2 }}</div>
            <div class="store-a" @click="supportStore(content.router2)">
              支持门店
            </div>
          </div>
        </div>
      </div>
      <div class="rule">
        <img class="rule-img-top" :src="img.img3" alt="">
        <img class="rule-img-bottom" :src="img.img4" alt="">
        <div class="rule-wraper">
          <div class="rule-wrap">
            <div class="rule-content" v-html="content.rule" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// import { getAES } from '@/utils'
// import $ from 'jquery'
import BScroll from 'better-scroll'
import { JsApiList } from '@/utils/const'
import { sendPc, getPc, processMobileData } from '@/utils'
import { wxShare } from '@/utils/wx'
import { getIndexInfo } from '@/api/common'

export default {
  name: 'NewGuestCeremony',
  data() {
    return {
      JsApiList: JsApiList,
      indexData: {
        unionGoodsList: [],
        homeInfo: {},
        advertiseLockStatus: [],
        integralGoodsList: []
      },
      bankId: '',
      url: '',
      allGoodsList: [],
      loading: false,
      finished: false,
      page: {
        pageNum: 1,
        pageSize: 10,
        totalPage: 0,
        totalRow: 0
      },
      goodsInfoId: '',
      goodsCouponId: '',
      advertiseId: '',
      goodsList: [],
      refreshing: false,
      pageFrom: '',
      goodsModel: '',
      rulesShow: false,
      allLoad: false,
      storeShow: false,
      content: {
        dateRange: '2020年12月31日',
        info: '邮储银行榆林区域，新客户通过线下或PAD进行“华润通”信用卡申请，并成功提交，即可在现场领取“华润万家20元电子券一张”或“精品超市20元电子券一张',
        // storeList: [
        //   {
        //     price: '20',
        //     name: '华润万家电子券',
        //     router: ''
        //   },
        //   {
        //     price: '20',
        //     name: '精品超市电子券',
        //     router: ''
        //   }
        // ],
        price1: 30,
        name1: '华润万家电子券',
        router1: null,
        price2: 50,
        name2: '精品超市电子券',
        router2: null,

        rule: `
        <div style="text-align:center; font-weight: bold; padding: 10px">活动细则</div>
        <p>1、本活动仅限2020年邮储银行榆林地区现场申办“华润通”联名信用卡用户； </p>
        <p>2、活动期间每位客户只能参加一次活动； </p>
        <p>3、新客户必须在现场完成信息填写并提交，即可由工作人员发放电子购物券一张； </p>
        <p>4、活动中涉及的所有电子卡券有效期至2021年3月31日； </p>
        <p>5、票券分为“华润万家”电子券和“县域超市”电子券，两者二选一； </p>
        <p>6、领取成功后的电子券需妥善保存，不予外泄，持卡人收到的电子券码可至对应商户进行核销；</p>
        <p>7、特惠活动，电子券不记名，不开具发票，敬请谅解； </p>
        <p>8、如有疑问，请拨打客服电话:400-109-7717(周一至周五10:00—18:00,周末及节假日9:00—13:00)。</p>`
      },
      bg: {
        bgImg1: 'http://khh-test.oss-cn-beijing.aliyuncs.com/developImage/20200713/6688366540988878848.png',
        bgImg2: 'http://khh-test.oss-cn-beijing.aliyuncs.com/developImage/20200713/6688332765328314368.png',
        bgImg3: 'http://khh-test.oss-cn-beijing.aliyuncs.com/developImage/20200713/6688325405830549504_resize.png',
        bgImg4: '',
        bgImg5: ''
      },
      img: {
        img1: 'http://khh-test.oss-cn-beijing.aliyuncs.com/developImage/20200713/6688367591674613760.png',
        img2: '',
        img3: '',
        img4: ''

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
    if (this.$route.query.pageFrom) {
      this.pageFrom = this.$route.query.pageFrom - 0
    }
    if (this.$route.query.goodsModel) {
      this.goodsModel = this.$route.query.goodsModel
    }
    // 获取页面传递的值
    this.getLocationData()
    // 获取移动端数据
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      // 获取pc端返回的数据
      getPc(this, this.processData)
      // 将页面高度发送到pc端
      sendPc('.newGuestCeremony')
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
        // 控制css
        this.controlCss()
        // 微信分享页时调取
        wxShare(this.shareGroup.shareTitle, this.shareGroup.shareContent, this.shareGroup.shareImg)
      })
    },
    // 处理pc端返回数据
    processData() {
      // 控制css
      this.controlCss()
    },
    // 控制css代码
    controlCss() {
      this.$refs.collectCode.style.setProperty('--bgImg1', `url(${this.bg.bgImg1}) no-repeat`)
      this.$refs.collectCode.style.setProperty('--bgImg2', `url(${this.bg.bgImg2}) no-repeat`)
      this.$refs.collectCode.style.setProperty('--bgImg3', `url(${this.bg.bgImg3}) no-repeat`)
      this.$refs.collectCode.style.setProperty('--bgImg4', `url(${this.bg.bgImg4}) no-repeat`)
      this.$refs.collectCode.style.setProperty('--bgImg5', `url(${this.bg.bgImg5}) no-repeat`)
    },
    supportStore(supplierId) {
      this.$router.push({ name: 'supportStore', query: { supplierId: supplierId }})
    },
    verScroll() {
      // const width = this.indexData.goodsTypeList.length * 106// 动态计算出滚动区域的大小，前面已经说过了，产生滚动的原因是滚动区域宽度大于父盒子宽度
      // this.$refs.cont.style.width = width + 'px' // 修改滚动区域的宽度
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.wrapper, {
            startX: 0, // 配置的详细信息请参考better-scroll的官方文档，这里不再赘述~
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
    back() {
      this.$router.push({ name: 'index1' })
      // this.$router.go(-1)
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
.newGuestCeremony{
  --bgImg1: '';
  --bgImg2: '';
  --bgImg3: '';
  --bgImg4: '';
  --bgImg5: '';

  .content{
    background: var(--bgImg1);
    background-size: 100% 100%;
    width: 100%;
    min-height: 667px;
    height: auto;
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
    .code-top{
      background: var(--bgImg2);
      width: 343px;
      height: 173px;
      position: relative;
      margin: auto;
      .times{
        position: absolute;
        font-size: 11px;
        color: #333333;
        bottom: 30px;
        left: 0;
      }
      .code-bg1{
        position: absolute;
        bottom: 5px;
        left: -15px;
        width: 22px;
        height: auto;
      }
    }
    .descInfor{
      border: 1px solid #000;
      width: 329px;
      padding: 10px;
      background-color: #fee654;
      height: auto;
      position: relative;
      margin: auto;
      .info{
       font-size: 13px;
       color: #333333;
       line-height: 18px;
       padding: 5px;
       text-align: justify;
       border: 1px solid #000;
       background-color: white;
      }
    }
    .storeList{
      width: 329px;
      position: relative;
      margin: auto;
      padding-top: 15px;
      height: auto;
      .store-top{
        width: 83px;
        height: 102px;
        position: absolute;
        top: 15px;
        left: 20px;
        background: var(--bgImg3);
        background-size: cover;
        font-weight: bold;
        padding: 32px 19px 0 22px;
        text-align: center;
        font-size: 20px;
        z-index: 3;
      }
      .store-img{
        width: 53px;
        height: 71px;
        position: absolute;
        right: -20px;
        top: 24px;
        z-index: 1;
      }
      .store-bottom-img{
        width: 29px;
        height: 54px;
        position: absolute;
        right: 0;
        bottom: 10px;
        z-index: 3;
      }
      .store-all{
        margin-top: 70px;
        position: relative;
        height: auto;
        z-index: 2;
        // overflow: hidden;
      }
      .storeItem{
      width: 260px;
      height: 140px;
      padding: 20px 25px;
      text-align: center;
      &:nth-child(even) {
        background: var(--bgImg4);
        float: left;
        background-size: 100% 100%;

      }
      &:nth-child(odd) {
        background: var(--bgImg5);
        float: right;
        background-size: 100% 100%;
      }
      div{
        width: 100%;
      }
      .store-bold{
        font-size: 18px;
        font-weight: bolder;
        padding: 5px 0;
      }
      .store-a{
        font-size: 14px;
        margin-top: 15px;
        width: 120px;
        background-color: #f8df46;
        position: relative;
        margin: auto;
        border-radius: 50px;
        height: 20px;
        line-height: 1.5;
      }
      }
      .store-all:after{
        clear: both;
        content: '';
        display: block;
      }
    }
    .rule{
      position: relative;
      .rule-img-top{
        position: absolute;
        width: 62px;
        height: 84px;
        top: -40px;
        left: 0;
      }
      .rule-img-bottom{
        position: absolute;
        width: 110px;
        height: 98px;
        bottom: -40px;
        right: 20px;
      }
      .rule-wraper{
        margin: 40px 0;
      }
      .rule-wrap{
        border: 1px solid #000;
        width: 329px;
        padding: 10px;
        background-color: #fee654;
        height: auto;
        position: relative;
        margin: auto;
        .rule-content{
          border: 1px solid #000;
          background-color: white;
          padding: 5px;
          font-size: 14px;
          color: #333;
        }
      }
    }
  }

}
</style>
