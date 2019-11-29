import Vue from 'vue'
import App from './App'
import store from './store'
// import VueSocketIO from 'vue-socket.io'
Vue.prototype.$store = store

import basics from './pages/basics/home.vue'
Vue.component('basics', basics)

import components from './pages/component/home.vue'
Vue.component('components', components)

import plugin from './pages/plugin/home.vue'
Vue.component('plugin', plugin)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

import message from './pages/message.vue'
Vue.component('message', message)

import contact from './pages/contact.vue'
Vue.component('contact', contact)

import me from './pages/me'
Vue.component('me', me)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
