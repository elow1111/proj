const path = require('path');

module.exports = {
  entry: './src/index.js', // Ваш входной файл
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'), // Здесь указывается путь к статическим файлам
    open: true,
    port: 3000,
    hot: true,
    historyApiFallback: true // Это для работы с React Router
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
