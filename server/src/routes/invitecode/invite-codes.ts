import KoaRouter from 'koa-router'
import config from '@config'
import inviteCodeService from '@services/invitecodes/service'

import { authMiddleware } from '@helpers/auth'

const router = new KoaRouter()

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

router.prefix('/invitecode')

router.post('/create', authMiddleware({
  permissionGroup: 'ADMIN',
  endpoint: 'invitecode'
}), async (ctx) => {
  // Pre-define the invite code
  // TODO: Never allow a user to create an invite code higher than their own permission
  const inviteCode = await inviteCodeService.create(ctx.request.body)

  ctx.ok({ message: 'Invite Code Created', inviteCode })
})

router.get('/get', (ctx) => { })

router.get('/delete', async (ctx) => { })

export default router
