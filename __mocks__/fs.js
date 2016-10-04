const fs = jest.genMockFromModule('fs');

let mockFileContents = '';
let mockIsInvalidFile = false;

// eslint-disable-next-line no-underscore-dangle
fs.__setFileContents = (contents) => {
  mockFileContents = contents;
};

// eslint-disable-next-line no-underscore-dangle
fs.__setIsInvalidFile = (flag) => {
  mockIsInvalidFile = flag;
};

/**
 * Reads the file
 *
 * @param {String}
 * @param {String} encoding
 * @param {Function} callback
 */
fs.readFile = (file, encoding, callback) => {
  if (mockIsInvalidFile) {
    callback.call(null, true);
  } else {
    callback.call(null, null, mockFileContents);
  }
};

module.exports = fs;
