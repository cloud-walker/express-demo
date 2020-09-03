import express from "express"
import { getMathRoutes } from "./math"

export const getRoutes = () => {
  const router = express.Router()
  router.use("/math", getMathRoutes())
  return router
}
