import { HTTP_STATUS } from '../constants/httpStatus.js'
import finalContractsService from '../services/finalContracts.services.js'

export const createFinalContract = async (req, res, next) => {
  try {
    const contractId = req.params.contractId // Lấy bookingId từ req.params
    const result = await finalContractsService.createFinalContract(contractId, req.body)
    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Create final contract successfully',
      result
    })
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: error.message
    })
  }
}

export const getFinalContractById = async (req, res, next) => {
  try {
    const createBy = req.decoded_authorization.user_id // Lấy user_id từ req.decoded_authorization

    const result = await finalContractsService.getFinalContractById(createBy)
    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Get final contract successfully',
      result
    })
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: error.message
    })
  }
}

export const getListFinalContracts = async (req, res) => {
  try {
    const result = await finalContractsService.getListFinalContracts()
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Final contract not found' })
    } else {
      return res.status(HTTP_STATUS.OK).json({
        message: 'Get list final contract successfully',
        result
      })
    }
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' })
  }
}
