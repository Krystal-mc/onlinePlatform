<template>
  <div ref="goods" class="goods clearfix">
    <!-- <button @click="jump">跳转到</button> -->
    <div id="iframe-height">
      <van-swipe class="goods-swipe" :height="300" :autoplay="3000">
        <van-swipe-item v-for="(thumb, index) in goods.thumb" :key="index">
          <img :src="thumb.img">
        </van-swipe-item>
      </van-swipe>

      <van-cell-group>
        <van-cell>
          <div class="goods-title">{{ goods.title }}</div>
          <div class="goods-price">{{ formatPrice(goods.price) }}</div>
        </van-cell>
        <van-cell class="goods-express">
          <van-col span="10">运费：{{ goods.express }}</van-col>
          <van-col span="14">剩余：{{ goods.remain }}</van-col>
        </van-cell>
      </van-cell-group>

      <van-cell-group class="goods-cell-group">
        <van-cell value="进入店铺" icon="shop-o" is-link @click="sorry">
          <template slot="title">
            <span class="van-cell-text">有赞的店</span>
            <van-tag class="goods-tag" type="danger">官方</van-tag>
          </template>
        </van-cell>
        <van-cell title="线下门店" icon="location-o" is-link @click="sorry" />
      </van-cell-group>

      <van-cell-group class="goods-cell-group">
        <van-cell title="查看商品详情" is-link @click="sorry" />
      </van-cell-group>

      <van-goods-action>
        <van-goods-action-icon icon="chat-o" @click="sorry">
          客服
        </van-goods-action-icon>
        <van-goods-action-icon icon="cart-o" @click="onClickCart">
          购物车
        </van-goods-action-icon>
        <van-goods-action-button type="warning" @click="sorry">
          加入购物车
        </van-goods-action-button>
        <van-goods-action-button type="danger" @click="sorry">
          立即购买
        </van-goods-action-button>
      </van-goods-action>
      <div class="testDiv" />

    </div>
  </div>
</template>

<script>
import {
  Tag,
  Col,
  Icon,
  Cell,
  CellGroup,
  Swipe,
  Toast,
  SwipeItem,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton
} from 'vant'
import { sendPc, getPc } from '@/utils'

export default {
  components: {
    [Tag.name]: Tag,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton
  },

  data() {
    return {
      goods: {
        title: '美国伽力果（约680g/3个）',
        price: 2680,
        express: '免运费',
        remain: 19,
        thumb: [
          {
            id: '1274991676818841601',
            img: 'http://khh-test.oss-cn-beijing.aliyuncs.com/goodsImage/20200622/b6d764d244034ea3967e1e855aad8fdf.png',
            name: '1112324',
            type: 1
          },
          {
            id: '1274991676818841601',
            img: 'https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg',
            name: '558899',
            type: 1
          }
          // 'https://img.yzcdn.cn/public_files/2017/10/24/1791ba14088f9c2be8c610d0a6cc0f93.jpeg'
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 将页面高度发送到pc端
      sendPc('.goods')
      // 获取pc端返回的数据
      getPc(this)
    })
  },

  methods: {
    formatPrice() {
      return '¥' + (this.goods.price / 100).toFixed(2)
    },
    jump() {
      this.$router.push({ name: 'goods' })
    },

    onClickCart() {
      this.$router.push('cart')
    },

    sorry() {
      Toast('暂无后续逻辑~')
    }
  }
}
</script>

<style lang="less" scoped>
.goods {
  padding-bottom: 50px;
  width: 100%;
  // height: 100%;
  // background: url('https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg') left top;

  .testDiv{
    width: 375px;
    height: 50px;
    background: #09c;
  }

  &-swipe {
    img {
      width: 100%;
      display: block;
    }
  }

  &-title {
    font-size: 16px;
  }

  &-price {
    color: #f44;
  }

  &-express {
    color: #999;
    font-size: 12px;
    padding: 5px 15px;
  }

  &-cell-group {
    margin: 15px 0;

    .van-cell__value {
      color: #999;
    }
  }

  &-tag {
    margin-left: 5px;
  }
}
</style>
