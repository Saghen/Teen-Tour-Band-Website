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

router.post('/create', authMiddleware({
  permissionGroup: 'ADMIN',
  endpoint: 'permissions'
}), async (ctx) => {
  const permissionName = await permissionService.create(ctx.request.body)

  ctx.ok({ message: 'Permission created', permissionName })
})

router.post('/assign', authMiddleware({
  permissionGroup: 'ADMIN',
  endpoint: 'permissions'
}), async (ctx) => {

  const info = await permissionService.assign(ctx.request.body)

  ctx.ok({ message: 'Assigned permission to the user', info })
})

router.post('/remove', authMiddleware({
  permissionGroup: 'ADMIN',
  endpoint: 'permissions'
}), async (ctx) => {

  const user = await permissionService.remove(ctx.request.body)

  ctx.ok({ message: 'Removed permissions from the user', user })
})

router.get('/get', authMiddleware({
  permissionGroup: 'ADMIN',
  endpoint: 'permissions'
}), async (ctx) => {
  const permission = await permissionService.get(ctx.request.body)

  ctx.ok({ message: 'Got permission', permission })
})

router.get('/delete', authMiddleware({
  permissionGroup: 'ADMIN',
  endpoint: 'permissions'
}), async (ctx) => {
  const permission = await permissionService.delete(ctx.request.body)

  ctx.ok({ message: 'Deleted permission', permission })
})

export default router
