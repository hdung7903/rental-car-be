import dateFormat from 'dateformat'
import querystring from 'qs'
import crypto from 'crypto'
import { config } from 'dotenv'
import moment from 'moment'
import https from 'https'

config()
// router.get('/', function(req, res, next){
//   res.render('orderlist', { title: 'Danh sách đơn hàng' })
// });

// router.get('/create_payment_url', function (req, res, next) {
//   res.render('order', { title: 'Tạo mới đơn hàng', amount: 10000 })
// })

// router.get('/querydr', function (req, res, next) {

//   let desc = 'truy van ket qua thanh toan';
//   res.render('querydr', {title: 'Truy vấn kết quả thanh toán'})
// });

// router.get('/refund', function (req, res, next) {

//   let desc = 'Hoan tien GD thanh toan';
//   res.render('refund', {title: 'Hoàn tiền giao dịch thanh toán'})
// });

export const createOrderPaymentController = async (req, res, next) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh'

  let date = new Date()
  let createDate = moment(date).format('YYYYMMDDHHmmss')

  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress

  let tmnCode = 'LBI3KB9A'
  let secretKey = 'BPYFJJZXZGFNTZOXRZLIXZCVLKENIJME'
  let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
  let returnUrl = `${process.env.FRONTEND_URL}/booking/${req.body.id}`
  let orderId = moment(date).format('DDHHmmss')
  let amount = req.body.amount
  let bankCode = req.body.bankCode
  let fullname = req.body.fullname
  let phone = req.body.phone
  let address = req.body.address

  let from = req.body.from
  let to = req.body.to

  let locale = req.body.language
  if (locale === null || locale === '') {
    locale = 'vn'
  }
  let currCode = 'VND'
  let vnp_Params = {}
  vnp_Params['vnp_Version'] = '2.1.0'
  vnp_Params['vnp_Command'] = 'pay'
  vnp_Params['vnp_TmnCode'] = tmnCode
  vnp_Params['vnp_Locale'] = locale
  vnp_Params['vnp_CurrCode'] = currCode
  vnp_Params['vnp_TxnRef'] = orderId

  vnp_Params['vnp_OrderInfo'] = `${fullname},:?${phone},:?${address},:?${from},:?${to}`

  vnp_Params['vnp_OrderType'] = 'other'
  vnp_Params['vnp_Amount'] = amount * 100
  vnp_Params['vnp_ReturnUrl'] = returnUrl
  vnp_Params['vnp_IpAddr'] = ipAddr
  vnp_Params['vnp_CreateDate'] = createDate
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode
  }

  vnp_Params = sortObject(vnp_Params)

  let signData = querystring.stringify(vnp_Params, { encode: false })

  let hmac = crypto.createHmac('sha512', secretKey)
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
  vnp_Params['vnp_SecureHash'] = signed
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })

  res.json(vnpUrl)
}
function sortObject(obj) {
  let sorted = {}
  let str = []
  let key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
  }
  return sorted
}

export const createOrderPaymentMOMOController = async (req, res, next) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var partnerCode = 'MOMO'
  var accessKey = 'F8BBA842ECF85'
  var secretkey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
  var requestId = partnerCode + new Date().getTime()
  var orderId = requestId
  var orderInfo = 'pay with MoMo'
  var redirectUrl = 'http://localhost:3000/booking/123'
  var ipnUrl = 'http://localhost:3000/booking/123'
  // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
  var amount = '11000'
  var requestType = 'payWithATM'
  var extraData = '' //pass empty value if your merchant does not have stores

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType
  //puts raw signature
  console.log('--------------------RAW SIGNATURE----------------')
  console.log(rawSignature)
  //signature

  var signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex')
  console.log('--------------------SIGNATURE----------------')
  console.log(signature)

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    isScanQR: 'true',
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: 'vi'
  })
  //Create the HTTPS objects

  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  }
  var dataUrl = ''
  const req1 = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`)
    console.log(`Headers: ${JSON.stringify(res.headers)}`)
    res.setEncoding('utf8')

    res.on('data', (body) => {
      console.log('Body: ')
      console.log(body)
      console.log('payUrl: ')
      dataUrl = JSON.parse(body).payUrl
      console.log(dataUrl)
    })

    res.on('end', () => {})
  })

  req1.on('error', (e) => {
    console.log(`problem with request: ${e.message}`)
  })
  // write data to request body
  console.log('Sending....')
  req1.write(requestBody)
  res.json(dataUrl)
  req1.end()
}

// export const createOrderPaymentMOMOController = async (req, res, next) => {
//   //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//   //parameters
//   var accessKey = 'F8BBA842ECF85'
//   var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
//   var orderInfo = 'pay with MoMo'
//   var partnerCode = 'MOMO'
//   var redirectUrl = 'http://localhost:3000/booking/123'
//   var ipnUrl = 'http://localhost:3000/booking/123'
//   var amount = '1100'
//   var orderId = partnerCode + new Date().getTime()
//   var requestId = orderId
//   var extraData = ''
//   var paymentCode =
//     'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA=='
//   var orderGroupId = ''
//   var autoCapture = true
//   var lang = 'vi'

//   //before sign HMAC SHA256 with format
//   //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
//   var rawSignature =
//     'accessKey=' +
//     accessKey +
//     '&amount=' +
//     amount +
//     '&extraData=' +
//     extraData +
//     '&orderId=' +
//     orderId +
//     '&orderInfo=' +
//     orderInfo +
//     '&partnerCode=' +
//     partnerCode +
//     '&paymentCode=' +
//     paymentCode +
//     '&requestId=' +
//     requestId
//   //puts raw signature
//   console.log('--------------------RAW SIGNATURE----------------')
//   console.log(rawSignature)
//   //signature

//   var signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex')
//   console.log('--------------------SIGNATURE----------------')
//   console.log(signature)

//   //json object send to MoMo endpoint
//   const requestBody = JSON.stringify({
//     partnerCode: partnerCode,
//     partnerName: 'Test',
//     storeId: 'MomoTestStore',
//     requestId: requestId,
//     amount: amount,
//     orderId: orderId,
//     orderInfo: orderInfo,
//     redirectUrl: redirectUrl,
//     ipnUrl: ipnUrl,
//     lang: lang,
//     autoCapture: autoCapture,
//     extraData: extraData,
//     paymentCode: paymentCode,
//     orderGroupId: orderGroupId,
//     signature: signature
//   })
//   //Create the HTTPS objects

//   const options = {
//     hostname: 'test-payment.momo.vn',
//     port: 443,
//     path: '/v2/gateway/api/pos',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': Buffer.byteLength(requestBody)
//     }
//   }
//   //Send the request and get the response
//   const req1 = https.request(options, (res) => {
//     console.log(`Status: ${res.statusCode}`)
//     console.log(`Headers: ${JSON.stringify(res.headers)}`)
//     res.setEncoding('utf8')
//     res.on('data', (body) => {
//       console.log('Body: ')
//       console.log(body)
//       console.log('resultCode: ')
//       console.log(JSON.parse(body).payUrl)
//     })
//     res.on('end', () => {
//       console.log('No more data in response.')
//     })
//   })

//   req1.on('error', (e) => {
//     console.log(`problem with request: ${e.message}`)
//   })
//   // write data to request body
//   console.log('Sending....')
//   req1.write(requestBody)
//   req1.end()
// }
