/* eslint-disable func-names */

import mongoose from 'mongoose'
import { isPermissionGroup, isPermissionType } from '@helpers/validators'

export type InviteCodeDocument = mongoose.Document & {
  inviteCode: string,
  referer?: mongoose.Schema.Types.ObjectId;
  permissionGroup: string;
  permissionType: string;
  used?: boolean;
}

const InviteCodeSchema = new mongoose.Schema(
  {
    inviteCode: {
      type: String,
      required: true,
    },
    referer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    permissionGroup: {
      type: String,
      default: 'DEFAULT',
      validate: [
        isPermissionGroup,
        'The permission level must be one of the enum keys'
      ],
    },
    permissionType: {
      type: String,
      default: 'DEFAULT',
      validate: [
        isPermissionType,
        'The permission level must be one of the enum keys'
      ],
    },
    used: {
      type: Boolean,
      required: false,
      default: false
    },
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

const InviteCode = mongoose.model<InviteCodeDocument>('InviteCode', InviteCodeSchema)

export default InviteCode
