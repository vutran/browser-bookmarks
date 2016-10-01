const url = require('url');

/**
 * Retrieve the favicon URL for the given URL.
 *
 * @param {String} link
 * @return {String}
 */
const getFavicon = (link) => {
  if (link && link.length) {
    const o = url.parse(link);
    if (o) {
      const protocol = o.protocol;
      const hostname = o.hostname;
      return `${protocol}//${hostname}/favicon.ico`;
    }
  }
  return '';
};

module.exports = {
  getFavicon,
};
