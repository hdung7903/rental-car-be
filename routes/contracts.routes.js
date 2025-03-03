import express from 'express'

import { wrapRequestHandler } from '../utils/handlers.js'
import {
  accessTokenValidator,
  adminValidator,
  staffValidator,
  adminAndStaffValidator
} from '../middlewares/users.middlewares.js'
import { createContract, getContractById, getListContracts } from '../controllers/contracts.controllers.js'

const contractsRoutes = express.Router()

contractsRoutes.post(
  '/create/:bookingId',
  // accessTokenValidator,
  adminAndStaffValidator,

  wrapRequestHandler(createContract)
)

contractsRoutes.get('/', staffValidator, wrapRequestHandler(getContractById))

contractsRoutes.get('/listContracts', adminValidator, wrapRequestHandler(getListContracts))
export default contractsRoutes
