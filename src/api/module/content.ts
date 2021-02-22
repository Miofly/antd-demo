import request from '@/api'

// 列表
export const article = (data, method?) => request({
	url: '/article_wechat',
	method,
	data
})

export const articleEdit = (data, method?) => request({
	url: `/article/${data.id}/edit`,
	method,
	data
})

