/** @jsx React.DOM */
var React = require('react');

module.exports = function(emitter) {
  var Sequencer = require('./sequencer')(emitter);

  var SequencePanel = React.createClass({
    setActive: function(ev) {
      emitter.emit('sequence:activate', {"id": ev.target.parentElement.id})
    },
    removeSequence: function(ev) {
      emitter.emit('sequence:remove', {"id": ev.target.parentElement.id});
    },
    render: function() {
      var addTab = function(sequence) {
        return <li onClick={this.setActive} id={sequence.id} contentEditable>{sequence.title}>
<span className={"remove"} onClick={this.removeSequence} >X</span>
          </li>
      };
      var addPanel = function(sequence) {
        return <div className={"tabs-section seq-content"}>
          <Sequencer tracks={sequence.tracks} id={sequence.id} />
          </div>
      };

      return <section id={"sequence-panel"}>
        <ul className={"tabs-list"}>
        {this.props.sequencers.map(addTab, this)}
      </ul>
        {this.props.sequencers.map(addPanel, this)}
        </section>
    }
   });

  return SequencePanel;
}
