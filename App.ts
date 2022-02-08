import { WebScrapeProvider } from './Providers/WebScrapeProvider'
import { IWebScrapeOpts } from './Models/IWebScraper'

import { LogProvider } from './Core/Providers/LogProvider'
import { dynamicImportByPlatformLoader } from './Core/Utils/DynamicImportLoader'

const log = new LogProvider('Web Scrape Driver')

export async function webScrapeDriver(configs: IWebScrapeOpts): Promise<boolean> {
  log.debug('Initializing App...')
  log.newLine()

  const platformImports = {
    windows: [ 'puppeteer-core' ],
    unix: [ 'puppeteer' ]
  }

  try {
    const imports = await dynamicImportByPlatformLoader(platformImports)
    await new WebScrapeProvider(imports, configs)
      .runMultiUrl()

    return true
  } catch (err) { throw err }
}

const configs: IWebScrapeOpts = {
  options: [
    {
      url: 'https://www.anandtech.com',
      selectors: [
        {
          text: 'cont_box1',
          type: 'class'
        }
      ],
      paginateOpts: {
        paginateFunc: function(baseurl, page, perPage) { 
          return `${baseurl}/Page/${page}` 
        },
        startPage: 1,
        endPage: 5
      },
      removeNewLines: true
    }
  ],
  filepath: '/home/sirgallo/Documents/Projects/WebScraper'
}

webScrapeDriver(configs)
  .then(res => {
    log.boolean(res)
    process.exit(0)
  }).catch(err => {
    log.error(err)
    process.exit(1)
  })