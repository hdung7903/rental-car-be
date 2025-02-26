import mongoose from 'mongoose'

const carsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: 'Brands'
    },
    model: {
      type: mongoose.Types.ObjectId,
      ref: 'Models'
    },
    numberSeat: {
      type: String,
      require: true
    },
    yearManufacture: {
      type: String,
      require: true
    },
    transmissions: {
      type: String,
      enum: ['Số tự động', 'Số sàn']
    },
    description: {
      type: String,
      require: true
    },
    thumb: {
      type: String
    },
    images: {
      type: Array
    },
    numberCar: {
      type: String
    },
    status: {
      type: String,
      enum: ['Hoạt động', 'Không hoạt động'],
      default: 'Hoạt động'
    },
    cost: {
      type: Number
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

const Cars = mongoose.model('Cars', carsSchema)

export default Cars
