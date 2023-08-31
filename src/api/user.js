/**
 * @Description: 用户相关接口
 */

import { MsbRequest } from '../plugins/request';

/**
 * @Description: 获取验证码
 * @param {*} passengerPhone
 * @return {*}
 */
const ApiGetVerifyCode = ({driverPhone}) => MsbRequest.post('/verification-code',{
    driverPhone
},{notVerifyToken:true})

/**
 * 校验验证码
 * @param driverPhone
 * @param verificationCode
 * @returns {Promise<any>}
 * @constructor
 */
const ApiPostVerifyCodeCheck = ({driverPhone,verificationCode}) => MsbRequest.post('/verification-code-check',{
    driverPhone,
    verificationCode,
},{notVerifyToken:true})

/**
 * 获取司机的信息
 * @param data
 * @returns {Promise<any>}
 * @constructor
 */
const ApiGetDriverInfo = (data = {driverPhone}) => MsbRequest.get('/user-info', data)

/**
 * 获取司机的车辆信息
 * @returns {Promise<any>}
 * @constructor
 */
const ApiGetUserCarInfo = () => MsbRequest.get('/driver-car-binding-relationship');

/**
 * 上传司机的位置信息
 * @param data
 * @returns {Promise<any>}
 * @constructor
 */
const ApiPostUpdatePoint = (data = {carId, points}) => MsbRequest.post('/point/upload', data);

/**
 * 获取司机的工作状态
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
const ApiGetWorkStatus = (params = {driverId}) => MsbRequest.get('/work-status', params);

/**
 * 更新司机的工作状态
 * @param data
 * @returns {Promise<any>}
 * @constructor
 */
const ApiPostUpdateWorkStatus = (data = {driverId, workStatus}) => MsbRequest.post('/driver-user-work-status', data)

export {
    ApiGetVerifyCode,
    ApiPostVerifyCodeCheck,
    ApiGetUserCarInfo,
    ApiPostUpdatePoint,
    ApiGetWorkStatus,
    ApiPostUpdateWorkStatus,
    ApiGetDriverInfo
}
