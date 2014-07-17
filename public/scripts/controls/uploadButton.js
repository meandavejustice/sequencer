/** @jsx React.DOM */
var React = require('react/addons');
var orm = require('../orm');

var UploadInput = React.createClass({
  onChange: function(ev) {
    ev.preventDefault();
    var file = ev.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function(buf) {
      var obj = {
        buffer: buf.target.result,
        name: file.name
      };
      orm.put(file.name, obj, function(err) {
        if (!err) console.log('PUT! ', file);
      })
    }
    reader.readAsArrayBuffer(file);
  },

  render: function() {
    return (
      <input type="file" onChange={this.onChange}></input>
    );
  }
});

module.exports = UploadInput;
