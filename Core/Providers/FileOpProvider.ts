const path = require('path')

import { promisify } from 'util'
import { writeFile, existsSync, readFile } from 'fs'
import { randomUUID } from 'crypto'

import { LogProvider } from './LogProvider'
import { IFileOpOpts } from '../Models/IFileOp'
export const asyncWriteFile = promisify(writeFile)
export const asyncExists = promisify(existsSync)
export const asyncReadFile = promisify(readFile)

export class FileOpProvider {
  private log = new LogProvider('File Op Provider')
  constructor(private opts?: IFileOpOpts) {}

  exists(pathForFile: string): boolean {
    try { return existsSync(pathForFile) } 
    catch (err) { throw err }
  }

  async readFile(fileName: string) {
    try {
      this.log.info(`Attempting to read file: ${fileName}`)
      const res = await asyncReadFile(fileName, {
        ...this.opts?.encoding,
        ...this.opts?.flag
      })
      const jsonResult = JSON.parse(res.toString())
      this.log.success(`File successfully read to json object, returning result.`)

      return jsonResult
    } catch (err) { throw err }  
  }

  async writeFile(jsonLoad: any, pathForFile?: string): Promise<string> {
    const jsonString = JSON.stringify(jsonLoad)
    const filename = `${randomUUID({ disableEntropyCache: true })}.dump.json`
    const fullPath =  pathForFile ? path.normalize(path.join(pathForFile, filename)) : path.normalize(path.join(process.cwd(), filename))
    
    try {
      this.log.info(`Attempting to write json payload to this path: ${fullPath}`)
      await asyncWriteFile(fullPath, jsonString, this.opts)
      this.log.success(`File written to ${fullPath}.`)

      return fullPath
    } catch (err) { throw err }
  }
}