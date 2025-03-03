import sha256 from 'crypto-js/sha256.js'

// export const hashPassword = (password) => sha256(password + process.env.PASSWORD_SECRET)

export const hashPassword = (password) => {
  const hashedPassword = sha256(password + process.env.PASSWORD_SECRET).toString()
  return hashedPassword
}
export const comparePassword = (plaintextPassword, hashedPassword) => {
  const hashedPlaintextPassword = hashPassword(plaintextPassword)
  return hashedPlaintextPassword === hashedPassword
}
