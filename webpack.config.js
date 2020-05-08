const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry : {
    main : './public/js/main.js'
  },
  output : {
    filename : './js/[name].js',
    path : path.resolve(__dirname, 'dist'),
    // pubilcPath : 'dist'
  },
  module : {
    rules : [
      {
        test : /\.js$/,
        include : path.resolve(__dirname, 'public/js'),
        use : {
          loader : 'babel-loader',
        }
      }
    ]
  },
  plugins : [
    new HtmlWebpackPlugin({
      minify : {
        collapseWhitespace : true
      },
      hash : true,
      template : './public/main.html',
      filename : 'main.html'
    })
  ],
  devServer : {
    proxy : {
      'https://api.neople.co.kr' : {
        target : 'http://localhost:8080',
        changeOrigin : true
      }
    }
  }
}