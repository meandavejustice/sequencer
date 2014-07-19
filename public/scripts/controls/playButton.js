/** @jsx React.DOM */
var React = require('react/addons');

module.exports = function(emitter) {
var PlayButton = React.createClass({
  getInitialState: function() {
    this.msgs = ['►', ' ▌▌'];
    return {msg: this.msgs[0]};
  },
  onClick: function(ev) {
    this.setState({msg: this.msgs[~~!this.msgs.indexOf(ev.target.textContent)]});
    emitter.emit('sequence:power', {});
  },
  render: function() {
    return (
      <button className={"pure-button"} onClick={this.onClick}>{this.state.msg}</button>
    );
  }
});

return PlayButton;
}
