import KoaRouter from 'koa-router'
import config from '@config'

import permissionService from '@services/permissions/service'

import { authMiddleware } from '@helpers/auth'

const router = new KoaRouter()

/* 
  NOTE: Should we make this handle all permission and creation or no?

*/

const cookieConfig = {
  secure: config.get('ssl'),
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  domain: config.get('api.domain'),
  httpOnly: false,
  sameSite: 'None',
}

const cookieConfigHttpOnly = {
  ...cookieConfig,
  httpOnly: true,
}

router.prefix('/permissions')

router.post('/create',  authMiddleware({
  permissionGroup: 'ADMIN',
  passthrough: true,
  endpoint: 'permissions'
}), async (ctx) => {
  const permissionName = await permissionService.create(ctx.request.body)
  
  ctx.ok({ message: 'Permission created', permissionName })
})

router.get('/get', (ctx) => { })

router.get('/delete', async (ctx) => { })

export default router
