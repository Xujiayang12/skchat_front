<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{ groupname }} - {{ groupid }}</block>
		</cu-custom>
		<view class="padding bg-white" v-show="getUploadShow">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				上传中
			</view>
			<view class="flex margin-top">
				<view class="cu-progress round"><view class="bg-green" :style="[{ width: upload + '%' }]"></view></view>
				<text class="margin-left">{{ upload }}%</text>
			</view>
		</view>
		<view class="cu-chat">
			<view v-for="(msg, index) in secret_info.data" :key="index">
				<view class="cu-item self" v-show="getShow(msg.userid)">
					<view class="date">{{ msg.time }} | {{msg.name}}</view>
					<view class="main">
						<view class="content bg-green shadow" v-if="!getPicShow(msg.type)">
							<text>{{ msg.msg }}</text>
						</view>
						<image v-else :src="`${server}/api/downloadpic?filename=${msg.msg}`" class="radius" mode="widthFix" @click="previewPic(msg.msg)"></image>
					</view>
					<view class="cu-avatar radius" :style="`background-image:url(${server}/api/avatar?userid=${msg.userid});`"></view>
				</view>
				<view class="cu-item" v-show="!getShow(msg.userid)">
					<view class="cu-avatar radius" :style="`background-image:url(${server}/api/avatar?userid=${msg.userid});`"></view>
					<view class="date ">{{msg.name}} | {{ msg.time }}</view>
					<view class="main">
						<view class="content bg-green shadow" v-if="!getPicShow(msg.type)">
							<text>{{ msg.msg }}</text>
						</view>
						<image v-else :src="`${server}/api/downloadpic?filename=${msg.msg}`" class="radius" mode="widthFix" @click="previewPic(msg.msg)"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-bar foot input" :style="[{ bottom: InputBottom + 'px' }]">
			<!-- <view class="action" onclick="document.getElementById('upload').click()"><text class="cuIcon-file text-grey"></text></view> -->
			<view class="action" @click="sendPic"><text class="cuIcon-pic text-grey"></text></view>
			<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10" @focus="InputFocus" @blur="InputBlur" v-model="msg_text" />
			<button class="cu-btn bg-green shadow" @click="sendMessage" @keyup.enter="sendMessage">发送</button>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			msg_text: '',
			groupid: 0,
			groupname: '',
			InputBottom: 0,
			upload: 0
		};
	},
	onLoad: function(res) {
		this.groupid = res.groupid;
		this.groupname = res.name;
	},
	mounted: function() {
		uni.pageScrollTo({
			scrollTop: 300,
			duration: 10
		});
		uni.pageScrollTo({
			scrollTop: 1000000,
			duration: 150
		});
	},
	beforeMount: function() {
		let server = this.server;
		let groupid = this.groupid;
		let that = this;
		uni.showLoading({
			title: '加载中'
		});
		uni.request({
			url: server + '/api/group',
			data: {
				groupid: groupid
			},
			success: res => {
				uni.hideLoading();
				that.$store.state.secret_info = res.data;
			}
		});
	},
	computed: {
		...mapState(['server', 'userid', 'name', 'secret_info']),
		getUploadShow() {
			if (this.upload != 0) {
				console.log(this.upload);
				return true;
			}
		}
	},
	methods: {
		previewPic(filename) {
			let server = this.server;
			uni.previewImage({
				urls: [server + '/api/downloadpic?filename=' + filename]
			});
		},
		getShow(id) {
			if (this.userid === id) {
				return true;
			} else {
				return false;
			}
		},
		getPicShow(type) {
			if (type == 'image') {
				return true;
			} else {
				return false;
			}
		},
		InputFocus(e) {
			this.InputBottom = e.detail.height;
		},
		InputBlur(e) {
			this.InputBottom = 0;
		},
		getShow(id) {
			if (this.userid === id) {
				return true;
			} else {
				return false;
			}
		},
		sendMessage() {
			let msg_data = { type: 3, from: this.userid, to: this.groupid, msg: this.msg_text };
			let msg_send = JSON.stringify(msg_data);
			console.log(msg_send);
			uni.sendSocketMessage({
				data: msg_send
			});
			this.msg_text = '';
		},
		sendPic() {
			let server = this.server;
			let userid = this.userid;
			let upload = this.upload;
			let groupid = this.groupid;
			let that = this;
			uni.chooseImage({
				success: chooseImageRes => {
					const tempFilePaths = chooseImageRes.tempFilePaths;
					// console.log(tempFilePaths[0]);
					const uploadTask = uni.uploadFile({
						url: server + '/api/uploadpic',
						filePath: tempFilePaths[0],
						name: 'file',
						formData: {
							userid: userid
						},
						success: (e) => {
							let reqdata = e.data;
							let resp = JSON.parse(reqdata);
							let msg_data = { type: 4, from: userid, to: groupid, msg: resp.msg };
							let msg_send = JSON.stringify(msg_data);
							console.log(msg_send);
							uni.sendSocketMessage({
								data: msg_send
							});
							uni.showModal({
								title: '上传成功',
								content: '上传图片成功',
								success: function(res) {
									if (res.confirm) {
										that.upload = 0;
									} else if (res.cancel) {
										that.upload = 0;
									}
								}
							});
						}
					});
					uploadTask.onProgressUpdate(res => {
						that.upload = res.progress;
						console.log('上传进度' + res.progress);
					});
				}
			});
		}
	}
};
</script>

<style>
page {
	padding-bottom: 100upx;
}
</style>
