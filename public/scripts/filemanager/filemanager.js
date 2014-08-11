/** @jsx React.DOM */
var React = require('react/addons');

module.exports = function(emitter) {
  var uploadInput = require('./uploadButton')(emitter);

  var FileManager = React.createClass({
    render: function() {
      return (
        <div>
           <uploadInput />
          </div>
      );
    }
  });

  return FileManager;
}
