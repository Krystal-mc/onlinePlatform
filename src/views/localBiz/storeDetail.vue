<template>
  <!-- 店铺详情页 -->
  <div class="store-detail">
    <div class="content">
      <div class="store-wrap">
        <!-- 头部轮播图 -->
        <div class="topSwipeContainer">
          <van-swipe class="topSwipe" :autoplay="5000" :duration="800">
            <van-swipe-item v-for="(item) in detail.images" :key="item.advertiseId">
              <a href="javascript:void(0)">
                <!-- <div class="slideImg" :style="{backgroundImage: 'url(' + item.imgPath + ')'}" @tap="activeOverlay" /> -->
                <img :src="item">
              </a>
            </van-swipe-item>
          </van-swipe>
        </div>
        <!-- 门店详情 -->
        <div class="store-info">
          <h2>
            {{ detail.name }}
          </h2>
          <p>
            <span class="color-blue">
              {{ detail.area }} | {{ detail.categoryName }}
            </span>
            <span class="color-km">
              距您：{{ detail.distance }}
            </span>
          </p>
          <div class="gps" @click="goMap">
            <svg-icon slot="icon" class="icon-van" icon-class="address" />
            <span class="gps-address">{{ detail.address }}</span>
            <span class="gps-right">
              <svg-icon slot="icon" class="icon-van" icon-class="storeMap" />
              <span>地图</span>
            </span>

          </div>
          <div class="gps">
            <svg-icon slot="icon" class="icon-van" icon-class="timeStore" />
            <span class="gps-address">{{ detail.openTime }}</span>
            <span class="gps-right">
              <svg-icon slot="icon" class="icon-van" icon-class="storePhone" />
              <span>电话</span>
            </span>

          </div>
        </div>
      </div>

      <!-- 商品推荐 -->
      <div class="goods">
        <div class="goods-title">
          <span>推荐</span>
        </div>
        <ul class="goodsList">
          <!-- <van-list
            v-model="loading"
            class="clearfix"
            :finished="finished"
            :offset="offset"
            @load="getMerchantList"
          >
           </van-list> -->
          <li v-for="(item,index) in goodsList" :key="index">
            <div class="storeList">
              <a href="javascript:void(0)">
                <img :src="item.logo">
                <div class="storeInfor">
                  <h6>{{ item.name }}</h6>
                  <p>{{ item.addressDetail }}</p>
                  <div class="store-three">
                    <div class="price-active">
                      <span>￥</span> <span>{{ item.activePrice }}</span>
                    </div>
                    <div class="price-market">
                      ￥{{ item.marketPrice }}
                    </div>
                  </div>
                  <div class="store-four">
                    <svg-icon slot="icon" class="icon-van" icon-class="storeLw" />
                    <span>{{ item.activeName }} </span>

                  </div>

                </div>
              </a>
            </div>
          </li>
        </ul>
        <div class="find-more">
          <span>查看更多</span>
          <van-icon name="arrow-down" />
        </div>
      </div>
      <div>
        <div class="introduce">
          <h3 class="introduce-h3">商户介绍</h3>
          <div v-html="detail.intro" />
        </div>

      </div>

    </div>

  </div>
</template>
<script>
import { getMerchantList } from '@/api/localBiz'
import { sendPc } from '@/utils'
import { wxShare } from '@/utils/wx'
import wx from 'weixin-js-sdk'

export default {
  data() {
    return {
      detail: {
        name: '家乐福超市',
        area: '高新二路',
        categoryName: 'ktv',
        distance: '2.3km',
        address: '陕西省榆林市子洲县第一中学南500米第一中学男500米',
        openTime: '周一至周五8：00-21：00，周末及节假日7：30-23：00',
        telephone: '18500394578',
        images: [
          'https://m.yinfu365.com/ylycFile/public/advertise/202006/2020062923095922625c91b7d01840.png',
          'https://m.yinfu365.com/ylycFile/public/advertise/202006/20200630144350056b1ab00147019207.png'
        ],
        intro: '',
        lng: '108.880615',
        lat: '34.232014'
      },
      goodsList: [
        {
          'addressDetail': '陕西省神木市大柳塔镇后柳塔名优市场金桥购物广场',
          'name': '金桥购物广场',
          'county': '大柳塔',
          'logo': 'https://m.yinfu365.com/ylycFile/public/home/staticImg/jqgwgc.jpg',
          'id': 1,
          'activePrice': 1,
          'marketPrice': '88',
          'activeName': '工会首刷大礼包',
          'introduce': ''
        },
        {
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
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 5,
        totalPage: 0,
        totalRow: 0
      },
      // 是否处于加载状态，加载过程中不触发load事件
      loading: false,
      // 是否已加载完成，加载完成后不再触发load事件
      finished: false,
      // 滚动条与底部距离小于 offset 时触发load事件
      offset: 0,
      // 判断wx是否挂载上
      flag: false
    }
  },
  created() {
    this.share()
  },
  mounted() {
    this.$nextTick(() => {
      // 获取pc传值
      this.getPcData()
      // 将页面高度发送到pc端
      sendPc('.store-detail')
    })
  },
  methods: {
    // 分享图
    share() {
      var img = ''
      if (this.detail.images.length > 0) {
        img = this.detail.images[0]
      }
      wxShare(this.detail.name, this.detail.address, img).then(res => {
        this.flag = true
      })
    },
    // 获取pc端传值
    getPcData() {
      window.addEventListener('message', event => {
        if (event && event.data && event.data.sendData) {
          const receiveData = event.data.sendData
          console.log(receiveData)
          this.detail = receiveData
          this.detail.distance = '5km'
        }
      })
    },
    // 进入地图
    goMap() {
      if (this.flag) {
        wx.openLocation({
          latitude: this.detail.lat,
          longitude: this.detail.lng,
          scale: 18
        })
      }
    },
    // 获取数据
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
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
p{
  padding: 0;
  margin: 0;
}
.store-detail{
  background: #f2f2f2;
  margin: 0;
  padding: 0;
  font-family:PingFangSC-Medium,PingFang SC;
  .content{
    padding-bottom: 110px;
    width: 100%;
    background: #f2f2f2;
    padding: 10px 15px;
    .store-wrap{
      background: white;
      padding: 10px 15px;
    }
    .topSwipeContainer{
      width: 100%;
      height: 140px;
      margin-bottom: 10px;

      .topSwipe{
        z-index: 1;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        border-radius: 8px;
        img{
          width: 100%;
          height: 140px;
          border-radius: 8px;
        }
      }
    }
    // 店铺详情
    .store-info{
      >p{
        font-size: 14px;
        color: #444;
        display: flex;
        justify-content: space-between;
        padding: 4px 0 24px 0;
        font-size: 11px;
        .color-blue{
          color: #0091FF;
          font-weight:400;
          line-height:14px;
        }
        .color-km{
          color: #999;
        }
      }
      &>h2{
        font-size: 20px;
        font-weight: 500;
        color:rgba(50,50,51,1);
        line-height:20px;
        padding: 10px 0;
        margin: 0;
        font-family:PingFangSC-Medium,PingFang SC;
      }
      .gps{
        display: flex;
        font-size: 14px;
        color: #444;
        margin-bottom: 20px;
        .icon-van{
          width: 30px;
          font-size: 16px;
          margin-top: 5px;
        }
        .gps-address{
          flex: 1;
          font-size: 14px;
          line-height: 21px;
          color:rgba(102,102,102,1);
          word-break:break-all;

          // margin-left: 10px;
        }
        .gps-right{
          width: 61px;
          padding-left: 10px;
          line-height: 20px;
          vertical-align: top;
          text-align: center;
          span{
            display: block;
          }
          .icon-van{
            font-size: 18px;

          }

        }

      }
    }
    // 商品列表
    .goods{
      margin-top: 10px;
      background-color: white;
      padding: 10px 15px;
      .goods-title{
        font-size: 16px;
        color: #333333;
        span{
          display: inline-block;
          vertical-align: top;
          line-height: 18px;
        }
      }
      .goodsList{
        .storeList{
        >a{
          height: auto;
          display: block;
          background: #ffffff;
          display: flex;
          padding: 15px 0;
          img{
            width: 103px;
            height: 103px;
            margin-right: 15px;
            border-radius: 4px;
          }
          .storeInfor{
            flex: 1;
            h6{
              font-size: 14px;
              margin: 0;
              font-weight: 500;
              line-height: 20px;
              span{
                font-size: 14px;
                color: #0091FF;
                float: right;
              }
            }
            p{
              margin: 0;
              font-size: 11px;
              line-height:15px;
              color: #666666;
              margin-top: 8px;
            }
            .store-three{
              padding-top: 5px;
              padding-bottom: 5px;
              >div{
                font-size: 14px;
                display: inline-block;
                padding-right: 15px;
              }
              .price-active{
                color: #FF4444;
                span:nth-child(1) {
                  font-size: 14px;
                }
                span:nth-child(2) {
                  font-size: 23px;
                  font-weight: bold;
                }
              }
              .price-market{
                text-decoration: line-through;
                font-size: 14px;
                color: #999;
              }

            }
            .store-four{
              font-size: 11px;
              color: #F7B500;
              padding:5px 0 0 0;
              span{
                vertical-align: top;
                display: inline-block;
                padding-top: 2px;
              }
              .icon-van{
                font-size: 16px;
              }

            }
            .store-ticket{
              padding:2px 0;
              width: 255px;
              display: flex;
              >img{
                width: 20px;
                height: 20px;
              }
              span{
                font-size: 14px;
                color: #888;
                vertical-align: top;
                display: inline-block;
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
      }
    }
    .find-more{
      text-align: center;
      font-size: 14px;
      color: #323233;
      padding: 10px 0;
      line-height: 18px;
      span{
        vertical-align: top;
      }

    }
    .introduce{
      padding: 10px 15px;
      background-color: white;
      margin-top: 10px;
      .introduce-h3{
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
        padding: 10px 0;
      }
    }

  }
}
</style>
