import express from 'express'
import { getRoutes } from './routes'

export const startServer = ({ port = process.env.PORT } = {}) => {
  const app = express()

  app.use('/api', getRoutes())

  app.use(errorMiddleware)

  return new Promise((resolve) => {
    const fn = () => {
      logger.info(`listening on ${port}`)
      const originalClose = server.close.bind(server)
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose)
        })
      }
      setupOnCloseExit(server)
      resolve(server)
    }
    const server = app.listen(port, fn)
  })
}
