var db = require('../clientDB');

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

function removeAll(cb) {
  var jobs = [];
  keyStream()
    .on('data', function(data) {
      jobs.push({
        'type': 'del',
        'key': data
      });
    })
    .on('end', function() {
      db.batch(jobs, function (err) {
        if (err) return cb(err);
        cb(null);
      });
    });
}

module.exports.put = put;
module.exports.get = get;
module.exports.keyStream = keyStream;
module.exports.removeAll = removeAll;
