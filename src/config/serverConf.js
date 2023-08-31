/**
 * 服务配置
 */

export default { // TODO: 服务配置？
    // #ifdef H5
        // sse服务
        sse: '/sseApi',
        // 其他接口服务
        other: '/api',
    // #endif

    // #ifdef APP-PLUS || MP
        // sse服务
        // sse: 'http://192.168.40.193:60001',
        sse: 'http://127.0.0.1:9000',
        // 其他接口服务
        other: 'http://127.0.0.1:8088'
    // #endif
}
