// import express from 'express'
// import { getMathRoutes } from './math'

// export const getRoutes = () => {
//   const router = express.Router()
//   router.use('/math', getMathRoutes())
//   return router
// }

import Router from 'koa-router'
import mathRouter from './math'

const router = new Router()

router.get('/ping/success', (ctx, next) => {
  ctx.body = { message: 'pong' }
})

router.get('/ping/error', (ctx, next) => {
  ctx.throw(500, JSON.stringify({ message: 'forced error' }), { expose: true })
})

router.use('/api', mathRouter.routes(), mathRouter.allowedMethods())

export default router
