import express from 'express'
import {
  acceptLicensesDriver,
  deleteDriverLicense,
  getLicensesDrivers,
  regisLicensesDriver,
  updateDriverLicense
} from '../controllers/driverLincenses.controllers.js'
import { wrapRequestHandler } from '../utils/handlers.js'
import { accessTokenValidator, adminAndStaffValidator } from '../middlewares/users.middlewares.js'
import uploadCloud from '../utils/cloudinary.config.js'
const driverLicensesRoutes = express.Router()
driverLicensesRoutes.post(
  '/registerDriver',
  accessTokenValidator,
  uploadCloud.single('image'),
  wrapRequestHandler(regisLicensesDriver)
),
  driverLicensesRoutes.put(
    '/updateDriver/:did',
    accessTokenValidator,
    uploadCloud.single('image'),
    wrapRequestHandler(updateDriverLicense)
  )
driverLicensesRoutes.put('/acceptDriver/:did', adminAndStaffValidator, wrapRequestHandler(acceptLicensesDriver))
driverLicensesRoutes.delete('/deleteDriver/:did', adminAndStaffValidator, wrapRequestHandler(deleteDriverLicense))
driverLicensesRoutes.get('/', adminAndStaffValidator, wrapRequestHandler(getLicensesDrivers))
export default driverLicensesRoutes
