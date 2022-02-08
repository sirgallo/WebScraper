# WebScraperTs

Make sure `node --lts` is installed on your machine. You can use either `nvm` or `n` to install.

Install `node` modules:
```bash
  npm install
```

Build:
```bash
  npm run build
```

Run:
```bash
  npm run start
```

Configuration should have following structure:

```typescript
{
  options: [
    {
      url: string
      selectors: [
        {
          text: string
          type: 'class' | 'element'
        }
      ]
      paginateOpts?: {
        paginateFunc(baseUrl: string, page: number, perPage?: number): string
        perPage?: number
        startPage?: number
        endPage?: number
      }
      removeNewLines?: boolean
    }
  ]
  filepath?: string
  browserExecPath?: string
}
```

Return object:

```typescript
{
  pages: [
    {
      url: string
      htmlList: [
        { elementText: string }
      ]
      timeStamp: Date
    }
  ]
  errorStack: []
}
```

Use in projects:

```typescript
const opts = { ... }

webScrapeDriver(opts)
  .then( res => console.log(res))
  .catch( err => console.log(err))
```

This is a **Universal Application**:
  - The Web Scraper will automatically identify the platform and adjust imports accordingly. Windows requires `puppeteer-core` to run, but it is better to bundle `puppeteer` when possible since it contains a full version of chrome

Check `./App.ts` to see a basic implementation of the web scraper.