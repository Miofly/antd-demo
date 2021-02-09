const path = require('path')
const glob = require("glob-all");

// 分析代码体积工具
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const PurgecssPlugin = require("purgecss-webpack-plugin");

module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
	outputDir: 'dist',
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
	},
	css: {
		loaderOptions: {
			// 给 sass-loader 传递选项
			sass: {
				additionalData: `@import "~@/variables.sass"`
			},
			scss: {
				additionalData: `@import "~@/variables.scss";`
			},
			less:{
				// http://lesscss.org/usage/#less-options-strict-units `Global Variables`
				// `primary` is global variables fields name
				globalVars: {
					primary: '#fff'
				}
			}
		}
	}
}
