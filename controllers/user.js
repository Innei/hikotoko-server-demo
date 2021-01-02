const { User } = require('../models')
const { Sentence, SentenceType } = require('../models')
const assert = require('http-assert')
const { compareSync } = require('bcrypt')
const { sign, verify } = require('jsonwebtoken')
const { nanoid } = require('nanoid')
const constant = require('../constant')
const { validNotEmptyString, getGravatar } = require('../utils')

class UserControllerStatic {
  async delete(req, res) {
    const {
      user: { _id: user_id },
    } = req

    await Sentence.deleteMany({
      type: SentenceType.USER,
      user_id,
    })

    await User.deleteOne({ _id: user_id })
    res.status(204).end()
  }

  async patch(req, res) {
    // TODO re-check password

    assert(!req.body.password, 400, 'not support change password current.')

    const {
      user: { _id: user_id },
    } = req

    await User.updateOne({ _id: user_id }, req.body, { omitUndefined: true })
    res.status(204).end()
  }
}

module.exports = new UserControllerStatic()
