const path = require('path')

import { promisify } from 'util'
import { writeFile, existsSync, readFile } from 'fs'
import { randomUUID } from 'crypto'

import { LogProvider } from './LogProvider'

export const asyncWriteFile = promisify(writeFile)
export const asyncExists = promisify(existsSync)
export const asyncReadFile = promisify(readFile)

export class FileOpProvider {
  private log = new LogProvider('File Op Provider')
  constructor(private opts?: any) {}

  exists(pathForFile: string): boolean {
    return existsSync(pathForFile)
  }

  async readFile(fileName) {
    const res = await asyncReadFile(fileName)
    const jsonResult = JSON.parse(res.toString())

    return jsonResult
  }

  async writeFile(jsonLoad: any, pathForFile?: string): Promise<string> {
    const jsonString = JSON.stringify(jsonLoad)
    const filename = `${randomUUID({ disableEntropyCache: true })}.dump.json`
    const fullPath =  pathForFile ? path.normalize(path.join(pathForFile, filename)) : path.normalize(path.join(process.cwd(), filename))
    try {
      this.log.info(`Attempting to write json payload to this path: ${fullPath}`)
      await asyncWriteFile(fullPath, jsonString)
      this.log.success(`File written to ${fullPath}`)

      return fullPath
    } catch (err) {
      this.log.error(err)
      throw err
    }
  }
}