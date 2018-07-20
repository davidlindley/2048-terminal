var path = require('path');

module.exports = {
  mode: 'production',
  entry: './bin/app.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.js'
  },
  module: {
    /**
     * What rules
     */
    rules: [

      /**
       * Any files with a .js extension (excluding node_modules)
       * Load with babel-loader (this converts files down to vanilla javascript)
       * .babelrc config is used here
       */
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }]
  }
};
