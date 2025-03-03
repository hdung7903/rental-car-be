import Models from "../models/models.model.js"

class ModelsService {
    async createModels(payload) {
        const newModels = new Models({
            ...payload,
        })
        try {
            await newModels.save()
        } catch (error) {
        }
    }

    async getModelByBrand(brandId) {
        try {
            const getModelByBrand = await Models.find({ brand: brandId })
            return getModelByBrand
        } catch (error) {
            throw error
        }
    }
}
const modelsService = new ModelsService()
export default modelsService