import { Page, Browser } from 'puppeteer'

export type UnParsedString = string

export interface IWebScrape {
  url: string
  selectors: ISelector[]
  paginateOpts?: {
    paginateFunc(baseUrl: string, page: number, perPage?: number): string
    perPage?: number
    startPage?: number
    endPage?: number
  }
  removeNewLines?: boolean
}

export interface IReturnHtml {
  pages: IResults[]
  errorStack: any[]
}

export interface IInnerHtml {
  elementText: UnParsedString
}

export interface IResults {
  url: string
  htmlList: IInnerHtml[]
  timeStamp: Date
}

export interface ISelector {
  text: string
  type: 'class' | 'element'
}

export interface IBrowser {
  browser: Browser
  page: Page
}