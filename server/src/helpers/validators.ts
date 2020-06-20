import mongoose from 'mongoose'
import { PERMISSIONS, STATUS, ALERTLEVEL } from '@constants'
import { assertMustBeOfType, assertObjectIdGenerator, assertArrayMustContainItem } from '@helpers/asserts'

const isObjectId = mongoose.Types.ObjectId.isValid

function isPermissionEnum(permissionEnum: PERMISSIONS): boolean {
  return Object.keys(PERMISSIONS).includes(permissionEnum)
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

export { isObjectId, isPermissionEnum, isPermissionLevel, validateArrayOfObjectIds, isStatus, isAlertLevel }
