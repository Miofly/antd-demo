import request from '@/api'

// 列表
export const getArticles = (data, method?) => request({
	url: '/getArticles',
	method: 'get',
	data
})

// 新增
export const createArticle = (data, method?) => request({
	url: '/createArticle',
	method: 'post',
	data
})

// 修改
export const updateArticle = (data, method?) => request({
	url: '/updateArticle',
	method: 'post',
	data
})

// 删除
export const deleteArticle = (data, method?) => request({
	url: '/deleteArticle',
	method: 'post',
	data
})


export const getSelectLists = (data, method?) => request({
	url: '/getSelectLists',
	method: 'post',
	data
})

// 广告列表
export const getAdList = (data, method?) => request({
	url: '/api/ad/page',
	method: 'get',
	data
})

export const delAd = (data, method?, headers?) => request({
	url: '/api/ad/remove',
	method: 'post',
	data,
	headers
})

export const editAd = (data, method?, headers?) => request({
	url: '/api/ad/build',
	method: 'post',
	data,
	headers
})

export const addAd = (data, method?) => request({
	url: '/api/ad/build',
	method: 'post',
	data
})

export const changeAdState = (data, method?) => request({
	url: '/ad/changeState',
	method: 'post',
	data
})
