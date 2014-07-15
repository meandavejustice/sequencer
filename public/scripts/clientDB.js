var levelup = require('levelup')
var leveljs = require('leveljs')

var db = levelup('seq', { db: leveljs })

module.exports = db
