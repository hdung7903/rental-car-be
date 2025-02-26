import mongoose from 'mongoose'

const driverLicensesSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true
    },
    drivingLicenseNo: {
      type: Number,
      required: true
    },
    class: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Chưa xác thực', 'Đã xác thực'],
      default: 'Chưa xác thực'
    }
  },
  { timestamps: true }
)

const DriverLicenses = mongoose.model('DriverLicenses', driverLicensesSchema)

export default DriverLicenses
