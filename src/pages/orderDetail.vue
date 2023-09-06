<template>
    <view class="wrapper">
        <!-- <BSseMessage/> -->
        <BMap ref="mapRef"/>
        <view class="operation">
          <view class="icon-text">
            <!-- 添加上车图标 -->
            <image src="@/static/images/start-icon.png" class="icon" />
            <text class="start-address">{{orderDetail.departure}}</text>
          </view>
          <view class="icon-text">
            <image src="@/static/images/end-icon.png" class="icon" />
            <text class="end-address">{{orderDetail.destination}}</text>
          </view>

            <button class="btn" v-if="orderDetail.orderStatus === ORDER_STATUS.driverReceive" @click="handleGrabOrder">去接乘客</button>
            <button class="btn" v-if="orderDetail.orderStatus === ORDER_STATUS.driverToPickUp" @click="handleToDeparture">到达约定点</button>
            <button class="btn" v-if="orderDetail.orderStatus === ORDER_STATUS.driverArriveStartPoint" @click="handlePickUpPassenger">接到乘客</button>
            <button class="btn" v-if="orderDetail.orderStatus === ORDER_STATUS.tripStart" @click="handleTripFinish">到达目的地</button>
            <button class="btn" v-if="orderDetail.orderStatus === ORDER_STATUS.tripFinish" @click="handlePay">￥{{orderDetail.price}} 发起收款</button>
        </view>
    </view>
</template>
<script setup>
import { ApiGetCurrentOrder, ApiPostToPickUpPassenger, ApiPostOrderCancel, ApiPostOrderPayInfo, ApiPostPassengerOff, ApiPostPickUpPassenger, ApiPostToDeparture, ApiGetOrderDetail } from "../api/order"
import { HandleApiError, ShowToast } from "../utils";
import {ORDER_STATUS} from '../config/dicts'
// import BSseMessage from '../component/BSseMessage.vue';
import BMap from '../component/BMap.vue';
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import { _FormatDate } from "@gykeji/jsutil";
import { ApiPostUpdatePoint } from "../api/user";

const $store = useStore();
const currentPoint = computed(()=> $store.state.point);
let orderDetail = ref({});
let mapRef = ref(null);

onMounted(()=>{
    getOrderDetail();
})
const getOrderDetail = async () => {
    const {error, result} = await ApiGetCurrentOrder();
	console.log(result)
    if(result){
        orderDetail.value = result
      mapRef.value.driving([result.depLongitude, result.depLatitude], [result.destLongitude, result.destLatitude]);
    }else{
        uni.redirectTo({url:'/pages/index'});
    }
};
const handleCancel = async () =>{
    const {error, result} = await ApiPostOrderCancel({orderId: orderDetail.value.id});
    if(HandleApiError(error)){
        uni.redirectTo({url:'/pages/index'});
    }
}

const handleGrabOrder = async (item)=>{
    const {error, result} = await ApiPostToPickUpPassenger({
        orderId: orderDetail.value.id,
        toPickUpPassengerTime: _FormatDate(new Date(), 'yyyy-mm-dd hh:ii:ss'),
        toPickUpPassengerLongitude: currentPoint.value.lng,
        toPickUpPassengerLatitude: currentPoint.value.lat,
        toPickUpPassengerAddress: currentPoint.value.name,
      passengerId: 1 // TODO：测试使用
    });
    if(!HandleApiError(error)){
        orderDetail.value.orderStatus = ORDER_STATUS.driverToPickUp;

    }
}
/**
 * @Description: 到达约定点
 * @return {*}
 */
const handleToDeparture = async () => {
    const {error, result} = await ApiPostToDeparture({
        orderId: orderDetail.value.id,
      passengerId: 1 // TODO：测试使用
    });
    if(!HandleApiError(error)){
        orderDetail.value.orderStatus = ORDER_STATUS.driverArriveStartPoint;
    }
}
/**
 * @Description: 接到乘客，开始行程
 * @return {*}
 */
const handlePickUpPassenger = async ()=>{
    const {error, result} = await ApiPostPickUpPassenger({
         orderId: orderDetail.value.id,
         pickUpPassengerLongitude: currentPoint.value.lng,
         pickUpPassengerLatitude: currentPoint.value.lat,
      passengerId: 1 // TODO：测试使用
    });
    if(!HandleApiError(error)){
        orderDetail.value.orderStatus = ORDER_STATUS.tripStart;
        // 模拟车辆行驶，上报位置
        testUpdatePoint();
    }

}
const handleTripFinish = async ()=>{
    const res = await ApiPostPassengerOff({
        orderId: orderDetail.value.id,
        // 测试使用的最后位置
        passengerGetoffLongitude: '116.599002',
        passengerGetoffLatitude: '39.90909',
      passengerId: 1 // TODO：测试使用

        // passengerGetoffLongitude: currentPoint.value.lng,
        // passengerGetoffLatitude: currentPoint.value.lat
    });
	console.log(res,orderDetail.value.id);
	let {error} = res;
    if(HandleApiError(error)){
        return false;
    }
    const {error:detailError, result} = await ApiGetOrderDetail({
        orderId: orderDetail.value.id,
    });
    if(HandleApiError(detailError)){
        return false
    }
    orderDetail.value = result;
}
const handlePay = async () =>{
    const {error:er} = await ApiPostOrderPayInfo({
        orderId: orderDetail.value.id,
        price: orderDetail.value.price,
        passengerId: orderDetail.value.passengerId
    });
    if(!HandleApiError(er)){
        ShowToast('收款发起成功，请等待乘客付款');
        uni.redirectTo({url:'/pages/index'})
    }

}
/**
 * @Description: 模拟车辆行驶上报位置。8秒内上报完
 * 测试时方便使用
 * @return {*}
 */
const testUpdatePoint = async () =>{
    let time = new Date().getTime();
    const x = await ApiPostUpdatePoint({
        "carId": orderDetail.value.carId,
        "points": [
            {
                "location": "117.140109,36.667382",
                "locatetime": time + 1000
            },
            {
                "location": "117.137738,36.666754",
                "locatetime": time + 2000
            },
            {
                "location": "117.137738,36.666754",
                "locatetime": time + 3000
            },
            {
                "location": "117.137738,36.666754",
                "locatetime": time + 4000
            },
            {
                "location": "117.137738,36.666754",
                "locatetime": time + 5000
            },
            {
                "location": "117.137738,36.666754",
                "locatetime": time + 6000
            },
            {
                "location": "117.137738,36.666754",
                "locatetime": time + 7000
            },
            {
                "location": "117.137738,36.666754",
                "locatetime": time + 8000
            },
            {
              "location": "117.100101,36.659042",
              "locatetime": time + 9000
            }
        ]
    })
}
</script>
<style lang="scss" scoped>

.wrapper {
    width: 100%;
    height: calc(100vh - 30px);
}
.operation{
    position: fixed;
    bottom: 30rpx;
    left: 30rpx;
    right: 30rpx;
    background: $uni-bg-color;
    border-radius: $uni-border-radius-lg;
    z-index: 9;
    padding: $uni-spacing-row-max;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
}

.icon-text {
  display: flex;
  align-items: center;
}

.icon {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 10px;
}

.start-address, .end-address{
    height: 30rpx;
    //line-height: 30rpx;
    font-size: $uni-font-size-base;
    //display: flex;
    //align-items: center;
    padding: 0 $uni-spacing-lg;
    margin-bottom: $uni-spacing-big;
    //&::before{
    //    display: block;
    //    content: '';
    //    width: 10rpx;
    //    height: 10rpx;
    //    border-radius: 50%;
    //    background: #19c235;
    //    margin-right: $uni-spacing-row-base;
    //
    //}
}

//.end-address::before{
//    display: block;
//    content: '';
//    width: 10rpx;
//    height: 10rpx;
//    border-radius: 50%;
//    background: #f0ad4e;
//    margin-right: $uni-spacing-row-base;
//
//}

    .btn{
        //height: 100rpx;
        //line-height: 100rpx;
        font-size: $uni-font-size-lg;
        background: $uni-color-primary;
        color: $uni-text-color-inverse;
        margin: $uni-spacing-row-base 0;
    }
</style>
