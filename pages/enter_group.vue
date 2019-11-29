<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">加入群组</block>
		</cu-custom>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-title text-purple "></text>
				请输入你要加入的群组ID
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">群ID</view>
			<input placeholder="" name="groupid" v-model="groupid" />
		</view>
		<view class="padding flex flex-direction"><button class="cu-btn bg-purple lg" @click="enter_group">确认</button></view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			groupid: ''
		};
	},
	computed: {
		...mapState(['server', 'userid', 'name'])
	},
	methods: {
		enter_group() {
			uni.showLoading({
				title: '加载中'
			});
			let userid = this.userid;
			let server = this.server;
			let groupid = this.groupid;
			uni.request({
				url: this.server + '/api/entergroup',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					userid: userid,
					groupid: groupid
				},
				success: res => {
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: res.data.msg
					});
				}
			});
		}
	}
};
</script>

<style></style>
