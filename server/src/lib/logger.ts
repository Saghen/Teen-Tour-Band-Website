import { createLogger, format, transports, Logger } from 'winston'
import Transport from 'winston-stream'
import config from '@config'
import path from 'path'
import fs from 'fs'

import chalk from 'chalk'
import tripleBeam from 'triple-beam'

import getRootDir from '@helpers/get-root-dir'

const { combine, colorize, label, simple, timestamp } = format
const loggerConfig = config.get('logger')

function addToBeginning(label, chalkFunc) {
  return format((info) => {
    info.level = `${chalkFunc(label)}: ${info.level}`
    return info
  })()
}

function json(replacer, space) {
  return format((info) => {
    info[tripleBeam.MESSAGE] = `${JSON.stringify(info, replacer, space)},`
    return info
  })()
}

function createConsoleTransport(label?: string, chalkFunc?: Function): transports.ConsoleTransportInstance | void {
  if (!loggerConfig.console.enabled) return
  const formatFuncs = [colorize(), simple()]
  if (label) {
    if (!chalkFunc) throw new Error('Must provide chalk function when using a label')

    formatFuncs.splice(1, 0, addToBeginning(label, chalkFunc))
  }
  return new transports.Console({
    level: loggerConfig.console.level,
    format: combine(...formatFuncs),
    handleExceptions: loggerConfig.handleExceptions,
  })
}

// TODO: Split logs per week
function createFileTransport(labelText?: string): transports.FileTransportInstance | void {
  if (!loggerConfig.file.enabled) return

  const logDir = path.join(getRootDir(), loggerConfig.file.path)

  try {
    fs.mkdirSync(logDir)
  } catch (err) {}

  const formatFuncs = [json(undefined, config.get('env') !== 'production' ? 2 : 0), timestamp()]
  if (labelText) formatFuncs.unshift(label({ label: labelText }))

  return new transports.File({
    level: loggerConfig.file.level,
    format: combine(...formatFuncs),
    filename: path.join(logDir, loggerConfig.file.filename),
  })
}

interface LoggerWithExtras extends Logger {
  api: Logger
  db: Logger
}

const logger: LoggerWithExtras = Object.defineProperties(
  createLogger({
    transports: <[Transport]>[createConsoleTransport(), createFileTransport()].filter((a) => a),
  }),
  {
    api: {
      value: createLogger({
        transports: <[Transport]>(
          [createConsoleTransport('API', chalk.magenta), createFileTransport('API')].filter((a) => a)
        ),
      }),
    },
    db: {
      value: createLogger({
        transports: <[Transport]>[createConsoleTransport('DB', chalk.cyan), createFileTransport('DB')].filter((a) => a),
      }),
    },
  }
)

export default logger

export const waitForLogger = async (logger) => {
  const loggerDone = new Promise((resolve) => logger.on('finish', resolve))
  logger.close()
  return loggerDone
}
