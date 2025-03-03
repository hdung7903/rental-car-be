import pkg from 'lodash'
const { omit } = pkg
import { HTTP_STATUS } from '../constants/httpStatus.js'
import { ErrorWithStatus } from '../models/error.js'

export const defaultErrorHandler = (err, req, res, next) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  Object.getOwnPropertyNames(err || Object(err)).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  return res.json({
    error: omit(err, ['stack'])
  })
}
