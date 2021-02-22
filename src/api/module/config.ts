import request from '@/api'

// 获取可登录用户列表
export const config = (data, method?) => request({
	url: '/setting/packet',
	method,
	data
})
