<template>
  <BSseMessage @receiveOrder="handleReceiveOrder"/>
  <view class="table">
    <view class="table-item table-item-one">
      <div class="title">司机信息</div>
      <div class="info">
        <div class="info-item">司机姓名：</div>
        <div class="info-value">{{ driverInfoTable.driverName }}</div>
      </div>
      <div class="info">
        <div class="info-item">司机手机号：</div>
        <div class="info-value">{{ driverInfoTable.driverPhone }}</div>
      </div>
    </view>
    <view class="table-item table-item-two">
      <div class="title">车辆信息</div>
      <div class="info">
        <div class="info-item">车辆号牌：</div>
        <div class="info-value">{{ carInfoTable.vehicleNo }}</div>
      </div>
      <div class="info">
        <div class="info-item">车辆厂牌：</div>
        <div class="info-value">{{ carInfoTable.brand }}</div>
      </div>
      <div class="info">
        <div class="info-item">车辆型号：</div>
        <div class="info-value">{{ carInfoTable.model }}</div>
      </div>
      <div class="info">
        <div class="info-item">车辆颜色：</div>
        <div class="info-value">{{ getCarColor(carInfoTable.vehicleColor) }}</div>
      </div>
      <div class="info">
        <div class="info-item">核定载客位：</div>
        <div class="info-value">{{ carInfoTable.seats }}</div>
      </div>
    </view>
    <view class="table-item btn-item sys-btn">
      <view @click="handleAccount()">设置</view>
    </view>
  </view>
  <view class="operation">
    <!-- 不同状态下方按钮不同 -->
    <template v-if="workStatus === 1">
      <view class="desc">听单中...</view>
      <button class="btn btn__waring" @click="handleWorkStatus(0)">收车</button>
    </template>
    <template v-else>
<!--      <view class="desc">勤劳的小蜜蜂，要开始工作了吗？</view>-->
      <button class="btn " @click="handleWorkStatus(1)">出车</button>
    </template>
  </view>
</template>


<script setup>
import BSseMessage from '../component/BSseMessage.vue';
import {computed, onMounted, ref} from 'vue';
import {useStore} from 'vuex';
import { ApiGetCurrentOrder} from '../api/order';
import {HandleApiError} from '../utils';
import {
  ApiGetWorkStatus,
  ApiPostUpdateWorkStatus,
  ApiPostUpdatePoint,
  ApiGetUserCarInfo,
  ApiGetCarInfo,
  ApiGetDriverInfo
} from '../api/user';

const $store = useStore();
const userInfo = computed(() => $store.state.userInfo);
// const phone = computed(() => $store.state.phone);
let workStatus = ref(null);
let carInfoTable = ref({});
let driverInfoTable = ref({});

// onLoad(() => {
//   getDriverInfo();
//   getCarInfo();
//   getUserCarInfo();
// })

// 首页加载时获取司机的车辆信息
onMounted(() => {
  getDriverInfo();
  getCarInfo();
  getUserCarInfo();
})

const getCarColor = (colorNumber) => {
  const colorMap = {
    1: '白色',
    2: '黑色',
    3: '红色',
    4: '蓝色',
    5: '黄色',
    6: '绿色',
    7: '灰色',
    9: '其他',
  };

  return colorMap[colorNumber] || '未知颜色';
};

// 点击出车/收车按钮，跳转到订单页面
const handleReceiveOrder = () => {
  uni.navigateTo({url: '/pages/orderDetail'});
}

const getCarInfo = async () => {
  const {error, result} = await ApiGetCarInfo({
    carId: userInfo.value.carId
  });
  if(result){
    console.log("================================")
    console.log(result)
    carInfoTable.value = result;
    console.log(carInfoTable)
    console.log(carInfoTable.vehicleNo)
  }
}

const getDriverInfo = async () => {
  console.log("===================driverPhone================"+userInfo.value.driverId)
  const {error, result} = await ApiGetDriverInfo({
    driverId: userInfo.value.driverId
  });
  if(result){
    console.log("================================")
    console.log(result)
    driverInfoTable.value = result;
    console.log(driverInfoTable)
    console.log(driverInfoTable.driverName)
  }
}

// 获取司机的车辆信息
const getUserCarInfo = async () => {

  console.log("=============="+userInfo.value.driverId)
  console.log("=============="+userInfo.value.driverName)
  console.log("=============="+userInfo.value.driverPhone)
  console.log("=============="+userInfo.value.carId)
  console.log("=============="+userInfo.value.workStatus)

  // 获取司机的车辆信息
  const {error, result} = await ApiGetUserCarInfo();
  if (result) {

    console.log("================================")
    console.log(result)

    // result.add('driverPhone', userInfo.value.driverPhone);

    // 存储司机的车辆信息
    $store.commit('setUserInfo', result);
    // 获取司机的工作状态
    getWorkStatus();
    // 获取司机的当前订单
    getCurrentOrder();

    // updatePoint();
    // 测试用
    testUpdatePoint({
      lat: '36.667382',
      lng: '117.140109',
      name: '山东大学软件学院'
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
.sys-btn {
  position: fixed;
  background: #fff;
  padding: 7rpx 15rpx 10rpx;
  z-index: 9;
  top: calc(var(--window-top) + 30rpx);
  right: 30rpx;
  border-radius: 8rpx;
  box-shadow: 0 3rpx 5rpx 5rpx #ccc;
  font-size: $uni-font-size-sm;
  //font-weight: bold;
  color: $uni-text-color;
  display: flex;
  align-items: center;
}
//.table{
//    margin: $uni-spacing-max;
//    &-item{
//        border-bottom: 1px solid $uni-border-color;
//        height: 60rpx;
//        line-height: 60rpx;
//        font-size: $uni-font-size-base;
//        color: $uni-text-color;
//    }
//	.btn-item{
//		margin-top: $uni-spacing-max;
//	}
//}
.table {
  margin: $uni-spacing-max 30px; /* 增大左间距两倍，并增大基本信息表格和车辆信息表格之间的间距 */
  font-size: 18px; /* 缩小字体大小 */

  &-item {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid $uni-border-color;
    color: $uni-text-color;

    .title {
      font-weight: bold;
      font-size: 20px; /* 增大标题字体大小 */
      margin-bottom: 25px;
      text-align: left;
    }

    .info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px; /* 增大属性和值之间的间距 */

      .info-item {
        flex: 1;
        text-align: left;
        white-space: nowrap;
        font-weight: bold;
        color: $uni-text-color-grey;
      }

      .info-value {
        flex: 2;
        text-align: left; /* 左对齐 */
      }
    }
  }
  .table-item-one, .table-item-two {
    margin-top: 40px;
    margin-bottom: 40px; /* 增大基本信息表格和车辆信息表格之间的间距 */
    border-radius: 10px; /* 设置为圆角 */
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); /* 调整阴影颜色 */
    padding: 20px; /* 增加卡片内边距 */
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
        //width: 600rpx;
        //height: 100rpx;
        //line-height: 100rpx;
        //border-radius: 5%;
        //background: $uni-color-primary;
        //color: $uni-text-color-inverse;
        //font-size: 46rpx;
        //margin-top: 30rpx;
      width: 650rpx;
      font-size: $uni-font-size-lg;
      margin: 60rpx 50rpx 40rpx;
      background: $uni-color-primary;
      color: $uni-text-color-inverse;
        &::after{
            box-shadow: none;
        }
        &__waring{
            background: $uni-bg-color-grey;
          color: $uni-text-color;
          border: 1px solid $uni-border-color;
        }
    }

}
</style>
