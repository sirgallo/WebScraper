import { configs } from './Configs/webScrapeConfigs'
import { WebScrapeProvider } from './Providers/WebScrapeProvider'

import { LogProvider } from './Core/Providers/LogProvider'
import { dynamicImportByPlatformLoader } from './Core/Utils/DynamicImportLoader'

const log = new LogProvider('Web Scrape Driver')

log.debug('Initializing App...')
log.newLine()

const platformImports = {
  windows: [ 'puppeteer-core' ],
  unix: [ 'puppeteer' ]
}

dynamicImportByPlatformLoader(platformImports)
  .then(imports => {
    new WebScrapeProvider(imports, configs)
      .runMultiUrl()
      .then(res => {
        log.boolean(res)
        process.exit(0)
      })
  }).catch(err => log.error(err))