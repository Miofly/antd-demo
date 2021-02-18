<template>
	<div class="home">
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

<style>
.mttest{
background-color: black;
}
</style>
