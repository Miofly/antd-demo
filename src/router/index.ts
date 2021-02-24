import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

export const constantRoutes: RouteConfig[] = [
	{
		path: '/404',
		component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
	},
	{
		path: '/home',
		component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
	},
	{
		path: '/',
		redirect: '/home',
		children: [
			{
				path: 'home',
				component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
			}
		]
	},
	{
		path: '*',
		redirect: '/404',
		meta: { hidden: true }
	},
]

const createRouter = () => new VueRouter({
	// mode: 'history',
	scrollBehavior: (to, from, savedPosition) => {
		if (savedPosition) {
			return savedPosition
		}
			return { x: 0, y: 0 }
		
	},
	base: process.env.VUE_APP_BASE_API,
	routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
	const newRouter = createRouter();
	(router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
