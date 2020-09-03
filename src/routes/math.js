import express from 'express'

const add = async (req, res) => {
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
}
