const getUserFromReq = (req) => req.user
const getUserIdFromReq = (req) => req.user._id

module.exports = {
  getUserFromReq,
  getUserIdFromReq,
}
