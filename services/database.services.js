import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import mongoose from 'mongoose'
config()
const uri = 'mongodb+srv://anhsangprovl:anhsangprovl@cluster0.defhizq.mongodb.net/?retryWrites=true&w=majority'

class databaseService {
  connect() {
    return mongoose
      .connect(
        //'mongodb+srv://anhsangprovl:anhsangprovl@cluster0.defhizq.mongodb.net/rental-car?retryWrites=true&w=majority'
        "mongodb://127.0.0.1/PWD_rental"
      )
      .then(() => {
        console.log('Connected to MongoDB')
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

const databaseServices = new databaseService()

export default databaseServices
