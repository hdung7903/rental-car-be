import Bookings from '../models/booking.model.js'
import BookedTimeSlots from '../models/bookedTimeSlots.model.js'
import moment from 'moment-timezone'
import mongoose from 'mongoose'
import { config } from 'dotenv'
class BookingServices {
  async createBooking(user_id, carId, payload) {
    try {
      const { timeBookingStart, timeBookingEnd } = payload

      console.log(timeBookingStart, timeBookingEnd)
      console.log(payload)
      const bookingStart = moment.utc(timeBookingStart).toDate()
      const bookingEnd = moment.utc(timeBookingEnd).toDate()
      console.log(bookingStart, bookingEnd)

      const newBooking = new Bookings({
        bookBy: user_id,
        carId: carId,
        timeBookingStart: bookingStart,
        timeBookingEnd: bookingEnd,
        ...payload
      })

      const bookingResult = await newBooking.save()

      const newBookedTimeSlot = await BookedTimeSlots.findOneAndUpdate(
        {
          carId: carId,
          from: moment.utc(bookingResult.timeBookingStart).toDate(),
          to: moment.utc(bookingResult.timeBookingEnd).toDate()
        },
        {
          bookingId: bookingResult._id,
          from: bookingStart,
          to: bookingEnd
        },
        { new: true }
      )

      return { bookingResult, newBookedTimeSlot }
    } catch (error) {
      throw error
    }
  }

  async cancelBookedTimeSlots(carId, payload) {
    try {
      const { timeBookingStart, timeBookingEnd } = payload

      console.log(timeBookingStart, timeBookingEnd)
      console.log(payload)
      const bookingStart = moment.utc(timeBookingStart).toDate()
      const bookingEnd = moment.utc(timeBookingEnd).toDate()
      console.log(bookingStart, bookingEnd)

      const deleteBookedTimeSlot = await BookedTimeSlots.findOneAndDelete({
        carId: carId,
        from: bookingStart,
        to: bookingEnd
      })

      return { deleteBookedTimeSlot }
    } catch (error) {
      throw error
    }
  }

  async bookRecord(carId, payload) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const { timeBookingStart, timeBookingEnd } = payload

      console.log(timeBookingStart, timeBookingEnd)
      console.log(payload)
      const startTime = moment.utc(timeBookingStart).toDate()
      const endTime = moment.utc(timeBookingEnd).toDate()
      const existingBookedTimeSlots = await BookedTimeSlots.findOne({
        carId: carId,
        $or: [
          { $and: [{ from: { $gte: startTime } }, { from: { $lt: endTime } }] },
          { $and: [{ to: { $gt: startTime } }, { to: { $lte: endTime } }] }
        ]
      }).session(session)

      if (existingBookedTimeSlots) {
        // Resource is already booked, handle accordingly
        throw new Error('Record already booked')
      }

      // Create a new booking
      const newBookedTimeSlots = new BookedTimeSlots({ from: startTime, to: endTime, carId: carId })
      await newBookedTimeSlots.save({ session })

      await session.commitTransaction()
      session.endSession()
      console.log('Booking successful')
      return newBookedTimeSlots
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
      console.error('Booking failed:', error.message)
    }
  }

  async cancelBooking(bookingId) {
    try {
      const booking = await Bookings.findById(bookingId)

      if (!booking) {
        return null
      }

      // const { timeBookingStart } = booking;
      // const currentDate = moment().toISOString();
      // console.log(currentDate)
      // const bookingStart = moment(timeBookingStart).toISOString();
      // console.log(bookingStart)

      // if (bookingStart.isSame(currentDate, 'day')) {
      //     throw new Error('Reservations cannot be canceled on the current date');
      // }

      const updateBooking = await Bookings.findByIdAndUpdate(bookingId, { status: 'Đã hủy' }, { new: true })

      if (!updateBooking) {
        return null
      }
      await BookedTimeSlots.deleteMany({ bookingId: bookingId })
      return updateBooking
    } catch (error) {
      throw error
    }
  }

  async getHistoryBooking(bookBy) {
    try {
      const getHistoryBooking = await Bookings.find({ bookBy: bookBy })
        .populate({
          path: 'carId',
          populate: {
            path: 'brand',
            model: 'Brands'
          }
        })
        .populate({
          path: 'carId',
          populate: {
            path: 'model',
            model: 'Models'
          }
        })
        .populate('contract')
        .sort({ status: 1 })
      return getHistoryBooking
    } catch (error) {
      throw error
    }
  }

  async getListBooking() {
    try {
      const getListBooking = await Bookings.find({})
        .populate('bookBy', 'fullname')
        .populate({
          path: 'carId',
          populate: [
            {
              path: 'model',
              model: 'Models'
            },
            { path: 'brand', model: 'Brands' }
          ]
        })
        .populate('contract')
        .sort({ status: 1, timeBookingStart: 1 })
      return getListBooking
    } catch (error) {
      throw error
    }
  }

  async getDetailBooking(bookingId) {
    try {
      const getDetailBooking = await Bookings.findById(bookingId)
        .populate('bookBy')
        .populate({
          path: 'carId',
          populate: [
            {
              path: 'model',
              model: 'Models'
            },
            { path: 'brand', model: 'Brands' }
          ]
        })
        .populate('contract')
      return getDetailBooking
    } catch (error) {
      throw error
    }
  }
  async getBookedTimeSlots(carId) {
    try {
      const getBookedTimeSlots = await BookedTimeSlots.find({ carId: carId })
      return getBookedTimeSlots
    } catch (error) {
      throw error
    }
  }
}
const bookingService = new BookingServices()
export default bookingService
