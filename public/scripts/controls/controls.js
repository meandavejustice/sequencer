/** @jsx React.DOM */
var React = require('react/addons');

module.exports = function(emitter) {
  var playButton = require('./playButton')(emitter);
  var stopButton = require('./stopButton')(emitter);
  var addSequenceButton = require('./addSequence')(emitter);

  var Controls = React.createClass({
    render: function() {
      return (
        <div>
           <playButton />
           <stopButton />
           <addSequenceButton />
          </div>
      );
    }
  });

  return Controls;
}
