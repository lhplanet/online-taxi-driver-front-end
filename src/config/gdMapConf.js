/**
 * 高德地图配置文件
 */

export default {
    // 高德地图JS Api key
    key:'60daece4e0ae0ced0aff48d8a7d45a65',
    // 高德地图JS Api key对应的秘钥，正式环境最好不要放前端
    securityJsCode : 'd61010d02f21371741865152a6db8291',
    // 城市获取key
    // cityKey : 'fe5524e832a0fc6e2bcaf1bb781ac830',
    cityKey : '78462a297c925d75cbfbf4e58c8e1b95',
    // 高德城市请求地址（行政区域查询）
    cityApiUrl : 'https://restapi.amap.com/v3/config/district',
    // 默认选中城市 // TODO: 怎么办
    city: {
        adcode: "110000",
        center: "116.407387,39.904179",
        citycode: "010",
        name: "北京市"
    }
}
