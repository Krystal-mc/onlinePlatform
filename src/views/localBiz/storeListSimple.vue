<template>
  <!-- 简易版店铺列表 -->
  <div class="supportStore clearfix">
    <div class="content">
      <div class="nav">
        <form class="searchForm" action="/">
          <van-search
            v-model="goodsName"
            placeholder="请输入商户名或地址关键字"
            show-action
            shape="round"
            @search="onSearch()"
          >
            <div slot="action" class="action" @click="onSearch()">搜索</div>
          </van-search>
        </form>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div class="goods clearfix">
          <ul class="goodsList">
            <van-list
              v-model="loading"
              class="clearfix"
              :finished="finished"
              :offset="100"
              @load="getMerchantList"
            >
              <li v-for="(item,index) in storeList" :key="index">
                <div class="storeList">
                  <a href="javascript:void(0)">
                    <div class="storeInfor">
                      <div class="store-title">
                        <h6>{{ item.name }}</h6>
                        <div class="store-address">{{ item.county }}</div>

                      </div>
                      <div class="store-two">
                        <p>{{ item.addressDetail }}</p>
                        <div class="store-svg" @click="showPhone(item)">
                          <svg-icon slot="icon" class="icon-van" icon-class="storePhone2" />
                        </div>

                      </div>
                      <div class="store-three">
                        <svg-icon slot="icon" class="icon-van" icon-class="address" />
                        <div>
                          800m
                        </div>
                      </div>
                    </div>
                    <div class="store-local" />
                  </a>
                </div>
              </li>
            </van-list>
          </ul>
        </div>
        <!-- <bottom-tip v-show="finished"></bottom-tip> -->
      </van-pull-refresh>
    </div>
    <van-popup v-model="show" position="bottom">
      <div class="popup-phone">
        <p class="title">
          拨打电话
          <van-icon name="cross" @click="show = false" />
        </p>
        <p v-for="(item, index) in storePhone" :key="index" class="phone">
          <a :href="`tel:${item}`">{{ item }}</a>
        </p>

      </div>
    </van-popup>
  </div>
</template>

<script>
import { getAES } from '@/utils'
import $ from 'jquery'
// import { getWxTicket } from '@/api/login'
import { getMerchantList } from '@/api/localBiz'
import BScroll from 'better-scroll'
import { JsApiList } from '@/utils/const'
import { wxShare } from '@/utils/wx'
import wx from 'weixin-js-sdk'

export default {
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
      refreshing: false,
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
      pageFrom: '',
      goodsModel: '',
      rulesShow: false,
      allLoad: false,
      storeList: [
        {
          'addressDetail': '陕西省神木市大柳塔镇后柳塔名优市场金桥购物广场',
          'name': '金桥购物广场',
          'county': '大柳塔',
          'logo': 'https://m.yinfu365.com/ylycFile/public/home/staticImg/jqgwgc.jpg',
          'id': 1,
          goods: [
            { name: '1元购50元超市电子券 1元购50元超市电子券 1元购50元超市电子券' },
            { name: '80元购100元代金券' },
            { name: '80元购110元' }
          ]
        }, {
          'addressDetail': '陕西省榆林市定边镇自立路与献忠路交汇处',
          'name': '享拼团•醉生鲜',
          'county': '定边县',
          'logo': 'https://m.yinfu365.com/ylycFile/public/home/staticImg/xptzsx.jpg',
          'id': 2
        }, {
          'addressDetail': '陕西省榆林市佳县佳芦镇观音楼底',
          'name': '干果水果批零',
          'county': '佳县',
          'logo': 'https://m.yinfu365.com/ylycFile/public/home/staticImg/ggsgpf.jpg',
          'id': 3
        }, {
          'addressDetail': '陕西省榆林市靖边县老车站新华百货大卖场',
          'name': '靖边新百连锁超市有限公司',
          'county': '靖边县',
          'logo': 'https://m.yinfu365.com/ylycFile/public/home/staticImg/xb.png',
          'id': 4
        }, {
          'addressDetail': '陕西省榆林市米脂县治黄西路',
          'name': '万家乐购物超市',
          'county': '米脂县',
          'logo': 'https://m.yinfu365.com/ylycFile/public/home/staticImg/mzwjl.jpg',
          'id': 5
        }, {
          'addressDetail': '陕西省榆林市清涧县岔口车管所旁门面房',
          'name': '清涧县恒安好邻里超市',
          'county': '清涧县',
          'logo': 'https://m.yinfu365.com/ylycFile/public/home/staticImg/hllcs.jpg',
          'id': 6
        }, {
          'addressDetail': '陕西省榆林市绥德县观云阁步行街北口',
          'name': '绥德县新世界购物广场有限公司',
          'county': '绥德县',
          'logo': 'https://m.yinfu365.com/ylycFile/public/home/staticImg/xsjgwgc.jpg',
          'id': 7
        }, {
          'addressDetail': '陕西省榆林市吴堡县宋家川镇新建街',
          'name': '吴堡县祥和购物广场',
          'county': '吴堡县',
          'logo': 'https://m.yinfu365.com/ylycFile/public/home/staticImg/xhgwgc.png',
          'id': 8
        }, {
          'addressDetail': '陕西省榆林市子洲县人民县医院对面',
          'name': '精品水果店',
          'county': '子洲县',
          'logo': 'https://m.yinfu365.com/ylycFile/public/home/staticImg/jpsgd.jpg',
          'id': 9
        }, {
          'addressDetail': '陕西省榆林市横山县汽车站对面',
          'name': '横山县润万家购物广场',
          'county': '横山县',
          'logo': 'https://m.yinfu365.com/ylycFile/public/home/staticImg/hsrwjcs.jpg',
          'id': 10
        }
      ],
      supplierId: '',
      goodsName: '',
      // 展示弹层
      show: false,
      storePhone: '288883，3333233'
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
    if (this.$route.query.supplierId) {
      this.supplierId = this.$route.query.supplierId
    }
    this.storePhone = this.splitPhone(this.storePhone)
  },
  mounted() {
    // this.getMerchantList()
  },
  destroyed() {

  },
  methods: {
    // 分享图
    async share() {
      var img = 'http://khh-test.oss-cn-beijing.aliyuncs.com/developImage/20200711/6687634785575112704.png'
      await wxShare('门店列表', '欢迎查看门店列表', img).then(res => {
        this.flag = true
        wx.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: res => {
            console.log('1')
            console.log(res.latitude)
            console.log(res.longitude)
          },
          cancel: res => {
            console.log(res)
          }
        })
      })
    },
    // 分隔电话号码
    splitPhone(str) {
      str = str.replace(/，/ig, ',')
      return str.split(',')
    },
    // 展示电话
    showPhone(data) {
      this.show = true
    },
    onRefresh() {
      this.page.pageNum = 1
      this.storeList = []
      var self = this
      self.getMerchantList(function() {
        self.finished = false
        self.refreshing = false
      })
    },
    onSearch() {
      this.page.pageNum = 1
      this.storeList = []
      this.getMerchantList()
    },
    gotoDetails(id) {
      this.$router.push({ name: 'supportStoreDetails', params: { id: getAES(id + '') }})
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
    getMerchantList(callback) {
      getMerchantList({
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        supplierId: this.supplierId,
        name: this.goodsName
      }).then(response => {
        if (response.data.code === 200) {
        // this.storeList = response.data.data.merchantList
          if (callback) {
            this.storeList = response.data.data.merchantList.list
          } else {
            this.storeList = this.storeList.concat(response.data.data.merchantList.list)
          }
          this.loading = false
          if (callback) {
            callback()
          }
          if (response.data.data.merchantList.list.length < response.data.data.merchantList.pageSize) {
            this.finished = true
          } else {
            this.page.pageNum++
          }
        }
      })
    },
    activeOverlay(e) {
      $('.image-overlay').addClass('active')
    },
    goto(there, goodsType, id, productType) {
      this.$router.push({ name: there, params: { id: getAES(id + ''), type: getAES(goodsType + '') }, query: { productType: productType, buyType: 2, pageFrom: this.pageFrom }})
    },
    back() {
      this.$router.go(-1)
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
.supportStore{
  background: #F7F8FA;
  height: 100%;
  /deep/ .van-popup{
    overflow: inherit;
  }
  .icon-van{
    font-size: 23px;
    color: #999;
  }
  /deep/ .van-search{
    padding-right: 16px;
      /deep/ .van-cell{
        border-radius: 50px;
        padding-left: 12px;
      }
      .van-field__control{
        font-size: 12px;
      }
      /deep/ .van-search__action{
        display: none;
      }
  }
  &>.content{
    background: #F7F8FA;
    .storeList{
      padding: 10px 15px 0;
      // border-radius: 8px;
        >a{
          height: auto;
          display: block;
          background: #ffffff;
          display: flex;
          padding: 15px;
          border-radius: 8px;
          .storeInfor{
            flex: 1;
            .store-title{
              display: flex;
              justify-content: space-between;
              .store-address{
                color: #999;
                font-size: 14px;
                line-height: 18px;

              }
            }
            .store-two{
              display: flex;
              justify-content: space-between;
              margin-top: 10px;

              .store-svg{
                width: 80px;
                display: inline-block;
                text-align: right;
                padding-right: 10px;
                .icon-van{
                  font-size: 18px;
                }
              }
              p{
              margin: 0;
              font-size: 14px;
              color: #666;
              line-height: 21px;
            }
            }
            h6{
              font-size: 16px;
              margin: 0;
              font-weight: 500;
              color: #323233;
            }
            .store-three{
              padding-top: 10px;
              .icon-van{
                font-size: 14px;
                display: inline-block;
              }
              >div{
                font-size: 11px;
                color: #999;
                display: inline-block;
                margin-left: 8px;

              }
            }
          }
        }
      }
    .nav{
      position: relative;
      width: 100%;
      height: 54px;
      border-radius: 4px;
      background: #ffffff;
      display: flex;
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

      .action{
        width: 53px;
        height: 30px;
        background: #FF7558;
        color: #fefefe;
        text-align: center;
        border-radius: 3px;
        line-height: 30px;
      }
    }
    .return{
      z-index: 100;
      font-size: 14px;
      margin-left: 12px;
      margin-top: 14px;
      svg{
        font-size: 22px;
      }
    }
    .searchForm{
      flex: 1;
    }
  }
}
.popup-phone{
  padding: 20px 20px 20px;
  font-weight: bold;
  .title{
   .van-icon{
     float: right;
   }
  }
  .phone{
    text-align: center;
    padding: 5px 0;
  }

}
</style>
