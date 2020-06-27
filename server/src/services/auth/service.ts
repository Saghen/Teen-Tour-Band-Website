import { BadRequest, Conflict, Forbidden, NotAcceptable, NotFound } from 'fejl'

import { objectToToken, comparePassword } from '@helpers/auth'
import { isValidUserEntry } from '@helpers/validators'

import { PERMISSIONS } from '@constants'
import config from '@config'

import User from '@models/User'
import InviteCode from '@models/InviteCode'
import { MongoError } from './assert'

const authConfig = config.get('auth')

export default {
  async login({ username, password }): Promise<string> {
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
    })
  },

  /*
  NOTE:
    - Add invite code checker - done
    - Invite code gives permissions? - yes
    - What do permissions look like, just names? - Permission enum
    - Give user permission based off of invite code
  */
  async signup({ firstName, lastName, username, email, phone, password, inviteCode }) {
    if (!authConfig.enabled) return objectToToken({ admin: true })
  
    // Ensure we have all the parts
    BadRequest.assert(username && password && firstName && lastName && email && phone && inviteCode,
      'Please provide a first name, last name, username, password, email, phone number, and an invite code.')

    // Type checking
    NotAcceptable.assert(isValidUserEntry(firstName, lastName, username, email, phone, password, inviteCode), 'Please specify valid types for the parameters of the user')
    
    // Move username to lowercase
    username = username.toLowerCase()
    
    // Check if user with username already exists
    const checkUser = await User.findOne({ username, email })
    Conflict.assert(!checkUser, 'User already exists with that username.')

    // Check for invite code and validate it
    const invite = await InviteCode.findOne({ inviteCode })
    NotFound.assert(invite, 'That invite code does not exist')
    Forbidden.assert(!invite.used, 'The invite code is already used')

    // Mark the invite code as used
    invite.used = true;
    await invite.save().catch((err) => {
      MongoError.assert(!err, 'There was a mongodb error')
    })

    // Get the permission that is granted
    let permissionEnum = invite.permissionGranted

    // Create the user
    const user = await User.create({ firstName, lastName, username, password, email, phone, permissionEnum })
    return objectToToken({
      id: user._id,
      username,
    })
  },
}
