/** @jsx React.DOM */
var React = require('react/addons');

module.exports = function(emitter) {
  var filelist = require('./filelist')(emitter);
  var uploadInput = require('./uploadButton')(emitter);
  var files = [];
  var userFiles = [];

  var FileManager = React.createClass({
    removeUserFiles: function() {
      emitter.emit('files:remove-all', {});
    },
    render: function() {
      return (
        <div>
            <uploadInput />
            <filelist />
            <button className={"pure-button"} onClick={this.removeUserFiles}>{"Remove uploaded Files"}</button>
        </div>
      );
    }
  });

  return FileManager;
}
