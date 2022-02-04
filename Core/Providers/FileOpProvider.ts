import { promisify }from 'util'
import { writeFile, existsSync } from 'fs'

import { randomUUID } from 'crypto'

import { LogProvider } from './LogProvider'

export const asyncWriteFile = promisify(writeFile)
export const asyncExists = promisify(existsSync)

export class FileOpProvider {
  private log = new LogProvider('File Op Provider')
  constructor(private opts?: any) {}

  async exists(path: string): Promise<boolean> {
    return await asyncExists(path) as boolean
  }

  async writeFile(jsonLoad: any, path?: string): Promise<boolean> {
    const jsonString = JSON.stringify(jsonLoad)
    const filename = `${randomUUID({disableEntropyCache : true})}.${new Date().toISOString()}.dump.json`
    const fullPath =  path ? `${path}/${filename}` : `${process.cwd()}/${filename}`
    try {
      this.log.info(`Attempting to write json payload to this path: ${fullPath}`)
      await asyncWriteFile(fullPath, jsonString)
      this.log.success(`File written to ${fullPath}`)

      return true
    } catch (err) {
      this.log.error(err)
      throw err
    }
  }
}