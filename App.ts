import { configs } from './Configs/webScrapeConfigs'
import { WebScrapeProvider } from './Providers/WebScrapeProvider'
import { IWebScrapeOpts } from './Models/IWebScraper'

import { LogProvider } from './Core/Providers/LogProvider'
import { dynamicImportByPlatformLoader } from './Core/Utils/DynamicImportLoader'

const log = new LogProvider('Web Scrape Driver')

export async function webScrapeDriver(overRideOpts?: IWebScrapeOpts): Promise<boolean> {
  log.debug('Initializing App...')
  log.newLine()

  const platformImports = {
    windows: [ 'puppeteer-core' ],
    unix: [ 'puppeteer' ]
  }
  
  try {
    const imports = await dynamicImportByPlatformLoader(platformImports)
    await new WebScrapeProvider(overRideOpts ? overRideOpts : imports, configs).runMultiUrl()

    return true
  } catch (err) {
    throw err
  }
}

webScrapeDriver()
  .then(res => {
    log.boolean(res)
    process.exit(0)
  }).catch(err => {
    log.error(err)
    process.exit(1)
  })