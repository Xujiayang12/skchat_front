<template name="me">
	<scroll-view scroll-y class="scrollPage">
		<view class="UCenter-bg" style="background-image: url(/static/index.jpg);">
			<image :src="`${server}/api/avatar?userid=${userid}`" class="cu-avatar round" mode="widthFix"></image>
			<view class="text-xl">{{ name }}</view>
			<view class="margin-top-sm">
				<text>ID: {{ userid }}</text>
			</view>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>
		<view class="padding flex text-center text-grey bg-white shadow-warp"></view>
		<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
			<view class="cu-item arrow">
				<view class="content" @click="navLogin">
					<text class="cuIcon-repeal text-grey"></text>
					<text class="text-grey">切换账号</text>
				</view>
			</view>
		</view>
		<view class="cu-tabbar-height"></view>
	</scroll-view>
</template>

<script>
export default {
	data() {
		return {
			name: '',
			server: '',
			userid: ''
		};
	},
	beforeMount: function() {
		uni.getStorage({
			key: 'name',
			success: res => {
				this.name = res.data;
			}
		});
		uni.getStorage({
			key: 'server',
			success: res => {
				this.server = res.data;
			}
		});
		uni.getStorage({
			key: 'userid',
			success: res => {
				this.userid = res.data;
			}
		});
	},
	methods: {
		navLogin() {
			uni.navigateTo({
				url: 'login'
			});
		}
	}
};
</script>

<style>
.UCenter-bg {
	background-image: url(/static/index.jpg);
	background-size: cover;
	height: 350rpx;
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
</style>
