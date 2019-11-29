import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const api = 'http://47.103.87.252:3000/mock/18'
const store = new Vuex.Store({
	state: {
		message_info: [], //消息列表信息
		secret_info: [],  //私聊信息
		userid: 0,
		server:'',
		name: '',
		friend_list: [],
		socket: '',
		socket_server: '',
		connect: 0,
		download: 0
	},
	mutations: {
		RECEIVE_MESSAGE(state, {info}) {
			state.message_info = info
		},
		START(state, {name, server, userid}){
			state.name = name
			state.server = server
			state.userid = userid
		},
		RECEIVE_FRIEND(state, {friendlist}){
			state.friend_list = friendlist
		},
		LOGIN(state, {name, server}) {
			state.name = name
			state.server = server
			uni.request({
				url: server + '/api/getid',
				data: {
					name: name
				},
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded', 
				},
				success: (res) => {
					state.userid = res.data.id;
					uni.setStorage({
						key: 'userid',
						data: res.data.id,
						success() {
							console.log(res.data.id);
							state.userid = res.data.id;
						}
					});
				}
			})
		}
	},
	getters: {

	},
	actions: {
		async addFriend({commit}, {friendid}){
			uni.showLoading({
				title: '添加中'
			});
			uni.request({
				url: store.state.server + '/api/addfriend',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded', 
				},
				data: {
					userid: store.state.userid,
					friend: friendid
				},
				success: (res) => {
					uni.hideLoading();
					uni.showModal({
						title: '好友',
						content: res.data.msg
					})
				}
			})
		},
		async getFriend({commit},{userid}){
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				url: store.state.server + '/api/friend',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded', 
				},
				data: {
					userid: userid
				},
				success: (res) => {
					uni.hideLoading();
					commit('RECEIVE_FRIEND',{friendlist: res.data.data})
				}
			})
		},
		async getGroup({commit},{userid}){
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				url: store.state.server + '/api/grouplist',
				data: {
					userid: userid
				},
				success: (res) => {
					uni.hideLoading();
					commit('RECEIVE_FRIEND',{friendlist: res.data.data})
				}
			})
		},
		async SignUp({commit}, {name, password, server, sex}){
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				url: server + '/api/signup',
				data: {
					name: name,
					password: password,
					sex: sex
				},
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded', 
				},
				success: (res) => {
					uni.hideLoading();
					uni.showModal({
						title: '注册',
						content: res.data.msg
					});
					uni.redirectTo({
						url: 'login'
					});
				},
				fail: () => {
					uni.hideLoading();
					uni.showModal({
						title: '网络问题',
						content: '无法连接到服务器'
					})
				}
			})
		},
		async Login({commit}, {name, password, server}){
			uni.showLoading({
				title: '请稍等'
			});
			uni.request({
				url: server + '/api/login',
				data: {
					name: name,
					password: password,
				},
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded', 
				},
				success: (res) => {
					uni.hideLoading()
					uni.showModal({
						title: '登录',
						content: res.data.msg
					})
					if(res.data.msg==='登录成功'){
						commit('LOGIN', {name, server})
						uni.setStorage({
							key: 'name',
							data: name,
							success() {
								console.log(name);
							}
						});
						uni.setStorage({
							key: 'server',
							data: server,
							success() {
								console.log(server);
							}
						})
						uni.redirectTo({
							url: 'index'
						});
						window.location.reload();
					}
				},
				fail: () => {
					uni.hideLoading()
					uni.showModal({
						title: '网络问题',
						content: '无法连接到服务器'
					})
				}
			})
		},
		async getMessageList({commit}, {userid, token}) {
			uni.request({
				url: api + '/message_list',
				data: {
					userid: userid,
					token: token
				},
				success: (res) => {
					const info = res.data;
					if (info) {
						commit('RECEIVE_MESSAGE', {info})
					}
				}
			});
		}
	}
});
export default store
