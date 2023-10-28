/* eslint-disable no-redeclare */
import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { Logger, Color } from '@starkow/logger'

dotenv.config({
  path: (process.env.NODE_ENV === 'development' && existsSync('.env.development')) ? '.env.development' : '.env',
})

const logger = Logger.create('config', Color.Cyan)

function getEnvironmentVariable (name: string): string | undefined
function getEnvironmentVariable (name: string, fallback: string): string
function getEnvironmentVariable (...values: string[]): string | undefined {
  const [name, fallback] = values
  const environmentVariable = process.env[name]

  if (environmentVariable == null) {
    logger.warn(`environment variable "${name}" is not defined. ${fallback ? `using fallback value "${fallback}".` : 'returning undefined.'}`)
  }

  return environmentVariable ?? fallback
}

export default {
  package: {
    name: getEnvironmentVariable('npm_package_name', 'unknown'),
    version: getEnvironmentVariable('npm_package_version', 'unknown'),
    mode: getEnvironmentVariable('NODE_ENV', 'production'),
  },
  web: {
    hostname: getEnvironmentVariable('WEB_HOSTNAME', '127.0.0.1'),
    port: parseInt(getEnvironmentVariable('WEB_PORT', '3000'), 10),
  },
  database: {
    url: getEnvironmentVariable('DATABASE_URL', 'redis://127.0.0.1:6379'),
  },
}
