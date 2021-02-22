import router from './router'
import NProgress from 'nprogress'
import '@/components/NProgress/nprogress.less' // progress bar custom style

import notification from 'ant-design-vue/es/notification'

import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'

NProgress.configure({ showSpinner: false }) // NProgress配置


// 白名单
const whiteList = ['/login']

router.beforeEach(async (to: Route, _: Route, next: any) => {
	NProgress.start()
	// 确定用户是否已登录
	if (UserModule.token) {
		if (to.path === '/login') {
			console.log('有token: 如果已登录，请重定向到主页')
			// 如果已登录，请重定向到主页
			next({ path: '/' })
			NProgress.done()
		} else {
			console.log('有token: 用户是否已获得权限角色', UserModule.roles.length === 0)
			// 检查用户是否已获得权限角色
			if (UserModule.roles.length === 0) {
				try {
					await UserModule.GetUserInfo()
					next({ ...to, replace: true })
				} catch (err) {
					console.log('获取路由失败')
					UserModule.ResetToken()
					notification.error({
						message: '错误',
						description: '请求用户信息失败，请重试'
					})
					next(`/login?redirect=${to.path}`)
					NProgress.done()
				}
			} else {
				console.log('用户已取得角色')
				next()
			}
		}
	} else if (whiteList.indexOf(to.path) !== -1) {
		console.log('没有token ==> 进入白名单页面')
		next()
	} else {
		console.log('没有token ==> 其他没有访问权限的页面将被重定向到登录页面')
		next(`/login?redirect=${to.path}`)
		NProgress.done()
	}
})

router.afterEach((to: Route) => {
	NProgress.done()
	// 根据路由里的信息设置页面标题
	// document.title = to.meta.title
})
