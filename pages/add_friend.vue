<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">添加好友</block>
		</cu-custom>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-title text-purple "></text>
				请输入好友ID
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">好友ID</view>
			<input placeholder="" name="id" v-model="friendid" />
		</view>
		<view class="padding flex flex-direction"><button class="cu-btn bg-purple lg" @click="add_friend">确认</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			friendid: ''
		};
	},
	methods: {
		add_friend() {
			this.$store.dispatch('addFriend', { friendid: this.friendid });
		}
	}
};
</script>

<style></style>
