import config from '@config'
import { V2 } from 'paseto'
import { createSecretKey } from 'crypto'
import bcrypt from 'bcrypt'
import { Context } from '@middleware/types'
import { Next } from 'koa'
import {} from 'koa-body'

import { PERMISSIONS } from '@constants'

import { assertNotLoggedIn, assertNotAuthorized, assertMustBeAdmin } from '@services/auth/assert'

const secretKey = createSecretKey(Buffer.from(config.get('auth.secret')))

interface AuthMiddlewareOptions {
  passthrough: boolean
  permissionLevel: number
}

function authMiddleware(options: AuthMiddlewareOptions = { passthrough: false, permissionLevel: PERMISSIONS.DEFAULT }) {
  return async (ctx: Context, next: Next) => {
    const { passthrough = false, permissionLevel = PERMISSIONS.DEFAULT } = options
    const token = ctx.cookies.get(config.get('auth').cookie)
    assertNotLoggedIn(token || passthrough)

    if (token || !passthrough) {
      try {
        ctx.user = await V2.decrypt(token, secretKey)
      } catch (err) {
        return ctx.forbidden({ message: 'The token is invalid', invalidToken: true })
      }
    }

    if (!passthrough || ctx.user) {
      if (permissionLevel <= PERMISSIONS.ADMIN)
        assertMustBeAdmin(ctx.user?.permissionLevel && ctx.user.permissionLevel <= permissionLevel)
      else assertNotAuthorized(ctx.user?.permissionLevel && ctx.user.permissionLevel <= permissionLevel)
    }

    return next()
  }
}

function objectToToken(obj) {
  return V2.encrypt(obj, secretKey)
}

function comparePassword(password, encryptedPassword) {
  return bcrypt.compare(password, encryptedPassword)
}

function isAuthorized(permissionLevel, { user }) {
  return permissionLevel >= user.permissionLevel
}

export { authMiddleware, objectToToken, comparePassword, isAuthorized }
