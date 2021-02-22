import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { getPermission, getUserInfo, login, logout } from '@/api/module/users'
import store from '@/store'
import root from 'uJs/root'
import settings from '@/settings'
export interface IUserState {
	token: string
	name: string
	avatar: string
	introduction: string
	roles: string[]
	loading: boolean
}

// 对后台的路由进行遍历处理
export const filterAsyncRoutes = (routes, parent_route = '', title = '') => {
	const res = []
	routes.forEach(item => {
		const r: any = {}
		const { route, id, icon, name, sub_permission } = item
		r.path = route == null ? '' : route
		r.key = String(id)
		r.meta = {
			icon,
			title: name
		}
		r.fullPath = parent_route == '' ? `/${route}` : parent_route == '/' ? `/${route}` : `${parent_route}/${route}`
		r.fullName = title == '' ? '' : `${title} / ${name}`
		
		if (sub_permission) {
			r.children = filterAsyncRoutes(sub_permission, r.fullPath, r.fullName == '' ? name : r.fullName)
		}
		res.push(r)
	})
	return res
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
	public token = root.getCookie(settings.access_token_name) || ''
	public name = ''
	public avatar = ''
	public introduction = ''
	public roles: any[] = []
	public routes: any[] = []
	public routePathArr: any[] = []
	public rolesId: string = ''
	public loading: boolean = false

	// 登录
	@Action({ rawError: true })
	public async Login (userInfo: { username: string, password: string }) {
		let { username, password } = userInfo
		username = username.trim()
		const { data, code } = await login({ username, password })
		// 登录成功后获取用户信息
		if (code == 200) {
			root.setCookie(settings.access_token_name, data.access_token)
			this.SET_TOKEN(data.access_token)
			const userData = await getUserInfo({ })
			const { id, name, avatar, introduction } = userData.data
			
			this.SET_NAME(name)
			this.SET_AVATAR(avatar)
			this.SET_INTRODUCTION(introduction)
		}
	}
	
	@Action
	public ResetToken () {
		root.delCookie(settings.access_token_name)
		this.SET_TOKEN('')
		this.SET_ROLES([])
	}
	
	@Action
	public async GetUserInfo () {
		if (this.token === '') {
			throw Error('GetUserInfo: token is undefined!')
		}
		const permissionData = await getPermission({ /* Your params here */ })
		const menu = permissionData.data.list
		const roleData = filterAsyncRoutes(menu)
		console.log(root.gsh(roleData))
		this.SET_ROLES(roleData)
		this.routeSplit(roleData)
		this.usefulRoutes()
	}
	
	@Action usefulRoutes () {
		for (const item of this.routes) {
			if (item.fullName !== '') {
				this.routePathArr.push(item)
			}
		}
	}
	
	// 路由拆分为单个
	@Action
	routeSplit (routes) {
		routes.forEach(item => {
			const r: any = {}
			const { fullPath, meta, children, fullName } = item
			r.path = fullPath == '/' ? '' : fullPath
			r.meta = meta
			r.fullName = fullName
			
			if (children) {
				this.routeSplit(children)
			}
			this.routes.push(r)
		})
		return this.routes
	}
	
	@Action
	public LogOut () {
		if (this.token === '') {
			throw Error('LogOut: token is undefined!')
		}
		root.delCookie(settings.access_token_name)
		this.SET_TOKEN('')
		this.SET_ROLES([])
	}
	
	@Action
	public LoginLoading (loading: boolean) {
		this.SET_LOADING(loading)
	}
	
	@Mutation
	private SET_ROUTES (routes: string[]) {
		this.routes = routes
	}
	
	@Mutation
	private SET_TOKEN (token: string) {
		this.token = token
	}
	
	@Mutation
	private SET_NAME (name: string) {
		this.name = name
	}
	
	@Mutation
	private SET_AVATAR (avatar: string) {
		this.avatar = avatar
	}
	
	@Mutation
	private SET_INTRODUCTION (introduction: string) {
		this.introduction = introduction
	}
	
	@Mutation
	private SET_ROLES (roles: string[]) {
		this.roles = roles
	}
	
	@Mutation
	private SET_LOADING (loading: boolean) {
		this.loading = loading
	}
}

export const UserModule = getModule(User)
