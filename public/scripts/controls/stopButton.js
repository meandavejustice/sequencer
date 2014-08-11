/** @jsx React.DOM */
var React = require('react/addons');

module.exports = function(emitter) {
  var StopButton = React.createClass({
    onClick: function(ev) {
      emitter.emit('sequence:stop', {});
    },
    render: function() {
      return (
          <button className={"pure-button"} onClick={this.onClick}>■</button>
      );
    }
  });

  return StopButton;
}
