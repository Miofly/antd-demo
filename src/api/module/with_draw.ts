import request from '@/api'

// 获取提现列表
export const getWithDrawList = (data: any) => request({
	url: '/assets/check_list',
	method: 'post',
	data
})

// 提现审核
export const check_order = (data: any) => request({
	url: '/assets/check_order',
	method: 'post',
	data
})

// 用户账户删除
export const accountDel = (data: any) => request({
	url: '/account/del',
	method: 'post',
	data
})

// 用户新增/修改
export const accountSave = (data: any) => request({
	url: '/account/save',
	method: 'post',
	data
})

// 获取角色列表
export const getRoleList = (data: any) => request({
	url: '/role/list',
	method: 'post',
	data
})

// 角色新增/修改
export const roleSave = (data: any) => request({
	url: '/role/save',
	method: 'post',
	data
})

// 角色删除
export const roleDel = (data: any) => request({
	url: '/role/del',
	method: 'post',
	data
})


// 获取权限列表
export const getAuthList = (data: any) => request({
	url: '/auth/list',
	method: 'post',
	data
})

// 权限新增/修改
export const authSave = (data: any) => request({
	url: '/auth/save',
	method: 'post',
	data
})

// 权限删除
export const authDel = (data: any) => request({
	url: '/auth/del',
	method: 'post',
	data
})

export const logout = () => request({
	url: '/users/logout',
	method: 'post'
})
