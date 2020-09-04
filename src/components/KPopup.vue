<template>
  <van-popup v-model="kPopupShow" :style="{ height: height }" class="kPopup" @closed="close">
    <template>
      <div class="rules">
        <div class="txt">
          <slot name="text" />
        </div>
      </div>
      <div class="close" @click="kPopupShow = false"><svg-icon icon-class="close" /></div>
    </template>
  </van-popup>
</template>
<script>
export default {
  name: 'KPopup',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      default: false,
      type: Boolean,
      required: false
    },
    // popup高度
    height: {
      default: 'auto',
      type: String,
      required: false
    }
  },
  data() {
    return {
      kPopupShow: this.value
    }
  },
  watch: {
    value(val) {
      this.kPopupShow = val
    }
  },
  methods: {
    close() {
      this.$emit('change', this.kPopupShow)
    }
  }
}
</script>

<style lang="less" scoped>
.kPopup{
  border-radius: 8px;
  overflow: visible;
  padding-bottom: 25px;
  max-height: 80%;
  min-height: 50%;
  .close{
    position: absolute;
    right: 19px;
    top: -8px;
    width:24px;
    height:38px;
    background:rgba(0,145,255,1);
    box-shadow:0px 2px 6px 0px rgba(0,145,255,0.4);
    border-radius:0px 0px 12px 12px;
    text-align: center;
    color: #ffffff;
    line-height: 38px;
    font-size: 14px;
  }
  .rules{
    width: 325px;
    line-height: 21px;
    max-height: -webkit-fill-available;
    overflow-y: auto;
    color: #666666;
    padding: 25px;
    padding-bottom: 0;
  }
}
</style>
