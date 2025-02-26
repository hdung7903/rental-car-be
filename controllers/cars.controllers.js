import { HTTP_STATUS } from '../constants/httpStatus.js'
import { CARS_MESSAGE } from '../constants/messages.js'
import carsService from '../services/cars.services.js'

export const createCar = async (req, res, next) => {
  console.log(req.body)
  const result = await carsService.createCar(req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: CARS_MESSAGE.CREATE_CAR_SUCCESS,
    result
  })
}

export const updateCar = async (req, res, next) => {
  const { carId } = req.params
  try {
    const result = await carsService.updateCar(carId, req.body)
    if (!result) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong!'
      })
    } else {
      return res.status(HTTP_STATUS.OK).json({
        message: CARS_MESSAGE.UPDATE_CAR_SUCCESS,
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

export const getCarById = async (req, res, next) => {
  try {
    const { carId } = req.params
    const result = await carsService.getCarById(carId)
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Car not found' })
    } else {
      return res.status(HTTP_STATUS.OK).json({
        message: CARS_MESSAGE.GET_CAR_SUCCESS,
        result
      })
    }
  } catch (e) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' })
  }
}

export const getListCars = async (req, res, next) => {
  try {
    const result = await carsService.getListCars(req.query)
    return res.status(HTTP_STATUS.OK).json({
      message: CARS_MESSAGE.GET_CARS_SUCCESS,
      result
    })
  } catch (error) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Can not get list cars', result })
  }
}

export const uploadImagesCar = async (req, res, next) => {
  try {
    const { images, thumb } = req.files

    const imageLinks = images.map((image) => image.path)
    const thumbLink = thumb && thumb[0] ? thumb[0].path : null

    console.log(imageLinks)
    console.log(thumbLink)
    // Tạo đối tượng chứa đường link của các ảnh
    const imageUrls = {
      images: imageLinks,
      thumb: thumbLink
    }

    return res.status(200).json(imageUrls)
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi tải lên ảnh' })
  }
}

export const ratings = async (req, res) => {
  try {
    const user_id = req.decoded_authorization.user_id
    const result = await carsService.ratings(user_id, req.body)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Ratings created',
      result
    })
  } catch (err) {
    console.error(err)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Cannot rating' })
  }
}
export const updateRatingsByBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params
    const result = await carsService.updateRatingsByBooking(bookingId, req.body)
    if (!result) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong!'
      })
    } else {
      return res.status(HTTP_STATUS.OK).json({
        message: CARS_MESSAGE.UPDATE_RATING_SUCCESS,
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
export const getRatingsOfCar = async (req, res, next) => {
  try {
    const { carId } = req.params
    const { page, limit } = req.query
    const result = await carsService.getRatingsOfCar(carId, parseInt(page) || 1, parseInt(limit) || 4)
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Car not found' })
    } else {
      return res.status(HTTP_STATUS.OK).json({
        message: CARS_MESSAGE.GET_CAR_SUCCESS,
        result: result.getRatingsOfCar,
        totalPages: result.totalPages,
        currentPage: result.page
      })
    }
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: error.message
    })
  }
}

export const getRatingByBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params
    const result = await carsService.getRatingByBooking(bookingId)
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Booking has no ratings' })
    } else {
      return res.status(HTTP_STATUS.OK).json({
        message: 'Get rating successfully',
        result
      })
    }
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: error.message
    })
  }
}

export const likeCars = async (req, res) => {
  try {
    const { carId } = req.params
    const user_id = req.decoded_authorization.user_id
    const result = await carsService.likeCars(user_id, carId)
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Car not found' })
    }

    const isLiked = result.likes.some((el) => el.toString() === user_id)
    const message = isLiked ? 'Liked the car' : 'Unliked the car'

    return res.status(HTTP_STATUS.OK).json({
      message,
      car: result
    })
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: error.message
    })
  }
}

export const getCarLikedByUser = async (req, res) => {
  try {
    const userId = req.decoded_authorization.user_id
    const result = await carsService.getCarsLikedByUser(userId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Get cars liked by user successfully',
      result
    })
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: error.message
    })
  }
}
