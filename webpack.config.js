/* eslint-disable no-undef */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let mode = 'development';
let buildPath = path.resolve(__dirname, 'dev-build');

const plugins = [
	new HtmlWebpackPlugin({
		template: './src/html/template.html',
	}),
	new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
];

if (process.env.NODE_ENV === 'production') {
	mode = 'production';
	buildPath = path.resolve(__dirname, 'dist');
}

module.exports = {
	mode,
	entry: './src/script/index.js',
	plugins,
	output: {
		filename: '[name].[contenthash].bundle.js',
		path: buildPath,
		assetModuleFilename: 'assets/[hash][ext][query]',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.scss$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: { publicPath: '' },
					},
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.css$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: { publicPath: '' },
					},
					'css-loader',
				],
			},
			{
				test: /\.(svg|png)$/i,
				type: 'asset/resource',
			},
		],
	},
	devtool: mode === 'development' ? 'source-map' : false,
	devServer: {
		hot: true,
	},
};
