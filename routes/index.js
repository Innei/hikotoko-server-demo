const { Router } = require('express')
const Express = require('express')
const auth = require('../middlewares/auth')
const UserController = require('../controllers/user')
const SentenceController = require('../controllers/sentence')

const root = Router()
const users = Router()

users.post('/register', UserController.register)
users.post('/login', UserController.login)

const sentence = Router()
sentence.get('/', SentenceController.getRandom)
sentence.use(auth)
sentence.get('/user', SentenceController.getAllByUser)
sentence.post('/', SentenceController.insert)
sentence.patch('/:id', SentenceController.patch)
sentence.delete('/:id', SentenceController.delete)
/**
 *
 * @param {Express.Application} app
 */
module.exports = (app) => {
  root.use('/users', users)
  root.use('/sentences', sentence)

  app.use('/v1', root)
}
