/** @jsx React.DOM */
var React = require('react');

module.exports = function(emitter) {
  var Sequencer = require('./sequencer')(emitter);

  var SequencePanel = React.createClass({
    setActive: function(ev) {
      emitter.emit('sequence:activate', {"id": ev.target.id})
    },
    render: function() {
      var addTab = function(sequence) {
        return <li onClick={this.setActive} id={sequence.id} contentEditable>{sequence.title}</li>
      };
      var addPanel = function(sequence) {
        return <div className={"tabs-section seq-content"}>
          <Sequencer tracks={sequence.tracks} />
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
