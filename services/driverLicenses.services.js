import DriverLicenses from '../models/driverLicenses.model.js'
import User from '../models/user.model.js'

class DriverLicensesService {
  async regisLicensesDriver(payloadBody, userId) {
    try {
      const result = await DriverLicenses.create({ ...payloadBody })
      await User.findByIdAndUpdate(userId, {
        driverLicenses: result._id
      })
      return result
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  async updateDriverLicense(did, payload) {
    try {
      const updateDriverLicense = await DriverLicenses.findByIdAndUpdate(did, { ...payload }, { new: true })
      return updateDriverLicense
    } catch (error) {
      throw new Error(error)
    }
  }
  async acceptLicensesDriver(did, newStatus) {
    try {
      const acceptLicensesDriver = await DriverLicenses.findByIdAndUpdate(did, newStatus)
      return acceptLicensesDriver
    } catch (error) {
      throw new Error(error)
    }
  }

  async getLicensesDrivers() {
    try {
      const getLicensesDrivers = await DriverLicenses.find()
        .sort({ status: 1 }) // Sắp xếp theo trạng thái tăng dần (Chưa xác thực trước)
        .exec()
      return getLicensesDrivers
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteLicensesDrivers(did) {
    try {
      const deleteDriverLicense = await DriverLicenses.findByIdAndDelete(did)
      if (!deleteDriverLicense) {
        throw new Error('Driver license not found')
      }
      await User.deleteOne({ driverLicenses: did })
    } catch (error) {
      throw new Error(error)
    }
  }
}

const driverLicensesService = new DriverLicensesService()
export default driverLicensesService
