import { resolve } from 'path'
import ne from 'webpack-node-externals'

export default {
	entry: './benchmark.js',
	output: {
		path: resolve('.'),
		filename: 'benchmark.bundle.js'
	},
	module: {
		loaders: [{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }],
		noParse: /node_modules\/benchmark/
	},
	externals: [ne()]
}
