import config from '@config'
import { V2 } from 'paseto'
import { createSecretKey } from 'crypto'
import bcrypt from 'bcrypt'
import { Context } from '@middleware/types'
import { Next } from 'koa'

import { PERMISSIONS } from '@constants'

import Permission from '@models/Permissions'

import { assertNotLoggedIn, assertNotValidEndpoint, assertNotAuthorized } from '@services/auth/assert'
import { NotFound } from 'fejl'
import { assertNotFoundGenerator } from './asserts'

const secretKey = createSecretKey(Buffer.from(config.get('auth.secret')))

/*
  Permission Overhaul

  Each member belongs to a certain group
  Each group will have a valid type

  Example:
    Johnny Appleseed - Section Leader -> Trumpet
    Bill Franks - Admin -> None // This is an edge case, admins and super users do not have types
    George Bob - Member -> Trumpet

  Each group has access to certain methods that it can run
  Then each type of group will have access to its end point ie. trumpet, drum-line etc.

  Permission Group Object {
    isGroup: true,
    name: 'Section Leader',
    validSubtypes: ['Trumpet', 'Drum Line',...],
    methods: ['post', 'delete', 'get'],
    permissionLevel: 1 // They inherit all group types that are below this number
    children: ['Trumpet', 'Drum Line'], // Object ids ?
  }

  Permission Type Object {
    isGroup: false,
    name: 'Trumpet',
    endpoints: ['trumpet']
  }

*/

interface AuthMiddlewareOptions {
  permissionGroup: string
  endpoint: string
}

function authMiddleware(options: AuthMiddlewareOptions = {permissionGroup: 'DEFAULT', endpoint: '' }) {
  return async (ctx: Context, next: Next): Promise<any> => {
    const {permissionGroup = 'DEFAULT', endpoint = '' } = options
    const token = ctx.cookies.get(config.get('auth').cookie)

    assertNotLoggedIn(token)
    assertNotValidEndpoint(endpoint !== '')

    if (token) {
      try {
        ctx.user = await V2.decrypt(token, secretKey)
      } catch (err) {
        return ctx.forbidden({ message: 'The token is invalid', invalidToken: true })
      }
    }

    assertNotAuthorized(ctx.user)

    // Check if they dont want to passthrough or if the user exists
    if (ctx.user) {
      const userPerm = await Permission.findOne({ name: ctx.user.permissionGroup })
      const wantedPerm = await Permission.findOne({ name: permissionGroup })
      
      // Check to see if the permissions exist
      NotFound.assert(userPerm && wantedPerm, 'The permission roles are missing from the database')
        
      // Check to make sure they are high enough
      assertNotAuthorized(userPerm.permissionLevel >= wantedPerm.permissionLevel)
      
      // Check to make sure that the wanted permission includes permission for the endpoint
      assertNotAuthorized(userPerm.endpoints.includes(endpoint) || userPerm.endpoints.includes('*'))
    }

    return next()
  }
}

function objectToToken(obj): Promise<string> {
  return V2.encrypt(obj, secretKey)
}

function comparePassword(password: string, encryptedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, encryptedPassword)
}

function isAuthorized(permissionLevel, { user }): boolean {
  return permissionLevel >= user.permissionLevel
}

export { authMiddleware, objectToToken, comparePassword, isAuthorized }

