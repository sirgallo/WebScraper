import { WebScrapeProvider } from './Providers/WebScrapeProvider'
import { IWebScrapeOpts } from './Models/IWebScraper'

import { LogProvider } from './Core/Providers/LogProvider'
import { FileOpProvider } from './Core/Providers/FileOpProvider'
import { dynamicImportByPlatformLoader } from './Core/Utils/DynamicImportLoader'

const log = new LogProvider('Web Scrape Driver')
const fileOp = new FileOpProvider()

export async function webScrapeDriver(configs: IWebScrapeOpts): Promise<string> {
  log.debug('Initializing App...')
  log.newLine()

  const platformImports = {
    windows: [ 'puppeteer-core' ],
    unix: [ 'puppeteer' ]
  }

  try {
    const imports = await dynamicImportByPlatformLoader(platformImports)
    const fileName = await new WebScrapeProvider(imports, configs)
      .runMultiUrl()

    return fileName
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
  .then(fileName => {
    log.debug(fileName)
    fileOp.readFile(fileName)
      .then(jsonResults => {
        log.debug(JSON.stringify(jsonResults, null, 2))
      })
  }).catch(err => {
    log.error(err)
    process.exit(1)
  })