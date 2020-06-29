/* eslint-disable func-names */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import { isPermissionGroup, isPermissionType } from '@helpers/validators'
import { PERMISSIONS } from '@constants'

function validateLocalStrategyProperty(property): number {
  return property.length
}

function validatePassword(password): boolean {
  return password && password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/.test(password)
}

function validateEmail(email): boolean {
  return email && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
}

function validatePhone(phone): boolean {
  return phone && /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(phone)
}

export type UserDocument = mongoose.Document & {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  // TODO: Convert to custom permission enum
  group?: string;
  type: string;
  archived?: boolean
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
      validate: [
        validateLocalStrategyProperty,
        'A username must be provided'
      ],
    },
    email: {
      type: String,
      unique: true, 
      required: true,
      index: true,
      validate: [
        validateEmail,
        'A valid email must be provided'
      ],
    },
    phone: {
      type: String,
      required: true,
      validate: [
        validatePhone,
        'A valid phone number must be provided'
      ]
    },
    password: {
      type: String,
      validate: [
        validatePassword,
        'Password must contain an uppercase, lowercase, and a digit and be atleast 8 characters.',
      ],
    },
    group: {
      type: String,
      default: 'MEMBER',
      validate: [
        isPermissionGroup,
        'Permission group must exist'
      ],
    },
    type: {
      type: String,
      validate: [
        isPermissionType,
        'Permission type must exist'
      ]
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
UserSchema.pre('save', async function (): Promise<void> {
  const user = this
  if (!user.isModified('password') || user.password === undefined) return

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(user.password, salt, null)
  user.password = hash
})

UserSchema.methods.comparePassword = async function (password): Promise<boolean> {
  return bcrypt.compare(password, this.password)
}

UserSchema.methods.toJSON = function (): unknown {
  const obj = this.toObject()
  delete obj.password
  return obj
}

const User = mongoose.model<UserDocument>('User', UserSchema)

export default User
