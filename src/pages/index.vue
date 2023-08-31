<template>
  <BSseMessage @receiveOrder="handleReceiveOrder"/>
  <view class="table">
    <view class="table-item">基本信息
<!--      {{userInfo.value.driverName}}-->
<!--         {{userInfo.value.driverPhone}}-->

    </view>
    <view class="table-item">车辆信息

<!--        {{userInfo.value.carNumber}} {{userInfo.value.carType}}-->

    </view>
    <view class="table-item btn-item">
      <button @click="handleAccount()">系统设置</button>
    </view>
  </view>
  <view class="operation">
    <!-- 不同状态下方按钮不同 -->
    <template v-if="workStatus === 1">
      <view class="desc">听单中...</view>
      <button class="btn btn__waring" @click="handleWorkStatus(0)">收车</button>
    </template>
    <template v-else>
      <view class="desc">勤劳的小蜜蜂，要开始工作了吗？</view>
      <button class="btn " @click="handleWorkStatus(1)">出车</button>
    </template>
  </view>
</template>


<script setup>
import UEmpty from '../component/UEmpty.vue';
import BSseMessage from '../component/BSseMessage.vue';
import {computed, onMounted, ref} from 'vue';
import {useStore} from 'vuex';
import {ApiPostToPickUpPassenger, ApiGetCurrentOrder} from '../api/order';
import {HandleApiError} from '../utils';
import {_FormatDate} from '@gykeji/jsutil';
import {ApiGetWorkStatus, ApiPostUpdateWorkStatus, ApiPostUpdatePoint, ApiGetUserCarInfo} from '../api/user';

const $store = useStore();
const userInfo = computed(() => $store.state.userInfo);
let workStatus = ref(null);

// 首页加载时获取司机的车辆信息
onMounted(() => {
  getUserCarInfo();
})

// 点击出车/收车按钮，跳转到订单页面
const handleReceiveOrder = () => {
  uni.navigateTo({url: '/pages/orderDetail'});
}

// 获取司机的车辆信息
const getUserCarInfo = async () => {

  console.log("==================================="+userInfo.value.driverId)
  console.log("==================================="+userInfo.value.carId)
  console.log("==================================="+userInfo.value.workStatus)

  // 获取司机的车辆信息
  const {error, result} = await ApiGetUserCarInfo();
  if (result) {

    console.log("================================")
    console.log(result)

    // 存储司机的车辆信息
    $store.commit('setUserInfo', result);
    // 获取司机的工作状态
    getWorkStatus();
    // 获取司机的当前订单
    getCurrentOrder();

    // updatePoint();
    // 测试用
    testUpdatePoint({
      lat: '39.924477',
      lng: '116.615574',
      name: '草房'
    });
  }
}

// 获取司机的工作状态
const getWorkStatus = async () => {
  const {error, result} = await ApiGetWorkStatus({
    driverId: userInfo.value.driverId
  });
  workStatus.value = result.workStatus;
}

// 获取司机的当前订单
const getCurrentOrder = async () => {
  const {error, result} = await ApiGetCurrentOrder();
  if (result) {
    // 如果司机有当前订单，跳转到订单详情页面
    uni.redirectTo({url: '/pages/orderDetail'});
  }
};

/**
 * @Description: 上报当前位置 测试用
 * @param {*} lng
 * @param {*} lat
 * @param {*} name
 * @return {*}
 */
const testUpdatePoint = async ({lng, lat, name}) => {
  const {error} = await ApiPostUpdatePoint({
    carId: userInfo.value.carId,
    points: [{
      location: `${lng},${lat}`,
      locatetime: new Date().getTime()
    }]
  })
  if (!error) {
    $store.commit('setPoint', {lng, lat, name})
  }
}

/**
 * @Description: 定时3秒上报当前位置
 * @return {*}
 */
const updatePoint = () => {
  uni.getLocation({
    type: 'gcj02',
    geocode: true,
    success: async (result) => {
      const {error} = await ApiPostUpdatePoint({
        carId: userInfo.value.carId,
        points: [{
          location: `${result.longitude},${result.latitude}`,
          locatetime: new Date().getTime()
        }]
      });
      if (!error) {
        $store.commit('setPoint', {lng: result.longitude, lat: result.latitude, name: result.city})
      }
      setTimeout(() => {
        updatePoint()
      }, 3000)
    }
  });
}

// 点击按钮，切换出车/收车状态
const handleWorkStatus = async (status) => {
  const {error, result} = await ApiPostUpdateWorkStatus({
    driverId: userInfo.value.driverId,
    workStatus: status
  });
  if (!HandleApiError(error)) {
    workStatus.value = status;
  }

}
const handleAccount = () => {
  uni.navigateTo({url: '/pages/account'});
}
</script>


<style lang="scss" scoped>
.table{
    margin: $uni-spacing-max;
    &-item{
        border-bottom: 1px solid $uni-border-color;
        height: 60rpx;
        line-height: 60rpx;
        font-size: $uni-font-size-base;
        color: $uni-text-color;
    }
	.btn-item{
		margin-top: $uni-spacing-max;
	}
}
.operation{
    position: fixed;
    bottom: 50rpx;
    left: 0;
    right: 0;
    text-align: center;
    .desc{
        font-size: $uni-font-size-base;
        color: $uni-text-color-grey;
    }
    .btn{
        width: 200rpx;
        height: 200rpx;
        line-height: 180rpx;
        border-radius: 50%;
        background: $uni-color-primary;
        color: $uni-text-color-inverse;
        font-size: 46rpx;
        margin-top: 30rpx;
        &::after{
            box-shadow: none;
        }
        &__waring{
            background: $uni-color-warning;
        }
    }
}
</style>
