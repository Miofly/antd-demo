import * as axios from 'axios'

export interface AxiosRequestConfig {
	sourceAxios?: any, // 配置多源默认接口，可传axios的实例instanceOne，或者直接传axios
	url?: string, // url
	data?: any, // Get请求传的参数
	method?: string, // 请求方法
	headers?: any, // get请求默认请求头
}

declare module 'axios' {
	interface AxiosInstance {
		// eslint-disable-next-line no-undef
		(config: AxiosRequestConfig): Promise<any>
	}
}
