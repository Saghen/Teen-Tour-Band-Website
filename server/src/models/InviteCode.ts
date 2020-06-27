/* eslint-disable func-names */

import mongoose from 'mongoose'

import { isPermissionEnum } from '@helpers/validators'

export type InviteCodeDocument = mongoose.Document & {
  inviteCode: string,
  referer?: mongoose.Schema.Types.ObjectId;
  permissionGranted?: string;
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
    permissionGranted: {
      type: String,
      default: 'DEFAULT',
      validate: [
        isPermissionEnum,
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
