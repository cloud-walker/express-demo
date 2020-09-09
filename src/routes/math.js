import logger from 'loglevel'
import Router from 'koa-router'

const mathRouter = new Router()

const add = (ctx) => {
  logger.info(`a ${ctx.query.a} b ${ctx.query.b}`)
  const sum = Number(ctx.query.a) + Number(ctx.query.b)
  ctx.body = sum
}

const subtract = (ctx) => {
  const difference = Number(ctx.query.a) - Number(ctx.query.b)
  ctx.body = difference
}

mathRouter.get('/math/add', add)

mathRouter.get('/math/subtract', subtract)

export default mathRouter
