import KoaRouter from 'koa-router'

import authRoutes from './auth/auth-api'
import inviteCodeRoutes from './invitecode/invite-codes'
import permisionRoutes from './permissions/permissions'
import photoRoutes from './photos/photos'

const router = new KoaRouter()

const apiRouters = [authRoutes, inviteCodeRoutes, permisionRoutes, photoRoutes]

for (const apiRouter of apiRouters) {
  router.use(apiRouter.routes())
  router.use(apiRouter.allowedMethods())
}

export default router
