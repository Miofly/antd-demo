import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { getToken, removeToken, setToken } from '@/utils/cookies'
import store from '@/store'

// export interface IRootState {
	// account_list: string[]
// }

@Module({ dynamic: true, store, name: 'auth' })
class Auth extends VuexModule {
	
	isEdit: boolean = false
	dialogStatus: boolean = false
	ruleForm: any = {}

	// @Action
	// public async getAccountList () { // 后台权限用户列表
	// 	const { data } = await getAccountList({})
	// 	console.log(data)
	// 	this.SET_ACCOUNT_LIST(data)
	// }
	//
	// @Mutation
	// private SET_ACCOUNT_LIST (data: any[]) {
	// 	this.account_list = data
	// }
	//
}

export const AuthModule = getModule(Auth)
