import { wrapRequestHandler } from '../utils/handlers.js'
import express from 'express'
import { createPaymentLink } from '../controllers/payments.controller.js'

const paymentsRoutes = express.Router()
/**
 * Description: Payment method vnpay
 * Path: /create_payment_url
 * Method: POST
 * Body:{ }
 */
paymentsRoutes.post('/create_payment_url', wrapRequestHandler(createPaymentLink))

/**
 * Description: Payment method MOMO
 * Path: /create_payment_url
 * Method: POST
 * Body:{ }
 */
// paymentsRoutes.post('/create_payment_url_momo', wrapRequestHandler(createOrderPaymentMOMOController))

export default paymentsRoutes
