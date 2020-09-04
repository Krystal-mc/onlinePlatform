<template>
  <div class="goods">
    <div class="goods-img">
      <a class="indexBtn" @click="gotoIndex">
        <svg-icon icon-class="index" />
      </a>
      <van-swipe ref="goodsSwipe" class="goods-swipe" :autoplay="3000" @change="onChange">
        <van-swipe-item v-for="thumb in skuImgList" :key="thumb.path">
          <img v-if="goods.externalOrganCode === 'JD'" fit="cover" :src="thumb.path" preview="0">
          <img v-else fit="cover" :src="thumb.imgPath" preview="0">
        </van-swipe-item>
        <template #indicator>
          <div class="indicator_wrap">
            <span>{{ current + 1 }}</span> / {{ skuImgList.length }}
          </div>
        </template>
      </van-swipe>
    </div>

    <div class="goods-info">
      <div class="price">
        <div>
          <span class="small">¥ </span><span class="big">{{ goods.actPrice }}</span>
        </div>
        <span v-if="actInfo.lineActionPriceType === 0">¥ {{ goods.marketPrice }}</span>
        <span v-if="actInfo.lineActionPriceType === 1">¥ {{ goods.salePrice }}</span>
      </div>
      <h2 class="name">
        {{ goods.skuName }}<span v-if="goods.batchStatus === 1">({{ goods.goodsIntro }})</span>
      </h2>
      <h3 class="intro">
        {{ goods.intro }}
      </h3>
    </div>

    <van-cell-group class="goods-discount">
      <van-cell>
        <div class="title">活动优惠</div>
      </van-cell>
      <van-cell>
        <div class="content van-ellipsis">
          {{ goods.discountIntro }}
        </div>
        <div class="rule" @click="ruleShow = true">
          <svg-icon icon-class="question" />
          活动细则
        </div>
      </van-cell>
    </van-cell-group>

    <van-cell-group v-if="goods.skuComponent !== '' && goods.externalOrganCode === 'JD'" class="goods-sku">
      <van-cell v-if="goods.skuComponent !== ''" class="selSku" @click="skuShow = true">
        <div class="title">已选</div>
        <svg-icon class="icon" icon-class="more" />
        <p class="van-multi-ellipsis--l2">{{ goods.selectedAttr }}，{{ goodsNum }}件</p>
      </van-cell>
      <van-cell v-if="goods.externalOrganCode === 'JD'" class="sendArea" @click="selAddressShow = true">
        <div class="title">送至</div>
        <svg-icon class="icon" icon-class="more" />
        <div class="expressInfo">
          <p class="expressAddress van-ellipsis"><svg-icon icon-class="gps" />{{ expressAddress }}</p>
          <p class="postNotice">
            <span class="status">{{ stockStateDesc }}</span>
            <span class="postTip" v-html="postTip" />
          </p>
        </div>
      </van-cell>
    </van-cell-group>

    <div class="goods-details">
      <template v-if="introductionFlag">
        <h2>商品详情</h2>
        <div class="content" v-html="goods.introduction" />
      </template>
      <template v-if="paramFlag">
        <h2>规格参数</h2>
        <div class="content param" v-html="goods.param" />
      </template>
      <template v-if="packFlag">
        <h2>包装清单</h2>
        <div class="content pack" v-html="goods.pack" />
      </template>
      <van-divider class="bottomTip">我是有底线的</van-divider>
    </div>

    <van-goods-action v-if="!noGoods" class="goodsAction">
      <!-- <van-goods-action-icon icon="chat-o" @click="sorry">
        客服
      </van-goods-action-icon>
      <van-goods-action-icon icon="cart-o" @click="onClickCart">
        购物车
      </van-goods-action-icon>
      <van-goods-action-button type="warning" @click="sorry">
        加入购物车
      </van-goods-action-button> -->

      <!-- 无购物车购买 -->
      <div class="normalGoodsAction">
        <van-goods-action-button v-if="buyStatus === true" :loading="posNum < 2" class="payBtn" type="info" @click="buy">
          <template v-if="goods.actPrice === 0">免费领取</template>
          <template v-else>立即购买</template>
        </van-goods-action-button>
        <van-goods-action-button v-if="buyStatus === false" class="payBtn" type="info" disabled>
          <!-- 卡唤唤已删除 -->
          <template v-if="goods.deleteStatus">{{ HasDelete }}</template>
          <!-- 卡唤唤下架 -->
          <template v-else-if="!goods.saleStatus">{{ OffShelf }}</template>
          <!-- 京东不可售 -->
          <template v-else-if="!jdSaleState">{{ NoSale }}</template>
          <!-- 京东下架 -->
          <template v-else-if="!jdShelvesState">{{ OffShelf }}</template>
          <!-- 京东无库存 -->
          <template v-else-if="noStock">{{ NoStock }}</template>
          <!-- ip或者gps不满足 -->
          <template v-else-if="!ipFlag || !gpsFlag">{{ NotInLimitArea }}</template>
        </van-goods-action-button>
      </div>
    </van-goods-action>

    <!-- 活动细则弹窗 -->
    <k-popup v-model="ruleShow">
      <div slot="text" class="ruleText">
        <h3>活动细则</h3>
        <div v-html="goods.discountRule" />
      </div>
    </k-popup>

    <!-- 多规格sku选择弹窗 -->
    <van-sku
      v-if="goods.skuComponent !== ''"
      ref="sku"
      v-model="skuShow"
      class="sku"
      :sku="goods.skuComponent.sku"
      :goods="skuImg"
      :goods-id="goods.skuComponent.goods_id"
      :show-add-cart-btn="false"
      :hide-stock="true"
      :initial-sku="initialSku"
      :show-soldout-sku="false"
      stepper-title="数量"
      @buy-clicked="onBuyClicked"
      @sku-selected="onSkuSelected"
      @stepper-change="onStepperChange"
    >
      <!-- 自定义sku-header -->
      <template #sku-header="props">
        <div class="van-sku-header van-hairline--bottom">
          <div class="van-image van-sku-header__img-wrap">
            <img :src="skuImg.picture" class="van-image__img" style="object-fit: cover;" @click="props.skuEventBus.$emit('sku:previewImage')">
          </div>
          <div class="van-sku-header__goods-info">
            <div class="van-sku__goods-price"><span class="van-sku__price-symbol">￥</span><span class="van-sku__price-num">{{ props.price }}</span>
            </div>
            <div class="van-sku-header-item">{{ skuSelectedText }}，{{ props.selectedNum }}件</div>
          </div>
        </div>
      </template>
      <template #sku-actions="props">
        <div class="van-sku-actions">
          <!-- 无购物车购买 -->
          <div class="normalSkuAction">
            <!-- 直接触发 sku 内部事件，通过内部事件执行 onBuyClicked 回调 -->
            <van-button
              v-if="buyStatus === true"
              square
              size="large"
              type="info"
              @click="props.skuEventBus.$emit('sku:buy')"
            >
              确定
            </van-button>
            <van-button
              v-if="buyStatus === false"
              square
              size="large"
              type="info"
              disabled
            >
              <!-- 卡唤唤已删除 -->
              <template v-if="goods.deleteStatus">{{ HasDelete }}</template>
              <!-- 卡唤唤下架 -->
              <template v-else-if="!goods.saleStatus">{{ OffShelf }}</template>
              <!-- 京东不可售 -->
              <template v-else-if="!jdSaleState">{{ NoSale }}</template>
              <!-- 京东下架 -->
              <template v-else-if="!jdShelvesState">{{ OffShelf }}</template>
              <!-- 京东无库存 -->
              <template v-else-if="noStock">{{ NoStock }}</template>
              <!-- ip或者gps不满足 -->
              <template v-else-if="!ipFlag || !gpsFlag">{{ NotInLimitArea }}</template>
            </van-button>
          </div>
        </div>
      </template>
    </van-sku>

    <!-- 收货地址选择弹窗 -->
    <van-popup v-model="selAddressShow" :safe-area-inset-bottom="true" round closeable position="bottom" class="selAddress">
      <h2>选择收货地址</h2>
      <div class="addressList">
        <van-radio-group v-model="selAddressId" @change="addressChange">
          <van-cell-group>
            <van-cell v-for="address in addressList" :key="address.id" :title="address.fullAddress" clickable @click="onAddressClick(address)">
              <template #icon>
                <van-radio :name="address.id" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="btn">
        <van-button type="info" block round @click="gotoAddressManage">管理收货地址</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
// TODO 卡券商品详情是否要加适用门店的跳转链接
// TODO 活动相关的限制有哪些需要在前端控制，需要打开编辑活动页面一个一个过
// 1.活动预告
// 2.划线价显示
// 3.支付方式
// 4.每人限购？
// 5.收货地址/自提
// TODO 自提商品的详情，榆林工会大礼包米面油 https://m.yinfu365.com/ylyc/goods/goodsDetails/36a13752a91fb98624396b8a8f359617/e137d0261653faa9dfd9867b324164e6?buyType=2&moduleId=0&bankId=&goodsClassification=1&pageFrom=4&productType=1&type=single&source=4
// TODO 活动相关模板页也需要调getActInfo接口
import _ from 'lodash'
import { goodsDetails, getSkuImgList, getNewStockAndPromiseTips, getSkuCheck, getSkuState, getIntroduction } from '@/api/goods'
import { getActInfo } from '@/api/activity'
import KPopup from '@/components/KPopup'
import { wxShare } from '@/utils/wx'
import { isLogin, inLimitArea, isWeiXin, getCurrentPosition } from '@/utils'
import { DefaultAddress, NoStock, NoSale, OffShelf, HasDelete, NotInLimitArea } from './const'
import { getGps, getIp, getHomeAttr, getActIndexPage } from '@/api/common'
import { getUserAddressList } from '@/api/my'
import wx from 'weixin-js-sdk'
import {
  Sku,
  Divider,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton
} from 'vant'

export default {
  name: 'GoodsDetails',
  components: {
    KPopup,
    [Sku.name]: Sku,
    [Divider.name]: Divider,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton
  },

  data() {
    return {
      NotInLimitArea,
      NoStock,
      NoSale,
      OffShelf,
      HasDelete,
      // 用户选择的地址ID
      selAddressId: '',
      // 用户收货地址列表
      addressList: [],
      selAddressShow: false,
      // 京东库存状态描述
      stockStateDesc: '',
      // 京东商品预计送达信息
      postTip: '',
      // 京东商品预计送达时间所需用户收货地址
      expressAddress: '',
      // sku组件中已选的文字
      skuSelectedText: '',
      // 商品数量
      goodsNum: 1,
      initialSku: {},
      skuImg: {
        picture: ''
      },
      skuShow: false,
      ruleShow: false,
      // 当前轮播图索引
      current: '',
      // 轮播图
      skuImgList: [],
      actId: '',
      skuId: '',
      storageId: '',
      organId: '',
      goods: {
        introduction: '',
        param: '',
        pack: '',
        // 卡唤唤上下架状态
        saleStatus: 1,
        // 卡唤唤删除状态
        deleteStatus: 0,
        actPrice: '',
        skuComponent: {
          sku: {
            tree: [],
            list: []
          }
        }
      },
      // 京东商品可售性状态：	是否可售：1->是，0->否
      jdSaleState: 1,
      // 京东商品上下架状态：1->上架，0->下架
      jdShelvesState: 1,
      // 京东商品是否无货(true无货，false有货)
      noStock: false,
      noGoods: false,
      // 活动信息
      actInfo: {
        // 划线价显示（0：市场价，1：销售价）
        lineActionPriceType: ''
      },
      // ip是否满足
      ipFlag: true,
      // gps是否满足
      gpsFlag: true,
      // gps和ip是否都请求完成的flag
      posNum: 0,
      // 当前机构首页路径
      homeUrl: '',
      // 单规格商品初始商品数量
      goodsCount: 1
    }
  },
  computed: {
    // 轮播图路径数组
    skuImgPathArr() {
      var arr = []
      this.skuImgList.forEach(item => {
        arr.push(item.path)
      })
      return arr
    },
    // 商品购买状态
    buyStatus() {
      // 京东商品
      // 京东可售性 && 京东上下架 && 卡唤唤上下架 && 卡唤唤删除 && 京东库存
      if (this.goods.externalOrganCode === 'JD') {
        return !!(this.jdSaleState && this.jdShelvesState && this.goods.saleStatus && !this.goods.deleteStatus && !this.noStock && this.ipFlag && this.gpsFlag)
      } else {
        return !!(this.goods.saleStatus && !this.goods.deleteStatus && this.ipFlag && this.gpsFlag)
      }
    },
    // 商品详情
    introductionFlag() {
      return this.goodsTextFlag(this.goods.introduction)
    },
    // 规格参数
    paramFlag() {
      return this.goodsTextFlag(this.goods.param)
    },
    // 包装清单
    packFlag() {
      return this.goodsTextFlag(this.goods.pack)
    }
  },
  created() {

  },
  async mounted() {
    this.$route.query.actId && (this.actId = this.$route.query.actId)
    this.$route.query.skuId && (this.skuId = this.$route.query.skuId)
    this.$route.query.organId && (this.organId = this.$route.query.organId)
    this.$route.query.storageId && (this.storageId = this.$route.query.storageId)
    this.getHomeAttr()
    await this.getActInfo()
    this.getIp()
    this.getGoodsDetails(this.skuId, this.storageId, 'init')
    // sku组件中已选的文字，从sku组件的计算属性获取
    this.$refs.sku && (this.skuSelectedText = this.$refs.sku.selectedText)
  },
  methods: {
    goodsTextFlag(str) {
      var flag = true
      if (str === '') {
        flag = false
      }
      if (str.indexOf('<body>') !== -1) {
        if (str.substring(str.indexOf('<body>') + 6, str.indexOf('</body>')).trim() === '') {
          flag = false
        }
      }
      return flag
    },
    gotoIndex() {
      this.$router.push({ path: this.homeUrl })
    },
    // 获取首页地址
    getHomeAttr() {
      getHomeAttr({ organId: this.organId }).then(res => {
        this.homeUrl = res.data.data.url
        if (this.homeUrl === '') {
          this.getActIndexPage()
        }
      })
    },
    // 根据活动Id获取对应首页
    getActIndexPage() {
      getActIndexPage({ actId: this.actId }).then(res => {
        this.homeUrl = res.data.data.url
      })
    },
    buy() {
      // 多规格商品
      if (this.goods.skuComponent !== '') {
        this.skuShow = true
      } else {
        // 单规格
        var query = {
          organId: this.organId,
          actId: this.actId,
          storageId: this.storageId,
          externalOrganCode: this.goods.externalOrganCode,
          externalSkuId: this.goods.externalSkuId,
          goodsCount: this.goodsCount,
          goodsId: this.goods.goodsId,
          goodsType: this.goods.goodsType,
          skuId: this.skuId,
          addressId: this.selAddressId
        }
        this.$router.push({ name: 'ConfirmOrder', query: query })
      }
    },
    // 点击购买回调
    // TODO 点击购买时再次验证地理位置等
    onBuyClicked(buyObj) {
      console.log(buyObj)
      console.log(this.$refs.sku.selectedText)
      var query = {
        organId: this.organId,
        actId: this.actId,
        storageId: buyObj.selectedSkuComb.storageId,
        externalOrganCode: buyObj.selectedSkuComb.externalOrganCode,
        externalSkuId: buyObj.selectedSkuComb.externalSkuId,
        goodsCount: buyObj.selectedNum,
        goodsId: this.goods.goodsId,
        goodsType: this.goods.goodsType,
        skuId: buyObj.goodsId,
        addressId: this.selAddressId
      }
      this.$router.push({ name: 'ConfirmOrder', query: query })
    },
    // 通过IP获取用户位置
    getIp() {
      getIp().then(res => {
        this.posNum++
        this.ipFlag = inLimitArea(res.data.result.ad_info.adcode, this.actInfo.ipAddress)
      }).catch(res => {
        this.getPosFail('ip')
      })
    },
    // 获取京东商品详情
    getIntroduction(skuId) {
      getIntroduction({
        skuId: skuId
      }).then(res => {
        this.goods.introduction = res.data.data.nappintroduction
        this.goods.param = res.data.data.param
        this.goods.pack = res.data.data.wareQD
        // 处理京东和云中鹤商品详情显示
        this.$nextTick(function() {
          if (document.querySelector('.ssd-module-wrap')) {
            var pcRate = document.querySelector('html').offsetWidth / document.querySelector('.ssd-module-wrap').offsetWidth
            document.querySelector('.ssd-module-wrap').style.zoom = pcRate < 1 ? pcRate : ''
          }
          if (document.querySelector('.ssd-module-mobile-wrap')) {
            var mobiRate = document.querySelector('html').offsetWidth / document.querySelector('.ssd-module-mobile-wrap').offsetWidth
            document.querySelector('.ssd-module-mobile-wrap').style.zoom = mobiRate < 1 ? mobiRate : ''
          }
        })
      })
    },
    // 根据skuId获取京东商品上下架状态
    getSkuState(skuId) {
      getSkuState({
        skuId: skuId
      }).then(res => {
        this.jdShelvesState = res.data.data.list[0].state
      })
    },
    // 根据skuId获取京东商品可售性状态
    getSkuCheck(skuId) {
      getSkuCheck({
        skuId: skuId
      }).then(res => {
        this.jdSaleState = res.data.data.list[0].saleState
      })
    },
    // 跳转地址管理
    gotoAddressManage() {
      this.$router.push({ name: 'AddressManage' })
    },
    // 地址列表item点击事件
    onAddressClick(item) {
      this.selAddressId = item.id
      this.selAddressShow = false
    },
    // 切换收获地址
    addressChange(name) {
      var defaultAddressIndex = this.addressList.findIndex(function(value, index, arr) {
        return value.id === name
      })
      if (defaultAddressIndex !== -1) {
        this.expressAddress = this.addressList[defaultAddressIndex].fullAddress
        this.getNewStockAndPromiseTips()
      }
    },
    // 查询商品库存和预计送达时间
    getNewStockAndPromiseTips() {
      getNewStockAndPromiseTips({
        externalSkuId: this.goods.externalSkuId,
        num: this.goodsNum,
        userAddress: this.expressAddress
        // userAddress: '陕西西安市雁塔区丈八沟街道丈八四路罗马景福城5号楼菜鸟驿站'
      }).then(res => {
        var resData = res.data.data
        this.postTip = resData.promiseTipsMsg
        this.stockStateDesc = resData.stockStateDesc
        resData.stockStateId === 33 && (this.stockStateDesc = '现货')
        resData.stockStateId === 39 && (this.stockStateDesc = '在途')
        resData.stockStateId === 40 && (this.stockStateDesc = '可配货')
        if (resData.stockStateId !== 33 && resData.stockStateId !== 39 && resData.stockStateId !== 40) {
          this.noStock = true
        } else {
          this.noStock = false
        }
      })
    },
    // 防抖 查询商品库存和预计送达时间
    debounceGetNewStockAndPromiseTips: _.debounce(function() {
      this.getNewStockAndPromiseTips()
    }, 300),
    // 购买数量变化时触发
    onStepperChange(num) {
      // 购买数量变化时更新.goods-sku中已选的数量
      this.goodsNum = num
      // 购买数量变化时，需要重新调用getNewStockAndPromiseTips
      if (this.goods.externalOrganCode === 'JD') {
        this.debounceGetNewStockAndPromiseTips()
      }
    },
    // 切换规格类目时触发
    onSkuSelected(obj) {
      // 切换规格类目时，更新已选商品的提示
      this.skuSelectedText = this.$refs.sku.selectedText
      if (obj.selectedSkuComb && this.skuId !== obj.selectedSkuComb.id) {
        // 重新调接口
        this.getGoodsDetails(obj.selectedSkuComb.id, obj.selectedSkuComb.storageId, 'change', obj.selectedSkuComb.externalSkuId)
      }
      // 规格类目切换后，将页面存储的skuId变为切换后的skuId
      this.skuId = obj.selectedSkuComb ? obj.selectedSkuComb.id : ''
    },
    // 获取活动基本信息
    async getActInfo() {
      const res = await getActInfo({
        actId: this.actId
      })
      this.actInfo = res.data.data
      // 判断活动状态
      if (this.actInfo.status === 1 && this.actInfo.actNotice === 1) {
        this.$router.replace({ name: 'ActivityNotice', query: { showActivityNotice: 'wait' }})
      } else if (this.actInfo.status === 4 || this.actInfo.status === 3) {
        this.$router.replace({ name: 'ActivityNotice', query: { showActivityNotice: 'over' }})
      }
    },
    // 获取轮播图
    getSkuImgList(skuId) {
      getSkuImgList({
        skuId: skuId
      }).then(res => {
        this.skuImgList = res.data.data.list
        // 改变轮播图后，将自定义的指示器的当前索引改为0
        this.current = 0
      })
    },
    // 轮播图切换
    onChange(index) {
      this.current = index
    },
    // 获取位置失败通用方法
    getPosFail(type) {
      this.$dialog.alert({
        title: '提示',
        message: '获取位置失败，请刷新后重试'
      }).then(() => {
        this.posNum++
        if (type === 'ip') {
          this.ipFlag = false
        } else if (type === 'gps') {
          this.gpsFlag = false
        }
      })
    },
    // 获取商品详情
    getGoodsDetails(skuId, storageId, type, externalSkuId) {
      goodsDetails({
        actId: this.actId,
        skuId: skuId,
        storageId: storageId
      }).then(async res => {
        var jdSkuId = ''
        if (type === 'init') {
          this.goods = res.data.data
          // 判断是否是打包商品
          if (this.goods.batchStatus === 1) {
            this.goodsCount = this.goods.batchCount
          }
          // 构造initialSku数据
          if (this.goods.skuComponent !== '') {
            this.goods.skuComponent.sku.list.forEach(item => {
              if (this.goods.skuComponent.goods_id === item.id) {
                this.initialSku = item
                this.initialSku.selectedNum = this.goodsNum
              }
            })
          }
          jdSkuId = this.goods.externalSkuId
        } else if (type === 'change') {
          var goods = res.data.data
          this.goods.externalOrganCode = goods.externalOrganCode
          this.goods.actPrice = goods.actPrice
          this.goods.marketPrice = goods.marketPrice
          this.goods.salePrice = goods.salePrice
          this.goods.skuName = goods.skuName
          this.goods.intro = goods.intro
          this.goods.discountIntro = goods.discountIntro
          this.goods.selectedAttr = goods.selectedAttr
          this.goods.deleteStatus = goods.deleteStatus
          this.goods.saleStatus = goods.saleStatus
          this.goods.discountRule = goods.discountRule
          this.goods.skuComponent.goods_id = goods.skuComponent.goods_id
          jdSkuId = externalSkuId
        }

        // 设置商品详情网页title
        document.title = this.goods.skuName

        // 设置sku组件初始预览图
        this.skuImg.picture = res.data.data.skuImg

        // 判断是否是京东商品
        if (this.goods.externalOrganCode === 'JD') {
          // 根据skuId获取京东商品上下架状态
          this.getSkuCheck(jdSkuId)
          // 根据skuId获取京东商品可售性状态
          this.getSkuState(jdSkuId)
          // 获取京东商品轮播图
          this.getSkuImgList(jdSkuId)
          // 获取京东商品详情
          this.getIntroduction(jdSkuId)
        } else {
          this.skuImgList = this.goods.skuImgList
          this.current = 0
        }

        // 获取用户收货地址，判断是否有默认地址
        if (isLogin()) {
          // 这里的getUserAddressList接口用同步的方式调用，为了在有收获地址时，只调用一次getNewStockAndPromiseTips接口
          const res = await getUserAddressList({
            actId: '',
            type: 0
          })
          // 构造选择收货地址列表
          this.addressList = res.data.data.list
          var defaultAddressIndex = this.addressList.findIndex(function(value, index, arr) {
            return value.defaultStatus === 1
          })
          // 有默认收货地址
          if (defaultAddressIndex !== -1) {
            this.expressAddress = this.addressList[defaultAddressIndex].fullAddress
            this.selAddressId = this.addressList[defaultAddressIndex].id
            if (this.goods.externalOrganCode === 'JD') {
              this.getNewStockAndPromiseTips()
            }
          }
        }

        // 分享信息
        if (isWeiXin()) {
          wxShare(this.goods.skuName, this.goods.intro, this.goods.skuImg).then(wxRes => {
            wx.getLocation({
            // 目前用的都是腾讯地图，所以统一用gcj02 https://www.cnblogs.com/langzou/p/10402501.html
              type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: res => {
                getGps(res.latitude, res.longitude).then(response => {
                  this.posNum++
                  this.gpsFlag = inLimitArea(response.data.result.ad_info.adcode, this.actInfo.gpsAddress)
                  // 这里根据this.expressAddress是否为空进行判断，不为空，则意味着用户有默认地址，并且已经调用过getNewStockAndPromiseTips接口了
                  if (this.goods.externalOrganCode === 'JD' && this.expressAddress === '') {
                    this.expressAddress = response.data.result.address
                    this.getNewStockAndPromiseTips()
                  }
                }).catch(res => {
                  // 根据gps获取位置接口出错
                  this.getPosFail('gps')
                })
              },
              fail() {
                // TODO 用户关闭了手机定位，实际是fail，但是不进任何回调
                this.getPosFail('gps')
                if (this.goods.externalOrganCode === 'JD' && this.expressAddress === '') {
                  this.expressAddress = DefaultAddress
                  this.getNewStockAndPromiseTips()
                }
              },
              cancel: res => {
                this.$dialog.confirm({
                  title: '提示',
                  message: '如果不同意获取地理位置，可能无法参加活动，是否要重新授权？',
                  confirmButtonText: '是',
                  cancelButtonText: '否'
                }).then(() => {
                  // on confirm
                  this.getGoodsDetails(this.skuId, this.storageId, 'init')
                }).catch(() => {
                  // on cancel
                })

                this.posNum++
                this.gpsFlag = false
                if (this.goods.externalOrganCode === 'JD' && this.expressAddress === '') {
                  this.expressAddress = DefaultAddress
                  this.getNewStockAndPromiseTips()
                }
              },
              complete: res => {
              // this.$toast.success(res)
              }
            })
          }).catch(() => {
            // getWxTicket接口报错
            this.getPosFail('gps')
          })
        }

        // 非微信浏览器调用腾讯地图前端定位组件获取经纬度
        if (!isWeiXin()) {
          getCurrentPosition().then(res => {
            getGps(res.coords.latitude, res.coords.longitude).then(response => {
              this.posNum++
              this.gpsFlag = inLimitArea(response.data.result.ad_info.adcode, this.actInfo.gpsAddress)
              // 这里根据this.expressAddress是否为空进行判断，不为空，则意味着用户有默认地址，并且已经调用过getNewStockAndPromiseTips接口了
              if (this.goods.externalOrganCode === 'JD' && this.expressAddress === '') {
                this.expressAddress = response.data.result.address
                this.getNewStockAndPromiseTips()
              }
            }).catch(res => {
              // 根据gps获取位置接口出错
              this.getPosFail('gps')
            })
          }).catch((err) => {
            switch (err.code) {
              case err.PERMISSION_DENIED:
                var currFullPath = this.$route.fullPath
                // h5拒绝后，可能不会再弹出授权确认弹窗了，所以如果用户拒绝过一次后，再次得到{code: 1, message: "User denied Geolocation"}都提示“获取位置失败，请联系客服”
                // refuseNum：非微信浏览器获取经纬度，拒绝次数
                if (currFullPath.indexOf('&refuseNum=1') !== -1) {
                  this.$dialog.alert({
                    title: '提示',
                    message: '获取位置失败，请联系客服'
                  })
                } else {
                  this.$dialog.confirm({
                    title: '提示',
                    message: '如果不同意获取地理位置，可能无法参加活动，是否要重新授权？',
                    confirmButtonText: '是',
                    cancelButtonText: '否'
                  }).then(() => {
                    // on confirm
                    if (currFullPath.indexOf('&refuseNum=1') === -1) {
                      location.href = this.$route.fullPath + '&refuseNum=1'
                    }
                  }).catch(() => {
                  // on cancel
                  })
                }
                break
              case err.POSITION_UNAVAILABLE:
                this.$dialog.alert({
                  title: '提示',
                  message: '获取位置失败，请刷新或更换浏览器后重试'
                })
                break
              case err.TIMEOUT:
                this.$dialog.alert({
                  title: '提示',
                  message: '获取位置失败，请刷新或更换浏览器后重试'
                })
                break
              case err.UNKNOWN_ERROR:
                this.$dialog.alert({
                  title: '提示',
                  message: '获取位置失败，请刷新或更换浏览器后重试'
                })
                break
            }
            this.posNum++
            this.gpsFlag = false
            if (this.goods.externalOrganCode === 'JD' && this.expressAddress === '') {
              this.expressAddress = DefaultAddress
              this.getNewStockAndPromiseTips()
            }
          })
        }
      }).catch(err => {
        console.error(err)
        // 401 商品信息不存在时，隐藏goods-action
        this.noGoods = true
      })
    },

    onClickCart() {
      this.$router.push('cart')
    },
    sorry() {
      this.$toast('暂无后续逻辑~')
    }
  }
}
</script>

<style lang="less" scoped>
.goods {
  padding-bottom: 50px;
  background: #F8F8FA;

  &-img{
    position: relative;
    .indexBtn{
      width: 40px;
      height: 40px;
      line-height: 40px;
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 40px;
      z-index: 10;
      color: #ffffff;
      text-align: center;
      font-size: 20px;
    }
  }

  &-swipe {
    width: 100%;
    height: 375px;
    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
    .indicator_wrap {
      position: absolute;
      z-index: 20;
      right: 12px;
      bottom: 31px;
      width: 49px;
      height: 23px;
      line-height: 23px;
      padding: 0;
      background: rgba(0,0,0,.2);
      border-radius: 13px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      span{
        font-size: 12px;
      }
    }
  }

  &-info {
    background: #ffffff;
    padding: 15px;
    .price{
      font-size: 0;
      &>div{
        display: inline;
        margin-right: 22px;
        .small{
          color: #FF4444;
          font-size: 14px;
        }
        .big{
          color: #FF4444;
          font-size: 24px;
        }
      }
      &>span{
        color: #999999;
        font-size: 14px;
        text-decoration: line-through;
      }
    }
    .name{
      margin-top: 13px;
      margin-bottom: 4px;
      font-size: 15px;
      color: #333333;
      font-weight:700;
      line-height:22px;
    }
    .intro{
      margin: 0;
      font-size:11px;
      line-height:16px;
      color: #999999;
      font-weight:500;
    }
  }

  &-discount {
    margin-top: 10px;
    margin-bottom: 10px;
    .title{
      font-size:14px;
      font-weight:700;
      line-height:14px;
      padding-top: 4px;
      padding-bottom: 2px;
      color: #333333;
    }
    .content{
      float: left;
      width: 280px;
      color: #333333;
      font-size:13px;
      font-weight:400;
      line-height:19px;
      height: 19px;
    }
    .rule{
      float: right;
      line-height:19px;
      color: #0091FF;
      font-size: 11px;
    }
  }
  &-sku {
    .selSku {
      height: 70px;
      padding-top: 17px;
      line-height:18px;

      .title{
        float: left;
        font-size:14px;
        font-weight:700;
        color:#333333;
        line-height:18px;
        margin-right: 15px;
        height: 40px;
      }
      .icon{
        font-size: 16px;
        position: absolute;
        right: 1.1px;
      }
      p{
        width: 260px;
        height:36px;
        font-size:13px;
        line-height:18px;
        color: #333333;
      }
    }
    .sendArea{
      min-height: 70px;
      padding-top: 11px;
      .title{
        float: left;
        font-size:14px;
        font-weight:700;
        color:#333333;
        line-height:18px;
        margin-right: 15px;
        height: 40px;
      }
      .icon{
        font-size: 16px;
        position: absolute;
        right: 1.1px;
      }
      .expressInfo{
        float: left;
        width:260px;
        font-size: 13px;
        color: #333333;
        line-height:18px;
        .expressAddress{
          width:260px;
          svg{
            font-size: 12px;
            margin-right: 10px;
          }
        }
        .postNotice{
          width: 280px;
          float: left;
          margin-top: 5px;
          .status{
            color: #0091FF;
          }
          .postTip{
            color:#999999;
            line-height: 18px;
          }
        }
      }
    }
  }

  &-details {
    background: #ffffff;
    width: 100%;
    margin-top: 10px;
    h2{
      font-size: 14px;
      color: #333333;
      font-weight: 700;
      height: 50px;
      line-height: 50px;
      padding-left: 15px;
    }
    .content{
      color: #666666;
      font-size: 12px;
      &.param{
        padding: 0 10px;
      }
      &.pack{
        padding: 0 10px;
      }
      table{
        width: 100%!important;
      }
      // 处理京东规格参数表格样式
      /deep/ .Ptable{
        width: 100%;
        margin-bottom: 10px;
        border-collapse: collapse;
        font-size: 12px;
        border-spacing: 0;
        line-height: 18px;
        td,th{
          padding:8px;
          border:1px solid #dadada;
          text-align:left;
        }
        td{
          &:first-child{
            width:72px;
          }
          &:last-child{
            word-break:break-all;
          }
        }
      }
      /deep/ img{
        display: block;
        width: 100%!important;
        height: auto!important;
      }
    }
    .bottomTip{
      background: #F8F8FA;
      color: #999999;
      border-color: #999999;
      padding: 16px 80px 31px;
    }
  }

  .sku{
    /deep/ .van-sku-header__goods-info{
      width: 230px;
    }
    /deep/ .van-sku-row__item{
      border: 1px solid #f7f8fa;
    }
    /deep/ .van-sku-row__item--active, .van-sku-row__image-item--active{
      color: #0091FF;
      border: 1px solid #0091ff;
    }
    /deep/ .normalSkuAction{
      display: flex;
      flex-shrink: 0;
      width: 100%;
    }
  }

  .goodsAction{
    .normalGoodsAction{
      width: 100%;
      display: flex;
      align-items: center;
      box-sizing: content-box;
      .payBtn{
        height: 50px;
        border-radius: 0;
        margin: 0;
      }
    }
  }

  .ruleText{
    h3{
      margin: 0;
      margin-bottom: 10px;
      font-size:16px;
      font-weight:700;
      line-height:20px;
      color: #323233;
    }
    /deep/ p{
      font-size: 14px;
      font-weight:400;
      line-height:20px;
      color: #969799;
      margin: 0;
      text-align: justify;
    }
  }

  .selAddress{
    min-height: 484px;
    h2{
      height: 58px;
      padding-top: 20px;
      font-size: 16px;
      color: #333333;
      line-height: 20px;
      text-align: center;
      padding-bottom: 18px;
    }
    .addressList{
      height: 350px;
      overflow-y: auto;
      .van-hairline--top-bottom::after{
        border-width: 0;
      }
      .van-radio{
        margin-right: 9px;
        margin-top: 2px;
        align-items: flex-start;
        .van-radio__icon{
          font-size: 18px;
        }
      }
      .van-cell__title{
        line-height: 21px;
        font-size: 14px;
        color: #333333;
      }
    }
    .btn{
      display: flex;
      flex-shrink: 0;
      height: 76px;
      padding: 16px;
    }
  }
}
</style>
