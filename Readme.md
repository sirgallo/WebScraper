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
  node ./dist/App.js
```

In `.env`

```bash
  PUPPETEERVERSION=puppeteer | puppeteer-core
  BROWSEREXECPATH=<path-to-chrome-executable>
  FILEPATH=<path-to-write-output-to>
```

`FILEPATH` and `BROWSEREXECPATH` are optional

In `./Configs/webScrapeConfigs.ts`

  - modify with your required fields
  - rebuild project

Windows requires `puppeteer-core` to run, so this needs to be specified. Puppeteer requires a path to an executable chrome browser.