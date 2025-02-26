import { HTTP_STATUS } from '../constants/httpStatus.js'
import contractsService from '../services/contracts.services.js'

export const createContract = async (req, res, next) => {
  try {
    const createBy = req.decoded_authorization.user_id // Lấy user_id từ req.decoded_authorization
    const bookingId = req.params.bookingId // Lấy bookingId từ req.params
    const result = await contractsService.createContract(createBy, bookingId, req.body)
    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Create contract successfully',
      result
    })
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: error.message
    })
  }
}

export const getContractById = async (req, res, next) => {
  try {
    const createBy = req.decoded_authorization.user_id // Lấy user_id từ req.decoded_authorization

    const result = await contractsService.getContractById(createBy)
    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Get contract successfully',
      result
    })
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: error.message
    })
  }
}

export const getListContracts = async (req, res) => {
  try {
    const result = await contractsService.getListContract()
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Contract not found' })
    } else {
      return res.status(HTTP_STATUS.OK).json({
        message: 'Get list contract successfully',
        result
      })
    }
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' })
  }
}
