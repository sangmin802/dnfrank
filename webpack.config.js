const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode : 'production',
  entry : {
    main : './public/js/main.js',
    signIn : './public/js/signIn.js',
    signUp : './public/js/signUp.js'
  },
  output : {
    filename : './js/[name].js',
    path : path.resolve(__dirname, 'build'),
  },
  module : {
    rules : [
      {
        test : /\.js$/,
        exclude: /(node_modules|bower_components)/, // 속도를 빠르게하기위해 번들링하는 파일을 줄임.(노드모듈 제외)
        include : path.resolve(__dirname, 'public/js'),
        use : {
          loader : 'babel-loader',
          options : {
            presets : ['@babel/preset-env'],
            plugins : ['transform-class-properties'] // class 객체 번들링
          }
        }
      },
      {
        test : /\.css$/,
        use : ['style-loader', 'css-loader']
      },
      {
        test : /\.(woff|woff2|eot|ttf|otf)$/,
        use : [
          {
            loader : 'url-loader',
            options : {
              limit : 10000, // 크기가 작으면 url loader로 크면 file loader로
              // url-loader : 문자형식으로 풀어서 코드와 함께 번들링
              // file-loader : 파일 자체를 복사해버림
              fallback : 'file-loader',
              name : 'fonts/[name].[ext]',
            }
          }
        ]
      }
    ]
  },
  plugins : [
    ...['main','signIn','signUp'].map(html => {
      return new HtmlWebpackPlugin({
        template : `./public/${html}.html`,
        filename : `./html/${html}.html`,
        chunks : [`${html}`]
      })
    })
  ],
}