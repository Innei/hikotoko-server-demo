const assert = require('http-assert')
const validNotEmptyString = (val, name) => {
  assert(
    typeof val === 'string' && val.length > 0,
    422,
    name + ' must be not empty string, got ' + val,
  )
}

const validStringOrUndefined = (val, name) => {
  assert(
    typeof val === 'undefined' || typeof val === 'string',
    422,
    name + ' can be undefined or string, got ' + val,
  )
}

const md5 = (text) =>
  require('crypto').createHash('md5').update(text).digest('hex')
const getGravatar = (email) => {
  if (!email) {
    return ''
  }
  return `https://sdn.geekzu.org/avatar/${md5(email)}`
}

module.exports = {
  validNotEmptyString,
  validStringOrUndefined,
  getGravatar,
}
