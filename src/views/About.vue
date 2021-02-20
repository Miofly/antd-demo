<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png">
		<HelloWorld msg="Welcome to Your Vue.js App"/>
		<div>
			<img src="../assets/1.jpg">
		</div>
	</div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
export default {
	name: 'Home',
	components: {
		HelloWorld
	},
	created() {
	}
}
</script>
