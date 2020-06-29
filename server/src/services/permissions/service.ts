import { NotAcceptable, BadRequest, Conflict } from 'fejl'

import { isValidPermissionBody } from '@helpers/validators'

import Permission from '@models/Permissions'
import { createAPIServer } from '@lib/api-server'
import { objectToToken } from '@helpers/auth'

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
  }


}