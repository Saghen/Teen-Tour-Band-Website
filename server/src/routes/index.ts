import KoaRouter from 'koa-router'
const router = new KoaRouter()

import authRoutes from './auth/auth-api'

const apiRouters = [authRoutes]

for (const apiRouter of apiRouters) {
  router.use(apiRouter.routes())
  router.use(apiRouter.allowedMethods())
}

export default router
