const bookmarks = require('./');

console.time('getChrome');

bookmarks.getChrome()
  .then(results => {
    console.timeEnd('getChrome');
  });
