/**
 * @Description: 订单相关接口
 */

import { MsbRequest } from "../plugins/request";

/**
 * 获取订单详情
 * @param data
 * @returns {Promise<any>}
 * @constructor
 */
const ApiGetOrderDetail = (data= {orderId}) => MsbRequest.get('/order/detail',data);

/**
 * 取消订单
 * @param data
 * @returns {Promise<any>}
 * @constructor
 */
const ApiPostOrderCancel = ( data = {orderId}) => MsbRequest.post('/order/cancel',data);

/**
 * 去接乘客
 * @param data
 * @returns {Promise<any>}
 * @constructor
 */
const ApiPostToPickUpPassenger = (data = {orderId,toPickUpPassengerTime,toPickUpPassengerLongitude,toPickUpPassengerLatitude,toPickUpPassengerAddress}) => MsbRequest.post('/order/to-pick-up-passenger',data);

/**
 * 到达接乘客地点
 * @param data
 * @returns {Promise<any>}
 * @constructor
 */
const ApiPostToDeparture = (data = {orderId}) => MsbRequest.post('/order/arrived-departure', data)

/**
 * 接到乘客
 * @param data
 * @returns {Promise<any>}
 * @constructor
 */
const ApiPostPickUpPassenger = (data = { orderId, pickUpPassengerLongitude, pickUpPassengerLatitude}) => MsbRequest.post('/order/pick-up-passenger', data)

/**
 * 乘客下车
 * @param data
 * @returns {Promise<any>}
 * @constructor
 */
const ApiPostPassengerOff = (data = { orderId, passengerGetoffLongitude, passengerGetoffLatitude}) => MsbRequest.post('/order/passenger-getoff', data)

/**
 * 发起支付
 * @param data
 * @returns {Promise<any>}
 * @constructor
 */
const ApiPostOrderPayInfo = (data = {orderId, price, passengerId}) => MsbRequest.post('/pay/push-pay-info',data, {
  "content-type" : 'application/x-www-form-urlencoded'
})

/**
 * 获取当前订单
 * @returns {Promise<any>}
 * @constructor
 */
const ApiGetCurrentOrder = () => MsbRequest.get('/order/current')


export {
  ApiGetOrderDetail,
  ApiPostOrderCancel,
  ApiPostToPickUpPassenger,
  ApiPostToDeparture,
  ApiPostPickUpPassenger,
  ApiPostPassengerOff,
  ApiPostOrderPayInfo,
  ApiGetCurrentOrder

}
