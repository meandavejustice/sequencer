/** @jsx React.DOM */
var React = require('react/addons');

// <input type="text" id="bpm" name="" value="120" />

module.exports = function(emitter) {
var uploadInput = require('./uploadButton');
var playButton = require('./playButton')(emitter);

var Controls = React.createClass({
  render: function() {
    return (
      <div>
         <playButton />
         <uploadInput />
      </div>
    );
  }
});

return Controls;
}
