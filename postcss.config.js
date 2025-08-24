module.exports = {
	plugins: [
		require('postcss-import'),
		require('@tailwindcss/postcss'),
		require('autoprefixer'),
		...(process.env.NODE_ENV === 'production' ? [require('cssnano')] : [])
	]
}
