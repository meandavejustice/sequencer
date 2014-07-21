var orm = require('./orm');

function _base64toArrayBuffer(base64) {
  var binary_string =  window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array( len );
  for (var i = 0; i < len; i++)        {
    var ascii = binary_string.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes.buffer;
}

function genURL(key, cb)  {
  orm.get(key, function(err, data) {
    if (err) cb(err);
    var arrBuffer = _base64toArrayBuffer(data.base64);
    var blob = new Blob([arrBuffer], {type: data.type});
    var url = URL.createObjectURL(blob);
    cb(null, url);
  })
}

module.exports = genURL;