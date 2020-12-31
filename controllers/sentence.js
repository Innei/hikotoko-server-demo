const { Sentence, SentenceType } = require('../models')
const assert = require('http-assert')
const constant = require('../constant')
const { validNotEmptyString, validStringOrUndefined } = require('../utils')
const { Types } = require('mongoose')
const FlakeId = require('../utils/snowflake')
const Snowflake = require('../utils/snowflake')
class SentenceControllerStatic {
  async getRandom(req, res) {
    const { count: queryCount } = req.query
    assert(
      typeof queryCount === 'undefined' ||
        typeof parseInt(queryCount) === 'number',
      422,
      'count must be number or undefined. got ' + queryCount,
    )

    const count = await Sentence.countDocuments()
    assert(count !== 0, 422, 'has no sentences yet.')
    if (!queryCount) {
      const data = await Sentence.findOne().skip(
        Math.floor(Math.random() * count),
      )
      res.send(data)
    } else {
      const data = await Sentence.aggregate([
        {
          $match: {
            liked_id: null,
          },
          $sample: { size: ~~queryCount },
        },
      ])
      res.send(data)
    }
  }

  async insert(req, res) {
    const { author, from, text } = req.body

    validNotEmptyString(text, 'text')
    validStringOrUndefined(author, 'author')
    validStringOrUndefined(from, 'from')

    const { user } = req
    const { _id: user_id } = user

    const data = await Sentence.create({
      author,
      text,
      from,
      type: SentenceType.USER,
      user_id,
      nonce: Snowflake.gen(),
    })

    res.status(201).send(data)
  }

  async likeSentence(req, res) {
    const { id } = req.params

    const { user } = req
    const { _id: user_id } = user

    assert(Types.ObjectId.isValid(id), 422, 'id must be object id. got ' + id)

    const hasDocument = await Sentence.findOne({
      _id: id,
      type: SentenceType.SYSTEM,
    })
    assert(hasDocument, 422, 'sentence not found.')

    const isLiked = await Sentence.findOne({
      type: SentenceType.USER,
      liked_id: id,
    })

    assert(
      !isLiked,
      422,
      'sentence already liked. document id: ' + (isLiked && isLiked._id),
    )

    const newModel = {
      ...hasDocument.toJSON(),
      type: SentenceType.USER,
      liked_id: hasDocument._id,
      user_id,
      nonce: Snowflake.gen(),
    }
    delete newModel._id
    delete newModel.id
    delete newModel.updated_at
    const document = await Sentence.create(newModel)
    res.send(document)
  }

  async patch(req, res) {
    const { id: _id } = req.params

    assert(Types.ObjectId.isValid(_id), 422, 'id must be object id. got ' + _id)
    const { author, from, text } = req.body
    const {
      user: { _id: user_id },
    } = req
    validStringOrUndefined(author, 'author')
    validStringOrUndefined(from, 'from')
    validStringOrUndefined(text, 'text')

    const doc = await Sentence.findOne({
      _id,
      type: SentenceType.USER,
      user_id,
    })
    assert(doc, 422, 'sentence not found.')

    await Sentence.updateOne(
      {
        _id,
        type: SentenceType.USER,
        user_id,
        nonce: Snowflake.gen(),
      },
      {
        author,
        from,
        text,
      },
      {
        omitUndefined: true,
      },
    )

    res.status(204).end()
  }

  async delete(req, res) {
    const { id } = req.params
    const {
      user: { _id: user_id },
    } = req
    assert(id && Types.ObjectId.isValid(id), 422, 'id must be object id.')
    const doc = await Sentence.findOne({
      _id: id,
      type: SentenceType.USER,
      user_id,
    })
    assert(doc, 422, 'sentence not found.')

    await Sentence.deleteOne({ _id: id })
    res.status(204).end()
  }

  async getAllByUser(req, res) {
    // TODO pager
    const { user } = req
    const { _id: user_id } = user

    const data = await Sentence.find({
      type: SentenceType.USER,
      user_id,
    })

    res.send({ data: data })
  }

  // sync sentences
  async syncSentence(req, res) {}
}

module.exports = new SentenceControllerStatic()
