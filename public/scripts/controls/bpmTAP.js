/** @jsx React.DOM */
var React = require('react/addons');

module.exports = function(emitter) {
  var BPMInput = React.createClass({
    calculateBPM: function(bpm) {
      return 1000 / (parseInt(bpm, 10) / 60);
    },
    onChange: function(ev) {
      var bpm = ev.target.value;

      this.setProps({bpm: this.calculateBPM(bpm)});
      emitter.emit('sequence:bpm', {bpm: this.props.bpm});
    },
    render: function() {
      return (
      <input type={"text"} onChange={this.onChange} value={this.props.bpm} />
      );
    }
  });

  var BPMTap = React.createClass({
    getInitialState: function() {
      return {bpm: 180, msecs: new Date().getTime(), };
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
          <BPMInput bpm={this.state.bpm} />
          <div onClick={this.onClick} />
      );
    }
  });

  return BPMTap;
}
