const pify = require('pify')
const deglob = require('deglob')
module.exports = pify(deglob)
