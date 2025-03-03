import User from '../models/user.model.js'
import Cars from '../models/cars.model.js'
import Bookings from '../models/booking.model.js'
import Contracts from '../models/contracts.model.js'
import FinalContracts from '../models/finalContracts.model.js'
import mongoose from 'mongoose'
import { hashPassword } from '../utils/crypto.js'

class AdminServices {
  async getUsers() {
    try {
      return await User.find({ role: 'user' }).populate('driverLicenses')
    } catch (error) {
      throw Error(error)
    }
  }

  async getDetailUser(userId) {
    try {
      const getDetailUser = await User.findById(userId).populate('driverLicenses')
      return getDetailUser
    } catch (error) {
      console.log(error)
    }
  }

  async getStaffs() {
    try {
      return await User.find({ role: 'staff' })
    } catch (error) {
      throw Error(error)
    }
  }

  async createStaff(payload) {
    const newUser = new User({
      ...payload,
      password: hashPassword(payload.password).toString(),
      role: 'staff'
    })
    try {
      const user = await newUser.save()
      return user
    } catch (error) {
      throw Error(error)
    }
  }

  async updateStatusUser(userId, payload) {
    try {
      const { status } = payload
      const updateStatusUser = await User.findByIdAndUpdate(userId, { status: status }, { new: true })
      return updateStatusUser
    } catch (error) {
      throw error
    }
  }

  async updateStatusCar(carId, payload) {
    try {
      const { status } = payload
      const updateStatusCar = await Cars.findByIdAndUpdate(carId, { status: status }, { new: true })
      return updateStatusCar
    } catch (error) {
      throw error
    }
  }

  async totalAdminDashboard() {
    try {
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth() + 1
      const totalUsers = await User.countDocuments()
      const totalCars = await Cars.countDocuments()
      const bookingByMonth = await Bookings.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $month: '$timeBookingStart' }, currentMonth] },
                { $eq: [{ $month: '$timeBookingEnd' }, currentMonth] }
              ]
            }
          }
        },
        {
          $count: 'totalResults'
        }
      ])
      const totalBookingByMonth = bookingByMonth.length > 0 ? bookingByMonth[0].totalResults : 0
      const revenue = await FinalContracts.aggregate([
        {
          $group: {
            _id: null,
            totalCost: { $sum: '$cost_settlement' }
          }
        }
      ])
      const totalRevenue = revenue.length > 0 ? revenue[0].totalCost : 0
      return { totalUsers, totalCars, totalBookingByMonth, totalRevenue }
    } catch (error) {
      throw new Error(error)
    }
  }

  async totalStaffDashboard(staffId) {
    try {
      const ObjectId = mongoose.Types.ObjectId
      const totalCarsCreated = await Cars.find({ user: staffId }).count()
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1
      const totalContractCreated = await Contracts.find({ createBy: staffId }).count()
      const bookingByMonth = await Bookings.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $month: '$timeBookingStart' }, currentMonth] },
                { $eq: [{ $month: '$timeBookingEnd' }, currentMonth] }
              ]
            }
          }
        },
        {
          $count: 'totalResults'
        }
      ])
      const totalBookingByMonth = bookingByMonth.length > 0 ? bookingByMonth[0].totalResults : 0
      const finalContracts = await FinalContracts.aggregate([
        {
          $lookup: {
            from: 'contracts',
            localField: 'contractId',
            foreignField: '_id',
            as: 'contractInfo'
          }
        },
        {
          $match: {
            'contractInfo.createBy': new ObjectId(staffId)
          }
        },
        {
          $count: 'totalResults'
        }
      ])
      const totalFinalContracts = finalContracts.length > 0 ? finalContracts[0].totalResults : 0

      return { totalCarsCreated, totalBookingByMonth, totalContractCreated, totalFinalContracts }
    } catch (error) {
      throw new Error(error)
    }
  }
  async getTotalRevenue() {
    try {
      const finalContracts = await FinalContracts.find()
      const currentYear = new Date().getFullYear()

      const revenueByMonth = finalContracts.reduce((result, contract) => {
        const finishDate = new Date(contract.timeFinish)

        const month = finishDate.getMonth() + 1
        const year = finishDate.getFullYear()

        // Only include months from the current year
        if (year === currentYear) {
          const key = `${year}-${month}`

          if (!result[key]) {
            result[key] = {
              month: `${month}`,
              totalRevenue: 0
            }
          }

          result[key].totalRevenue += contract.cost_settlement
        }

        return result
      }, {})

      const revenueArray = Object.values(revenueByMonth)
      return revenueArray
    } catch (error) {
      console.error('Error in getTotalRevenue:', error)
      throw new Error('Error fetching total revenue')
    }
  }
}

const adminServices = new AdminServices()
export default adminServices
