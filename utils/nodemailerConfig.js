import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'

import { config } from 'dotenv'
config()

// https://ethereal.email/create
const nodeConfig = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 456,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, // generated ethereal user
    pass: process.env.PASSWORD // generated ethereal password
  }
}
export const transporter = nodemailer.createTransport(nodeConfig)

export const MailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Mailgen',
    link: 'https://mailgen.js/'
  }
})
