const chrome = require('./browsers/chrome');

/**
 * Retrieves Chrome bookmarks
 *
 * @return {Object[]} - An array of bookmark objects
 */
const getChrome = () => chrome.extractBookmarks(chrome.getDirectory(process.platform));

module.exports = {
  getChrome,
};
