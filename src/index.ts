import { Logger, Color, TextStyle } from '@starkow/logger'
import { oneLine } from 'common-tags'
import Fastify from 'fastify'
import { createClient } from 'redis'

import config from './config'
import type { IRequestParams, IRequestQuery } from './types'
import { themes, getImage } from './utilities/themify'

const client = createClient({
  url: config.database.url,
})

const fastify = Fastify({
  logger: false, // config.package.mode === 'development',
})

const logger = Logger.create('index', Color.Gray)

fastify.get('/', async (request, reply) => {
  reply.send({
    user_url: '/@{user}{?theme}',
    user_statistics_url: '/raw/@{user}',
    themes_url: '/themes',
  })
})

fastify.get('/@:name', async (request, reply) => {
  const params = request.params as IRequestParams
  const { theme = 'moebooru' } = request.query as IRequestQuery

  const counter = await client.incr(params.name)

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
})

fastify.get('/raw/@:name', async (request, reply) => {
  const params = request.params as IRequestParams

  const counter = await client.incr(params.name)

  reply.send({
    name: params.name,
    counter,
  })
})

fastify.get('/themes', async (request, reply) => {
  reply.send(Object.keys(themes))
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
