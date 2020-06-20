import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import { isPermissionEnum } from '@helpers/validators'
import { PERMISSIONS } from '@constants'

function validateLocalStrategyProperty(property) {
  return property.length
}

function validatePassword(password) {
  return password && password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/.test(password)
}

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true,
      index: true,
      validate: [validateLocalStrategyProperty, 'A username must be provided'],
    },
    password: {
      type: String,
      validate: [
        validatePassword,
        'Password must contain an uppercase, lowercase, and a digit and be atleast 8 characters.',
      ],
    },
    virtualOffices: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VirtualOffice' }],
      default: [],
      // TODO: Check if Virtual Offices exist
    },
    permissionEnum: {
      type: String,
      default: 'DEFAULT',
      validate: [isPermissionEnum, 'The permission level must be one of the enum keys'],
    },
    archived: Boolean,
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
)

/**
 * Password hashing and comparing
 */
UserSchema.pre('save', async function () {
  const user = this
  if (!user.isModified('password') || user.password === undefined) return

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(user.password, salt, null)
  user.password = hash
})

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

UserSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

/**
 * Permission Level Virtual
 */
UserSchema.virtual('permissionLevel')
  .get(function getPermissionLevel() {
    return PERMISSIONS[this.permisionEnum]
  })
  .set(function setPermissionLevel(permissionLevel) {
    const permissionEnum = Object.entries(PERMISSIONS).find((permission) => permission[1] === permissionLevel)
    if (!permissionEnum) throw new Error('The permission enum was not found')
    this.set({ permissionEnum: permissionEnum[0] })
  })

const User = mongoose.model('User', UserSchema)

export default User
