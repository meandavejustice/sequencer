/** @jsx React.DOM */
var React = require('react/addons');

module.exports = function(emitter) {
  var AddSequenceButton = React.createClass({
    onClick: function(ev) {
      emitter.emit('sequence:add', {});
    },
    render: function() {
      return (
          <button className={"pure-button"} onClick={this.onClick}>Add Sequence</button>
      );
    }
  });

  return AddSequenceButton;
}
