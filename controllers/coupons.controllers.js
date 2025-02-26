import couponsService from '../services/coupons.services.js'
import { HTTP_STATUS } from '../constants/httpStatus.js'

export const createCoupon = async (req, res, next) => {
  try {
    const result = await couponsService.createCoupons(req.body)

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Created coupon successfully',
      result
    })
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: error.message
    })
  }
}

export const getCoupons = async (req, res, next) => {
  try {
    const result = await couponsService.getCoupons()
    return res.status(HTTP_STATUS.OK).json({
      message: 'Get coupons successfully',
      result
    })
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: error.message
    })
  }
}
export const getCouponById = async (req, res, next) => {
  try {
    const { couponId } = req.params
    const result = await couponsService.getCouponById(couponId)
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Coupon not found' })
    } else {
      return res.status(HTTP_STATUS.OK).json({
        message: 'Okay',
        result
      })
    }
  } catch (e) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' })
  }
}

export const updateCoupon = async (req, res, next) => {
  const { couponId } = req.params

  try {
    const result = await couponsService.updateCoupon(couponId, req.body)
    if (!result) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong!'
      })
    } else {
      return res.status(HTTP_STATUS.OK).json({
        message: 'successfully',
        result
      })
    }
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong!',
      error: error.message
    })
  }
}

export const deleteCoupon = async (req, res) => {
  const { couponId } = req.params
  try {
    const result = await couponsService.deleteCoupon(couponId, req.body)

    return res.status(HTTP_STATUS.OK).json({
      message: result.message
    })
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong!',
      error: error.message
    })
  }
}
