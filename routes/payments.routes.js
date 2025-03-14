import { wrapRequestHandler } from '../utils/handlers.js'
import express from 'express'
import { createPaymentLink, getPaymentLinkInformation, createOrderPaymentZaloPayController, callbackZalopay } from '../controllers/payments.controller.js'

const paymentsRoutes = express.Router()
/**
 * Description: Payment method PayOs
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
paymentsRoutes.get('/get_payment', wrapRequestHandler(getPaymentLinkInformation))

/**
 * Description: Payment method Zalopay
 * Path: /create_payment_url
 * Method: POST
 * Body:{ }
 */

paymentsRoutes.post('/zalopay_payment_url', wrapRequestHandler(createOrderPaymentZaloPayController))

paymentsRoutes.post('/zalopay_payment_url/callback', wrapRequestHandler(callbackZalopay))


export default paymentsRoutes
