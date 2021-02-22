import request from '@/api'

// 登录
export const manage = (data, method?) => request({
	url: '/ws/open_platform/official_account/manage',
	data
})

export const statusChange = (data, method?) => request({
	url: '/ws/open_platform/official_account/enable',
	method,
	data
})


