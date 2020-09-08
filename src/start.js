import express from 'express'
import 'express-async-errors'
import logger from 'loglevel'
import { getRoutes } from './routes'

export const startServer = ({ port = process.env.PORT } = {}) => {
  const app = express()

  app.use('/api', getRoutes())

  const errorMiddleware = (error, req, res, next) => {
    if (res.headersSent) {
      next(error)
    } else {
      res.status(500)
      res.json({
        message: error.message,
        ...(process.env.NODE_ENV === 'production'
          ? null
          : { stack: error.stack }),
      })
    }
  }

  app.get('/ping/success', (req, res) => res.json({ message: 'pong' }))
  app.get('/ping/error', (req, res) => {
    throw new Error('forced error')
  })
  app.use(errorMiddleware)

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
