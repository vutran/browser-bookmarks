# browser-bookmarks

[![Travis](https://img.shields.io/travis/vutran/browser-bookmarks/develop.svg?maxAge=2592000&style=flat-square)](https://travis-ci.org/vutran/browser-bookmarks) [![Coveralls branch](https://img.shields.io/coveralls/vutran/browser-bookmarks/develop.svg?maxAge=2592000&style=flat-square)](https://coveralls.io/github/vutran/browser-bookmarks) [![license](https://img.shields.io/github/license/vutran/browser-bookmarks.svg?maxAge=2592000&style=flat-square)](LICENSE)

> Retrieve bookmarks from different browsers.

## Install

```bash
$ npm install --save browser-bookmarks
```

## Usage

```js
const browserBookmarks = require('browser-bookmarks');

// retrieve bookmarks from Chrome (returns a Promise)
browserBookmarks.getChrome().then(bookmarks => {
  console.log(bookmarks);
});
```

## API

### getChrome()

Returns a Promise with an array of [Bookmarks](#bookmarks) objects.

## Bookmarks

### title

The bookmark title.

Type: `String`

### url

The bookmark URL.

Type: `String`

### icon

The bookmark icon.

Type: `String`

### folder

The folder in which the bookmark item belongs.

Type: `String`

## License

MIT © [Vu Tran](https://github.com/vutran/)
