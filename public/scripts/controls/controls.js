/** @jsx React.DOM */
var React = require('react/addons');

module.exports = function(gainNode, emitter) {
  var playButton = require('./playButton')(emitter);
  var stopButton = require('./stopButton')(emitter);
  var masterVolume = require('./masterVolume')(gainNode, emitter);
  var addSequenceButton = require('./addSequence')(emitter);

  var Controls = React.createClass({
    render: function() {
      return (
        <div>
            <playButton />
            <stopButton />
            <masterVolume />
            <addSequenceButton />
        </div>
      );
    }
  });

  return Controls;
}
