import request from '@/api'

// 登录
export const login = (data: any) => request({
	url: '/login',
	method: 'post',
	data
})

// 获取用户信息
export const getUserInfo = (data: any) => request({
	url: '/login-info',
	method: 'post',
	data
})

// 获取用户路由列表
export const getPermission = (data: any) => request({
	url: '/auth-list',
	method: 'post',
	data
})

export const logout = () => request({
	url: '/users/logout',
	method: 'post'
})
