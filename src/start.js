import Koa from 'koa'
import { router } from './routes'
import logger from 'loglevel'

export const startServer = ({ port = process.env.PORT } = {}) => {
  const app = new Koa()

  // logger

  app.use(async (ctx, next) => {
    await next()
    const rt = ctx.response.get('X-Response-Time')
    logger.info(`${ctx.method} ${ctx.url} - ${rt}`)
  })

  // x-response-time

  app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
  })

  // error handling

  app.on('error', (err, ctx) => {
    logger.info(`${ctx.method} ${ctx.url}`)
    logger.error('server error:', err)
    logger.info('ctx:', ctx)
  })

  // router

  app.use(router.routes()).use(router.allowedMethods())

  // port listen

  return app.listen(port)
}
