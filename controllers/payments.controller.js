import dateFormat from 'dateformat'
import querystring from 'qs'
import crypto from 'crypto'
import { config } from 'dotenv'
import moment from 'moment'
import https from 'https'
import PayOS from "@payos/node"

config();

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY,
);

export const createPaymentLink = async (req, res) => {
  const { currentUrl, totalAmount, items } = req.body;

  if (!currentUrl || typeof currentUrl !== 'string') {
    return res.status(400).json({ error: "Trường 'currentUrl' là bắt buộc và phải là một chuỗi" });
  }

  if (totalAmount === undefined || totalAmount === null) {
    return res.status(400).json({ error: "Trường 'totalAmount' là bắt buộc" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Trường 'items' là bắt buộc và phải là mảng không rỗng" });
  }

  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: totalAmount,
    description: "Thanh toan don hang",
    items: items,
    returnUrl: currentUrl,
    cancelUrl: currentUrl,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);

    // Trả về URL thanh toán dưới dạng JSON thay vì redirect
    return res.status(200).json({ checkoutUrl: paymentLinkResponse.checkoutUrl });
  } catch (error) {
    console.error("Lỗi khi tạo payment link:", error);
    return res.status(500).json({ error: "Có lỗi xảy ra, vui lòng thử lại sau" });
  }
};

export const getPaymentLinkInformation = async (req, res) => {
  const { orderId } = req.body;
  try {
    const paymentLink = await payOS.getPaymentLinkInformation(orderId);
    res.status(200).json(paymentLink);
  } catch (error) {
    console.error(error);
    res.send("Something went error");
  }
};

export const cancelPaymentLink = async (req, res) => {
  const { orderId } = req.body;
  try {
    const cancelledPaymentLink = await payOS.cancelPaymentLink(orderId, "Bấm hủy đơn thanh toán");
    res.status(200).json(cancelledPaymentLink);
  } catch (error) {
    console.error(error);
    res.send("Something went error");
  }
};

export const confirmWebhook = async (req, res) => {

};

export const verifyPaymentWebhookData = async (req, res) => {

}
