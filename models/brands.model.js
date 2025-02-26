import mongoose from 'mongoose'

const brandsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
)

const Brands = mongoose.model('Brands', brandsSchema)

export default Brands
