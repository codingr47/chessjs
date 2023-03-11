const path = require("path");
const webpack = require("webpack");
// eslint-disable-next-line @typescript-eslint/naming-convention, import/no-extraneous-dependencies
const TerserPlugin = require("terser-webpack-plugin");


const mainEntryPoint = "./lib/main.ts";

module.exports = (env, argv) => {
	const scriptLoadersRulesArray = [
		{
			test: /(?<!\.d)\.(ts)x?$/,
			use: [
				{
					loader: "ts-loader",
					options: {
						transpileOnly: false,
						logLevel: "info",
						logInfoToStdOut: true,
					},
				},
			],
		},
	];

	return {
		entry: mainEntryPoint,
		output: {
			filename: "bundle.js",
			chunkFilename: "[name].bundle.js",
			path: path.resolve(__dirname, "dist"),
			library: "poc",
			libraryTarget: "umd",
		},
		devtool: "source-map",
		resolve: {
			extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
			alias: {
				react: require.resolve("react"),
			},
		},
		optimization: {
			chunkIds: "named",
			minimize: false,
			minimizer: [new TerserPlugin({
				exclude: /index_esm_js/,
				terserOptions: {
					format: {
						keep_quoted_props: true,
					},
				},
			})],
		},
		stats: "normal",
		module: {
			rules: [{
				test: /\.css$/,
				use: [{
					loader: "style-loader",
					options: {
						insertInto: "body",
					},
				},
				{
					loader: "css-loader",
					options: {
						importLoaders: true,
						modules: {
							localIdentName: "[path][name]__[local]--[hash:base64:5]",
						},
					},
				},
				],
			},
			{
				test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
				use: {
					loader: "file-loader",
					options: {
						name: "fonts/[name].[ext]",
					},
				},
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: {
					loader: "file-loader",
					options: {
						name: "images/[name].[ext]",
					},
				},
			},
			...scriptLoadersRulesArray,
			],
		},
		devServer: {
			static: {
				directory: __dirname,
			},
			client: {
				overlay: false,
			},
		},
	};
};
