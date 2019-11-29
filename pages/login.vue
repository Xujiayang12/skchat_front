<template name="me">
	<scroll-view scroll-y class="scrollPage">
		<view class="UCenter-bg"><image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image></view>
		<view class="padding flex text-center text-grey bg-white shadow-warp">
			<view class="flex flex-sub flex-direction solid-right"><view class="text-xxl text-green">请登录</view></view>
		</view>
		<view class="cu-list menu" :class="[menuBorder ? 'sm-border' : '', menuCard ? 'card-menu margin-top' : '']">
			<view class="cu-item">
				<view class="title">用户名</view>
				<input placeholder="" name="name" class="input-box" v-model="name" />
			</view>
			<view class="cu-item">
				<view class="title">密码</view>
				<input placeholder="" name="password" class="input-box" v-model="password" />
			</view>
			<view class="cu-item">
				<view class="title">服务器地址</view>
				<input placeholder="" name="server_url" class="input-box" v-model="server" />
			</view>
		</view>
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-green lg" @click="login">登录</button>
			<button class="cu-btn line-green margin-tb-sm lg" @click="to_signup">注册</button>
		</view>
		<!-- <view class="cu-tabbar-height"></view> -->
	</scroll-view>
</template>

<script>
export default {
	data() {
		return {
			name: '',
			password: '',
			server: 'http://127.0.0.1:5000'
		};
	},
	methods: {
		login() {
			this.$store.dispatch('Login', { name: this.name, password: this.password, server: this.server });
		},
		to_signup() {
			uni.redirectTo({
				url: 'signup'
			});
		}
	}
};
</script>

<style>
.UCenter-bg {
	background-image: url(/static/index.jpg);
	background-size: cover;
	height: 250rpx;
	display: flex;
	justify-content: center;
	padding-top: 0rpx;
	overflow: hidden;
	position: relative;
	flex-direction: column;
	align-items: center;
	color: #fff;
	font-weight: 300;
	text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}

.UCenter-bg text {
	opacity: 0.8;
}

.UCenter-bg image {
	width: 200rpx;
	height: 200rpx;
}

.UCenter-bg .gif-wave {
	position: absolute;
	width: 100%;
	bottom: 0;
	left: 0;
	z-index: 99;
	mix-blend-mode: screen;
	height: 100rpx;
}

.mapBox {
	left: 0;
	z-index: 99;
	mix-blend-mode: screen;
	height: 100rpx;
}

.mapBox {
	width: 750rpx;
	height: 300rpx;
}

.cu-item .title {
	width: 150rpx;
}

.cu-item .input-box {
	width: 550rpx;
	text-align: right;
}
</style>
