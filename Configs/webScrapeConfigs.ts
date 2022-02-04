import { IWebScrape } from '../Models/IWebScraper'

/*
  A test configuration, modify this to tailor towards your site
*/

export const configs: IWebScrape[] = [
  {
    url: 'https://www.anandtech.com',
    selectors: [
      {
        text: 'cont_box1',
        type: 'class'
      }
    ],
    paginateOpts: {
      paginateFunc: (baseurl, page, perPage) => { 
        return `${baseurl}/Page/${page}` 
      },
      startPage: 1,
      endPage: 5
    },
    removeNewLines: true
  }
  /*
  {
    url: 'https://www.astm.org',
    selectors: [
      {
        text: 'up-date',
        type: 'class'
      }
    ],
    paginateOpts: {
      paginateFunc: (baseurl, page, perPage) => { 
        return `${baseurl}/catalogsearch/result/index/?p=${page}&q=standards` 
      },
      startPage: 1
    }
  }
  */
]