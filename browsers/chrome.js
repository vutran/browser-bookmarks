const fs = require('fs');
const os = require('os');
const path = require('path');
const utils = require('../utils');

/**
 * Retrieve the directory to the Google Chrome default profile.
 *
 * https://www.chromium.org/user-experience/user-data-directory
 *
 * @param {String} profile - The profile name (default: "Default")
 * @return {String} - The directory to the Google Chrome profile
 */
const getDirectory = (platform, profile = 'Default') => {
  switch (platform) {
    case 'darwin':
      return path.join(
        os.homedir(),
        'Library',
        'Application Support',
        'Google',
        'Chrome',
        profile,
        'Bookmarks'
      );
    case 'win32':
      return path.join(
        process.env.LOCALAPPDATA,
        'Google',
        'Chrome',
        'User Data',
        profile,
        'Bookmarks'
      );
    case 'linux':
      return path.join(
        os.homedir(),
        '.config',
        'google-chrome',
        profile,
        'Bookmarks'
      );
    default:
      return '';
  }
};

/**
 * Normalizes the Chrome bookmark item to our bookmark model.
 *
 * @param {Object} item
 * @return {Object}
 */
const normalize = item => ({
  title: item.name,
  url: item.url,
  favicon: utils.getFavicon(item.url),
  folder: item.folder || '',
});

/**
 * Recursively retrieve a list of child nodes of bookmark objects.
 * Flattens the tree and appends a new "folder" property for reference.
 *
 * @param {Object[]}
 * @return {Object[]}
 */
const getChildren = (children) => {
  // build the bookmarks list
  let bookmarks = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === 'folder') {
      const gc = getChildren(child.children);
      for (let j = 0; j < gc.length; j++) {
        const fgc = Object.assign({}, gc[j], {
          folder: child.name,
        });
        bookmarks.push(fgc);
      }
    } else {
      bookmarks.push(child);
    }
  }
  return bookmarks;
};

/**
 * Reads the file and extract the bookmarks.
 *
 * @param {String} file - The path to the bookmarks file
 * @return {Promise} - An array of bookmark objects
 */
const extractBookmarks = file => new Promise((resolve) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      resolve([]);
    } else {
      const dataJson = JSON.parse(data);
      if (dataJson.roots) {
        // build the bookmarks list
        let bookmarks = [];
        Object.keys(dataJson.roots).forEach((folder) => {
          const rootObject = dataJson.roots[folder];
          // retrieve child nodes in each root folder
          // and concatenate to global collection
          const children = rootObject.children ? getChildren(rootObject.children) : [];
          if (children.length) {
            bookmarks = bookmarks.concat(children);
          }
        });
        resolve(bookmarks.map(normalize));
      } else {
        resolve([]);
      }
    }
  });
});

module.exports = {
  getDirectory,
  getChildren,
  extractBookmarks,
  normalize,
};
