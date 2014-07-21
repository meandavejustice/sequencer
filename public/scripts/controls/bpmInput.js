/** @jsx React.DOM */
var React = require('react/addons');

module.exports = function(emitter) {
  var BPMInput = React.createClass({
    getInitialState: function() {
      return {bpm: this.calculateBPM(180)};
    },
    calculateBPM: function(bpm) {
      return 1000 / (parseInt(bpm, 10) / 60);
    },
    onChange: function(ev) {
      var bpm = ev.target.value;
      this.setState({bpm: this.calculateBPM(bpm)});
      emitter.emit('sequence:bpm', {bpm: this.state.bpm});
    },
    render: function() {
      return (
      <input type={"text"} onChange={this.onChange} value={this.state.bpm} />
      );
    }
  });

  return BPMInput;
}
