import { config } from 'dotenv'

import {
  IWebScrape,
  IReturnHtml,
  IBrowser,
  IInnerHtml,
  ISelector,
  IWebScrapeOpts
} from '../Models/IWebScraper'

import { LogProvider } from '../Core/Providers/LogProvider'
import { ITimerMap, elapsedTimeInMs } from '../Core/Utils/Timer'
import { FileOpProvider } from '../Core/Providers/FileOpProvider'

config({ path: '.env' })

export class WebScrapeProvider {
  private log = new LogProvider('Web Scrape Provider')
  private fileOp = new FileOpProvider()
  private timer: ITimerMap = {
    baseName: 'Web Scrape Provider',
    timerMap: {
      webScrape: {
        start: null,
        stop: null,
        elapsedInMs: null
      }
    }
  }

  constructor(private imports: any, private configs: IWebScrapeOpts, private headless: boolean = true) {}

  getConfigs() {
    return this.configs
  }

  async runMultiUrl(filePath?: string): Promise<boolean> {
    const allResults: IReturnHtml[] = []

    this.timer.timerMap['webScrape'].start = new Date()
    this.log.info('Starting new timer...')

    if (filePath && ! this.fileOp.exists(filePath)) throw new Error(`${filePath} does not exist...`)
    
    try {
      const _browser: IBrowser = await this.runHeadless()

      for (const config of this.configs.options) {
        if (config.paginateOpts) allResults.push(await this.headlessPaginate(_browser, config))
        else allResults.push(await this.headlessSingle(_browser, config))

        this.log.success(`Successfully parsed ${config.url}`)
      }

      this.log.newLine()
      this.log.debug('Closing Browser...')
      _browser.browser.close()
      
      this.timer.timerMap['webScrape'].stop = new Date()
      this.timer.timerMap['webScrape'].elapsedInMs = elapsedTimeInMs(
        this.timer.timerMap['webScrape'].start,
        this.timer.timerMap['webScrape'].stop
      )

      this.log.newLine()
      await this.fileOp.writeFile(allResults, this.configs.filepath)

      this.log.newLine()
      this.log.debug(
        JSON.stringify({ 
          start: this.timer.timerMap['webScrape'].start, 
          stop: this.timer.timerMap['webScrape'].stop 
        }, null, 2)
      )
      this.log.newLine()
      this.log.timer(this.timer.timerMap['webScrape'].elapsedInMs)
      this.log.newLine()

      return true
    } catch (err) {
      this.log.error(err)

      this.log.newLine()
      this.timer.timerMap['webScrape'].stop = new Date()

      this.timer.timerMap['webScrape'].elapsedInMs = elapsedTimeInMs(
        this.timer.timerMap['webScrape'].start,
        this.timer.timerMap['webScrape'].stop
      )

      this.log.timer(this.timer.timerMap['webScrape'].elapsedInMs )
      this.log.newLine()
    }
  }

  private async runHeadless(): Promise<IBrowser> {
    const isPuppeteerCore = this.imports.hasOwnProperty('puppeteer-core')
    const puppeteer =  isPuppeteerCore ? this.imports['puppeteer-core'] : this.imports['puppeteer']
    const browser = await puppeteer.launch({
      ...( isPuppeteerCore ? { executablePath: this.configs.browserExecPath } : {}),
      args: ['--no-sandbox', '--disable-setuid-sandbox'], 
      headless: this.headless
    })
    const page = await browser.newPage()

    this.log.info('Initialized Browser and Page')

    return { browser, page }
  }

  private async headlessSingle(_browser: IBrowser, config: IWebScrape): Promise<IReturnHtml> {
    const resp: IReturnHtml = {
      pages: [],
      errorStack: []
    }

    try {
      this.log.info(`Navigating to Url: ${config.url}`)
      const result = await this.scrapePage(_browser, config.url, config.selectors, config.removeNewLines)
      resp.pages.push({
        url: config.url,
        htmlList: result,
        timeStamp: new Date()
      })
    } catch (err) { 
      console.log('Error stack:', err)
      resp.errorStack.push(err)
    }

    return resp
  }

  private async headlessPaginate(_browser: IBrowser, config: IWebScrape): Promise<IReturnHtml> {
    const resp: IReturnHtml = {
      pages: [],
      errorStack: []
    }
    
    let pageNext = true
    let page = 1
    
    try {
      this.log.info(`Navigating to base url...${config.url}`)
      await _browser.page.goto(config.url)
      this.log.info('Beginning pagination...')
      while (config.paginateOpts.endPage ? config.paginateOpts.endPage >= page : pageNext) {
        const formattedPath = config.paginateOpts.paginateFunc(config.url, page, config.paginateOpts.perPage)

        this.log.debug(`Attempting page ${page}...`)
        this.log.info(`Next page url: ${pageNext ? formattedPath : 'ended' }`)
        const returnHtmlList: IInnerHtml[] = await this.scrapePage(_browser, formattedPath, config.selectors, config.removeNewLines)
        
        if (returnHtmlList.length > 0) { 
          resp.pages.push({
            url: formattedPath,
            htmlList: returnHtmlList,
            timeStamp: new Date()
          })
        } else pageNext = false
        
        ++page
      }
    } catch (err) {
      this.log.error(err)
      pageNext = false
      resp.errorStack.push({ err })
    }

    return resp
  }

  private async scrapePage(_browser: IBrowser, url: string, selectors: ISelector[], removeNewLines: boolean): Promise<IInnerHtml[]> {
    try {
      await _browser.page.goto(url)
      const elements: IInnerHtml[] = await _browser.page.evaluate( (obj: { selectors: any, removeNewLines: boolean }) => {
        const validateSelector = (selector: ISelector): string => selector.type === 'class' ? `.${selector.text}` : `#${selector.text}`
        const formatString = (item: any, removeWhiteLines: boolean) => { 
          const regex = new RegExp(/(\s{2,})/ig)
          const formattedStr: string = item.textContent?.trimStart().trimEnd()
          
          return removeWhiteLines ? formattedStr.replaceAll(regex, '') : formattedStr
        }

        const res = []

        for (const selector of obj.selectors) {
          const elem = document.querySelectorAll(validateSelector(selector))
          elem.forEach( item => {
            formatString(item, obj.removeNewLines)
            res.push({
              elementText: formatString(item, obj.removeNewLines)
            })
          })
        }

        return res
      },  { selectors , removeNewLines } as { selectors: any, removeNewLines: boolean })

      return elements
    } catch (err) { throw err }
  }
}