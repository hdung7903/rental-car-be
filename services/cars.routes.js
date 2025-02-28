import express from 'express'
import {
  createCar,
  updateCar,
  getCarById,
  getListCars,
  uploadImagesCar,
  ratings,
  getRatingsOfCar,
  getRatingByBooking,
  updateRatingsByBooking,
  likeCars,
  getCarLikedByUser
} from '../controllers/cars.controllers.js'
import { wrapRequestHandler } from '../utils/handlers.js'
import {
  accessTokenValidator,
  adminAndStaffValidator,
  adminValidator,
  staffValidator
} from '../middlewares/users.middlewares.js'
import uploadCloud from '../utils/cloudinary.config.js'
const carsRoutes = express.Router()

carsRoutes.get('/get/liked', accessTokenValidator, wrapRequestHandler(getCarLikedByUser))
carsRoutes.post('/createCar', adminAndStaffValidator, wrapRequestHandler(createCar))
carsRoutes.put('/updateCar/:carId', adminAndStaffValidator, wrapRequestHandler(updateCar))

carsRoutes.get('/:carId', wrapRequestHandler(getCarById))
carsRoutes.get('/', wrapRequestHandler(getListCars))
carsRoutes.post(
  '/uploadimage/:carId',
  uploadCloud.fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumb', maxCount: 1 }
  ]),
  wrapRequestHandler(uploadImagesCar)
)

carsRoutes.post('/rating/create', accessTokenValidator, wrapRequestHandler(ratings))
carsRoutes.get('/ratings/:carId', wrapRequestHandler(getRatingsOfCar))
carsRoutes.get('/rating/:bookingId', accessTokenValidator, wrapRequestHandler(getRatingByBooking))
carsRoutes.put('/rating/update/:bookingId', accessTokenValidator, wrapRequestHandler(updateRatingsByBooking))
carsRoutes.put('/:carId/like', accessTokenValidator, wrapRequestHandler(likeCars))

export default carsRoutes
