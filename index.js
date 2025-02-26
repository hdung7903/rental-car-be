// import { defaultErrorHandler } from './middlewares/error.middlewares'
import usersRouter from './routes/users.routes.js'
import databaseServices from './services/database.services.js'
import { defaultErrorHandler } from './middlewares/errors.middlewares.js'
import bodyParser from 'body-parser'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'

config()
const app = express()
const port = 4000
console.log('hello')

databaseServices.connect()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
//   next()
// })
app.options('/payments/create_payment_url', cors())
app.use(
    cors({
        origin: `${process.env.FRONTEND_URL}`, // Thay đổi nguồn gốc tại đây nếu cần
        credentials: true // Cho phép sử dụng các credentials như cookie
    })
)
app.use(express.json())
app.use(cookieParser())

app.use('/users', usersRouter)

app.use(defaultErrorHandler)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
