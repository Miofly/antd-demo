import request from '@/api'

// 公共 Post 请求
export const commonPost = (url: string, data: any) => request({
	url,
	method: 'post',
	data
})

// 公共 Get 请求
export const commonGet = (url: string) => request({
	url,
	method: 'get'
})
