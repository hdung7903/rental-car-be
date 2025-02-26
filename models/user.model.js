import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    fullname: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'staff'],
      default: 'user'
    },
    gender: {
      type: String
    },
    date_of_birth: {
      type: String
    },
    driverLicenses: {
      type: mongoose.Types.ObjectId,
      ref: 'DriverLicenses'
    },
    profilePicture: {
      type: String
    },
    address: {
      type: String
    },
    status: {
      type: String,
      enum: ['Hoạt động', 'Không hoạt động'],
      default: 'Hoạt động'
    }
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)

export default User
