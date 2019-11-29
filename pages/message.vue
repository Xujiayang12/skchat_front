<template name="message">
	<view>
		<image src="/static/msgBar.png" mode="widthFix" class="response"></image>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action" v-show="!connect">
				<text class="cuIcon-title text-gray"></text>
				消息列表[离线中]
			</view>
			<view class="action" v-show="connect">
				<text class="cuIcon-title text-green"></text>
				消息列表[在线中]
			</view>
		</view>
		<scroll-view scroll-y="true">
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item, index) in message_info" :key="index" @click="navMsg(item.userid, item.name)">
					<view class="cu-avatar round lg" :style="`background-image:url(${server}/api/avatar?userid=${item.userid > 100000 ? item.userid : 0});`"></view>
					<view class="content">
						<view class="text-grey">{{ item.name }}</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">{{ item.message }}</view>
						</view>
					</view>
					<view class="action">
						<view class="text-grey text-sm">{{ item.time }}</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {};
	},
	computed: {
		...mapState(['message_info', 'server', 'connect', 'userid'])
	},
	onLoad:function(){
		
	},
	beforeMount: function() {
		uni.showLoading({
			title: '加载中'
		});
		let server = this.server;
		let userid = this.userid;
		let that = this;
		uni.request({
			url: server + '/api/msg_list',
			data: {
				userid: userid
			},
			success: res => {
				uni.hideLoading();
				that.$store.state.message_info = res.data.data;
			}
		});
	},
	methods: {
		navMsg(id, name) {
			if (id < 100000) {
				uni.navigateTo({
					url: 'groupchat?groupid=' + id + '&name=' + name
				});
			} else {
				uni.navigateTo({
					url: 'chat?userid=' + id + '&name=' + name
				});
			}
		}
	}
};
</script>

<style></style>
