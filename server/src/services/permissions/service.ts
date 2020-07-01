import { NotAcceptable, BadRequest, Conflict, NotFound } from 'fejl'

import { isValidPermissionBody, isValidPermissionAssign } from '@helpers/validators'

import Permission, { PermissionDocument } from '@models/Permissions'
import User, { UserDocument } from '@models/User'

interface AssignReturn {
  user: UserDocument,
  permissionGroup: string,
  permissionType: string
}

interface RemoveReturn {
  user: UserDocument
}

interface DeletePermissionReturn {
  ok?: number,
  n?: number
}

export default {
  async create({ isGroup, name, validSubtypes, methods, endpoints, permissionLevel, children }): Promise<string> {

    // Check for all paremeters
    BadRequest.assert((isGroup !== undefined) && name && validSubtypes
      && methods && endpoints && permissionLevel
      && children,
    'Please provide all parts of the permission body')

    // Check types
    NotAcceptable.assert(
      isValidPermissionBody(
        isGroup, name, validSubtypes,
        methods, endpoints, permissionLevel,
        children),
      'This permission was misconstructed and cannot be made')

    // All permission names are in caps
    name = name.toUpperCase()

    // Check to see if one already exists
    const checkPerm = await Permission.findOne({ name })
    Conflict.assert(!checkPerm, 'A permission with that name already exists')

    // Create the permission
    const permission = await Permission.create({ isGroup, name, validSubtypes, methods, endpoints, permissionLevel, children })

    return permission.name
  },
  async assign({ username, permissionGroup, permissionType }): Promise<AssignReturn> {

    // Check for all parameters
    BadRequest.assert(username && permissionGroup && permissionType, 'Please include the username, permission group and the permission type')

    // Check types
    NotAcceptable.assert(isValidPermissionAssign(username, permissionGroup, permissionType), 'The given types were misconstructed')

    username = username.toLowerCase()

    const user = await User.findOne({ username })
    NotFound.assert(user, 'That user does not exist')

    const pG = Permission.findOne({ isGroup: true, name: permissionGroup })
    const pT = Permission.findOne({ isGroup: false, name: permissionType })
    NotFound.assert(pG && pT, 'The permission group or the permission type do not exist')

    user.group = permissionGroup
    user.type = permissionType

    // TODO: Catch errors
    await user.save()

    return { user, permissionGroup, permissionType }
  },
  async remove({ username }): Promise<RemoveReturn> {

    // Check for all parameters
    BadRequest.assert(username, 'Please include the username for permissions to be removed from')

    // Check types
    NotAcceptable.assert(typeof username === 'string', 'The username was not a string')

    username = username.toLowerCase()

    const user = await User.findOne({ username })
    NotFound.assert(user, 'That user does not exist')

    user.group = undefined
    user.type = undefined

    // TODO: Catch errors
    await user.save()

    return { user }
  },
  async get({ permissionName }): Promise<PermissionDocument> {
    
    // Check for all paremeters
    BadRequest.assert(permissionName, 'Please include the name of the permission to look for')

    // Check types
    NotAcceptable.assert(typeof permissionName === 'string', 'The query name was not a string')

    permissionName = permissionName.toUpperCase()

    const permission = await Permission.findOne({ name: permissionName })
    NotFound.assert(permission, 'That permission does not exist')

    return permission
  },
  async delete({ permissionName }): Promise<DeletePermissionReturn> {
    
    // Check for all paremeters
    BadRequest.assert(permissionName, 'Please include the name of the permission to look for')

    // Check types
    NotAcceptable.assert(typeof permissionName === 'string', 'The query name was not a string')

    permissionName = permissionName.toUpperCase()

    const permission = await Permission.deleteOne({ name: permissionName })
    
    return permission
  }

}