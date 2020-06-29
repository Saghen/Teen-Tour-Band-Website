/* eslint-disable func-names */

import mongoose from 'mongoose'

// import { isPermissionEnum } from '@helpers/validators'

export type PermissionDocument = mongoose.Document & {
  isGroup: boolean;
  name: string;
  validSubtypes?: string[];
  methods?: string[];
  endpoints?: string[];
  permissionLevel?: number;
  children?: string[];
}

const PermissionSchema = new mongoose.Schema(
  {
    isGroup: {
      type: Boolean,
      required: true
    },
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    validSubtypes: {
      type: Array,
      required: false
    },
    methods: {
      type: Array,
      required: false
    },
    endpoints: {
      type: Array,
      required: false
    },
    permissionLevel: {
      type: Number,
      required: false
    },
    children: {
      type: Array,
      required: false
    }
  }
)

const Permission = mongoose.model<PermissionDocument>('Permission', PermissionSchema)

export default Permission
