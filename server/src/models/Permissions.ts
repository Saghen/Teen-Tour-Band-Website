/* eslint-disable func-names */

import mongoose from 'mongoose'

import { isPermissionEnum } from '@helpers/validators'

export type PermissionDocument = mongoose.Document & {
  name: string;
  allow: string[];
  deny: string[];
  level: number;
  inherit: mongoose.Schema.Types.ObjectId;
}

const PermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    allow: {
      type: Array,
      required: true
    },
    deny: {
      type: Array,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    inherit: {
      type: mongoose.Schema.Types.ObjectId
    }
  }
)

const Permission = mongoose.model<PermissionDocument>('Permission', PermissionSchema)

export default Permission
