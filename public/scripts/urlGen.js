var orm = require('./orm');

function genURL(key, cb)  {
  orm.get(key, function(err, data) {
    if (err) cb(err);
    var obj = JSON.parse(data).buffer;
    var blob = new Blob(obj, {type: "audio/mp3"}) // propz should check for type
    var url = URL.createObjectUrl(blob);
    cb(null, url);
  })
}

module.exports = genURL;