import { BadRequest, Forbidden, NotFound } from 'fejl'

import { objectToToken, comparePassword } from '@helpers/auth'

import { PERMISSIONS } from '@constants'
import config from '@config'
const authConfig = config.get('auth')

import User from '@models/User'

export default {
  async login({ username, password }) {
    if (!authConfig.enabled) return objectToToken({ admin: true })
    BadRequest.assert(username && password, 'A username and password must be provided')
    // TODO: Check types

    username = username.toLowerCase()

    if (username === authConfig.username) {
      Forbidden.assert(password === authConfig.password, 'Password is incorrect')
      return objectToToken({ admin: true, username, permissionLevel: PERMISSIONS.ADMIN })
    }

    const user = await User.findOne({ username })

    NotFound.assert(user, 'The user was not found')

    Forbidden.assert(await comparePassword(password, user.password), 'Password is incorrect')

    if (username === 'administrator') return objectToToken({ admin: true })

    return objectToToken({
      id: user._id,
      username,
      virtualOfficeIds: user.virtualOffices,
      officeIds: user.computedOfficeIds,
    })
  },
  async signup({ firstName, lastName, username, password, inviteCode }) {

  }
}
