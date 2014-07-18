/** @jsx React.DOM */
var React = require('react');
var trackStore = require('./trackStore');
var getFreshSequence = function() {
  return [
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    0,0,0,0
  ];
}

module.exports = function(emitter) {
  var Track = React.createClass({
    updateSequence: function(ev) {
      var el = ev.target;
      el.classList.toggle('on');
      emitter.emit('sequence:update', {
        id: el.attributes['data-id'].textContent,
        index: parseInt(el.attributes['data-grid'].textContent, 10)
      })
    },
    render: function() {
      return <tr>
          <td className={"track"} data-id={this.props.track.id}>
              {this.props.track.name}
          </td>
          <td onClick={this.updateSequence} data-grid={1} data-id={this.props.track.id}></td>
          <td onClick={this.updateSequence} data-grid={2} data-id={this.props.track.id}></td>
          <td onClick={this.updateSequence} data-grid={3} data-id={this.props.track.id}></td>
          <td onClick={this.updateSequence} data-grid={4} data-id={this.props.track.id}></td>

          <td onClick={this.updateSequence} data-grid={5} data-id={this.props.track.id}></td>
          <td onClick={this.updateSequence} data-grid={6} data-id={this.props.track.id}></td>
          <td onClick={this.updateSequence} data-grid={7} data-id={this.props.track.id}></td>
          <td onClick={this.updateSequence} data-grid={8} data-id={this.props.track.id}></td>

          <td onClick={this.updateSequence} data-grid={9} data-id={this.props.track.id}></td>
          <td onClick={this.updateSequence} data-grid={10} data-id={this.props.track.id}></td>
          <td onClick={this.updateSequence} data-grid={11} data-id={this.props.track.id}></td>
          <td onClick={this.updateSequence} data-grid={12} data-id={this.props.track.id}></td>

          <td onClick={this.updateSequence} data-grid={13} data-id={this.props.track.id}></td>
          <td onClick={this.updateSequence} data-grid={14} data-id={this.props.track.id}></td>
          <td onClick={this.updateSequence} data-grid={15} data-id={this.props.track.id}></td>
          <td onClick={this.updateSequence} data-grid={16} data-id={this.props.track.id}></td>
      </tr>
      }
  });

  var Sequencer = React.createClass({
    getInitialState: function() {
      var bpm = 1000 / (180 / 60);
      return {bpm: bpm, activeIndex: 0, crate:{}};
    },
    updateSequence: function() {
      console.warn('Not Implemented');
    },
    setBPM: function(bpm) {
      var bpm = 1000 / (parseInt(bpm, 10) / 60);
      this.setState({bpm: bpm});
    },
    renderStep: function() {
      var activateEv = new CustomEvent('activate', {});
      var silenceEv = new CustomEvent('silence', {});
      this.heads[this.state.activeIndex - 1].dispatchEvent(silenceEv);
      this.heads[this.state.activeIndex].dispatchEvent(activateEv);
    },
    updateStep: function() {
      if (this.state.activeIndex === 16) {
        this.setState({activeIndex: 0});
      }
      this.setState({activeIndex: this.state.activeIndex + 1});
      this.renderStep();
      this.playStep();
    },
    playStep: function() {
      Object.keys(this.state.crate).forEach(function(key) {
        if (this.state.crate[key][this.state.activeIndex]) {
          trackStore.play(key);
        }
      }, this)
    },
    componentDidMount: function() {
      this.heads = Array.prototype.slice.call(
        this.getDOMNode().querySelectorAll('th'), 0);

      this.heads.forEach(function(head) {
        head.addEventListener('silence', function(ev) {
          ev.target.classList.remove('active');
        })

        head.addEventListener('activate', function(ev) {
          ev.target.classList.add('active');
        })
      })

      this.props.tracks.forEach(function(track) {
        this.state.crate[track.id] = getFreshSequence();
      }, this);

      emitter.on('sequence:update', function(ev) {
        if (!this.state.crate[ev.id]) {
          this.state.crate[ev.id] = getFreshSequence();
        }
        if (this.state.crate[ev.id][ev.index]) {
          this.state.crate[ev.id][ev.index] = 0;
        } else {
          this.state.crate[ev.id][ev.index] = 1;
        }
      }, this)

      emitter.on('sequence:power', function() {
        if (this.interval) {
          clearInterval(this.interval);
        } else {
          this.interval = setInterval(this.updateStep, this.state.bpm);
        }
      }, this)
    },
    componentWillUnmount: function() {
      clearInterval(this.interval);
    },
    render: function() {
      var addTrack = function(track) {
        return <Track track={track} />
      }

      return <section id={"sequence"}>
          <h4>{this.props.title}</h4>
          <table className={"pure-table pure-table-bordered"}>
              <thead>
                  <tr>
                      <th>Tracklist</th>
                      <th onClick={this.updateSequence} >1</th>
                      <th onClick={this.updateSequence} >2</th>
                      <th onClick={this.updateSequence} >3</th>
                      <th onClick={this.updateSequence} >4</th>
                      <th onClick={this.updateSequence} >5</th>
                      <th onClick={this.updateSequence} >6</th>
                      <th onClick={this.updateSequence} >7</th>
                      <th onClick={this.updateSequence} >8</th>
                      <th onClick={this.updateSequence} >9</th>
                      <th onClick={this.updateSequence} >10</th>
                      <th onClick={this.updateSequence} >11</th>
                      <th onClick={this.updateSequence} >12</th>
                      <th onClick={this.updateSequence} >13</th>
                      <th onClick={this.updateSequence} >14</th>
                      <th onClick={this.updateSequence} >15</th>
                      <th onClick={this.updateSequence} >16</th>
                  </tr>
              </thead>
              <tbody>{this.props.tracks.map(addTrack, this)}</tbody>
          </table>
      </section>
      }
  })

  return Sequencer;
}
