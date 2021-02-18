const autoprefixer = require('autoprefixer')
const postcssImport = require('postcss-import')
const purgecss = require('@fullhuman/postcss-purgecss')
let plugins = []
plugins.push(postcssImport)
plugins.push(
	purgecss({
		content: [
			'./src/components/*.vue',
			'./public/**/*.html',
			'./public/*.html',
			'./src/views/*.vue',
			'./src/views/**/*.vue'
		],
		extractors: [
			{
				extractor: class Extractor {
					static extract(content) {
						const validSection = content.replace(
							/<style([\s\S]*?)<\/style>+/gim,
							''
						)
						return validSection.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
					}
				},
				extensions: ['html', 'vue']
			}
		],
		whitelist: ['html', 'body'],
		whitelistPatterns: [/el-.*/, /-(leave|enter|appear)(|-(to|from|active))$/, /^(?!cursor-move).+-move$/, /^router-link(|-exact)-active$/],
		whitelistPatternsChildren: [/^token/, /^pre/, /^code/]
	})
)
module.exports = {
	plugins: [...plugins, autoprefixer]
}
