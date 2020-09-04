<template>
  <div class="goodsList clearfix">
    <div class="top">
      <div v-if="searchShow === 0" class="nav">
        <form class="searchForm" action="/">
          <van-search
            v-model="goodsList.name"
            placeholder="请输入要搜索的商品关键字"
            show-action
            shape="round"
            @search="onSearch()"
          >
            <div slot="action" class="action" @click="onSearch()">搜索</div>
          </van-search>
        </form>
      </div>
      <div v-if="sortShow === 0" class="menu">
        <div class="recommend">
          <a href="javascript:void(0)" :class="classification === '1'?'active':''" @click="recommendClick">综合排序</a>
        </div>
        <div class="sort">
          <a v-if="classification === '1' || classification === '4'" href="javascript:void(0)" @click="sortClick"><span>价格</span><i /></a>
          <a v-if="classification === '2'" href="javascript:void(0)" :class="classification === '2'?'asc':''" @click="sortClick"><span>价格</span><i /></a>
          <a v-if="classification === '3'" href="javascript:void(0)" :class="classification === '3'?'desc':''" @click="sortClick"><span>价格</span><i /></a>
        </div>
        <div class="recommend">
          <a href="javascript:void(0)" :class="classification === '4'?'active':''" @click="screenClick"><span>筛选</span><i /></a>
        </div>
      </div>
    </div>
    <div class="content">
      <van-pull-refresh v-if="columnsNum === 2" v-model="refreshing" @refresh="onRefresh">
        <!-- finished-text="已全部加载完" -->
        <van-list
          v-model="loading"
          class="goodsList clearfix"
          :finished="finished"
          :offset="100"
          :immediate-check="true"
          @load="doList"
        >
          <div v-for="(item,index) in allGoodsList" :key="index" class="twoColumns clearfix">
            <a href="javascript:void(0)" @click="goto(item)">
              <div class="product">
                <img :src="item.skuImg">
              </div>
              <div class="info">
                <h4 class="name">{{ item.skuName }}</h4>
                <p class="price">
                  <span class="goodsPrice"><span>￥</span>{{ item.organSalePrice }}</span>
                  <span class="oldPrice">￥{{ item.organMarketPrice }}</span>
                </p>
              </div>
            </a>
          </div>
        </van-list>
        <div v-if="allGoodsList.length === 0" class="noGoods">
          <div class="icon">
            <svg-icon icon-class="noOrder" />
          </div>
          <div class="text">暂无商品</div>
        </div>
      </van-pull-refresh>
      <van-pull-refresh v-if="columnsNum === 1" v-model="refreshing" @refresh="onRefresh">
        <!-- finished-text="已全部加载完" -->
        <van-list
          v-model="loading"
          class="goodsList clearfix"
          :finished="finished"
          :offset="100"
          :immediate-check="true"
          @load="doList"
        >
          <div v-for="(item,index) in allGoodsList" :key="index" class="oneColumns clearfix">
            <a href="javascript:void(0)" @click="goto(item)">
              <div class="product">
                <img :src="item.skuImg">
              </div>
              <div class="info">
                <h4 class="name">{{ item.skuName }}</h4>
                <!-- batchStatus 是否开启打包售卖（0：关闭，1：开启打包） -->
                <h5 v-if="item.batchStatus === 1" class="intro">{{ item.goodsIntro }}</h5>
                <p class="price">
                  <span class="goodsPrice"><span>￥</span>{{ item.actPrice }}</span>
                  <span v-if="lineActionPriceType==0" class="oldPrice">￥{{ item.organMarketPrice }}</span>
                  <span v-if="lineActionPriceType==1" class="oldPrice">￥{{ item.organSalePrice }}</span>
                </p>
              </div>
            </a>
          </div>
        </van-list>
        <div v-if="allGoodsList.length === 0" class="noGoods">
          <div class="icon">
            <svg-icon icon-class="noOrder" />
          </div>
          <div class="text">暂无商品</div>
        </div>
      </van-pull-refresh>
    </div>
    <van-popup v-model="screeningCriteria" position="right" :style="{ heigth: '100%', width: '76%' }">
      <template>
        <div class="categories">
          <div class="categoriesLi">
            <h5>服务</h5>
            <div class="cont">
              <van-button v-for="(item,index) in serviceProviderList" :key="index" round type="default" class="opBtn" :class="item.check === true ? 'active' : ''" @click="seviceLabel(index)">
                {{ item.name }}
              </van-button>
            </div>
          </div>
          <div class="categoriesLi">
            <h5>价格区间</h5>
            <div class="cont">
              <van-cell-group>
                <van-field v-model="goodsList.salePriceMax" placeholder="最低价" />
                <div class="line" />
                <van-field v-model="goodsList.salePriceMin" placeholder="最高价" />
              </van-cell-group>
            </div>
          </div>
          <div class="btnGrop">
            <van-button round type="default" class="opBtn" @click="filterReset">重置</van-button>
            <van-button round type="info" class="opBtn" @click="screenConfirm">确定</van-button>
          </div>
        </div>
      </template>
    </van-popup>
  </div>
</template>

<script>
import { Tab, Tabs } from 'vant'
import { Icon } from 'vant'
import { Row, Col } from 'vant'
import $ from 'jquery'
import { Button } from 'vant'
import { Search } from 'vant'
import { PullRefresh } from 'vant'
import { Toast } from 'vant'
import { List } from 'vant'
import { Cell } from 'vant'
import { getGoodsList } from '@/api/common'
import { getActInfo } from '@/api/activity'
import { JsApiList } from '@/utils/const'
import mixin from '@/utils/mixin'

export default {
  name: 'GoodsList',
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Icon.name]: Icon,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [Toast.name]: Toast,
    [List.name]: List,
    [Cell.name]: Cell,
    [PullRefresh.name]: PullRefresh,
    [Search.name]: Search
  },
  mixins: [mixin],
  data() {
    return {
      // 划线价显示（0：市场价，1：销售价）
      lineActionPriceType: '',
      // 搜索是否显示
      searchShow: '',
      // 排序是否显示
      sortShow: '',
      // 一行一列还是一行两列
      columnsNum: '',
      classification: '1',
      screeningCriteria: false,
      minPrice: '',
      maxPrice: '',
      JsApiList: JsApiList,
      singleFlag: false,
      list: [],
      refreshing: false,
      loading: false,
      finished: false,
      allGoodsList: [],
      allGoodsList1: [
        {
          skuImg: '',
          skuName: '',
          organSalePrice: '',
          organMarketPrice: ''
        }
      ],
      url: '',
      bankId: '',
      goodsName: '',
      goodsList: {
        // 活动id
        actId: '',
        // 类目ID，指三级类目ID
        categoryId: '',
        // 某列排序(salePrice)
        column: '',
        // 第三方机构编码，从机构表获取，如：京东、云中鹤的机构编码
        externalOrganCode: '',
        // 商品类型（0：实物商品，1：虚拟商品，2：卡券商品）
        goodsType: '',
        // 商品名称
        name: '',
        // 排序方式,可用值:ascend,descend
        orderType: '',
        // 机构ID
        organId: '',
        // 销售价最大
        salePriceMax: '',
        // 销售价最小
        salePriceMin: '',
        // 类目类型，（0：后台类目表，1：品牌表，2：商品sku表）
        type: ''
      },
      serviceProviderList: [
        {
          name: '京东',
          code: 'JD',
          labelFlag: '1',
          check: false
        },
        {
          name: '云中鹤',
          code: 'YZH',
          labelFlag: '2',
          check: false
        }
      ],
      page: {
        // 第几页
        current: 1,
        // 显示条数
        size: 10
      },
      labelFlag: '1'
    }
  },
  computed: {

  },
  created() {
    // 判断是否是ios微信浏览器
    if (window.__wxjs_is_wkwebview === true) {
      this.url = this.$store.getters.url.split('#')[0]
    } else {
      this.url = window.location.href.split('#')[0]
    }
  },
  activated() {
    // this.$route.query.actId && (this.goodsList.actId = this.$route.query.actId)
    // this.$route.query.organId && (this.goodsList.organId = this.$route.query.organId)
    // isUseCache为false时才重新刷新获取数据
    // 目前只是商品详情返回时isUseCache才为true，其他页面到这个页面都重新获取数据
    // if (!this.$route.meta.isUseCache) {
    //   this.classification = '1'
    //   // this.goodsName = ''
    //   this.onRefresh()
    // }
    // 进入这个页面再设置为不缓存，其他页进来需要缓存，在其他页离开时判断
    // this.$route.meta.isUseCache = false
  },
  mounted() {
    this.$route.query.actId && (this.goodsList.actId = this.$route.query.actId)
    this.$route.query.organId && (this.goodsList.organId = this.$route.query.organId)
    // 搜索框是否显示（0的话显示，1的话不显示）
    this.$route.query.searchShow && (this.searchShow = this.$route.query.searchShow - 0)
    // 排序是否显示（0的话显示，1的话不显示）
    this.$route.query.sortShow && (this.sortShow = this.$route.query.sortShow - 0)
    // 商品是一行一列还是一行两列（1的话是一列，2的话是两列）
    this.$route.query.columnsNum && (this.columnsNum = this.$route.query.columnsNum - 0)

    // this.getWxTicket()
    // this.getGoodsList()
    this.getActInfo()
  },
  destroyed() {
  },
  methods: {
    // 获取活动基本信息
    async getActInfo() {
      const res = await getActInfo({
        actId: this.goodsList.actId
      })
      this.lineActionPriceType = res.data.data.lineActionPriceType
    },
    // 筛选条件
    seviceLabel(index) {
      this.serviceProviderList[index].check = !this.serviceProviderList[index].check
      var screenCondition = []
      this.serviceProviderList.forEach(element => {
        if (element.check === true) {
          screenCondition.push(element.code)
        }
      })
      this.goodsList.externalOrganCode = screenCondition.toString()
      this.page.current = 1
      this.allGoodsList = []
      this.getGoodsList(() => {
        this.finished = false
        this.refreshing = false
      })
    },
    doList() {
      var self = this
      self.getGoodsList()
    },
    onSearch() {
      this.page.current = 1
      this.classification = '1'
      this.allGoodsList = []
      var self = this
      self.getGoodsList(function() {
        self.finished = false
        self.refreshing = false
      })
    },
    recommendClick() {
      this.page.current = 1
      this.classification = '1'
      this.goodsList.orderType = ''
      this.goodsList.column = ''
      this.allGoodsList = []
      var self = this
      self.getGoodsList(function() {
        self.finished = false
        self.refreshing = false
      })
    },
    sortClick() {
      this.page.current = 1
      if (this.classification === '1' || this.classification === '4') {
        this.classification = '2'
        this.goodsList.orderType = 'ascend'
      } else if (this.classification === '2') {
        this.classification = '3'
        this.goodsList.orderType = 'descend'
      } else if (this.classification === '3') {
        this.classification = '2'
        this.goodsList.orderType = 'ascend'
      }
      this.allGoodsList = []
      var self = this
      self.getGoodsList(function() {
        self.finished = false
        self.refreshing = false
      })
    },
    screenClick() {
      this.classification = '4'
      this.goodsList.orderType = ''
      this.goodsList.column = ''
      this.screeningCriteria = true
    },
    // 筛选重置
    filterReset() {
      this.serviceProviderList.forEach((element, index) => {
        if (element.check === true) {
          this.serviceProviderList[index].check = false
        }
        element.check === false
      })
      this.goodsList.externalOrganCode = ''
      this.page.current = 1
      this.goodsList.orderType = ''
      this.allGoodsList = []
      var self = this
      self.getGoodsList(function() {
        self.finished = false
        self.refreshing = false
      })
    },
    // 筛选确定
    screenConfirm() {
      this.screeningCriteria = false
      this.classification = '1'
      this.page.current = 1
      this.goodsList.orderType = ''
      this.allGoodsList = []
      var self = this
      self.getGoodsList(function() {
        self.finished = false
        self.refreshing = false
      })
    },
    back() {
      this.$router.go(-1)
    },
    getGoodsList(callback) {
      getGoodsList({
        // 第几页
        current: this.page.current,
        // 显示条数
        size: this.page.size,
        // 活动id
        actId: this.goodsList.actId,
        // 类目ID，指三级类目ID
        categoryId: this.goodsList.categoryId,
        // 某列排序
        column: this.goodsList.column,
        // 第三方机构编码，从机构表获取，如：京东、云中鹤的机构编码
        externalOrganCode: this.goodsList.externalOrganCode,
        // 商品类型（0：实物商品，1：虚拟商品，2：卡券商品）
        goodsType: this.goodsList.goodsType,
        // 商品名称
        name: this.goodsList.name,
        // 排序方式,可用值:ascend,descend
        orderType: this.goodsList.orderType,
        // 机构ID
        organId: this.goodsList.organId,
        // 销售价最大
        salePriceMax: this.goodsList.salePriceMax,
        // 销售价最小
        salePriceMin: this.goodsList.salePriceMin,
        // 类目类型，（0：后台类目表，1：品牌表，2：商品sku表）
        type: this.goodsList.type
      }).then(response => {
        // this.allGoodsList = response.data.data.list
        if (callback) {
          this.allGoodsList = response.data.data.list
        } else {
          this.allGoodsList = this.allGoodsList.concat(response.data.data.list)
        }
        this.loading = false
        if (callback) {
          callback()
        }
        if (response.data.data.list.length < response.data.data.pageSize) {
          this.finished = true
        } else {
          this.page.current++
        }
      })
    },
    onRefresh() {
      this.loading = true
      this.page.current = 1
      this.allGoodsList = []
      var self = this
      self.getGoodsList(function() {
        self.finished = false
        self.refreshing = false
        self.loading = false
      })
    },
    activeOverlay(e) {
      $('.image-overlay').addClass('active')
    }
  }
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
.goodsList{
  background: #F4F4F4;
  height: 100%;
  .categories{
      padding: 55px 16px 82px 16px;
      position: relative;
      overflow: auto;
      min-height: 100%;
      .categoriesLi{
          margin-bottom: 35px;
          h5{
              margin: 0;
              margin-bottom: 16px;
              font-size: 16px;
              color: #333333;
              font-weight: normal;
          }
          .cont{
              display: flex;

              .line{
                  width: 13px;
                  height: 1px;
                  background: #CCCCCC;
                  margin-top: 15px;
                  margin: 15px 20px 0 20px;
              }
              /deep/ .van-cell-group.van-hairline--top-bottom{
                  width: 100%;
                  display: flex;
              }
              /deep/ .van-cell.van-field{
                width: 100px;
                height: 32px;
                line-height: 32px;
                padding: 0 5px;
                background: #F7F8FA;
                border-radius: 20px;
                text-align: center;
                /deep/ .van-field__control{
                    text-align: center;
                }
             }
              .opBtn{
                  height: 32px;
                  font-size: 13px;
                  color: #323232;
                  margin-right: 8px;
              }
               .active{
                  background: #0091FF;
                  color: #ffffff;
              }
          }
      }
      .btnGrop{
          position: absolute;
          bottom: 50px;
          left: 16px;
          .opBtn{
              height: 32px;
              width: 119px;
          }
      }

  }
  .top{
    background: #ffffff;
    .nav{
      position: relative;
      width: 350px;
      height: 40px;
      margin: 0px auto 0;
      border-radius: 4px;
      display: flex;
      padding-top: 5px;
      .action{
        width: 53px;
        height: 30px;
        background: #3f78f7;
        color: #fefefe;
        text-align: center;
        border-radius: 3px;
        line-height: 30px;
      }
    }
    .menu{
      height: 43px;
      margin: 0 30px;
      display: flex;
      >div{
          flex: 1;
        &:last-child{
            text-align: right;
        }
      }
      .recommend{
        height: 43px;
        line-height: 40px;
        display: block;
        float: left;
        font-size: 15px;
        color: #444444;
        position: relative;
        i{
          display: inline-block;
          width: 16px;
          height: 16px;
          background-image: url('../../assets/images/screen.png');
          background-repeat: no-repeat;
          background-position-x: 0;
          background-position-y: -1px;
          background-size: cover;
          margin-left: 7px;
          vertical-align: middle;
        }
        a.active{
            color: #0091FF;
        }
        &.active{
          color: #EA3232;
          &:after{
            content: '';
            position: absolute;
            display: block;
            width: 28.5px;
            height: 2px;
            bottom: 4px;
            color: #EA3232;
          }
        }
      }
      .sort{
        position: relative;
        height: 43px;
        line-height: 40px;
        display: block;
        float: right;
        font-size: 15px;
        color: #444444;
        text-align: center;
        i{
          display: inline-block;
          width: 16px;
          height: 16px;
          background-image: url('../../assets/images/sortIcon.png');
          background-repeat: no-repeat;
          background-position-x: 0;
          background-position-y: -1px;
          background-size: cover;
          margin-left: 7.5px;
          vertical-align: middle;
        }
        a.asc{
          color: #0091FF;
          i{
              background-image: url('../../assets/images/sortAsc.png');
          }
        }
        a.desc{
          color: #0091FF;
          i{
              background-image: url('../../assets/images/sortDesc.png');
          }
        }
        &.asc{
        }
        &.desc{
            background-image: url('../../assets/images/sortDesc.png');
        }
      }
    }
  }
  &>.content{
    width: 100%;
    .ad{
      width: 100%;
      img{
        width: 100%;
        float: left;
      }
    }
      .goodsList{
        padding: 0 15px;
        padding-top: 10px;
        >div.twoColumns{

          &:nth-child(2n) {
            margin-right: 0;
          }
          a{
            background: #ffffff;
            float: left;
            width: 168px;
            height: 270px;
            border-radius: 8px;
            margin-bottom: 10px;
            margin-right: 9px;
            display: block;
            -webkit-tap-highlight-color:initial;
            .product{
              position: relative;
              width: 168px;
              height: 168px;
              background: #F8F8F8;
              text-align: center;
              float: left;
              img{
                width: 100%;
                height: 100%;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
              }
            }
            .info{
              padding: 0 10px;
              text-align: left;
              overflow: hidden;
              .name{
                font-weight: normal;
                font-size: 14px;
                height: 46px;
                line-height: 21px;
                color: #333333;
                margin: 9px 0 14px 0;
                margin-top: 9px;
                display: -webkit-box;
                word-break: break-all;
                text-overflow:ellipsis;
                overflow: hidden;
                white-space: pre-line;
                -webkit-box-orient: vertical;
                -webkit-line-clamp:2;
              }
              .price{
                .goodsPrice{
                  margin-left: 5px;
                  font-size: 20px;
                  color: #FF4444;
                  margin-right: 23px;
                  span{
                      font-size: 14px;
                  }
                }
                .oldPrice{
                    text-decoration: line-through;
                    font-size: 14px;
                    color: #999999;
                }
              }
            }
          }
        }
        >div.oneColumns{
          a{
            width: 100%;
            background: #ffffff;
            border-radius: 8px;
            padding: 15px;
            display: flex;
            position: relative;
            margin-bottom: 10px;
            .product{
              margin-right: 19px;
              img{
                width:103px;
                height: 103px;
              }
            }
            .info{
              .name{
                font-weight: normal;
                font-size: 14px;
                height: 46px;
                line-height: 21px;
                margin-top: 5px;
                color: #333333;
                display: -webkit-box;
                word-break: break-all;
                text-overflow:ellipsis;
                overflow: hidden;
                white-space: pre-line;
                -webkit-box-orient: vertical;
                -webkit-line-clamp:2;
              }
              .intro{
                color: #999999;
                font-weight: normal;
              }
              .price{
                position: absolute;
                bottom: 18px;
                font-size: 20px;
                color: #FF4444;
                .goodsPrice{
                  span{
                    font-size: 14px;
                  }
                }
                .oldPrice{
                  font-size: 14px;
                  color: #999999;
                  margin-left: 24px;
                  text-decoration: line-through;
                }
              }
            }
          }
        }
        /deep/ .van-list__placeholder{
          float: left;
        }
        &:after{
          content: '';
          display: block;
          clear: both;
        }
      }
  }
  .noGoods{
    text-align: center;
    height: 100%;
    padding-top: 120px;
    padding-bottom: 330px;
    .icon{
      width: 90px;
      height: 90px;
      border-radius: 100%;
      background: #E5E5E5;
      margin: 0 auto 15px;
      svg{
        font-size: 32px;
        line-height: 90px;
        height: 90px;
      }
    }
    .text{
      font-size: 13px;
      color: #999999;
    }
  }
  /deep/ .van-popup.van-popup--right{
      height: 100%;
  }
  /deep/ .van-list__finished-text{
    width: 100%;
    float: left;
  }
}
</style>
<style rel="stylesheet/less" lang="less">
.goodsList{
  .van-search{
    background: none!important;
    padding-top: 5px;
  }
  .searchForm{
    flex: 1;
    .van-field__control{
      line-height: inherit;
      padding-top: 2px;
    }
    .van-icon, .van-icon::before{
      margin-top: 1.5px;
    }
    .van-search .van-cell{
      padding: 0rem 0.21333rem 0rem 0;
    }
  }
  .van-search__content{
    height: 30px;
  }
  .van-field__left-icon .van-icon, .van-field__right-icon .van-icon{
    line-height: initial;
  }
  .van-field__left-icon{
    padding-top: 3px;
  }
}
</style>
