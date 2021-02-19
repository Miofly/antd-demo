<template>
	<div class="home flex" style="-webkit-animation: fade 2s linear 0s infinite alternate;-o-animation: fade 2s linear 0s infinite alternate;animation: fade 2s linear 0s infinite alternate;">
		<div v-for="(item, index) in 3" :key="index">
			{{index}}
		</div>
		<a-button type="primary">asda 测试</a-button>
	</div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import {getSpecialDays, getNum} from 'mio-common-js'
export default {
	name: 'Home',
	components: {
		HelloWorld
	},
	created() {
		console.log(getSpecialDays)
		console.log('==================')
	}
}
</script>

<style lang="less">
@import "~@/static/flex.less";
</style>
