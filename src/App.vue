<template>
	<div id="app" class="bg-black test">
		<div id="nav">
			<router-link to="/">Home</router-link>
			|
			<router-link to="/about">About</router-link>
		</div>
		<router-view/>
	</div>
</template>


<style lang="scss">
@import "/static/color.scss";
</style>
