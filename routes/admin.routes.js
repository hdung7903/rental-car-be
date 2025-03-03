import express from 'express'
import { adminAndStaffValidator, adminValidator, staffValidator } from '../middlewares/users.middlewares.js'
import { wrapRequestHandler } from '../utils/handlers.js'
import {
  getUsers,
  getStaffs,
  getDetailUser,
  createStaff,
  updateStatusUser,
  totalAdminDashboard,
  totalStaffDashboard,
  getTotalRevenue,
  updateStatusCar
} from '../controllers/admins.controllers.js'
const adminRoutes = express.Router()

adminRoutes.get('/list-users', adminAndStaffValidator, wrapRequestHandler(getUsers))
adminRoutes.get('/staffs', adminValidator, wrapRequestHandler(getStaffs))
adminRoutes.post('/create-staffs', adminValidator, wrapRequestHandler(createStaff))
adminRoutes.put('/update-status/:userId', adminAndStaffValidator, wrapRequestHandler(updateStatusUser))
adminRoutes.put('/update-status-car/:carId', adminAndStaffValidator, wrapRequestHandler(updateStatusCar))
adminRoutes.get('/get-user/:userId', adminAndStaffValidator, wrapRequestHandler(getDetailUser))
adminRoutes.get('/admin-dashboard', adminValidator, wrapRequestHandler(totalAdminDashboard))
adminRoutes.get('/staff-dashboard', staffValidator, wrapRequestHandler(totalStaffDashboard))
adminRoutes.get('/total-revenue-by-month', adminAndStaffValidator, wrapRequestHandler(getTotalRevenue))

export default adminRoutes
