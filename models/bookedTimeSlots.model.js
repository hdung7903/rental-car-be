import mongoose from 'mongoose'
import moment from 'moment-timezone'

const bookedTimeSlotsSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Types.ObjectId,
      ref: 'Booking' // Tham chiếu đến bảng Booking
      // required: true
    },
    from: {
      type: Date,
      require: true,
      get: (v) => moment(v).format('YYYY-MM-DD HH:mm'),
      set: (v) => moment(v, 'YYYY-MM-DD HH:mm').toDate()
    },
    to: {
      type: Date,
      require: true,
      get: (v) => moment(v).format('YYYY-MM-DD HH:mm'),
      set: (v) => moment(v, 'YYYY-MM-DD HH:mm').toDate()
    },
    carId: {
      type: mongoose.Types.ObjectId,
      ref: 'Cars', // Tham chiếu đến bảng Cars (xe)
      required: true
    }
  },
  { timestamps: true }
)

const BookedTimeSlots = mongoose.model('BookedTimeSlots', bookedTimeSlotsSchema)

export default BookedTimeSlots
