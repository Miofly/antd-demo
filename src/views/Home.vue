<template>
	<div class="home">
		<div v-for="(item, index) in 3" :key="index">
			{{index}}
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
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

