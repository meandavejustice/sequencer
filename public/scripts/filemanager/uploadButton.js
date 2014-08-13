/** @jsx React.DOM */
var React = require('react/addons');
var orm = require('../utils/orm');

function parseB64(b64str) {
  return {
    base64: b64str.substr(b64str.indexOf(',') + 1),
    type: b64str.match(/:([^}]*);/)[1]
  }
}

module.exports = function(emitter) {
  var UploadInput = React.createClass({
    onChange: function(ev) {
      ev.preventDefault();
      var file = ev.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function(buf) {
        var obj = parseB64(buf.target.result);
        obj.name = file.name;

        orm.put(file.name, obj, function(err) {
          if (!err) console.log('PUT! ', file.name);
          emitter.emit('track:upload', {key: file.name});
        })
      }
      reader.readAsDataURL(file);
    },

    render: function() {
      return (
          <input type="file" onChange={this.onChange}></input>
      );
    }
  });

  return UploadInput;
}
