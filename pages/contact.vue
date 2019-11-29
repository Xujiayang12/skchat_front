<template>
	<view>
		<image src="/static/contactBar.png" mode="widthFix" class="response"></image>
		<scroll-view scroll-x class="nav text-center">
			<view class="cu-item flex-sub" :class="index == TabCur ? 'text-purple cur' : ''" v-for="(item, index) in 2" :key="index" @click="tabSelect" :data-id="index">
				{{ index === 0 ? '好友' : '群聊' }}
			</view>
		</scroll-view>
		<scroll-view scroll-y class="indexes">
			<view class="cu-bar btn-group">
				<button class="cu-btn bg-purple shadow round" @click="navAdd">添加好友</button>
				<button class="cu-btn bg-purple shadow round" @click="navEnterGroup">加入群聊</button>
				<button class="cu-btn text-purple line-purple shadow round" @click="navAddGroup">创建群聊</button>
			</view>
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-me text-orange "></text>
					{{ getTitle }}
				</view>
			</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(friend, index) in friend_list" :key="index">
					<view class="cu-avatar radius lg" :style="`background-image:url(${server}/api/avatar?userid=${TabCur == 0 ? friend.userid : 0});`"></view>
					<view class="content" @click="navFriend(friend.userid, friend.name)">
						<view class="text-pink">
							<view class="text-cut">{{ friend.name }}</view>
						</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">ID: {{ friend.userid }}</view>
						</view>
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
		return {
			InputBottom: 0,
			TabCur: 0,
			scrollLeft: 0,
			StatusBar: this.StatusBar,
			CustomBar: this.CustomBar,
			hidden: true,
			listCurID: '',
			list: [],
			listCur: ''
		};
	},
	computed: {
		...mapState(['friend_list', 'server', 'userid']),
		getTitle() {
			if (this.TabCur == 0) {
				this.$store.dispatch('getFriend', {userid: this.userid});
				return '好友列表';
			} else if (this.TabCur == 1) {
				this.$store.dispatch('getGroup', {userid: this.userid});
				return '群列表';
			}
		}
	},
	beforeMount() {
		this.$store.dispatch('getFriend',{userid: this.userid});
		// console.log(this.friend_list);
	},
	onReady() {
		let that = this;
		uni.createSelectorQuery()
			.select('.indexBar-box')
			.boundingClientRect(function(res) {
				that.boxTop = res.top;
			})
			.exec();
		uni.createSelectorQuery()
			.select('.indexes')
			.boundingClientRect(function(res) {
				that.barTop = res.top;
			})
			.exec();
	},
	methods: {
		navAddGroup() {
			uni.navigateTo({
				url: 'add_group'
			});
		},
		navEnterGroup() {
			uni.navigateTo({
				url: 'enter_group'
			});
		},
		navFriend(id, name) {
			if (id < 100000) {
				uni.navigateTo({
					url: 'groupchat?groupid=' + id + '&name=' + name
				});
			} else {
				uni.navigateTo({
					url: 'friend?userid=' + id
				});
			}
		},
		navAdd() {
			uni.navigateTo({
				url: 'add_friend'
			});
		},
		InputFocus(e) {
			this.InputBottom = e.detail.height;
		},
		InputBlur(e) {
			this.InputBottom = 0;
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			// console.log(this.TabCur);
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
		},
		//获取文字信息
		getCur(e) {
			this.hidden = false;
			this.listCur = this.list[e.target.id].name;
		},
		setCur(e) {
			this.hidden = true;
			this.listCur = this.listCur;
		},
		//滑动选择Item
		tMove(e) {
			let y = e.touches[0].clientY,
				offsettop = this.boxTop,
				that = this;
			//判断选择区域,只有在选择区才会生效
			if (y > offsettop) {
				let num = parseInt((y - offsettop) / 20);
				this.listCur = that.list[num].name;
			}
		},
		//触发全部开始选择
		tStart() {
			this.hidden = false;
		},

		//触发结束选择
		tEnd() {
			this.hidden = true;
			this.listCurID = this.listCur;
		},
		indexSelect(e) {
			let that = this;
			let barHeight = this.barHeight;
			let list = this.list;
			let scrollY = Math.ceil((list.length * e.detail.y) / barHeight);
			for (let i = 0; i < list.length; i++) {
				if (scrollY < i + 1) {
					that.listCur = list[i].name;
					that.movableY = i * 20;
					return false;
				}
			}
		}
	}
};
</script>

<style>
page {
	padding-top: 0upx;
}

.indexes {
	position: relative;
}

.indexBar {
	position: fixed;
	right: 0px;
	bottom: 0px;
	padding: 20upx 20upx 20upx 60upx;
	display: flex;
	align-items: center;
}

.indexBar .indexBar-box {
	width: 40upx;
	height: auto;
	background: #fff;
	display: flex;
	flex-direction: column;
	box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
	border-radius: 20upx;
}

.indexBar-item {
	flex: 1;
	width: 40upx;
	height: 40upx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24upx;
	color: #888;
}

movable-view.indexBar-item {
	width: 40upx;
	height: 40upx;
	z-index: 9;
	position: relative;
}

movable-view.indexBar-item::before {
	content: '';
	display: block;
	position: absolute;
	left: 0;
	top: 10upx;
	height: 20upx;
	width: 4upx;
	background-color: #f37b1d;
}

.indexToast {
	position: fixed;
	top: 0;
	right: 80upx;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	width: 100upx;
	height: 100upx;
	border-radius: 10upx;
	margin: auto;
	color: #fff;
	line-height: 100upx;
	text-align: center;
	font-size: 48upx;
}
</style>
