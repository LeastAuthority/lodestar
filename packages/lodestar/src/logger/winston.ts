/**
 * @module logger
 */

import {createLogger, format, Logger, transports} from 'winston';
import {defaultLogLevel, LogLevel, LogLevels, ILogger, ILoggerOptions} from "./interface";

export class WinstonLogger implements ILogger {
  private winston: Logger;
  private _level: LogLevel;
  private _silent: boolean;

  public constructor(options?: Partial<ILoggerOptions>) {
    options = {
      level: LogLevel[defaultLogLevel],
      module: "",
      ...options,
    };
    this.winston = createLogger({
      level: LogLevel[LogLevel.debug], // log level switching handled in `createLogEntry`
      defaultMeta: {
        module: options.module || "",
      },
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.printf((info) => {
              const screenSize = process.stdout.columns;
              const paddingBeforeInfo = 21;
              const paddingBetweenInfo = 30;
              const paddingPreMsg = paddingBeforeInfo + paddingBetweenInfo + info.level.length - 19;

              const infoString = (info.module || info.namespace || "");
              const infoPad = paddingBetweenInfo - infoString.length;

              if (info.message.length + paddingPreMsg > screenSize) {
                const max = screenSize - paddingPreMsg;
                const p2 = info.message.length - max;
                const msgs = [info.message.substring(0, max), info.message.substring(max)]; 
                return (`${info.timestamp}  [${infoString.toUpperCase()}] ${info.level.padStart(infoPad)}: ${msgs[0]}\n${msgs[1].padStart(paddingPreMsg + 2)}`)
              } else {
                return `${info.timestamp}  [${infoString.toUpperCase()}] ${info.level.padStart(infoPad)}: ${info.message}`
              }
            })
          ),
          handleExceptions: true
        }),
      ],
      exitOnError: false
    });
    this._level = LogLevel[options.level];
    this._silent = false;
  }

  public debug(message: string | object, context?: object): void {
    this.createLogEntry(LogLevel.debug, message, context);
  }

  public info(message: string | object, context?: object): void {
    this.createLogEntry(LogLevel.info, message, context);
  }

  public error(message: string | object, context?: object): void {
    this.createLogEntry(LogLevel.error, message, context);
  }

  public warn(message: string | object, context?: object): void {
    this.createLogEntry(LogLevel.warn, message, context);
  }

  private createLogEntry(level: LogLevel, message: string | object, context: object = {}): void {
    if (this.silent || level > this._level) {
      return;
    }
    if (typeof message === 'object') {
      this.winston.log(LogLevel[level], JSON.stringify(message));
    } else {
      this.winston.log(LogLevel[level], message, context);
    }
  }

  public set level(level: LogLevel) {
    this.winston.level = LogLevel[level];
    this._level = level;
  }

  public get level(): LogLevel {
    return this._level;
  }

  public set silent(silent: boolean) {
    this._silent = silent;
  }

  public get silent(): boolean {
    return this._silent;
  }

  public child(options: ILoggerOptions): WinstonLogger {
    const logger = Object.create(WinstonLogger.prototype);
    const winston = this.winston.child({namespace: options.module});
    return Object.assign(logger, {
      winston,
      _level: options.level,
      _silent: false,

    });
  }
}
