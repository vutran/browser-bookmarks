# browser-bookmarks

[![Build Status](https://travis-ci.org/vutran/browser-bookmarks.svg?branch=master)](https://travis-ci.org/vutran/browser-bookmarks) [![Coverage Status](https://coveralls.io/repos/github/vutran/browser-bookmarks/badge.svg?branch=master)](https://coveralls.io/github/vutran/browser-bookmarks?branch=master)

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
