import { Logger, Color, TextStyle } from '@starkow/logger'
import { oneLine } from 'common-tags'
import Fastify from 'fastify'
import { createClient } from 'redis'

import config from './config'
import type { IRequestParams, IRequestQuery } from './types'
import { themes, getImage } from './utilities/themify'
import { SUPPORTED_FORMATS } from './utilities/constants'

const client = createClient({
  url: config.database.url,
})

const fastify = Fastify({
  logger: config.package.mode === 'development',
})

const logger = Logger.create('index', Color.Gray)

fastify.get('/', async (request, reply) => {
  reply.send({
    user_image_url: '/@{user}{?theme,format}',
    themes_url: '/themes',
    formats_url: '/formats',
  })
})

fastify.get('/@:name', async (request, reply) => {
  const params = request.params as IRequestParams
  let { theme = 'moebooru', format = 'svg' } = request.query as IRequestQuery

  const counter = await client.incr(params.name)

  if (!SUPPORTED_FORMATS.includes(format)) {
    format = 'svg'
  }

  switch (format) {
  case 'svg': {
    reply.headers({
      'content-type': 'image/svg+xml',
      'cache-control': params.name === 'demo' ? 'max-age=31536000' : 'max-age=0, no-cache, no-store, must-revalidate',
    }).send(
      getImage({
        count: counter,
        theme,
        length: params.name === 'demo' ? 10 : 7,
      }),
    )

    break
  }
  case 'txt': {
    reply.headers({
      'content-type': 'text/plain',
    }).send(counter.toString())

    break
  }
  case 'json': {
    reply.send({ name: params.name, counter })

    break
  }
  }
})

fastify.get('/themes', async (request, reply) => {
  reply.send(Object.keys(themes))
})

fastify.get('/formats', async (request, reply) => {
  reply.send(SUPPORTED_FORMATS)
})

const init = async () => {
  logger(oneLine`
    starting
    ${Logger.color(config.package.name, Color.Blue, TextStyle.Bold)}
    ${Logger.color(`(${config.package.version})`, Color.Blue)}
    in ${Logger.color(config.package.mode, Color.Blue, TextStyle.Bold)} mode...
  `)

  await client.connect()
    .then(() => logger('connected to database'))
    .catch(Logger.create('error', Color.Red, TextStyle.Bold).error)

  fastify.listen({
    port: config.web.port,
    host: config.web.hostname,
  }).then(() => logger(`web server is running on ${Logger.color(`${config.web.hostname}:${config.web.port}`, Color.Magenta)}`))
    .catch(Logger.create('error', Color.Red, TextStyle.Bold).error)
}

init()
  .catch(Logger.create('error', Color.Red, TextStyle.Bold).error)
