<template>
  <div class="addressAdd-container" :msgtype="msgtype" :addretype="addretype">
    <van-form @submit="onSubmit">
      <van-field
        v-model="formOptions.name"
        name="收货人"
        label="收货人"
        placeholder="请输入收货人姓名"
        :rules="[{ required: true, message: '请输入收货人姓名' }]"
      />
      <van-field
        v-model.trim="formOptions.telephone"
        maxlength="11"
        type="tel"
        name="手机号"
        label="手机号"
        placeholder="请输入收货人手机号"
        :rules="[{ required: true, message: '请输入收货人手机号' }]"
      />
      <van-field
        v-if="addretype === 0"
        v-model="area"
        name="所在地区"
        label="所在地区"
        placeholder="请选择省/市/区/街道"
        readonly
        :rules="[{ required: true, message: '请选择省/市/区/街道' }]"
        @click="openSelRegionFour"
      />
      <van-field
        v-if="addretype === 1"
        readonly
        clickable
        name="picker"
        :value="formOptions.placeName"
        label="提货点"
        placeholder="请选择提货点"
        @click="openPickUpPoint"
      />
      <van-field
        v-model="formOptions.detailAddress"
        maxlength="100"
        type="textarea"
        name="详细地址"
        label="详细地址"
        placeholder="街道、楼牌号等"
        :rules="[{ required: true, message: '请输入街道、楼牌号等' }]"
      />
      <van-popup v-model="showPicker" position="bottom" :style="{ height: '40%' }">
        <van-picker
          show-toolbar
          :columns="pickUpPointLists"
          @confirm="pickUpPointConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>
      <van-field name="switch" label="设为默认地址" label-width="105px" class="switchBox" @click="selectDefaultAddress">
        <template #input>
          <van-switch v-model="formOptions.defaultStatus" size="20" />
        </template>
      </van-field>
      <div style="margin: 40px 16px 16px 16px;">
        <van-button round block type="info" native-type="submit">
          保存
        </van-button>
        <van-button v-if="addressId" round block class="deleteBtn" @click.stop.prevent="deleteOption">
          <!-- <van-button round block class="deleteBtn" @click.stop.prevent="deleteOption"> -->
          删除
        </van-button>
      </div>
    </van-form>
    <!-- 四级省市区 -->
    <van-popup v-model="fourRegionShow" position="bottom" :safe-area-inset-bottom="true" :style="{ height: '50%' }">
      <div class="fourRegionShow">
        <h5>所在地区</h5>
        <div class="fourRegionShowContent">
          <van-tabs ref="addressTab" v-model="fourRegionActive">
            <van-tab :title="provinceName">
              <template>
                <div class="area-list">
                  <div v-for="item in areaJson" :key="item.key" class="area-item" :class="{active: item.value === provinceName}" @click="clickProvince(item.value,item.key)">
                    {{ item.value }}
                  </div>
                </div>
              </template>
            </van-tab>
            <van-tab :title="cityName">
              <template>
                <div class="area-list">
                  <div v-for="item in cityData" :key="item.key" class="area-item" :class="{active: item.value === cityName}" @click="clickCity(item.value,item.key)">
                    {{ item.value }}
                  </div>
                </div>
              </template>
            </van-tab>
            <van-tab :title="areaName">
              <template>
                <div class="area-list">
                  <div v-for="item in districtData" :key="item.key" class="area-item" :class="{active: item.value === areaName}" @click="clickDistrict(item.value,item.key)">
                    {{ item.value }}
                  </div>
                </div>
              </template>
            </van-tab>
            <van-tab :title="streetName">
              <template>
                <div class="area-list">
                  <div v-for="item in streetData" :key="item.key" class="area-item" :class="{active: item.value === streetName}" @click="clickStree(item.value,item.key)">
                    {{ item.value }}
                  </div>
                </div>
              </template>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getUserAddressById, saveUserAddress, getReceiveAddressList, deleteUserAddressById } from '@/api/my'
import { getDistrictList } from '@/api/common'
import { Switch } from 'vant'
export default {
  name: 'AddressAdd',
  components: {
    [Switch.name]: Switch
  },
  props: {
    msgtype: {
      type: String,
      default: null,
      required: false
    },
    addressId: {
      type: String,
      default: null,
      required: false
    },
    addretype: {
      type: Number,
      default: null,
      required: false
    }
  },
  data() {
    return {
      thisTitleTxt: this.titleTxt,
      area: '',
      defaultAddress: false,
      showPicker: false,
      addressType: '',
      pickUpPointLists: [],
      pickUpIdLists: [],
      pointList: [
        {
          actId: 1000,
          address: '撒范德萨分',
          createTime: '2020-07-09',
          id: 1212340,
          name: '人民路支行'
        },
        {
          actId: 1000,
          address: '是否为地方大师傅',
          createTime: '2020-07-09',
          id: 1212340,
          name: '精华花就路支行'
        }
      ],
      formOptions: {
        actId: '',
        areaCode: '',
        areaName: '',
        cityCode: '',
        cityName: '',
        defaultStatus: false,
        detailAddress: '',
        fullAddress: '',
        id: '',
        name: '',
        placeName: '',
        provinceCode: '',
        provinceName: '选择省份',
        streetCode: '',
        streetName: '',
        telephone: '',
        type: '',
        userId: '',
        placeId: ''
      },
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
      fourRegionShow: false,
      fourRegionActive: 0,
      provinceName: '选择省份',
      cityName: '',
      areaName: '',
      areaJson: [],
      cityData: [],
      districtData: [],
      streetName: '',
      streetData: [],
      addressEditObj: {},
      provinceReadyCode: '',
      cityReadyCode: '',
      areaReadyCode: '',
      townReadyCode: '',
      updAddSucFlag: 0,
      // 从addressManage获取的msgtype值，将msgtype赋值给msgtypeVal
      msgtypeVal: ''
    }
  },
  watch: {
    // msgtype区别addressAdd显示的时候是编辑还是增加
    'msgtype': function(newVal, oldVal) {
      this.msgtypeVal = newVal
      if (this.msgtypeVal === '0') {
        this.clearProp()
      } else if (this.msgtypeVal !== '') {
        if (this.addressType === 1) {
          this.formOptions.type = 1
          this.getUserAddressById(this.msgtypeVal)
        } else {
          this.formOptions.type = 0
          this.getUserAddressById(this.msgtypeVal)
        }
      }
    },
    // 地址类型，0是收货地址，1是自提地址
    'addretype': function(newVal, oldVal) {
      this.addressType = newVal
    }
  },
  created() {
  },
  mounted() {
    if (this.$route.query.id) {
      this.addressId = this.$route.query.id
      this.formOptions.id = this.$route.query.id
    }
    if (this.$route.query.type !== '' && this.$route.query.type !== undefined && this.$route.query.type !== null) {
      this.addressType = this.$route.query.type - 0
      this.formOptions.type = this.$route.query.type - 0
    }
    if (this.$route.query.actId) {
      this.formOptions.actId = this.$route.query.actId
    }
    if (this.$store.getters.userId) {
      this.formOptions.userId = this.$store.getters.userId
    }
    if (this.data) {
      this.provinceName = this.data.provinceName
      if (this.data.city) {
        this.cityName = this.data.cityName
        this.cityData = this.data.cityJson
      }
      if (this.data.district) {
        this.areaName = this.data.areaName
        this.districtData = this.data.districtJson
      }
      if (this.data.street) {
        this.streetName = this.data.streetName
        this.streetData = this.data.streetJson
      }
    }
    if (this.addretype) {
      this.addressType = this.addretype
    }
    if (this.msgtype === '0') {
      this.clearProp()
    } else {
      if (this.addressType === 1) {
        this.formOptions.type = 1
        this.getUserAddressById(this.msgtype)
      } else {
        this.formOptions.type = 0
        this.getUserAddressById(this.msgtype)
      }
    }

    this.getReceiveAddressList()
  },
  destroyed() {
  },
  methods: {
    openPickUpPoint() {
      this.formOptions.actId = '1268102382080925698'
      this.getReceiveAddressList()
      this.showPicker = true
    },
    // 获取地址详情
    getUserAddressById(addressId) {
      getUserAddressById({
        id: addressId
      }).then(response => {
        // 收货人
        this.formOptions.name = response.data.data.name
        // 手机号
        this.formOptions.telephone = response.data.data.telephone
        // 详细地址
        if (response.data.data.type === 0) {
          this.formOptions.detailAddress = response.data.data.detailAddress
        } else {
          this.formOptions.detailAddress = response.data.data.fullAddress
        }
        // 提货点
        this.formOptions.placeName = response.data.data.placeName
        // 是否默认
        var defAddr = response.data.data.defaultStatus - 0
        if (defAddr === 0) {
          this.formOptions.defaultStatus = false
        } else if (defAddr === 1) {
          this.formOptions.defaultStatus = true
        }
        // id
        this.formOptions.id = response.data.data.id
        // 省市区
        this.formOptions.provinceCode = response.data.data.provinceCode
        this.formOptions.provinceName = response.data.data.provinceName
        this.formOptions.cityCode = response.data.data.cityCode
        this.formOptions.cityName = response.data.data.cityName
        this.formOptions.areaCode = response.data.data.areaCode
        this.formOptions.areaName = response.data.data.areaName
        this.formOptions.streetCode = response.data.data.streetCode
        this.formOptions.streetName = response.data.data.streetName
        this.area = this.formOptions.provinceName + this.formOptions.cityName + this.formOptions.areaName + this.formOptions.streetName
      })
    },
    // 获取提货点列表
    getReceiveAddressList() {
      getReceiveAddressList({
        actId: this.formOptions.actId
      }).then(response => {
        this.pointList = response.data.data.list
        this.pointList.forEach(element => {
          this.pickUpPointLists.push(element.name)
          this.pickUpIdLists.push(element.id)
        })
      })
    },
    // 删除收货地址
    deleteUserAddressById() {
      deleteUserAddressById({
        id: this.addressId
      }).then(response => {
        this.$toast.success(response.data.msg)
        this.$emit('delete', this.addressId)
      })
    },
    onSubmit() {
      if (this.addretype === 0) {
        this.formOptions.type = this.addretype
        this.typeOneFun()
        this.clearProp()
      } else if (this.addretype === 1) {
        this.formOptions.type = this.addretype
        this.typeTwoFun()
        this.clearProp()
      }
    },
    // 当保存修改寄送地址的时候执行的方法
    typeOneFun() {
      saveUserAddress({
        name: this.formOptions.name,
        telephone: this.formOptions.telephone,
        provinceCode: this.formOptions.provinceCode,
        provinceName: this.formOptions.provinceName,
        cityCode: this.formOptions.cityCode,
        cityName: this.formOptions.cityName,
        areaCode: this.formOptions.areaCode,
        areaName: this.formOptions.areaName,
        streetCode: this.formOptions.streetCode,
        streetName: this.formOptions.streetName,
        detailAddress: this.formOptions.detailAddress,
        defaultStatus: this.formOptions.defaultStatus === false ? 0 : 1,
        type: this.formOptions.type,
        fullAddress: this.area + this.formOptions.detailAddress,
        id: this.formOptions.id
      }).then(response => {
        this.$toast.success(response.data.msg)
        // this.msgtypeVal = ''
        this.$router.go(-1)
      })
    },
    // 当保存修改提货地址的时候执行的方法
    typeTwoFun() {
      saveUserAddress({
        name: this.formOptions.name,
        telephone: this.formOptions.telephone,
        defaultStatus: this.formOptions.defaultStatus === false ? 0 : 1,
        type: this.formOptions.type,
        id: this.formOptions.id,
        actId: this.formOptions.actId,
        placeName: this.formOptions.placeName,
        placeId: this.formOptions.placeId,
        fullAddress: this.area + this.formOptions.detailAddress
      }).then(response => {
        this.$toast.success(response.data.msg)
        // this.msgtypeVal = ''
        this.$router.go(-1)
      })
    },
    // 删除
    deleteOption() {
      this.$dialog.confirm({
        title: '',
        message: '是否删除该地址'
      }).then(() => {
        this.deleteUserAddressById()
      }).catch(() => {
        // on cancel
      })
    },
    openSelRegionFour() {
      this.fourRegionShow = true
      if (this.addressId) {
        this.editAction()
      } else {
        this.formOptions.areaCode = ''
        this.formOptions.areaName = ''
        this.formOptions.cityCode = ''
        this.formOptions.cityName = ''
        this.formOptions.provinceCode = ''
        this.formOptions.provinceName = '选择省份'
        this.formOptions.streetCode = ''
        this.formOptions.streetName = ''
        getDistrictList({
          level: 1
        }).then(response => {
          this.areaJson = response.data.data.list
        })
      }
    },
    // 清空元素的值
    clearProp() {
      this.formOptions.actId = ''
      this.formOptions.areaCode = ''
      this.formOptions.areaName = ''
      this.formOptions.cityCode = ''
      this.formOptions.cityName = ''
      this.formOptions.defaultStatus = false
      this.formOptions.detailAddress = ''
      this.formOptions.fullAddress = ''
      // this.formOptions.id = ''
      this.formOptions.name = ''
      this.formOptions.placeName = ''
      this.formOptions.provinceCode = ''
      this.formOptions.provinceName = '选择省份'
      this.formOptions.streetCode = ''
      this.formOptions.streetName = ''
      this.formOptions.telephone = ''
      this.formOptions.type = ''
      this.formOptions.userId = ''
      this.formOptions.placeId = ''
      this.area = ''
    },
    openSelRegionThree() {
    },
    // 选择提货点
    pickUpPointConfirm(value, index) {
      this.formOptions.placeName = value
      this.formOptions.placeId = this.pickUpIdLists[index]
      this.showPicker = false
      for (var i in this.pointList) {
        if (this.pointList[i].name === value) {
          this.formOptions.detailAddress = this.pointList[i].address
        }
      }
    },
    // 选择是否默认
    selectDefaultAddress(value) {
    },
    // 选择地址
    clickProvince(name, code) {
      // name就是当前选中的省份
      if (this.provinceName === name) {
        // 判断它是否跟当前已经选中的省份相同,如果相同,就把tab栏切换到市的选择.不用做其他操作,因为在选中的省有数据的情况下,市的数据是肯定有的.
        this.fourRegionActive = 1
      } else {
        // 如果不相同,就代表选择了其他的省份
        this.provinceName = name // 把选中的省份赋值给之前绑定好的tab栏上显示省的值
        this.fourRegionActive = 1 // 当前的tab栏切换到市
        // this.cityData = this.areaJson[name] // 在地区的json数据中拿选中的省当key值,就可以取出对应的市区数据
        for (var i in this.areaJson) {
          if (this.areaJson[i].value === name) {
            getDistrictList({
              code: code
            }).then(response => {
              this.cityData = response.data.data.list
              if (this.cityData.length < 2) {
                this.fourRegionActive = 2
                this.cityName = this.cityData[0].value
                this.cityReadyCode = this.cityData[0].key
                this.areaName = '选择区域'
                getDistrictList({
                  code: this.cityData[0].key
                }).then(response => {
                  this.districtData = response.data.data.list
                })
              }
            })
          }
        }
        // 联动到下级的值,防止显示上的错误,比如已选择,广东,广州,天河,如果直接跳回省份选择了广西,那对应的市与区的值就要重置
        this.cityName = '选择城市'
        this.areaName = ''
        this.streetName = ''
      }
      this.provinceReadyCode = code
      this.cityReadyCode = ''
      this.areaReadyCode = ''
      this.townReadyCode = ''
    },
    clickCity(city, code) {
      if (this.cityName === city) {
        this.fourRegionActive = 2
      } else {
        this.cityName = city
        this.fourRegionActive = 2
        for (var i in this.cityData) {
          if (this.cityData[i].value === city) {
            getDistrictList({
              code: code
            }).then(response => {
              this.districtData = response.data.data.list
              if (this.districtData < 2) {
                this.fourRegionActive = 3
                this.areaName = this.districtData[0].value
                this.areaReadyCode = this.districtData[0].key
                this.streetName = '选择街道'
                getDistrictList({
                  code: this.districtData[0].key
                }).then(response => {
                  this.streetData = response.data.data.list
                })
              }
            })
          }
        }
      }
      this.areaName = '选择区域'
      this.streetName = ''
      this.cityReadyCode = code
      this.areaReadyCode = ''
      this.townReadyCode = ''
    },
    clickDistrict(district, code) {
      for (var i in this.districtData) {
        if (this.districtData[i].value === district) {
          getDistrictList({
            code: code
          }).then(response => {
            const disChild = response.data.data.list
            if (disChild.length === 0) {
              this.areaName = district
              this.streetName = ''
              this.townReadyCode = ''
              this.areaReadyCode = code
              this.saveData()
            } else {
              this.streetData = response.data.data.list
              this.areaName = district
              this.streetName = '选择街道'
              this.fourRegionActive = 3
            }
          })
        }
      }
      this.areaReadyCode = code
      this.townReadyCode = ''
    },
    clickStree(street, code) {
      this.streetName = street
      this.townReadyCode = code
      this.saveData()
    },
    saveData() {
      const data = {}
      if (this.provinceName !== '选择省份') {
        data.provinceName = this.provinceName
      }
      if (this.cityName !== '选择城市') {
        data.cityName = this.cityName
        data.cityJson = this.cityData
      }
      if (this.areaName !== '选择区域') {
        data.areaName = this.areaName
        data.districtJson = this.districtData
      }
      if (this.streetName !== '选择街道') {
        data.streetName = this.streetName
        data.streetJson = this.streetData
      }

      this.formOptions.provinceName = data.provinceName
      this.formOptions.cityName = data.cityName
      this.formOptions.areaName = data.areaName
      this.formOptions.streetName = data.streetName
      this.formOptions.provinceCode = this.provinceReadyCode
      this.formOptions.cityCode = this.cityReadyCode
      this.formOptions.areaCode = this.areaReadyCode
      this.formOptions.streetCode = this.townReadyCode

      this.area = data.provinceName + data.cityName + data.areaName + data.streetName
      this.fourRegionShow = false
      this.$emit('save', data)
    },
    editAction() {
      this.provinceName = this.formOptions.provinceName !== '' ? this.formOptions.provinceName : '选择省份'
      this.cityName = this.formOptions.cityName !== '' ? this.formOptions.cityName : '选择城市'
      this.areaName = this.formOptions.areaName !== '' ? this.formOptions.areaName : '选择区域'
      this.streetName = this.formOptions.streetName !== '' ? this.formOptions.streetName : '选择街道'
      this.provinceReadyCode = this.formOptions.provinceCode
      this.cityReadyCode = this.formOptions.cityCode
      this.areaReadyCode = this.formOptions.areaCode
      this.townReadyCode = this.formOptions.streetCode
      getDistrictList({
        level: 1
      }).then(response => {
        this.areaJson = response.data.data.list
        for (var i in this.areaJson) {
          if (this.areaJson[i].value === this.provinceName) {
            this.cityData = this.areaJson[i].children
            for (var j in this.cityData) {
              if (this.cityData[j].value === this.cityName) {
                getDistrictList({
                  code: this.formOptions.cityCode
                }).then(response => {
                  this.districtData = response.data.data.list
                  for (var k in this.districtData) {
                    if (this.districtData[k].value === this.areaName) {
                      getDistrictList({
                        code: this.formOptions.areaCode
                      }).then(response => {
                        var stDList = []
                        stDList = response.data.data.list
                        if (stDList.length === 0) {
                          this.streetName = ''
                          this.fourRegionActive = 2
                        } else {
                          this.streetData = response.data.data.list
                          if (this.streetName === '') {
                            this.streetName = '请选择'
                          } else {
                            this.streetName = this.formOptions.streetName
                          }
                          this.fourRegionActive = 3
                        }
                      })
                    }
                  }
                })
              }
            }
          }
        }
      })
      this.regionLoading = false
      this.$nextTick(function() {
        this.fourRegionShow = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.addressAdd-container{
    background: #F7F8FA;
    height: 100%;
    overflow: auto;
    .deleteBox{
      margin: 0 15px;
    }
    .deleteBtn{
      margin-top: 20px;
      border: 1px solid #0091FF;
    }
    .fourRegionShow{
      h5{
        margin: 0;
        line-height: 40px;
        text-align: center;
        font-size: 16px;
        font-weight: normal;
      }
      .fourRegionShowContent{
        .area-list{
          padding-top: 10px;
          padding-bottom: 10px;
          height: 200px;
          overflow: scroll;
          z-index: 9999;
          .area-item{
            padding: 8px 20px;
            font-size: 14px;
          }
          .active{
            color: #f00;
            font-weight: bold;
          }
        }
      }
  }
  .switchBox{
    position: relative;
    .van-switch{
      position: absolute;
      right: 0;
    }
  }
  /deep/ .van-field__error-message{
    display: none;
  }
}
</style>
