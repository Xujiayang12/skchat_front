<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{ friendname }}</block>
		</cu-custom>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			type: '',
			friendid: 0,
			friendname: '',
		};
	},
	onLoad: function(res) {
		this.friendid = res.userid;
		this.friendname = res.name;
		this.type = res.type;
	},
	mounted: function() {
		let server = this.server.replace('http://', '');
		server = server.split(':')[0];
		let httpserver = 'http' + ':' + this.server.split(':')[1] + ':' + '5002';
		let url = httpserver + '/p2p?type=' + this.type + '&sev=' + server + '&name=' + this.friendname;
		window.location.href = url;
	},
	beforeMount: function() {},
	computed: {
		...mapState(['server', 'userid', 'name', 'secret_info', 'download'])
	},
	methods: {
		// geturl() {
		// 	let server = this.server.replace('http://', '');
		// 	server = server.split(':')[0];
		// 	let httpserver = 'http' + ':' + this.server.split(':')[1] + ':' + '5002';
		// 	let url = httpserver + '/p2p?type=' + this.type + '&sev=' + server;
		// 	console.log(url);
		// 	return url;
		// }
	}
};
</script>

<style scoped>
page {
	padding-bottom: 100upx;
}
</style>
