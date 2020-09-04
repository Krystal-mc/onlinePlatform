import { getActInfo } from '@/api/activity'
import { getIndexInfo, getHomeAttr } from '@/api/common'
import { wxShare } from '@/utils/wx'
import { processMobileData, gotoGoodsDetails } from '@/utils'

export default {
  data() {
    return {
      // 预告页
      actId: '',
      actInfo: {},
      // open开启  wait为开启  over已结束
      // showActivityNotice: ''
      // 该活动页的id参数
      queryForm: {
        actId: '',
        organId: '',
        relationId: ''
      },
      // 分享活动
      shareGroup: {
        shareTitle: '',
        shareContent: '',
        shareImg: ''
      },
      goodsListPage: false,
      judgeWhiteInner: false,
      // 配置信息
      allInfo: []
    }
  },
  created() {

  },

  methods: {
    // 获取活动参数
    getQueryForm() {
      this.$route.query.actId &&
            (this.queryForm.actId = this.$route.query.actId)
      this.$route.query.organId &&
            (this.queryForm.organId = this.$route.query.organId)
      this.$route.query.pageId &&
            (this.queryForm.relationId = this.$route.query.pageId)
    },

    // 获取配置信息+处理数据
    async getIndexInfo() {
      if (this.queryForm.actId && this.queryForm.organId && this.queryForm.relationId) {
        const { data: result } = await getIndexInfo(this.queryForm)
        this.allInfo = result.data.tmplAttrGroup
        // 处理数据
        if (this.setData) {
          processMobileData(this.allInfo, this.setData)
          // 微信分享页调取
          wxShare(
            this.setData.shareGroup.shareTitle,
            this.setData.shareGroup.shareContent,
            this.setData.shareGroup.shareImg
          )
        } else {
          processMobileData(this.allInfo, this)
          // 微信分享页调取
          wxShare(
            this.shareGroup.shareTitle,
            this.shareGroup.shareContent,
            this.shareGroup.shareImg
          )
        }
      }
    },

    // 点击跳转：进入活动页
    // 配置活动跳转路由（预告页 or 活动页）
    async getActInfo(path, query) {
      if (path) {
        this.actId = path.split('&')[0].split('=')[1]
      }
      const { data: result } = await getActInfo({ actId: this.actId })
      this.actInfo = result.data
      if (this.actInfo.status === 1 && this.actInfo.actNotice === 1) {
        this.$router.push({ name: 'ActivityNotice', query: { showActivityNotice: 'wait' }})
      } else if (this.actInfo.status === 4 || this.actInfo.status === 3) {
        this.$router.push({ name: 'ActivityNotice', query: { showActivityNotice: 'over' }})
      } else {
        this.$router.push({ path, query })
      }
    },

    // 直接输入链接，判断是否进入活动预告
    async beforeEnterAct() {
      const { data: result } = await getActInfo({ actId: this.queryForm.actId })
      this.actInfo = result.data
      if (this.actInfo.status === 1 && this.actInfo.actNotice === 1) {
        this.$router.replace({ name: 'ActivityNotice', query: { showActivityNotice: 'wait' }})
      } else if (this.actInfo.status === 4 || this.actInfo.status === 3) {
        this.$router.replace({ name: 'ActivityNotice', query: { showActivityNotice: 'over' }})
      }
    },

    // 商品列表详情
    goto(item) {
      const queryStr = item.route
      gotoGoodsDetails(this, queryStr)
    },

    // 回到首页
    async goPageHome(organId) {
      const { data: result } = await getHomeAttr({ organId: this.queryForm.organId })
      const path = result.data.url
      this.$router.push({ path })
    }

  }

}
