/** @jsx React.DOM */
var React = require('react/addons');

module.exports = function(gainNode, emitter) {
  var MasterVolume = React.createClass({
    getInitialState: function() {
      return {value: 50};
    },
    updateVolume: function(ev) {
      gainNode.gain.value = ev.target.value / 100;
      this.setState({value: ev.target.value});
    },
    render: function() {
      return (
        <label>{this.state.value}
            <input type={"range"} min={"0"} max={"100"} step={"10"} value={this.state.value}
                   onInput={this.updateVolume} />
        </label>);
    }
  });

  return MasterVolume;
}
