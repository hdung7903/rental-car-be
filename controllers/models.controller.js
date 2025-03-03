import { MODEL_MESSAGE } from '../constants/messages.js'
import modelsService from '../services/models.services.js'
import { HTTP_STATUS } from '../constants/httpStatus.js'

export const createModels = async (req, res, next) => {
    const result = await modelsService.createModels(req.body)
    return res.json({
        message: MODEL_MESSAGE.CREATE_MODEL_SUCCESS, result
    })
}
export const getModelByBrand = async (req, res) => {
    try {
        const { brandId } = req.params
        const result = await modelsService.getModelByBrand(brandId)
        if (!result) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Can not found' })
        } else {
            return res.status(HTTP_STATUS.OK).json({
                message: 'Get Models successfully',
                result
            })
        }
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' })
    }
}