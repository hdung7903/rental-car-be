import { validate } from '../utils/validator.js'
import { checkSchema } from 'express-validator'
import { HTTP_STATUS } from '../constants/httpStatus.js'
import { USER_MESSAGES } from '../constants/messages.js'
import usersService from '../services/users.services.js'
import User from '../models/user.model.js'
import { hashPassword } from '../utils/crypto.js'
import { ErrorWithStatus } from '../models/error.js'
import { verifyToken } from '../utils/jwt.js'

import pkg from 'lodash'
const { capitalize } = pkg
import pkg1 from 'jsonwebtoken'
const { JsonWebTokenError } = pkg1
import { config } from 'dotenv'

config()

export const registerValidator = validate(
  checkSchema(
    {
      // username: {
      //   notEmpty: {
      //     errorMessage: USER_MESSAGES.NAME_IS_REQUIRED
      //   },
      //   isString: {
      //     errorMessage: USER_MESSAGES.NAME_MUST_BE_A_STRING
      //   },
      //   isLength: {
      //     options: {
      //       min: 1,
      //       max: 100
      //     },
      //     errorMessage: USER_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      //   },

      //   trim: true
      // },
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const result = await usersService.checkExistEmail(value)
            if (result) {
              throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
            }

            return true
          }
        }
      },
      password: {
        trim: true,

        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: { min: 6, max: 40 },
          errorMessage: USER_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_40
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: { min: 6, max: 40 },
          errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_40
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
        },
        trim: true,

        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_IS_NOT_MATCHED)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const result = await User.findOne({
              email: value,
              password: hashPassword(req.body.password).toString()
            })
            if (result === null) {
              throw new Error(USER_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            const result2 = await usersService.checkActivityUser(value)
            console.log(result2)

            if (result2) {
              throw new Error('Tài khoản này không còn hoạt động!')
            }
            req.user = result
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: { min: 6, max: 40 },
          errorMessage: USER_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_40
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG
        },

        trim: true
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      authorization: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUESTED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const access_token = (value || '').split(' ')[1]

            if (!access_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUESTED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublickey: process.env.JWT_SECRET_ACCESS_TOKEN
              })
              const { user_id } = decoded_authorization
              console.log(user_id)
              req.decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize(error.message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const staffValidator = validate(
  checkSchema(
    {
      authorization: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUESTED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const access_token = (value || '').split(' ')[1]

            if (!access_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUESTED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublickey: process.env.JWT_SECRET_ACCESS_TOKEN
              })
              const { role } = decoded_authorization
              if (role === 'staff') {
                req.decoded_authorization = decoded_authorization
              } else {
                next(new ErrorWithStatus('You not staff', HTTP_STATUS.UNAUTHORIZED))
              }
              req.decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize(error.message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const adminValidator = validate(
  checkSchema(
    {
      authorization: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUESTED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const access_token = (value || '').split(' ')[1]

            if (!access_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUESTED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublickey: process.env.JWT_SECRET_ACCESS_TOKEN
              })
              const { role } = decoded_authorization
              if (role === 'admin') {
                req.decoded_authorization = decoded_authorization
              } else {
                next(new ErrorWithStatus('You not admin', HTTP_STATUS.UNAUTHORIZED))
              }
              req.decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize(error.message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const adminAndStaffValidator = validate(
  checkSchema(
    {
      authorization: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUESTED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const access_token = (value || '').split(' ')[1]

            if (!access_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUESTED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublickey: process.env.JWT_SECRET_ACCESS_TOKEN
              })
              const { role } = decoded_authorization
              if (role === 'admin' || role === 'staff') {
                req.decoded_authorization = decoded_authorization
              } else {
                next(new ErrorWithStatus('You not admin', HTTP_STATUS.UNAUTHORIZED))
              }
              req.decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize(error.message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)
