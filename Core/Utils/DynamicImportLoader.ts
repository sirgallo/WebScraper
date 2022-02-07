import {
  PlatformOptions,
  getPlatform,
  PlatformOptionsType
} from './Platform'
import { LogProvider } from '../Providers/LogProvider'

export async function dynamicImportByPlatformLoader(modulesToImport: Record<PlatformOptionsType, string[]>): Promise<any> {
  const log = new LogProvider('Dynamic Loader')
  
  try {
    log.debug(`Current Platform: ${getPlatform}`)
    let moduleImports: any
    if (getPlatform === PlatformOptions.Windows) {
      log.debug('Attempting to load puppeteer version: puppeteer-core')
      moduleImports = await dynamicImportLoader(modulesToImport.windows)
    } else if (getPlatform === PlatformOptions.Linux || PlatformOptions.MacOS) {
      log.debug('Attempting to load puppeteer version: puppeteer')
      moduleImports = await dynamicImportLoader(modulesToImport.unix)
    }

    log.debug('Loaded imports.')
    log.newLine()

    return moduleImports
  } catch (err) {
    log.error(err)
    throw err
  }
}

export async function dynamicImportLoader(modulesToImport: string[]): Promise<any> {
  const allModules = {}

  for (const module of modulesToImport) {
    allModules[module] = await require(module)
  }

  return allModules
}