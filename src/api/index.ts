import axios from 'axios'
import notification from 'ant-design-vue/es/notification'
import { UserModule } from '@/store/modules/user'
import { AxiosRequestConfig } from '@/api/types'
const Qs = require('qs')
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API,
	timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
	(config) => {
		if (UserModule.token) {
			// 设置请求头信息
			config.headers.Authorization = `Bearer ${UserModule.token}`
		}
		return config
	},
	(error) => {
		Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	(response) => {
		const res = response.data
		if (response.config.url.indexOf('/ws/') == -1 && res.code !== 200) {
			notification.error({
				message: res.message || 'Error',
				description: res.message
			})
			
			if (res.code === 401 || res.code === 50012 || res.code === 50014) {
				// MessageBox.confirm(
				// 	'你已被登出，可以取消继续留在该页面，或者重新登录',
				// 	'确定登出',
				// 	{
				// 		confirmButtonText: '重新登录',
				// 		cancelButtonText: '取消',
				// 		type: 'warning'
				// 	}
				// ).then(() => {
				// 	UserModule.ResetToken()
				// 	location.reload() // To prevent bugs from vue-router
				// })
			}
			console.log('全局报错提示：', res.message)
			return Promise.reject(new Error(res.message || 'Error'))
		} else if (response.config.url.indexOf('/ws/') != -1) {
			return response
		}
		return response.data
	},
	(error) => {
		const error_message = error.response
		if (error.response) {
			const { status, data, config, request } = error_message
			console.log(`报错接口信息URL：${request.responseURL}`)
			console.log(`报错接口信息请求头：${JSON.stringify(config.headers)}`)
			console.log(`报错接口信息参数：${config.data}`)
			console.log(`报错接口信息返回信息：${JSON.stringify(data)}`)
			console.log(`报错接口信息请求方式：${config.method}`)
			console.log(`报错接口信息状态：${status}`)
			notification.error({
				message: 'Error',
				description: '网络错误！请稍后再试...',
			})
		}
		return Promise.reject(error.response)
	}
)


function ajax (config: AxiosRequestConfig): any {
	const {
		sourceAxios = service, url = '', data = null, method = 'get', headers = { 'content-type': 'application/json;charset=utf-8' }
	} = config
	let promise: any = null
	return new Promise((resolve, reject) => {
		// 执行异步ajax请求
		if (method.toUpperCase() === 'GET') {
			// 	发送get请求
			promise = sourceAxios.get(url, { params: data, headers })
		} else if (method.toUpperCase() === 'POST') {
			// 发送post请求
			// @ts-ignore
			
			if (headers['content-type'] == 'application/x-www-form-urlencoded') { // eslint-disable-line
			    promise = sourceAxios({ method: 'POST', url, data: Qs.stringify(data), headers })
			} else {
			promise = sourceAxios({ method: 'POST', url, data, headers })
			}
		} else {
			promise = sourceAxios({ url: `${url}/${data[Object.keys(data)[0]]}`, data, method, headers })
		}
		promise.then((response) => {
			if (response.code === 200) {
				resolve(response)
			} else if (response.config.baseURL == process.env.VUE_APP_BASE_API_THE_PUBLIC) {
					resolve(response)
				} else {
					console.log('请求失败', response)
				}
		}).catch((err) => { // 失败了调用reject()
			reject(err)
		})
	})
}

export default ajax
