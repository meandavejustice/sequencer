var db = require('./clientDB');

function put(key, file, cb) {
  db.put(key, file, function(err) {
    if (err) cb(err);
    cb(null);
  })
}

function get(key, cb) {
  db.get(key, function(err, data) {
    if (err) cb(err);
    cb(null, data);
  })
}

function keyStream() {
  return db.createKeyStream();
}

module.exports.put = put;
module.exports.get = get;
module.exports.keyStream = keyStream;