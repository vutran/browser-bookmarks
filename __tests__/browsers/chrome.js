import os from 'os';
import path from 'path';
import chrome from '../../browsers/chrome';

jest.mock('fs');

describe('retrieve the default directory', () => {
  const homedir = os.homedir();

  it('should retrieve for darwin', () => {
    expect(chrome.getDirectory('darwin')).toEqual(`${homedir}/Library/Application Support/Google/Chrome/Default/Bookmarks`);
  });

  it('should retrieve for win32', () => {
    // stub the LOCALAPPDATA env var
    process.env.LOCALAPPDATA = 'C:\\Users\\vu.tran\\AppData\\Local';
    expect(chrome.getDirectory('win32')).toEqual(`${process.env.LOCALAPPDATA}/Google/Chrome/User Data/Default/Bookmarks`);
  });

  it('should retrieve for linux', () => {
    expect(chrome.getDirectory('linux')).toEqual(`${homedir}/.config/google-chrome/Default/Bookmarks`);
  });

  it('should return nothing', () => {
    expect(chrome.getDirectory('INVALID')).toEqual('');
  });
});

describe('normalize', () => {
  it('should normalize an item', () => {
    const item = {
      date_added: 1234567890,
      id: 1,
      name: 'Foo',
      sync_transaction_version: 1,
      type: 'url',
      url: 'https://foobar.com',
    };
    const expected = {
      title: 'Foo',
      url: 'https://foobar.com',
      favicon: 'https://foobar.com/favicon.ico',
      folder: '',
    };
    expect(chrome.normalize(item)).toEqual(expected);
  });

  it('should normalize a item within a folder', () => {
    const item = {
      date_added: 1234567890,
      id: 1,
      name: 'Foo',
      sync_transaction_version: 1,
      type: 'url',
      url: 'https://foobar.com',
      folder: 'Bar',
    };
    const expected = {
      title: 'Foo',
      url: 'https://foobar.com',
      favicon: 'https://foobar.com/favicon.ico',
      folder: 'Bar',
    };
    expect(chrome.normalize(item)).toEqual(expected);
  });
});

describe('get childrens', () => {
  it('should retrieve child bookmark items', () => {
    const items = [
      {
        date_added: 100,
        id: 1,
        name: 'Bookmarks Bar',
        type: 'folder',
        children: [
          {
            date_added: 200,
            id: 2,
            name: 'Foo',
            sync_transaction_version: 1,
            type: 'url',
            url: 'https://foo.com',
          },
          {
            date_added: 300,
            id: 3,
            name: 'Sub-folder',
            sync_transaction_version: 1,
            type: 'folder',
            children: [
              {
                date_added: 400,
                id: 4,
                name: 'Bar',
                sync_transaction_version: 1,
                type: 'url',
                url: 'https://bar.com',
              },
            ],
          },
        ],
      },
    ];
    // should be an array
    expect(chrome.getChildren(items)).toBeTruthy();
    // first item
    expect(chrome.getChildren(items)).toContainEqual({
      date_added: 200,
      id: 2,
      name: 'Foo',
      sync_transaction_version: 1,
      type: 'url',
      url: 'https://foo.com',
      folder: 'Bookmarks Bar',
    });
    // second item
    expect(chrome.getChildren(items)).toContainEqual({
      date_added: 400,
      id: 4,
      name: 'Bar',
      sync_transaction_version: 1,
      type: 'url',
      url: 'https://bar.com',
      folder: 'Bookmarks Bar',
    });
  });
});

describe('extract bookmarks', () => {
  it('should retrieve local bookmarks', async () => {
    const mockData = {
      roots: {
        bookmarks_bar: {
          children: [
            {
              date_added: 0,
              id: 1,
              name: 'GitHub',
              type: 'url',
              url: 'https://github.com',
            },
          ],
        },
      },
    };
    // eslint-disable-next-line global-require, no-underscore-dangle
    require('fs').__setFileContents(JSON.stringify(mockData));
    const dir = path.join(chrome.getDirectory('darwin'));
    const bookmarks = await chrome.extractBookmarks(dir);
    expect(bookmarks).toBeDefined();
    expect(bookmarks instanceof Array).toBeTruthy();
    expect(bookmarks.length).toBeGreaterThan(0);
  });

  it('should retrieve no bookmarks', async () => {
    const mockData = {};
    // eslint-disable-next-line global-require, no-underscore-dangle
    require('fs').__setFileContents(JSON.stringify(mockData));
    const dir = path.join(chrome.getDirectory('darwin'));
    const bookmarks = await chrome.extractBookmarks(dir);
    expect(bookmarks).toBeDefined();
    expect(bookmarks instanceof Array).toBeTruthy();
    expect(bookmarks.length).toBe(0);
  });

  it('should return nothing for an invalid file', async () => {
    // eslint-disable-next-line global-require, no-underscore-dangle
    require('fs').__setIsInvalidFile(true);
    const dir = 'INVALID_DIR';
    const bookmarks = await chrome.extractBookmarks(dir);
    expect(bookmarks).toEqual([]);
  });
});
