import mongoose from 'mongoose'
import { PERMISSIONS, STATUS, ALERTLEVEL } from '@constants'
import { assertMustBeOfType, assertObjectIdGenerator, assertArrayMustContainItem } from '@helpers/asserts'
import Permission from '@models/Permissions'

const isObjectId = mongoose.Types.ObjectId.isValid

function isValidUserEntry(firstName, lastName, username, email, phone, password, inviteCode): boolean {
  if (typeof firstName !== 'string') return false
  if (typeof lastName !== 'string') return false
  if (typeof username !== 'string') return false
  if (typeof email !== 'string') return false
  if (typeof phone !== 'string') return false
  if (typeof password !== 'string') return false
  if (typeof inviteCode !== 'string') return false

  return true
}

// FUTURE: This is aids and needs to be fixed
function isValidPermissionBody(isGroup, name, subTypes, methods, endpoints, permissionLevel, children ): boolean {
  if (typeof isGroup !== 'boolean') return false
  if (typeof name !== 'string') return false
  if (!Array.isArray(subTypes)) return false;
  if (!Array.isArray(methods)) return false;
  if (!Array.isArray(endpoints)) return false;
  if (typeof permissionLevel !== 'number') return false; // BUG: Reads as not a number if permissionLevel = 0
  if (!Array.isArray(children)) return false;

  return true
}

function isValidPermissionAssign(username, permissionGroup, permissionType): boolean {
  if (typeof username !== 'string') return false
  if (typeof permissionGroup !== 'string') return false
  if (typeof permissionType !== 'string') return false
  
  return true
}

function isPermissionGroup(name): boolean {
  return Permission.findOne({name, isGroup: true}) !== undefined
}

function isPermissionType(name): boolean {
  return Permission.findOne({ name, isGroup: false }) !== undefined
}

function isPermissionLevel(permissionLevel: PERMISSIONS): boolean {
  return Object.entries(PERMISSIONS).some((permission) => permission[1] === permissionLevel)
}

function isStatus(status: string | number): boolean {
  if (typeof status === 'string') return Object.keys(STATUS).includes(status)
  if (typeof status === 'number') return Object.values(STATUS).includes(status)
  return false
}

function isAlertLevel(alertLevel: ALERTLEVEL): boolean {
  return Object.keys(ALERTLEVEL).includes(alertLevel)
}

function validateArrayOfObjectIds(property, data): void {
  assertMustBeOfType(property, 'array')(Array.isArray(data))
  assertArrayMustContainItem(property)(data.length > 0)
  assertObjectIdGenerator(`${property} child items'`)(data.every(isObjectId))
}

export { isValidUserEntry, isValidPermissionBody, isValidPermissionAssign, isObjectId, isPermissionGroup, isPermissionType, isPermissionLevel, validateArrayOfObjectIds, isStatus, isAlertLevel }
