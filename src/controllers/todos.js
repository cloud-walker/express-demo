import { todosClient } from '../libs/todos/client'

const getParams = (ctx) => {
  return ctx.request.body
}

const getResponse = (body, status) => {
  return { body, status }
}

const updateCtx = (ctx, response) => {
  ctx.body = response.body
  ctx.status = response.status
}

const create = (ctx) => {
  const params = getParams(ctx)
  const { body, status } = todosClient().create({ name: params.name })
  const response = getResponse(body, status)
  updateCtx(ctx, response)
}

const getAll = (ctx) => {
  const { body, status } = todosClient().getAll()
  const response = getResponse(body, status)
  updateCtx(ctx, response)
}

export const todosController = () => {
  return {
    create: create,
    getAll: getAll,
  }
}
