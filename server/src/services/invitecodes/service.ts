import { NotFound } from 'fejl'

import { isPermissionGroup, isPermissionType } from '@helpers/validators'

import randomWords from 'random-words';
import InviteCode from '@models/InviteCode'

export default {
  async create({ permissionGroup, permissionType }): Promise<string> {
    // NOTE: This is from a new package, maybe should do random letters, but it looks so good
    // Generate exactly 4 words that are at max 4 chars long and join them with the '-' char
    // 161.5 billion possibilities
    const code = randomWords({ exactly: 4, join: '-', maxLength: 4 })

    // Check to see if the permission granted through the invite code actually exists
    NotFound.assert(isPermissionGroup(permissionGroup), 'That is a not a valid permission group')

    NotFound.assert(isPermissionType(permissionType), 'That is not a valid permission type')

    // Create an invite code
    const invite = await InviteCode.create({
      inviteCode: code,
      permissionGroup,
      permissionType
    })

    // Return the code
    return (await invite).inviteCode;
  }
}
