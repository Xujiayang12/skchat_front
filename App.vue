<script>
import Vue from 'vue';
export default {
	onLaunch: function() {
		uni.getStorage({
			key: 'name',
			success: res => {
				this.$store.state.name = res.data;
			}
		});
		uni.getStorage({
			key: 'server',
			success: res => {
				this.$store.state.server = res.data;
			}
		});
		uni.getStorage({
			key: 'userid',
			success: res => {
				this.$store.state.userid = res.data;
			}
		});
		let socket_server = 'ws' + ':' + this.$store.state.server.split(':')[1] + ':' + '5001';
		this.$store.state.socket_server = socket_server;
		uni.connectSocket({
			url: socket_server
		});
		let that = this;
		uni.onSocketOpen(function(res) {
			console.log('成功连接聊天服务器');
			that.$store.state.connect = 1;
			uni.sendSocketMessage({
				data: `{ "userid": ${that.$store.state.userid}, "type": 0 }`
			});
		});
		uni.onSocketError(function() {
			console.log('连接聊天服务器失败');
		});
		uni.onSocketMessage(function(res) {
			// console.log(res.data);
			let data = JSON.parse(res.data);
			if (data.type == 'secret') {
				that.$store.state.secret_info = data;
				uni.pageScrollTo({
					scrollTop: 10000000,
					duration: 150
				});
			} else if (data.type == 'file') {
				console.log(data);
				let filename = data.data;
				uni.showModal({
					title: '文件接收',
					content: '对方向你发送了一个文件，是否接收？',
					success: function(res) {
						if (res.confirm) {
							that.$store.state.download = 1;
							// window.location.href = that.$store.state.server + '/api/downloadfile?filename=' + filename;
							const downloadTask = uni.downloadFile({
								url: that.$store.state.server + '/api/downloadfile?filename=' + filename, //仅为示例，并非真实的资源
								success: res => {
									if (res.statusCode === 200) {
										let path = res.tempFilePath;
										uni.showModal({
											title: '下载成功',
											content: '下载成功'
										});
										window.location.href = path;
										that.$store.state.download = 0;
									}
								}
							});
							downloadTask.onProgressUpdate(res => {
								that.$store.state.download = res.progress;
								console.log('下载进度' + res.progress);
							});
						}
					}
				});
			} else if (data.type == 'video') {
				let name = data.name;
				if (data.msg == 'call') {
					uni.showModal({
						title: '视频通话',
						content: name + '请求视频通话，是否接听？',
						success: function(res) {
							if (res.confirm) {
								let server = that.$store.state.server.replace('http://', '');
								server = server.split(':')[0];
								let httpserver = 'http' + ':' + that.$store.state.server.split(':')[1] + ':' + '5002';
								let url = httpserver + '/p2p?type=offer&sev=' + server + '&name=' + name;
								window.location.href = url;
							}
						}
					});
				}
			}
		});
		uni.getSystemInfo({
			success: function(e) {
				// #ifndef MP
				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				}
				// #endif

				// #ifdef MP-WEIXIN
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif

				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
			}
		});

		Vue.prototype.ColorList = [
			{
				title: '嫣红',
				name: 'red',
				color: '#e54d42'
			},
			{
				title: '桔橙',
				name: 'orange',
				color: '#f37b1d'
			},
			{
				title: '明黄',
				name: 'yellow',
				color: '#fbbd08'
			},
			{
				title: '橄榄',
				name: 'olive',
				color: '#8dc63f'
			},
			{
				title: '森绿',
				name: 'green',
				color: '#39b54a'
			},
			{
				title: '天青',
				name: 'cyan',
				color: '#1cbbb4'
			},
			{
				title: '海蓝',
				name: 'blue',
				color: '#0081ff'
			},
			{
				title: '姹紫',
				name: 'purple',
				color: '#6739b6'
			},
			{
				title: '木槿',
				name: 'mauve',
				color: '#9c26b0'
			},
			{
				title: '桃粉',
				name: 'pink',
				color: '#e03997'
			},
			{
				title: '棕褐',
				name: 'brown',
				color: '#a5673f'
			},
			{
				title: '玄灰',
				name: 'grey',
				color: '#8799a3'
			},
			{
				title: '草灰',
				name: 'gray',
				color: '#aaaaaa'
			},
			{
				title: '墨黑',
				name: 'black',
				color: '#333333'
			},
			{
				title: '雅白',
				name: 'white',
				color: '#ffffff'
			}
		];
	},
	onShow: function() {
		// console.log('App Show');
	},
	onHide: function() {
		// console.log('App Hide');
	}
};
</script>

<style>
@import 'colorui/main.css';
@import 'colorui/icon.css';

.nav-list {
	display: flex;
	flex-wrap: wrap;
	padding: 0px 40upx 0px;
	justify-content: space-between;
}

.nav-li {
	padding: 30upx;
	border-radius: 12upx;
	width: 45%;
	margin: 0 2.5% 40upx;
	background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
	background-size: cover;
	background-position: center;
	position: relative;
	z-index: 1;
}

.nav-li::after {
	content: '';
	position: absolute;
	z-index: -1;
	background-color: inherit;
	width: 100%;
	height: 100%;
	left: 0;
	bottom: -10%;
	border-radius: 10upx;
	opacity: 0.2;
	transform: scale(0.9, 0.9);
}

.nav-li.cur {
	color: #fff;
	background: rgb(94, 185, 94);
	box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
}

.nav-title {
	font-size: 32upx;
	font-weight: 300;
}

.nav-title::first-letter {
	font-size: 40upx;
	margin-right: 4upx;
}

.nav-name {
	font-size: 28upx;
	text-transform: Capitalize;
	margin-top: 20upx;
	position: relative;
}

.nav-name::before {
	content: '';
	position: absolute;
	display: block;
	width: 40upx;
	height: 6upx;
	background: #fff;
	bottom: 0;
	right: 0;
	opacity: 0.5;
}

.nav-name::after {
	content: '';
	position: absolute;
	display: block;
	width: 100upx;
	height: 1px;
	background: #fff;
	bottom: 0;
	right: 40upx;
	opacity: 0.3;
}

.nav-name::first-letter {
	font-weight: bold;
	font-size: 36upx;
	margin-right: 1px;
}

.nav-li text {
	position: absolute;
	right: 30upx;
	top: 30upx;
	font-size: 52upx;
	width: 60upx;
	height: 60upx;
	text-align: center;
	line-height: 60upx;
}

.text-light {
	font-weight: 300;
}

@keyframes show {
	0% {
		transform: translateY(-50px);
	}

	60% {
		transform: translateY(40upx);
	}

	100% {
		transform: translateY(0px);
	}
}

@-webkit-keyframes show {
	0% {
		transform: translateY(-50px);
	}

	60% {
		transform: translateY(40upx);
	}

	100% {
		transform: translateY(0px);
	}
}
</style>
