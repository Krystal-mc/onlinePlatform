<template>
  <div class="addressEdit-container">
    <addressAdd />
  </div>
</template>

<script>
import addressAdd from '../../views/address/addressAdd'
export default {
  name: 'AddressEdit',
  components: {
    'addressAdd': addressAdd
  },
  data() {
    return {

    }
  },
  watch: {

  },
  created() {
  },
  mounted() {

  },
  destroyed() {
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.addressEdit-container{
    background: #F7F8FA;
    height: 100%;
    overflow: auto;

}
</style>
