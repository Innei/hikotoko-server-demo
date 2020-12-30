const { User } = require('../models')
const assert = require('http-assert')
const { compareSync } = require('bcrypt')
const { sign, verify } = require('jsonwebtoken')
const { nanoid } = require('nanoid')
const constant = require('../constant')
const { validNotEmptyString } = require('../utils')

class UserControllerStatic {
  constructor() {
    this.signToken = this.signToken.bind(this)
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
  }
  async register(req, res) {
    const { username, password, email } = req.body
    validNotEmptyString(username, 'username')
    validNotEmptyString(password, 'password')
    validNotEmptyString(email, 'email')

    const code = nanoid(6)
    const isExist = await User.find({
      username,
    })
    assert(!isExist, 422, 'user is exists.')
    const doc = await User.create({
      username,
      password,
      email,
      randomCode: code,
    })
    const data = doc.toJSON()
    delete data.randomCode
    delete data.password
    const token = this.signToken({ ...doc.toJSON(), randomCode: code })
    res.send({
      ...data,
      token,
    })
  }

  async login(req, res) {
    const { username, password } = req.body
    validNotEmptyString(username, 'username')
    validNotEmptyString(password, 'password')
    const user = await User.findOne({
      username,
    })
      .select('+randomCode +password')
      .lean()

    assert(!!user, 422, 'user not exists')

    const isValid = compareSync(password, user.password)

    assert(isValid, 422, 'password not correct.')

    const token = this.signToken(user)
    delete user.randomCode
    delete user.password

    res.send({
      ...user,
      token,
    })
  }

  signToken(doc) {
    return (
      'bearer ' +
      sign(
        { username: doc.username, code: doc.randomCode, id: doc._id },
        constant.jwtKey,
      )
    )
  }
}

module.exports = new UserControllerStatic()
