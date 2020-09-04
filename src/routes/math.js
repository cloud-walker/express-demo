import express from 'express'
import logger from 'loglevel'

const add = async (req, res) => {
  logger.info(`a ${req.query.a} b ${req.query.b}`)
  const sum = Number(req.query.a) + Number(req.query.b)
  res.send(sum.toString())
}

const subtract = async (req, res) => {
  const difference = Number(req.query.a) - Number(req.query.b)
  res.send(difference.toString())
}

export const getMathRoutes = () => {
  const router = express.Router()
  router.get('/add', add)
  router.get('/subtract', subtract)
  return router
}
