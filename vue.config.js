const path = require('path')
const glob = require("glob-all");

// 分析代码体积工具
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const PurgecssPlugin = require("purgecss-webpack-plugin");

// 判断是否生产环境
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

console.log(IS_PROD)
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
		config.plugins = [...config.plugins, ...plugins];

		// if (IS_PROD) {
			config.externals = {
				vue: 'Vue',
				'vue-router': 'VueRouter',
				vuex: 'Vuex',
				axios: 'axios'
			}
		// }
	},
	chainWebpack: (config) => {
		// 代码分析插件
		config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin).init(Plugin => new Plugin({
			analyzerMode: 'server', // 在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
			analyzerHost: '127.0.0.1',
			analyzerPort: 3000,
			defaultSizes: 'parsed', // 模块大小默认显示在报告中。应该是`stat`，`parsed`或者`gzip`中的一个。
			openAnalyzer: true, // 在默认浏览器中自动打开报告
			logLevel: 'info' // 日志级别
		}))

		// if (IS_PROD) {
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
				console.log(cdn)
				return args
			})
		// }
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
