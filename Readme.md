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

In *.env*

```bash
  PUPPETEERVERSION=puppeteer | puppeteer-core
  BROWSEREXECPATH=<path-to-chrome-executable>
```

In *./Configs/webScrapeConfigs.ts*

  - modify with your required fields
  - rebuild project