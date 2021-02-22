<template>
	<div id="app">
		<meta name="referrer" content="no-referrer">
		<router-view v-if="isRouterAlive"/>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'

@Component({
	name: 'App'
})
export default class extends Vue {
	isRouterAlive: boolean = true
	
	reloadPage () {
		this.isRouterAlive = false // 先关闭，
		this.$nextTick(() => {
			this.isRouterAlive = true // 再打开
		})
	}
	
	@Provide() reload = this.reloadPage
}
</script>

<style>
</style>
