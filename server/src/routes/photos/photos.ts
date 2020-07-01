import KoaRouter from 'koa-router'
import KoaBody from 'koa-body'
import config from '@config'

import photoService from '@services/photos/service'

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

router.get('/get/:name/:size', authMiddleware({
  permissionGroup: 'MEMBER',
  endpoint: 'photos'
}), async (ctx) => {

  const { name, size } = ctx.params
  const file = await photoService.get({name, size})
  ctx.response.type = 'image/png';
  ctx.body = file
})

router.post('/upload', authMiddleware({
  permissionGroup: 'MEMBER',
  endpoint: 'photos'
}),  KoaBody(), async (ctx) => {
  const { path, name, type } = ctx.request.files.file
  const fileName = await photoService.add({ filePath: path, name, type })
  ctx.ok({ message: 'Photo succesfully saved', fileName})
})

router.delete('/delete/:name', authMiddleware({
  permissionGroup: 'MEMBER',
  endpoint: 'photos'
}), async (ctx) => {
  const { name } = ctx.params
  const fileName = await photoService.delete({name})
  ctx.ok({ message: 'Photo succesfully deleted', fileName})
})

export default router
