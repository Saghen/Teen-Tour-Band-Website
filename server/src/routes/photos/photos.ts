import KoaRouter from 'koa-router'
import KoaBody from 'koa-body'
import config from '@config'
import * as fs from 'fs'
import * as Path from 'path'

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

router.prefix('/photos')

router.get('/get', authMiddleware({
  permissionGroup: 'MEMBER',
  passthrough: true,
  endpoint: 'photos'
}), async (ctx) => {

  ctx.ok({ message: 'WOW' })
})

router.post('/upload', authMiddleware({
  permissionGroup: 'MEMBER',
  passthrough: true,
  endpoint: 'photos'
}),  KoaBody(), async (ctx) => {
  
  try {
    const { path, name } = ctx.request.files.file

    // BUG: Have to create a photos folder for it to reference
    const savePath = Path.join(__dirname, `../../../photos/${name}`)
    await fs.copyFileSync(path, savePath)
    ctx.ok({ message: 'Photo succesfully saved', name})
  } catch (err) {
    ctx.ok({message: 'An error occured', err})
  }
})

export default router
