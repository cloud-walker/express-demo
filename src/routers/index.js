import Router from '@koa/router'
import { mathRouter } from './math'
import { createTodosRouter } from './todos'

export const getRouter = () => {
  let router = new Router()

  router.get('/ping/success', (ctx) => {
    ctx.body = { message: 'pong' }
  })

  router.get('/ping/error', (ctx) => {
    ctx.throw(500, JSON.stringify({ message: 'forced error' }), {
      expose: true,
    })
  })

  router.use('/api', mathRouter.routes())
  router.use('/api', createTodosRouter().routes())

  return router
}
