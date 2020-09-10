import Router from '@koa/router'
import { todosController } from '../controllers/todos'

const createTodo = (ctx) => {
  return todosController().create(ctx)
}

const getTodos = (ctx) => {
  return todosController().getAll(ctx)
}

export const createTodosRouter = () => {
  const router = new Router({
    prefix: '/todos',
  })
  router.post('/', createTodo)
  router.get('/', getTodos)
  return router
}
