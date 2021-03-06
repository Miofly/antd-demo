const path = require('path')
const glob = require("glob-all");
const os = require('os');
// 分析代码体积工具
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// 压缩优化 js 去除日志
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const PurgecssPlugin = require("purgecss-webpack-plugin");

const zopfli = require("@gfx/zopfli");
const BrotliPlugin = require("brotli-webpack-plugin");

// 判断是否生产环境
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

// gzip压缩
const CompressionWebpackPlugin = require("compression-webpack-plugin");

// 利用cdn加载
const assetsCDN = {
	// webpack build externals
	externals: {
		vue: 'Vue',
		'vue-router': 'VueRouter',
		vuex: 'Vuex',
		axios: 'axios',
		'ant-design-vue': 'antd',
	},
	css: ['https://cdn.jsdelivr.net/npm/ant-design-vue@1.7.3/dist/antd.min.css'],
	// https://unpkg.com/browse/vue@2.6.10/
	js: [
		'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
		'https://cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
		'https://cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
		'https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js',
		'https://cdn.jsdelivr.net/npm/ant-design-vue@1.4.12/dist/antd.min.js'
	]
}

// 获取真实IP地址
function getIpAddress () {
	const interfaces = os.networkInterfaces()
	for (const devName in interfaces) {
		if (devName == 'WLAN') {
			const iface = interfaces[devName]
			for (let i = 0; i < iface.length; i++) {
				const alias = iface[i]
				if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
					return alias.address
				}
			}
		}
	}
}

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
		if (IS_PROD) {
			const plugins = [];
			// gzip打包
			plugins.push(
				new CompressionWebpackPlugin({
					test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
					threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
					deleteOriginalAssets: false, // 是否删除原文件
					algorithm(input, compressionOptions, callback) {
						return zopfli.gzip(input, compressionOptions, callback);
					},
					minRatio: 0.8,
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
					sourceMap: false, // 使用源映射将错误信息位置映射到模块（这将会减慢编译速度）
					parallel: true  // 使用多进程并行运行来提高构建速度
				})
			);
			// plugins.push(
			// 	new BrotliPlugin({
			// 		test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
			// 		minRatio: 0.99
			// 	})
			// );
			config.plugins = [...config.plugins, ...plugins];
			// 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
			config.externals = assetsCDN.externals
		}
	},
	chainWebpack: (config) => {
		if (IS_PROD) {
			config.module.rule("images")
			.test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
			.use('url-loader')
			.loader('url-loader')
			.tap(options => Object.assign(options, { limit: 1000 }))
			.end()
			.use("image-webpack-loader")
			.loader("image-webpack-loader")
			.options({
				mozjpeg: { // 压缩JPEG图像
					progressive: true,
					quality: 65,
				},
				optipng: { // 压缩PNG图像
					enabled: false, // 表示不啟用這一個圖片優化器
				},
				pngquant: { // 压缩PNG图像
					quality: [0.65, 0.9],
					speed: 4,
				},
				gifsicle: { // 压缩GIF图像
					interlaced: false,
				},
				webp: { // 将JPG和PNG图像压缩为WEBP
					quality: 75, // 配置選項表示啟用 WebP 優化器
				},
			});
			// 代码分析插件
			config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin).init(Plugin => new Plugin({
				analyzerMode: 'server', // 在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
				analyzerHost: '127.0.0.1',
				analyzerPort: 3000,
				defaultSizes: 'parsed', // 模块大小默认显示在报告中。应该是`stat`，`parsed`或者`gzip`中的一个。
				openAnalyzer: false, // 在默认浏览器中自动打开报告
				logLevel: 'info' // 日志级别
			}))

			// html中添加cdn
			config.plugin('html').tap(args => {
				args[0].cdn = assetsCDN
				return args
			})
		}
	},
	css: {
		loaderOptions: {
			less: {
				modifyVars: {
					'border-radius-base': '2px'
				},
				// DO NOT REMOVE THIS LINE
				javascriptEnabled: true
			},
			postcss: { // 浏览器增加前缀
				plugins: [
					// require('autoprefixer')({
					// 	browsers : [
					// 		'last 1 version', // 例如 last 80 version 可给大部分浏览器增加前缀
					// 		'> 1%',
					// 		'IE 10'
					// 	]
					// }),
					require('@fullhuman/postcss-purgecss')({
						content: [`./public/index.html`, `./src/components/*.vue`, `./src/views/*.vue`],
						defaultExtractor(content) {
							const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
							return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
						},
						whitelist: [],
						safelist: [/ant-*/, /-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /data-v-.*/]
					})
				]
			}
		}
	},
	devServer: { // 开发环境跨域处理
		host: getIpAddress(),
		open: true,
	}
}
