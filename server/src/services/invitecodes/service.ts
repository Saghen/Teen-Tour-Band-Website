import { BadRequest, Conflict, Forbidden, NotFound } from 'fejl'

import { objectToToken, comparePassword } from '@helpers/auth'
import { isPermissionEnum } from '@helpers/validators'

import randomWords from 'random-words';

import { PERMISSIONS } from '@constants'
import config from '@config'

import User from '@models/User'
import InviteCode, {InviteCodeDocument} from '@models/InviteCode'

const authConfig = config.get('auth')

export default {
  async create({permissionGranted} = {permissionGranted: 'DEFAULT'}): Promise<string> {
    // NOTE: This is from a new package, maybe should do random letters, but it looks so good
    // Generate exactly 4 words that are at max 4 chars long and join them with the '-' char
    // 161.5 billion possibilities
    const code = randomWords({ exactly: 4, join: '-', maxLength: 4 })

    // Check to see if the permission granted through the invite code actually exists
    NotFound.assert(!isPermissionEnum(permissionGranted), 'That is a not a valid permission type')

    // Create an invite code
    const invite = await InviteCode.create({
      inviteCode: code,
      permissionGranted
    })

    // Return the code
    return (await invite).inviteCode;
  }
}
