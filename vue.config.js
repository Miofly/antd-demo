const path = require('path')
const glob = require("glob-all");

// 分析代码体积工具
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// 压缩优化 js 去除日志
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const PurgecssPlugin = require("purgecss-webpack-plugin");

// 判断是否生产环境
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
	outputDir: 'dist',
	/**
	 * @Description: productionSourceMap
	 * @author wfd
	 * @date 2021/2/10 10:46
	 * @detail 把productionSourceMap改为false。不然在最终打包的文件中会出现一些map文件，map文件的作用在于：项目打包后，代码都是经过压缩加密的，
	 * 		   如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
	 *		   如果不关掉，生产环境是可以通过map文件看到源码的。
	 */
	productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
	configureWebpack: config => {
		const plugins = [];
		//去掉不用的css 多余的css
		plugins.push(
			new PurgecssPlugin({
				paths: glob.sync([ // glob-all可以设置多条路径
					path.join(__dirname, './src/index.html'),
					path.join(__dirname, './**/*.vue'),
					path.join(__dirname, './src/**/*.js')]
				),
				whitelist: ["html", "body"],
				whitelistPatterns: [/el-.*/],
				whitelistPatternsChildren: [/^token/, /^pre/, /^code/]
			})
		);
		plugins.push(
			new UglifyJsPlugin({
				uglifyOptions: {
					compress: { // 启用压缩功能
						dead_code: true, // 移除没被引用的代码
						unused: true, // 干掉没有被引用的函数和变量
						drop_console: true, // 去除console.*函数
						drop_debugger: false, // 移除 debugger
						pure_funcs: ['console.log'], // 移除console
						passes: 1 //  默认 1。运行压缩的次数。在某些情况下，用一个大于1的数字参数可以进一步压缩代码大小。注意：数字越大压缩耗时越长。
					}
				},
				sourceMap: false,
				parallel: true  // 使用多进程并行运行来提高构建速度
			})
		);
		config.plugins = [...config.plugins, ...plugins];

		if (IS_PROD) {
			// 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
			config.externals = {
				vue: 'Vue',
				'vue-router': 'VueRouter',
				vuex: 'Vuex',
				axios: 'axios'
			}
		}
	},
	chainWebpack: (config) => {
		if (IS_PROD) {
			// 代码分析插件
			config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin).init(Plugin => new Plugin({
				analyzerMode: 'server', // 在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
				analyzerHost: '127.0.0.1',
				analyzerPort: 3000,
				defaultSizes: 'parsed', // 模块大小默认显示在报告中。应该是`stat`，`parsed`或者`gzip`中的一个。
				openAnalyzer: true, // 在默认浏览器中自动打开报告
				logLevel: 'info' // 日志级别
			}))


			// cdn 资源加载
			const cdn = {
				js: [
					'https://unpkg.com/vue@2.6.10/dist/vue.min.js', // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
					'https://unpkg.com/vue-router@3.0.6/dist/vue-router.min.js',
					'https://unpkg.com/vuex@3.1.1/dist/vuex.min.js',
					'https://unpkg.com/axios@0.19.0/dist/axios.min.js',
				]
			};

			// html中添加cdn
			config.plugin('html').tap(args => {
				args[0].cdn = cdn
				return args
			})
		}
	},
	css: {
		loaderOptions: {
			postcss: { // 浏览器增加前缀
				plugins: [
					require('autoprefixer')({
						browsers : [
							'last 1 version', // 例如 last 80 version 可给大部分浏览器增加前缀
							'> 1%',
							'IE 10'
						]
					})
				]
			}
		}
	}
}
