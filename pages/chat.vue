<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{ friendname }}</block>
		</cu-custom>
		<view class="cu-chat">
			<view v-for="(msg, index) in secret_info.data" :key="index">
				<view class="cu-item self" v-show="getShow(msg.userid)">
					<view class="date">
						<view class="cu-capsule round" style="margin-right: 20px;" v-if="getFileShow(msg.type)">
							<view class="cu-tag bg-blue sm ">文件</view>
							<view class="cu-tag line-blue sm">{{ msg.msg }}</view>
							<view class="cu-tag line-blue sm">{{ msg.time }}</view>
						</view>
						<text v-else>{{ msg.time }}</text>
					</view>
					<view class="main">
						<image
							v-if="getPicShow(msg.type)"
							:src="`${server}/api/downloadpic?filename=${msg.msg}`"
							class="radius"
							mode="widthFix"
							@click="previewPic(msg.msg)"
						></image>
						<image @click="downFile(msg.msg)" v-else-if="getFileShow(msg.type)" src="../static/filePic.png" class="radius" mode="widthFix"></image>
						<view class="content bg-green shadow" v-else>
							<text>{{ msg.msg }}</text>
						</view>
					</view>
					<view class="cu-avatar radius" :style="`background-image:url(${server}/api/avatar?userid=${msg.userid});`"></view>
				</view>
				<view class="cu-item" v-show="!getShow(msg.userid)">
					<view class="cu-avatar radius" :style="`background-image:url(${server}/api/avatar?userid=${msg.userid});`"></view>
					<view class="date">
						<view class="cu-capsule round" style="margin-right: 20px;" v-if="getFileShow(msg.type)">
							<view class="cu-tag bg-blue sm ">文件</view>
							<view class="cu-tag line-blue sm">{{ msg.msg }}</view>
							<view class="cu-tag line-blue sm">{{ msg.time }}</view>
						</view>
						<text v-else>{{ msg.time }}</text>
					</view>
					<view class="main">
						<image
							v-if="getPicShow(msg.type)"
							:src="`${server}/api/downloadpic?filename=${msg.msg}`"
							class="radius"
							mode="widthFix"
							@click="previewPic(msg.msg)"
						></image>
						<image @click="downFile(msg.msg)" v-else-if="getFileShow(msg.type)" src="../static/filePic.png" class="radius" mode="widthFix"></image>
						<view class="content bg-green shadow" v-else>
							<text>{{ msg.msg }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view ref="input" class="input"></view>
		<view class="cu-bar foot input" :style="[{ bottom: InputBottom + 'px' }]">
			<view class="action" onclick="document.getElementById('upload').click()"><text class="cuIcon-file text-grey"></text></view>
			<view class="action" @click="sendPic"><text class="cuIcon-pic text-grey"></text></view>
			<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10" @focus="InputFocus" @blur="InputBlur" v-model="msg_text" />
			<button class="cu-btn bg-green shadow" @click="sendMessage" @keyup.enter="sendMessage">发送</button>
		</view>
		<view v-show="getUploadShow" class="cu-bar foot bg-white padding" :style="[{ bottom: InputBottom + 51 + 'px' }]">
			<text class="margin-right" style="width: 120upx;" v-show="download == 0">上传中</text>
			<text class="margin-right" style="width: 120upx;" v-show="download != 0">下载中</text>
			<view v-show="upload" class="cu-progress round sm striped"><view class="bg-green" :style="[{ width: upload + '%' }]"></view></view>
			<view v-show="download" class="cu-progress round sm striped"><view class="bg-green" :style="[{ width: download + '%' }]"></view></view>
			<text v-show="upload" class="margin-left">{{ upload }}%</text>
			<text v-show="download" class="margin-left">{{ download }}%</text>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			msg_text: '',
			friendid: 0,
			friendname: '',
			InputBottom: 0,
			upload: 0
		};
	},
	onLoad: function(res) {
		this.friendid = res.userid;
		this.friendname = res.name;
	},
	mounted: function() {
		let server = this.server;
		let userid = this.userid;
		let friendid = this.friendid;
		let that = this;
		uni.pageScrollTo({
			scrollTop: 300,
			duration: 10
		});
		uni.pageScrollTo({
			scrollTop: 1000000,
			duration: 150
		});
		var input = document.createElement('input');
		input.type = 'file';
		input.ref = 'iptt';
		input.style = 'display:none;';
		input.id = 'upload';
		input.className = 'cu-btn round';
		input.onchange = e => {
			let file = e.target.files[0];
			let filename = file.name;
			let path = that.getObjectURL(file);
			console.log(path);
			const uploadTask = uni.uploadFile({
				url: server + '/api/uploadfile',
				filePath: path,
				name: 'file',
				formData: {
					filename: filename
				},
				success: e => {
					let reqdata = e.data;
					let resp = JSON.parse(reqdata);
					let msg_data = { type: 5, from: userid, to: friendid, msg: resp.msg };
					let msg_send = JSON.stringify(msg_data);
					console.log(msg_send);
					uni.sendSocketMessage({
						data: msg_send
					});
					uni.showModal({
						title: '上传成功',
						content: '上传文件成功',
						success: function(res) {
							if (res.confirm) {
								that.upload = 0;
								that.scroll_bottom();
							} else if (res.cancel) {
								that.upload = 0;
								that.scroll_bottom();
							}
						}
					});
				}
			});
			uploadTask.onProgressUpdate(res => {
				that.upload = res.progress;
				console.log('上传进度' + res.progress);
			});
		};
		this.$refs.input.$el.appendChild(input);
	},
	beforeMount: function() {
		let server = this.server;
		let userid = this.userid;
		let friendid = this.friendid;
		let that = this;
		uni.showLoading({
			title: '加载中'
		});
		uni.request({
			url: server + '/api/secret',
			data: {
				from: userid,
				to: friendid
			},
			success: res => {
				uni.hideLoading();
				that.$store.state.secret_info = res.data;
			}
		});
	},
	computed: {
		...mapState(['server', 'userid', 'name', 'secret_info', 'download']),
		getUploadShow() {
			if (this.upload != 0 || this.download != 0) {
				return true;
			}
		}
	},
	methods: {
		downFile(filename){
			window.location.href = this.$store.state.server + '/api/downloadfile?filename=' + filename;
		},
		scroll_bottom() {
			uni.pageScrollTo({
				scrollTop: 300,
				duration: 10
			});
			uni.pageScrollTo({
				scrollTop: 1000000,
				duration: 150
			});
		},
		getFileShow(type) {
			if (type == 'file') {
				return true;
			} else {
				return false;
			}
		},
		getObjectURL(file) {
			var url = null;
			if (window.createObjectURL != undefined) {
				// basic
				url = window.createObjectURL(file);
			} else if (window.URL != undefined) {
				// mozilla(firefox)
				url = window.URL.createObjectURL(file);
			} else if (window.webkitURL != undefined) {
				// webkit or chrome
				url = window.webkitURL.createObjectURL(file);
			}
			return url;
		},
		previewPic(filename) {
			let server = this.server;
			uni.previewImage({
				urls: [server + '/api/downloadpic?filename=' + filename]
			});
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
		getPicShow(type) {
			if (type == 'image') {
				return true;
			} else {
				return false;
			}
		},
		sendMessage() {
			let msg_data = { type: 1, from: this.userid, to: this.friendid, msg: this.msg_text };
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
			let friendid = this.friendid;
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
						success: e => {
							let reqdata = e.data;
							let resp = JSON.parse(reqdata);
							let msg_data = { type: 2, from: userid, to: friendid, msg: resp.msg };
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
										that.scroll_bottom();
									} else if (res.cancel) {
										that.upload = 0;
										that.scroll_bottom();
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
