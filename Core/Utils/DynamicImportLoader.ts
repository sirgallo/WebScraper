import {
  PlatformOptions,
  getPlatform,
  PlatformOptionsType
} from './Platform'
import { 
  CustomMessageWrap, 
  DEBUG, WARN
} from '../Models/ILog'
import { LogProvider } from '../Providers/LogProvider'

const log = new LogProvider('Dynamic Loader')

export async function dynamicImportByPlatformLoader(modulesToImport: Record<PlatformOptionsType, string[]>): Promise<any> {
  try {
    log.custom(customLogMessage(getPlatform.toUpperCase()))
    let moduleImports = {}

    if (getPlatform === PlatformOptions.Windows) {
      log.debug('Attempting to load puppeteer version: puppeteer-core')
      moduleImports = await dynamicImportLoader(modulesToImport.windows)
    } else if (getPlatform === PlatformOptions.Linux || PlatformOptions.MacOS) {
      log.debug('Attempting to load puppeteer version: puppeteer')
      moduleImports = await dynamicImportLoader(modulesToImport.unix)
    }

    log.success('Loaded Imports.')
    log.newLine()

    return moduleImports
  } catch (err) {
    log.error(`Error in dynamic importer: ${err}`)
    throw err
  }
}

export async function dynamicImportLoader(modulesToImport: string[]): Promise<any> {
  const allModules = {}

  modulesToImport.forEach( async name => {
    try {
      allModules[name] = await require(name)
    } catch (err) {
      log.error(`Unable to import module ${name}: ${err}`)
      process.exit(1)
    }
  })

  return allModules
}

function customLogMessage(message: string): CustomMessageWrap {
  return {
    1: {
      text: 'Current Platform:',
      color: DEBUG
    },
    2: {
      text: message,
      color: WARN
    }
  }
}