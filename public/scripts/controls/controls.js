/** @jsx React.DOM */
var React = require('react/addons');

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
