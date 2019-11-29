<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">创建群组</block>
		</cu-custom>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-title text-purple "></text>
				请输入你要创建的群组昵称
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">群昵称</view>
			<input placeholder="" name="nick" v-model="nick" />
		</view>
		<view class="padding flex flex-direction"><button class="cu-btn bg-purple lg" @click="add_group">确认</button></view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			nick: ''
		};
	},
	computed: {
		...mapState(['server', 'userid', 'name'])
	},
	methods: {
		add_group() {
			uni.showLoading({
				title: '加载中'
			});
			let userid = this.userid;
			let server = this.server;
			let nick = this.nick;
			uni.request({
				url: this.server + '/api/addgroup',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					userid: userid,
					name: nick
				},
				success: res => {
					uni.hideLoading();
					uni.showModal({
						title: '群聊ID',
						content: res.data.msg
					});
				}
			});
		}
	}
};
</script>

<style></style>
