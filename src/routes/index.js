import Router from "koa-router";
import { mathRouter } from "./math";

export const router = new Router();

router.get("/ping/success", (ctx) => {
  ctx.body = { message: "pong" };
});

router.get("/ping/error", (ctx) => {
  ctx.throw(500, JSON.stringify({ message: "forced error" }), { expose: true });
});

router.use("/api", mathRouter.routes(), mathRouter.allowedMethods());
