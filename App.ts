import { configs } from './Configs/webScrapeConfigs'
import { dynamicWebScrapeProvider } from './Providers/WebScrapeProvider'

import { LogProvider } from './Core/Providers/LogProvider'

const log = new LogProvider('Web Scraper Driver')

dynamicWebScrapeProvider(configs)
  .then(res => {
    log.boolean(res)
    process.exit(0)
  }).catch(err => console.log(err))