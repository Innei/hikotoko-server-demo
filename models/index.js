const mongoose = require('mongoose')
const { hashSync } = require('bcrypt')
const { nanoid } = require('nanoid')
const Snowflake = require('../utils/snowflake')

const SentenceType = Object.freeze({
  SYSTEM: 0,
  USER: 1,
})
/**
 * @type {mongoose.SchemaOptions}
 */
const SchemaOptions = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
}

const SentenceSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    type: {
      type: Number,
      default: SentenceType.USER,
    },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    author: {
      type: String,
    },
    from: {
      type: String,
    },
    nonce: {
      type: String,
    },
    liked_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Sentence',
    },
  },
  SchemaOptions,
)

SentenceSchema.virtual('liked', {
  ref: 'Sentence',
  localField: 'liked_id',
  foreignField: '_id',
  justOne: true,
})

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: 1,
  },
  password: {
    type: String,
    required: true,
    get(val) {
      return val
    },
    set(val) {
      return hashSync(val, 3)
    },
    select: false,
  },
  email: {
    type: String,
    required: true,
  },
  randomCode: {
    type: String,
    default: () => {
      return nanoid(6)
    },
    select: false,
  },
})

const Sentence = mongoose.model('Sentence', SentenceSchema)
const User = mongoose.model('User', UserSchema)

module.exports = {
  Sentence,
  User,
  SentenceType,
}
