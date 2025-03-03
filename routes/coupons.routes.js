import express from 'express'
import { wrapRequestHandler } from '../utils/handlers.js'
import { accessTokenValidator, adminAndStaffValidator, adminValidator, staffValidator } from '../middlewares/users.middlewares.js'
import { createCoupon, deleteCoupon, getCoupons, updateCoupon, getCouponById } from '../controllers/coupons.controllers.js'

const couponsRoutes = express.Router()
couponsRoutes.get('/:couponId', adminAndStaffValidator, wrapRequestHandler(getCouponById))

couponsRoutes.post('/createCoupon', adminAndStaffValidator, wrapRequestHandler(createCoupon))
couponsRoutes.get('/', wrapRequestHandler(getCoupons))
couponsRoutes.put('/update/:couponId', adminAndStaffValidator, wrapRequestHandler(updateCoupon))
couponsRoutes.delete('/deleteCoupon/:couponId', adminAndStaffValidator, wrapRequestHandler(deleteCoupon))


export default couponsRoutes