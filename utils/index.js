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
module.exports = {
  validNotEmptyString,
  validStringOrUndefined,
}
