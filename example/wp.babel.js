import { resolve } from 'path'
import ne from 'webpack-node-externals'

const { FILE } = process.env

export default {
	entry: `./${ FILE }.js`,
	output: {
		path: resolve('.'),
		filename: `${ FILE }.bundle.js`
	},
	module: {
		loaders: [{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }],
		noParse: /node_modules\/benchmark/
	},
	externals: [ne()]
}
