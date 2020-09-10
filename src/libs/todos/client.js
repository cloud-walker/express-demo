const todos = []

const getAll = () => {
  return { status: 200, body: todos }
}

const create = (params) => {
  const todo = { name: params.name }
  todos.push(todo)
  return { status: 200, body: todo }
}

export const todosClient = () => {
  return {
    create: create,
    getAll: getAll,
  }
}
