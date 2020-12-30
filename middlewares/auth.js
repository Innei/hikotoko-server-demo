const constant = require('../constant')
const { verify } = require('jsonwebtoken')
const { User } = require('../models')
/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} next
 */
module.exports = async (req, res, next) => {
  if (req.headers.authorization) {
    const tokenString = req.headers.authorization.replace(/^bearer /, '')

    try {
      const { code, id } = verify(tokenString, constant.jwtKey)

      const user = await User.findById(id).select({ randomCode: 1 })
      const randomCode = user.randomCode

      if (code === randomCode) {
        req.user = user

        return next()
      }
    } catch (e) {
      console.log(e)
      return res.status(422).send({ message: 'token is valid' })
    }
  }

  return res
    .status(422)
    .send({ message: 'authorization failed, check token please,' })
}