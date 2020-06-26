import KoaRouter from 'koa-router'

import authRoutes from './auth/auth-api'
import inviteCodeRoutes from './invitecode/invite-codes'

const router = new KoaRouter()

const apiRouters = [authRoutes, inviteCodeRoutes]

for (const apiRouter of apiRouters) {
  router.use(apiRouter.routes())
  router.use(apiRouter.allowedMethods())
}

export default router
