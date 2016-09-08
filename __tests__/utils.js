const utils = require('../utils');

describe('favicon', () => {
  it('should retrieve the favicon URL', () => {
    expect(utils.getFavicon('http://google.com/some/fake/path')).toEqual('http://google.com/favicon.ico');
  });

  it('should return nothing', () => {
    expect(utils.getFavicon('')).toEqual('');
  });
});
