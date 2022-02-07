# WebScraper
## Uses Node.js and Puppeteer

Make sure `node --lts` is installed on your machine. You can use either `nvm` or `n` to install.

install node modules:
```bash
  npm install
```

build:
```bash
  npm run build
```

run:
```bash
  npm run start
```

In `./Configs/webScrapeConfigs.ts`

  - modify with your required fields
  - rebuild project

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

This is a **Universal Application**:
  - The Web Scraper will automatically identify the platform and adjust imports accordingly. Windows requires `puppeteer-core` to run, but it is better to bundle `puppeteer` when possible since it contains a full version of chrome