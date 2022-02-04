import {
  CustomMessageWrap,
  Message,
  BASE, ERROR, WARN, INFO, DEBUG, TIMER, STATUSOK
} from '../Models/ILog'

/*
  Log Provider provides colored logs, as well as the ability to create custom logs

  Provide base name to constructor so that the log has a predefined location
*/

export class LogProvider {
  private log = console.log
  constructor(private baseName: string) {}

  debug(message: Message) {
    this.log(BASE(this.formatBaseName()), DEBUG(message))
  }

  info(message: Message) {
    this.log(BASE(this.formatBaseName()), INFO(message))
  }

  warn(message: Message) {
    this.log(BASE(this.formatBaseName()), WARN(message))
  }

  error(message: Message) {
    this.log(BASE(this.formatBaseName()), ERROR(message))
  }

  success(message: Message) {
    this.log(BASE(this.formatBaseName(), STATUSOK('SUCCESS'), INFO(message)))
  }

  timer(elapsedTime: number) {
    this.log(
      BASE(this.formatBaseName()), 
      TIMER(`${new Date().toUTCString()} =>`),
      INFO(`Time Elapsed In Milliseconds: ${TIMER(elapsedTime)}`)
    )
  }

  newLine() {
    console.log()
  }
  
  boolean(bool: boolean) {
    if (bool) this.log(BASE(this.formatBaseName()), STATUSOK(bool))
    else this.log(BASE(this.formatBaseName()), ERROR(false))
  }

  custom(message: CustomMessageWrap, newLine?: boolean) {
    const finalMessage: string = Object.keys(message)
      .map(key => message[key].color(message[key].text))
      .join(' ')

    if(newLine) console.log()
    this.log(BASE(this.formatBaseName()), finalMessage)
  }

  private formatBaseName(): string {
    return `[${this.baseName.toUpperCase()}]: `
  }
}