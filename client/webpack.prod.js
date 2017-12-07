const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  resolveLoader: {
    root: path.join(__dirname, 'client/node_modules'),
  },
  plugins: [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify('production'),
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      mangle: {
        except: ['$super', '$', 'exports', 'require'],
      },
    })
  ],
});
