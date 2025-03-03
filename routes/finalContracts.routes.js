import express from 'express'

import { wrapRequestHandler } from '../utils/handlers.js'
import {
  accessTokenValidator,
  adminAndStaffValidator,
  adminValidator,
  staffValidator
} from '../middlewares/users.middlewares.js'
import {
  createFinalContract,
  getFinalContractById,
  getListFinalContracts
} from '../controllers/finalContracts.controllers.js'

const finalContractsRoutes = express.Router()

finalContractsRoutes.get('/listFinalContracts', adminAndStaffValidator, wrapRequestHandler(getListFinalContracts))
finalContractsRoutes.get('/', staffValidator, wrapRequestHandler(getFinalContractById))

finalContractsRoutes.post('/create/:contractId', adminAndStaffValidator, wrapRequestHandler(createFinalContract))

export default finalContractsRoutes
