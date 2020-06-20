import KoaRouter from 'koa-router'

import authRoutes from './auth/auth-api'

const router = new KoaRouter()

const apiRouters = [authRoutes]

for (const apiRouter of apiRouters) {
  router.use(apiRouter.routes())
  router.use(apiRouter.allowedMethods())
}

export default router
