const path = require('path');
module.exports = (webpack) => {
  return {
    ...webpack,
    resolve: {
      ...webpack.resolve,
      alias: {
        // we need this because of multiple LRU versions across the different modules
        // we can possibly remove once everything has consolidated
        'lru-cache': path.join(__dirname, 'node_modules', 'lru-cache'),
        ...webpack.resolve.alias
      }
    }
  };
};
