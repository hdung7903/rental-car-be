import mongoose from 'mongoose'
import moment from 'moment'

const couponsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            uppercase: true
        },
        discount: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        timeExpired: {
            type: Date,
            required: true,
            get: (v) => moment(v).format('YYYY-MM-DD HH:mm'),
            set: (v) => moment(v, 'YYYY-MM-DD HH:mm').toDate()
        }
    },
    { timestamps: true }
)

const Coupons = mongoose.model('Coupons', couponsSchema);

export default Coupons;
