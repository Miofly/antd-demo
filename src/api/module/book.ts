import request from '@/api'

// 广告列表
export const getAdList = (data, method?) => request({
	url: '/ad/getList',
	method: 'get',
	data
})

export const delAd = (data, method?) => request({
	url: '/ad/del',
	method: 'get',
	data
})

export const editAd = (data, method?) => request({
	url: '/ad/edit',
	method: 'post',
	data
})

export const addAd = (data, method?) => request({
	url: '/ad/add',
	method: 'post',
	data
})

export const changeAdState = (data, method?) => request({
	url: '/ad/changeState',
	method: 'post',
	data
})
