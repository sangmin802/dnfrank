const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode : 'development',
  entry : {
    main : './public/js/main.js',
    signIn : './public/js/signIn.js',
    signUp : './public/js/signIn.js'
  },
  output : {
    filename : './js/[name].js',
    path : path.resolve(__dirname, 'build'),
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
    ...['main','signIn','signUp'].map(html => {
      const template = html === 'main' ? `./views/${html}.ejs` : `./public/${html}.html`;
      return new HtmlWebpackPlugin({
        template : template,
        filename : `./html/${html}.html`,
        chunks : [`${html}`]
      })
    })
  ],
}