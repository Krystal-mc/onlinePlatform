<template>
  <div class="personalData-container">
    <div class="k-pd-function">
      <div class="k-pd-grounp">
        <van-cell is-link class="chooseImage" @click="chooseImageFn">
          <template #title>
            <span class="custom-title">头像</span>
            <div v-show="headImgShow">
              <img v-if="userInfoSaveModel.headImg" :src="userInfoSaveModel.headImg" class="avatar" @click.stop.prevent="priviewAvatar">
              <img v-else :src="require('@/assets/img/defaultAvatar.png')" class="avatar" @click.stop.prevent="priviewAvatar">
            </div>
          </template>
          <van-uploader v-if="!isWeiXin" v-model="uploadNoWeixin" :after-read="h5ChooseImage" :max-count="1" :preview-image="false">
            <div class="noWeixin" />
          </van-uploader>
        </van-cell>
        <van-cell :value="userInfoSaveModel.nickname">
          <template #title>
            <span class="custom-title">昵称</span>
          </template>
        </van-cell>
        <van-cell :value="userInfoSaveModel.telephone">
          <template #title>
            <span class="custom-title">手机号</span>
          </template>
        </van-cell>
        <van-cell :value="userInfoSaveModel.realName" is-link @click="updateName = true">
          <template #title>
            <span class="custom-title">真实姓名</span>
          </template>
        </van-cell>
        <van-cell :value="userInfoSaveModel.sex" is-link @click="showPicker = true">
          <template #title>
            <span class="custom-title">性别</span>
          </template>
        </van-cell>
        <van-cell :value="userInfoSaveModel.age" is-link @click="updateAge = true">
          <template #title>
            <span class="custom-title">年龄</span>
          </template>
        </van-cell>
        <van-cell :value="location" is-link @click="openSelRegion">
          <template #title>
            <span class="custom-title">所在地</span>
          </template>
        </van-cell>
        <van-cell v-if="userInfoSaveModel.userType === 1" :value="userInfoSaveModel.jobNum" is-link @click="updateJobNum = true">
          <template #title>
            <span class="custom-title">工号</span>
          </template>
        </van-cell>
      </div>
    </div>
    {{ localIds }}
    <div class="logOut" @click="logout">
      <van-button type="default">退出登录</van-button>
    </div>
    <!-- 修改姓名 -->
    <van-dialog v-model="updateName" title="修改真实姓名" show-cancel-button @confirm="realNameConfirm">
      <van-cell-group>
        <van-field v-model="userInfoSaveModel.realName" label="" placeholder="输入姓名" />
      </van-cell-group>
    </van-dialog>
    <!-- 修改年龄 -->
    <van-dialog v-model="updateAge" title="修改年龄" show-cancel-button @confirm="ageConfirm">
      <van-cell-group>
        <van-field v-model="userInfoSaveModel.age" label="" placeholder="输入年龄" />
      </van-cell-group>
    </van-dialog>
    <!-- 修改工号 -->
    <van-dialog v-model="updateJobNum" title="修改工号" show-cancel-button @confirm="jobNumConfirm">
      <van-cell-group>
        <van-field v-model="userInfoSaveModel.jobNum" label="" placeholder="输入工号" />
      </van-cell-group>
    </van-dialog>
    <!-- 修改性别 -->
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="sexColumns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <!-- 地区 -->
    <van-popup v-model="selRegionShow" position="bottom">
      <div class="selRegion">
        <van-area :area-list="areaList" :loading="regionLoading" :columns-num="2" :value="addAddressForm.selRegionVal" @cancel="selRegionShow = false" @confirm="setRegion" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Area } from 'vant'
import { Uploader } from 'vant'
import { ImagePreview } from 'vant'
import { Toast } from 'vant'
import { getDistrictList, upload } from '@/api/common'
import { getUserInfoById, updateProfile, mediaDownload } from '@/api/my'
import { logout } from '@/api/user'
import { getImgPath, isWeiXin, createSignForUpload } from '@/utils/index'
import wx from 'weixin-js-sdk'
import { wxHideBtn } from '@/utils/wx'
// import $ from 'jquery'
import { JsApiList } from '@/utils/const'

export default {
  name: 'PersonalData',
  components: {
    [Area.name]: Area,
    [Uploader.name]: Uploader,
    [ImagePreview.name]: ImagePreview,
    [Toast.name]: Toast
  },
  data() {
    return {
      // 非微信浏览器的时候上传的图片
      uploadNoWeixin: [],
      isWeiXin: isWeiXin(),
      JsApiList: JsApiList,
      loggedIn: true,
      updateName: false,
      showPicker: false,
      sexColumns: ['男', '女'],
      updateAge: false,
      updateJobNum: false,
      userId: '',
      provinceName: '',
      cityName: '',
      location: '',
      selRegionShow: false,
      selRegionVal: '',
      areaList: {
        'province_list': {},
        'city_list': {},
        'county_list': {}
      },
      regionLoading: true,
      addAddressForm: {
        region: '',
        addressId: '',
        receiverName: '',
        receiverTelephone: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        townCode: '',
        addressDetail: '',
        formToken: '',
        selRegionVal: '',
        type: 1
      },
      userInfoSaveModel: {
        // 推荐人的推荐人
        againReferrer: '',
        // 年龄
        age: '',
        // 所在地-市编码
        cityCode: '',
        // 所在地-市名称
        cityName: '',
        // 头像
        headImg: '',
        // 预览头像
        headImgPriview: '',
        // 头像类型（0：微信头像，1：自定义上传）
        headType: '',
        id: '',
        // 邀请码
        inviteCode: '',
        // 客户经理工号
        jobNum: '',
        // 昵称
        nickname: '',
        // 所属机构ID，只有客户经理该字段才有值
        organId: '',
        // 所在地-省编码
        provinceCode: '',
        // 所在地-省名称
        provinceName: '',
        // 真实姓名
        realName: '',
        // 推荐人
        referrer: '',
        // 注册来源活动ID
        regActId: '',
        // 注册地，中文
        regAddress: '',
        // 注册使用网络IP
        regIp: '',
        // 注册地经纬度，逗号分隔
        regLngLat: '',
        // 注册来源机构ID
        regOrganId: '',
        // 注册来源网址
        regSourceUrl: '',
        // 性别（0：未设置，1：男，2：女）
        sex: '',
        // 手机号
        telephone: '',
        // 用户类型（0：普通用户，1：客户经理）
        userType: '',
        // 微信openId
        wxOpenId: '',
        // 微信用户唯一ID
        wxUnionId: ''
      },
      wxMenuFlag: '',
      localIds: '',
      serverId: '',
      headImgShow: false
    }
  },
  watch: {

  },
  created() {
  },
  mounted() {
    if (this.$store.getters.userId) {
      this.userId = this.$store.getters.userId
    }
    this.getUserInfoById()
    wxHideBtn().then(res => {
      this.wxMenuFlag = res
    })
  },
  destroyed() {
  },
  methods: {
    // 修改真实姓名确认
    realNameConfirm() {
      this.updateProfile('realName', this.userInfoSaveModel.realName)
      this.$store.dispatch('user/getInfo')
    },
    // 修改年龄确认
    ageConfirm() {
      this.updateProfile('age', this.userInfoSaveModel.age)
    },
    // 工号修改
    jobNumConfirm() {
      this.updateProfile('jobNum', this.userInfoSaveModel.jobNum)
    },
    // 修改性别
    onConfirm(value, index) {
      this.showPicker = false
      this.updateProfile('sex', index + 1)
    },
    // 获取用户信息
    getUserInfoById() {
      getUserInfoById({
        id: this.userId
      }).then(response => {
        if (response.data.code === 200) {
          // 客户类型
          this.userInfoSaveModel.userType = response.data.data.userType
          this.userInfoSaveModel.nickname = response.data.data.nickname
          this.userInfoSaveModel.telephone = response.data.data.telephone
          this.userInfoSaveModel.realName = response.data.data.realName
          this.userInfoSaveModel.age = response.data.data.age
          const sexVal = response.data.data.sex
          if (sexVal === 0) {
            this.userInfoSaveModel.sex = ''
          } else if (sexVal === 1) {
            this.userInfoSaveModel.sex = '男'
          } else if (sexVal === 2) {
            this.userInfoSaveModel.sex = '女'
          }
          this.userInfoSaveModel.provinceName = response.data.data.provinceName
          this.userInfoSaveModel.cityName = response.data.data.cityName
          this.location = this.userInfoSaveModel.provinceName + '-' + this.userInfoSaveModel.cityName
          this.userInfoSaveModel.jobNum = response.data.data.jobNum
          // 获取头像链接/132之前的内容
          var avatarUrl = response.data.data.headImg
          var avatarUrlFront = ''
          if (avatarUrl.indexOf('http://thirdwx.qlogo.cn') !== -1) {
            // 是微信头像
            var indexI = avatarUrl.lastIndexOf('\/')
            avatarUrlFront = avatarUrl.substring(0, indexI + 1)
            this.userInfoSaveModel.headImg = response.data.data.headImg
            this.userInfoSaveModel.headImgPriview = avatarUrlFront + '0'
          } else {
            // 是修改过的头像
            this.userInfoSaveModel.headImg = getImgPath(avatarUrl, 'list')
            this.userInfoSaveModel.headImgPriview = getImgPath(avatarUrl, 'small')
          }
          this.headImgShow = true
        }
      })
    },
    // 修改用户信息
    updateProfile(key, value) {
      updateProfile({
        [key]: value
      }).then(response => {
        this.getUserInfoById()
        this.$toast.success({
          message: response.data.msg,
          forbidClick: true
        })
        this.$store.dispatch('user/getInfo')
      })
    },
    logout() {
      logout().then(res => {
        this.$store.dispatch('user/resetToken').then(() => {
          this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath }})
        })
      })
    },
    // 点击所在地之后调用地址列表
    openSelRegion() {
      getDistrictList({ level: 2 }).then(response => {
        this.areaList.province_list = {}
        this.areaList.city_list = {}
        this.areaList.county_list = {}
        var regionList = response.data.data.list
        for (const item of regionList) {
          this.$set(this.areaList.province_list, item.key, item.value)
          for (const item1 of item.children) {
            this.$set(this.areaList.city_list, item1.key, item1.value)
          }
        }
        this.regionLoading = false
        this.$nextTick(function() {
          this.selRegionShow = true
        })
      })
    },
    // 选择省市区
    setRegion(arr) {
      this.addAddressForm.region = arr[0].name + arr[1].name
      this.addAddressForm.provinceCode = arr[0].code
      this.addAddressForm.cityCode = arr[1].code
      this.location = arr[0].name + '-' + arr[1].name
      updateProfile({
        cityCode: arr[1].code,
        cityName: arr[1].name,
        provinceCode: arr[0].code,
        provinceName: arr[0].name
      }).then(response => {
        if (response.data.code === 200) {
          this.getUserInfoById()
          this.$toast.success({
            message: response.data.msg,
            forbidClick: true
          })
        }
      })
      this.selRegionShow = false
    },
    // 查看头像
    priviewAvatar() {
      if (this.isWeiXin) {
        if (this.wxMenuFlag) {
          wx.previewImage({
            current: this.userInfoSaveModel.headImgPriview, // 当前显示图片的http链接
            urls: [this.userInfoSaveModel.headImgPriview] // 需要预览的图片http链接列表
          })
        } else {
          this.$toast('网络请求中，请稍后重试！')
        }
      } else {
        ImagePreview({
          images: [getImgPath(this.userInfoSaveModel.headImg, 'small')],
          showIndex: false
        },
        )
      }
    },
    h5ChooseImage(file, detail) {
      Toast.loading({
        message: '正在上传头像',
        duration: 0
      })
      const formData = new FormData()
      formData.append('file', this.uploadNoWeixin[0].file)
      formData.append('type', '5')
      // 上传文件
      upload(formData, createSignForUpload({ type: '5' }, '/khh/common/oss/upload')).then(response => {
        this.updateProfile('headImg', response.data.data.url)
        this.userInfoSaveModel.headImg = getImgPath(response.data.data.url, 'list')
        this.uploadNoWeixin = []
      })
    },
    priviewNoweixin() {
      ImagePreview({
        images: [getImgPath(this.userInfoSaveModel.headImg, 'small')],
        showIndex: false
      },
      )
    },
    chooseImageFn() { // 微信选择头像
      if (this.isWeiXin) {
        var that = this
        if (that.wxMenuFlag) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
              var localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
              wx.uploadImage({
                localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function(res) {
                  var serverId = res.serverId // 返回图片的服务器端ID
                  mediaDownload({
                    mediaId: serverId
                  }).then(response => {
                    that.$nextTick(function() {
                      that.getUserInfoById()
                      this.$store.dispatch('user/getInfo')
                    })
                    that.$toast.success({
                      message: '修改成功',
                      forbidClick: true
                    })
                  })
                },
                fail: function(res) {
                  that.$toast.success({
                    message: '修改失败',
                    forbidClick: true
                  })
                }
              })
            }
          })
        } else {
          this.$toast('网络请求中，请稍后重试！')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.personalData-container{
    background: #F7F8FA;
    height: 100%;
    /deep/ .van-uploader{
      width: 100%;
      position: absolute;
      top: 0;
      right: 0;
    }
    /deep/ .van-cell__title{
      position: relative;
    }
    .vanUploadImg{
      height: 45px;
      padding-top: 4px;
      padding-bottom: 4px;
      /deep/ .van-cell__title{
        flex: inherit;
        line-height: 36px;
      }
      .van-cell__right-icon{
        line-height: 36px;
      }
    }
    /deep/ .van-cell__value{
      flex: 1;
    }
    /deep/ .van-uploader__wrapper{
      display: initial;
    }
    /deep/ .van-uploader__preview{
      margin: 0;
      float: right;
    }
    /deep/ .van-overlay{
      z-index: 10;
      .loadingIcon{
        position: relative;
        top: 45%;
        left: 47%;
      }
    }
    .k-pd-function{
        font-size: 14px;
        color: #333333;
        margin-bottom: 30px;
        .k-pd-grounp{
            margin-bottom: 10px;
            background: #ffffff;
            /deep/ .chooseImage{
              height: 60px;
              /deep/ .van-cell__title{
                line-height: 40px;
              }
              /deep/ .van-cell__right-icon{
                line-height: 40px;
              }
              .van-cell__value{
                position: absolute;
                width: 100%;
                height: 40px;
                z-index: 1;
              }
            }
            .van-cell{
                background: none;
            }
            .avatar{
                width: 36px;
                height: 36px;
                border-radius: 4px;
                position: absolute;
                top: 0px;
                right: 0px;
                z-index: 9;
            }
            .avatar1{
                right: 0px;
                top: 0;
            }
            .van-cell{
                position: relative;
            }
            .noWeixin{
              width: 100%;
              height: 36px;
            }
        }
        .custom-title{
            font-size: 14px;
            color: #323232;
        }
    }
    .logOut{
        .van-button{
            width: 100%;
            font-size: 14px;
        }
    }
    .van-dialog{
        border-radius: 4px;
        .van-dialog__content{
            .van-cell-group{
                border: 1px solid #DCDDE0;
                margin: 12px 24px 24px 24px;
            }
            .van-cell{
                height: 40px;
            }
        }
        .van-dialog__footer--buttons{
            border-top: 1px solid #EBEDF0;
        }
    }
}
</style>
