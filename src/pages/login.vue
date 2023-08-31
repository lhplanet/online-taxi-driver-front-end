<template>
  <view class="container">
    <view class="logo" @dblclick="handleAccount">网约车-司机端</view>
    <view class="login">
      <input placeholder="请输入手机号" type="number" maxlength="11" v-model="phone" class="login--input"/>
      <view class="login--code">
        <input placeholder="请输入验证码" type="number" maxlength="6" class="login--input" v-model="code"/>
        <text @click="handleGetVerifyCode" :class="['login--send-btn', {'login--send-btn__disabled':isDisableCode}]">
          {{ codeText }}
        </text>
      </view>
    </view>
    <button class="login--btn" @click="handleLogin">登录</button>
  </view>
</template>


<script setup>
import {_IsPhone} from '@gykeji/jsutil';
import {computed, onMounted, ref} from 'vue';
import {ApiGetVerifyCode, ApiPostVerifyCodeCheck, ApiGetDriverInfo, ApiGetWorkStatus} from '../api/user'
import {HandleApiError, ShowToast} from '../utils';
import {useStore} from 'vuex';

const $store = useStore();
const token = computed(() => $store.state.token);
// 获取验证码按钮文字
let codeText = ref('获取验证码');
// 重新获取验证码倒计时
let codeTimerNum = ref(0);
// 重新获取验证码倒计时定时器
let codeTimer = null;
// 获取验证码按钮是否禁用
let isDisableCode = computed(() => codeTimerNum.value !== 0);
// 手机号输入框内容
let phone = ref('');
// 验证码输入框内容
let code = ref('');

// 如果已经登录，token还有效，直接跳转到首页
onMounted(() => {
  if (token.value) {
    uni.redirectTo({url: '/pages/index'});
  }
})

// 获取验证码
const handleGetVerifyCode = async () => {
  // 验证手机号
  if (isDisableCode.value || !verifyPhone(phone.value)) {
    return false;
  }
  // 设置重新获取验证码倒计时
  codeTimerNum.value = 10;
  // 开始倒计时
  calcTimer();
  // 发送验证码
  const {error, result} = await ApiGetVerifyCode({driverPhone: phone.value});
  // 如果发送成功，显示提示
  if (!HandleApiError(error)) {
    ShowToast('验证码发送成功');
  }
}

// 验证手机号
const verifyPhone = (phone) => {
  let result = phone && _IsPhone(phone);
  if (!result) {
    ShowToast('请填写正确手机号！');
    result = false;
  }
  return result;
}

// 重新获取验证码倒计时定时器
const calcTimer = () => {
  codeTimerNum.value--;
  if (codeTimerNum.value === 0) {
    clearTimeout(codeTimer);
    codeText.value = '获取验证码';
    return false;
  }
  codeText.value = `${codeTimerNum.value}s后重新获取`;
  setTimeout(() => {
    calcTimer();
  }, 1000)
}

// 登录
const handleLogin = async () => {
  if (!verifyPhone(phone.value)) {
    return false;
  }
  if (!code.value) {
    ShowToast('请输入正确验证码');
    return false;
  }
  // 校验验证码
  const {error, result} = await ApiPostVerifyCodeCheck({
    driverPhone: phone.value,
    verificationCode: code.value
  });
  // 如果校验成功，保存token，跳转到首页
  if (!HandleApiError(error)) {
    $store.commit('setToken', result.accessToken);
    getDriverInfo();
    uni.redirectTo({url: '/pages/index'});
  }
}

// 获取司机信息
const getDriverInfo = async () => {
  const {error, result} = await ApiGetDriverInfo({driverPhone: phone.value});

  console.log("--------------");
  console.log(result);

  if (!HandleApiError(error)) {
    $store.commit('setUserInfo', result);
  }
}

// TODO: 双击logo跳转到账号管理页面，方便测试，上线时删除
const handleAccount = () => {
  uni.navigateTo({url: '/pages/account'})
}
</script>


<style lang="scss" scoped>
.logo{
	font-size: 46rpx;
	text-align: center;
	margin: 100rpx 0 84rpx 0;
	font-weight: bold;
}
.login{
	width: 650rpx;
	margin: 0 auto;
	&--input{
		border-bottom: 2rpx solid $uni-border-color;
		width: 650rpx;
		height: 100rpx;
		font-size: $uni-font-size-lg;
	}
	&--code{
		position: relative;
	}
	&--send-btn{
		position: absolute;
		right: 0;
        top: 36rpx;
		color: $uni-color-primary;
		&__disabled{
            color: $uni-text-color-disable;
		}
	}
	&--btn{
		width: 650rpx;
		font-size: $uni-font-size-lg;
		margin: 60rpx 50rpx 40rpx;
        background: $uni-color-primary;
        color: $uni-text-color-inverse;
	}
}
</style>
