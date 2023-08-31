/**
 * 处理api错误
 * @param error
 * @param name
 * @returns {boolean}
 * @constructor
 */
const HandleApiError = (error, name) =>{
    let result = false;
    if (error) {
        const tip = name ? `${name}错误：` : '';
        ShowToast(error.message ? `${tip}${error.message}` : `请求失败: ${error}`);
        result = true;
    }
    return result;
}

/**
 * 显示提示
 * @param str
 * @constructor
 */
const ShowToast = (str) =>{
    uni.showToast({title:str,duration:3000, icon:'none'});
}


export {
    HandleApiError,
    ShowToast
}
