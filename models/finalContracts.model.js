import mongoose from 'mongoose'
import moment from 'moment-timezone'
const finalContractsSchema = new mongoose.Schema(
  {
    contractId: { type: mongoose.Types.ObjectId, ref: 'Contracts' },
    images: {
      type: Array,
      require: true
    },
    cost_settlement: { type: Number },
    timeFinish: {
      type: Date,

      get: (v) => moment(v).format('YYYY-MM-DD HH:mm'),
      set: (v) => moment(v, 'YYYY-MM-DD HH:mm').toDate()
    },
    note: { type: String }
  },
  { timestamps: true }
)
const FinalContracts = mongoose.model('FinalContracts', finalContractsSchema)
export default FinalContracts
