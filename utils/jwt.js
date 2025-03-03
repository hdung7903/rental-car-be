import { rejects } from 'assert'
import jwt from 'jsonwebtoken'
import { resolve } from 'path'
import { config } from 'dotenv'

config()
export const signToken = ({ payload, privateKey, options = { algorithm: 'HS256' } }) => {
  return new Promise((resolve, rejects) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        rejects(error)
      }
      resolve(token)
    })
  })
}

export const verifyToken = ({ token, secretOrPublickey }) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublickey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }

      resolve(decoded)
    })
  })
}
