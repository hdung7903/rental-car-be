import { BRAND_MESSAGE } from '../constants/messages.js'
import brandsService from '../services/brands.services.js';
import { HTTP_STATUS } from '../constants/httpStatus.js'

export const createBrand = async (req, res, next) => {
    const result = await brandsService.createBrands(req.body)
    return res.status(HTTP_STATUS.OK).json({
        message: BRAND_MESSAGE.CREATE_BRAND_SUCCESS, result
    })
}

export const getBrands = async (req, res, next) => {
    try {
        const result = await brandsService.getBrands();
        return res.status(HTTP_STATUS.OK).json({
            message: "Get Brands successfully",
            result
        })
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not get list of brands' })
    }
}
