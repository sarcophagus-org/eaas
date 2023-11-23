const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    buffer: require.resolve('buffer'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
  
    url: require.resolve('url'),
    zlib: require.resolve('browserify-zlib'),
    process: require.resolve('process'),
    path: require.resolve('path-browserify'),
    util: require.resolve('util'),
    fs: false,
    tty: false,
    child_process: false,
    readline: false,
    timers: false,
    net: false, // 'net' is typically not available in the browser
    dgram: false, // 'dgram' (UDP) is not available in the browser
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      // https://github.com/framer/motion/issues/1504#issuecomment-1092838443
      process: 'process/browser.js',
    })
  );

  config.experiments = {
    topLevelAwait: true,
  };

  return config;
};
