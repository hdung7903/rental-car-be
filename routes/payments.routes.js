import { wrapRequestHandler } from '../utils/handlers.js'
import { createOrderPaymentController, createOrderPaymentMOMOController } from '../controllers/payments.controller.js'
import express from 'express'

const paymentsRoutes = express.Router()
/**
 * Description: Payment method vnpay
 * Path: /create_payment_url
 * Method: POST
 * Body:{ }
 */
paymentsRoutes.post('/create_payment_url', wrapRequestHandler(createOrderPaymentController))

/**
 * Description: Payment method MOMO
 * Path: /create_payment_url
 * Method: POST
 * Body:{ }
 */
paymentsRoutes.post('/create_payment_url_momo', wrapRequestHandler(createOrderPaymentMOMOController))

export default paymentsRoutes
