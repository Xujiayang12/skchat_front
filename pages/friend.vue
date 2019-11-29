<template name="me">
	<scroll-view scroll-y class="scrollPage">
		<view class="UCenter-bg" style="background-image: url(/static/friendBg.png);">
			<image :src="`${server}/api/avatar?userid=${friendid}`" class="cu-avatar round" mode="widthFix"></image>
			<view class="text-xl">{{ name }}</view>
			<view class="margin-top-sm">
				<text>{{ friendid }}</text>
			</view>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>
		<view class="padding flex text-center text-grey bg-white shadow-warp"></view>
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-selection text-green"></text>
					<text class="text-grey">性别</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{ sex }}</text>
				</view>
			</view>
		</view>
		<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
			<view class="cu-item arrow" @click="navMsg">
				<view class="content">
					<text class="cuIcon-message text-green"></text>
					<text class="text-grey">发消息</text>
				</view>
			</view>
			<view class="cu-item arrow" @click="navVideo">
				<view class="content" bindtap="showQrcode">
					<text class="cuIcon-phone text-cyan"></text>
					<text class="text-grey">视频聊天</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<button class="cu-btn content" open-type="feedback">
					<text class="cuIcon-delete text-red"></text>
					<text class="text-grey">删除好友</text>
				</button>
			</view>
		</view>
		<view class="cu-tabbar-height"></view>
	</scroll-view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			name: '',
			friendid: '',
			sex: ''
		};
	},
	computed: {
		...mapState(['server', 'userid'])
	},
	onLoad: function(res) {
		this.friendid = res.userid;
		uni.request({
			url: this.server + '/api/userdata',
			method: 'POST',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				userid: this.friendid
			},
			success: res => {
				this.name = res.data.name;
				this.friendid = res.data.userid;
				this.sex = res.data.sex;
			}
		});
	},
	methods: {
		navMsg() {
			uni.navigateTo({
				url: 'chat?userid=' + this.friendid + '&name=' + this.name
			});
		},
		navVideo() {
			let msg_data = { type: 6, from: this.userid, to: this.friendid, msg: 'call' };
			let msg_send = JSON.stringify(msg_data);
			uni.sendSocketMessage({
				data: msg_send
			});
			uni.navigateTo({
				url: 'video?userid=' + this.friendid + '&name=' + this.name + "&type=answer"
			});
		}
	}
};
</script>

<style>
.UCenter-bg {
	background-image: url(/static/index.jpg);
	background-size: cover;
	height: 600rpx;
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
