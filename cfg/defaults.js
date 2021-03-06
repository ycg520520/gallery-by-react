'use strict';
const path = require('path');
const srcPath = path.join(__dirname, '/../src');
const dfltPort = 3000;
function getDefaultModules() {
  return {
    preLoaders: [{
        test: /\.(js|jsx)$/,
        include: srcPath,
        loader: 'eslint-loader'
      }],
    loaders: [
      
      /*{
        test: /\.sass/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded&indentedSyntax'
      },*/
      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!postcss-loader!autoprefixer-loader?{browsers:["last 2 version","Firefox 15"]}!sass-loader?outputStyle=expanded'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader!autoprefixer-loader?{browsers:["last 2 version","Firefox 15"]}'
      },
      /*{
        test: /\.less/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      },
      {
        test: /\.styl/,
        loader: 'style-loader!css-loader!postcss-loader!stylus-loader'
      },*/
      {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=8192'
      },{
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(mp4|ogg|svg)$/,
        loader: 'file-loader'
      }
    ]
  };
}
module.exports = {
  srcPath: srcPath,
  publicPath: '/assets/',
  port: dfltPort,
  getDefaultModules: getDefaultModules,
  postcss: function () {
    return [];
  }
};