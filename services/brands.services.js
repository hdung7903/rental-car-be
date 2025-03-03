import Brands from "../models/brands.model.js"

class BrandsService {
    async createBrands(payload) {
        const newBrands = new Brands({
            ...payload,
        })
        try {
            await newBrands.save()
        } catch (error) {
        }
    }

    async getBrands() {
        try {
            const getBrands = Brands.find()
            return getBrands
        } catch (error) {
            throw error
        }

    }
}
const brandsService = new BrandsService()
export default brandsService