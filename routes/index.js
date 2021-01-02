const { Router } = require('express')
const Express = require('express')
const authMiddleware = require('../middlewares/auth')
const AuthController = require('../controllers/auth')
const SentenceController = require('../controllers/sentence')
const UserController = require('../controllers/user')

const root = Router()
const auth = Router()
const sentence = Router()
const user = Router()

auth.post('/register', AuthController.register)
auth.post('/login', AuthController.login)

sentence.get('/', SentenceController.getRandom)
sentence.use(authMiddleware)
sentence.get('/like/:id', SentenceController.likeSentence)
sentence.get('/user', SentenceController.getAllByUser)
sentence.post('/sync', SentenceController.syncSentence)
sentence.post('/', SentenceController.insert)
sentence.patch('/:id', SentenceController.patch)
sentence.delete('/:id', SentenceController.delete)

user.use(authMiddleware)
user.delete('/', UserController.delete)
user.patch('/', UserController.patch)

/**
 *
 * @param {Express.Application} app
 */
module.exports = (app) => {
  root.use('/auth', auth)
  root.use('/sentences', sentence)
  root.use('/users', user)

  app.use('/v1', root)
}
