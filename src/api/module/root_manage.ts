import request from '@/api'

// 获取可登录用户列表
export const account = (data, method?) => request({
	url: '/admin',
	method,
	data
})

// 角色名称匹配
export const accountRoleName = (data, method?) => request({
	url: '/admin/create',
	method,
	data
})

// 获取角色列表
export const role = (data, method?) => request({
	url: '/admin_group',
	method,
	data
})

//
export const auth = (data, method?) => request({
	url: '/admin_group/create',
	method,
	data
})

// 权限接口
export const permissions = (data, method?) => request({
	url: '/permissions',
	method,
	data
})

