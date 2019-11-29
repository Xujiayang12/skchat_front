<template>
	<view>
		<message v-if="PageCur=='basics'"></message>
		<contact v-if="PageCur=='component'"></contact>
		<me v-if="PageCur=='plugin'"></me>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action" @click="NavChange" data-cur="basics">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/basics' + [PageCur=='basics'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='basics'?'text-green':'text-gray'">消息</view>
			</view>
			<view class="action" @click="NavChange" data-cur="component">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/component' + [PageCur == 'component'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='component'?'text-green':'text-gray'">联系人</view>
			</view>
			<view class="action" @click="NavChange" data-cur="plugin">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/plugin' + [PageCur == 'plugin'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='plugin'?'text-green':'text-gray'">我的</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
		return {
				PageCur: 'basics'
			}
		},
		beforeMount:function(){
			uni.getStorage({
				key: 'name',
				success: (res) => {
					console.log(res);
					this.$store.state.name = res.data;
				},
				fail: () => {
					uni.redirectTo({
						url: 'login'
					})
				}
			});
			uni.getStorage({
				key: 'server',
				success: (res) => {
					this.$store.state.server = res.data;
				}
			});
			uni.getStorage({
				key: 'userid',
				success: (res) => {
					this.$store.state.userid = res.data;
				}
			});
		},
		methods: {
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			}
		}
	}
</script>

<style>

</style>
