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

router.post('/create', /*  authMiddleware({
  permissionLevel: 1,
  passthrough: false,
}), */ async (ctx) => {
  // TODO: Allow permission type to be passed through to create
    const inviteCode = await inviteCodeService.create()

    ctx.ok({ message: 'Invite Code Created', inviteCode })
  })

router.get('/get', (ctx) => { })

router.get('/delete', async (ctx) => {
})

export default router
