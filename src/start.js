import Koa from 'koa'
import koaBody from 'koa-body'
import { getRouter } from './routers'
import logger from 'loglevel'

const setupCloseOnExit = (server) => {
  const exitHandler = async (options = {}) => {
    await server
      .close()
      .then(() => {
        logger.info('Server successfully closed')
      })
      .catch((e) => {
        logger.warn('Something went wrong in close', e.stack)
      })

    if (options.exit) process.exit()
  }
  // do something when app is closing
  process.on('exit', exitHandler)

  // catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit: true }))

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))

  // catches uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
}

const promisedServer = (app, port) => {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${server.address().port}`)
      const originalClose = server.close.bind(server)
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose)
        })
      }
      setupCloseOnExit(server)
      resolve(server)
    })
  })
}

export const startServer = ({ port = process.env.PORT } = {}) => {
  const app = new Koa()

  app.on('error', (err, ctx) => {
    logger.info(`${ctx.method} ${ctx.url}`)
    logger.error('server error:', err)
    logger.info('ctx:', ctx)
  })

  app.use(async (ctx, next) => {
    await next()
    const rt = ctx.response.get('X-Response-Time')
    logger.info(`${ctx.method} ${ctx.url} - ${rt}`)
  })

  app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
  })

  app.use(koaBody())

  let router = getRouter()
  app.use(router.routes())

  return promisedServer(app, port)
}
