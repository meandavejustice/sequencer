var levelup = require('levelup')
var leveljs = require('level-js')

var db = levelup('seq', { db: leveljs, valueEncoding: 'json' })

module.exports = db
