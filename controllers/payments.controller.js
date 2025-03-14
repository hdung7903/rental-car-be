import dateFormat from 'dateformat'
import querystring from 'qs'
import crypto from 'crypto'
import { config } from 'dotenv'
import moment from 'moment'
import https from 'https'
import PayOS from '@payos/node'
import CryptoJS from "crypto-js";
import axios from 'axios';

config()

const payOS = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY)

export const createOrderPaymentZaloPayController = async (req, res) => {
  try {
    const { name, phone, address, from, to, id, amount, discount } = req.body;

    if (!id || !amount) {
      return res.status(400).json({ error: "Thiếu dữ liệu cần thiết" });
    }

    // **ZaloPay Sandbox Configuration**
    const config = {
      app_id: "2553",
      key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
      key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
      endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    };

    // **Thông tin đơn hàng**
    const items = [{ id, name: "Dịch vụ thuê xe", price: amount - (discount || 0) }];

    // **Tạo URL chuyển hướng sau khi thanh toán**
    const redirectUrl = `http://localhost:3000/booking/${id}?vnp_OrderInfo=${id},:?${phone},:?${address},:?${from},:?${to}`;

    // **Thêm thông tin vào `embed_data`**
    const embed_data = { redirecturl: redirectUrl };

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: name || "default_user",
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount - (discount || 0),
      description: `Thanh toán đơn thuê xe #${transID}`,
      bank_code: "",
      callback_url: "https://3303-2402-800-6172-c150-c178-1ca8-b8c-d25d.ngrok-free.app/payments/zalopay_payment_url/callback",
    };

    // **Tạo chữ ký `mac`**
    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    // **Gửi yêu cầu đến ZaloPay**
    const response = await axios.post(config.endpoint, null, { params: order });

    // **Trả về link thanh toán**
    res.json({ message: "ZaloPay payment initiated successfully", data: response.data });

  } catch (error) {
    console.error("ZaloPay Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const callbackZalopay = async (req, res) => {
  const config = {
    key2: "eG4r0GcoNtRGbO8", // Key2 của bạn từ ZaloPay
  };
  let result = {};

  try {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    // Tạo MAC để kiểm tra tính hợp lệ của callback
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "MAC không hợp lệ";
    } else {
      // Parse dữ liệu giao dịch từ ZaloPay
      const dataJson = JSON.parse(dataStr);

      console.log("Cập nhật trạng thái đơn hàng:", dataJson["app_trans_id"]);

      // TODO: Cập nhật trạng thái đơn hàng trong database của bạn

      result.return_code = 1;
      result.return_message = "Thành công";
    }
  } catch (error) {
    result.return_code = 0; // ZaloPay sẽ gọi lại tối đa 3 lần nếu thất bại
    result.return_message = error.message;
  }

  res.json(result);
}

export const createPaymentLink = async (req, res) => {
  const { currentUrl, totalAmount, items } = req.body

  if (!currentUrl || typeof currentUrl !== 'string') {
    return res.status(400).json({ error: "Trường 'currentUrl' là bắt buộc và phải là một chuỗi" })
  }

  if (totalAmount === undefined || totalAmount === null) {
    return res.status(400).json({ error: "Trường 'totalAmount' là bắt buộc" })
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Trường 'items' là bắt buộc và phải là mảng không rỗng" })
  }

  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: totalAmount,
    description: 'Thanh toan don hang',
    items: items,
    returnUrl: currentUrl,
    cancelUrl: currentUrl
  }

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body)

    // Trả về URL thanh toán dưới dạng JSON thay vì redirect
    return res.status(200).json({ checkoutUrl: paymentLinkResponse.checkoutUrl })
  } catch (error) {
    console.error('Lỗi khi tạo payment link:', error)
    return res.status(500).json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau' })
  }
}

export const getPaymentLinkInformation = async (req, res) => {
  const { orderId } = req.query // Lấy orderId từ query string thay vì body

  // Kiểm tra orderId có tồn tại và hợp lệ không
  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing orderId' })
  }

  try {
    const paymentLink = await payOS.getPaymentLinkInformation(orderId)
    console.log(paymentLink)
    res.status(200).json(paymentLink)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
}

export const cancelPaymentLink = async (req, res) => {
  const { orderId } = req.body
  try {
    const cancelledPaymentLink = await payOS.cancelPaymentLink(orderId, 'Bấm hủy đơn thanh toán')
    res.status(200).json(cancelledPaymentLink)
  } catch (error) {
    console.error(error)
    res.send('Something went error')
  }
}

export const confirmWebhook = async (req, res) => {}

export const verifyPaymentWebhookData = async (req, res) => {}
