<template name="me">
	<scroll-view scroll-y class="scrollPage">
		<view class="UCenter-bg"><image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image></view>
		<view class="padding flex text-center text-grey bg-white shadow-warp">
			<view class="flex flex-sub flex-direction solid-right"><view class="text-xxl text-purple">请注册</view></view>
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
				<view class="title">性别</view>
				<picker @change="PickerChange" :value="index" :range="picker">
					<view class="picker">{{ index > -1 ? picker[index] : '请点击选择' }}</view>
				</picker>
			</view>
			<view class="cu-item">
				<view class="title">服务器地址</view>
				<input placeholder="" name="server_url" class="input-box" v-model="server" />
			</view>
		</view>
		<view class="padding flex flex-direction"><button class="cu-btn bg-purple lg" @click="signUP">注册</button></view>
		<!-- <view class="cu-tabbar-height"></view> -->
	</scroll-view>
</template>

<script>
export default {
	data() {
		return {
			name: '',
			password: '',
			sex: '',
			index: -1,
			picker: ['男', '女'],
			server: 'http://127.0.0.1:5000'
		};
	},
	methods: {
		PickerChange(e) {
			this.index = e.detail.value;
		},
		signUP() {
			let real_sex = this.index === 0 ? '男' : '女';
			this.$store.dispatch('SignUp', { name: this.name, password: this.password, server: this.server, sex: real_sex });
		}
	}
};
</script>

<style scoped>
.UCenter-bg {
	background-image: url(/static/signupBg.png);
	background-size: cover;
	height: 150rpx;
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
