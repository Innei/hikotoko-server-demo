/*
 * @Author: Innei
 * @Date: 2021-01-04 16:21:40
 * @LastEditTime: 2021-01-15 14:40:47
 * @LastEditors: Innei
 * @FilePath: /demo-server/controllers/user.js
 * @Mark: Coding with Love
 */
// @ts-check
const { User } = require('../models')
const { Sentence, SentenceType } = require('../models')
const assert = require('http-assert')

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
