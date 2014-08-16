/** @jsx React.DOM */
var React = require('react/addons');
var Emitter = require('tiny-emitter');
var tabs = require('hut-tabs');

var context = require('./utils/audioContext')();
var trackStore = require('./utils/trackStore');
var TrackSource = require('./utils/tracksource');
var genURL = require('./utils/urlGen');
var FFT = require('./utils/fft');
var DrawBuffer = require('./utils/draw-buffer');
var getId = require('./utils/getId');

var emitter = new Emitter();
var gainNode = context.createGain();

var sequencePanel = require('./sequencePanel')(emitter);
var controls = require('./controls/controls')(gainNode, emitter);
var fileManager = require('./filemanager/filemanager')(emitter);

var fft = new FFT(context, {canvas: document.getElementById('fft')});
// var fftime = new FFT(context, {canvas: document.getElementById('fftime'), type: "time"});
var fftime = new DrawBuffer(context, {canvas: document.getElementById('fftime'), type: "time"});

var placeholder = document.querySelector('.welcome');

var Recorder = require('./utils/recorder.js');
debugger;

var sequencers = [];

function getFreshSequence() {
  var activeSeq = {
    active: true,
    id: 'seq:' + getId(),
    title: 'Default',
    tracks: []
  };
  sequencers.push(activeSeq);

  return activeSeq;
}

function updateActiveSequence(id) {
  sequencers.forEach(function(seq) {
    if (seq.id !== id) {
      seq.active = false;
    } else {
      seq.active = true;
    }
  });
}

function getActiveSequencer() {
  var active = [];
  sequencers.forEach(function(seq) {
    if (seq.active) active.push(seq);
  });

  if (!active.length) {
    return getFreshSequence();
  } else {
    return active[0];
  }
}

getActiveSequencer();
var sequencerPanelComponent = React.renderComponent(<sequencePanel sequencers={sequencers} />, document.querySelector('.sequence-contain'));
var controlsComponent = React.renderComponent(<controls />, document.querySelector('.control'));
var fileManagerComponent = React.renderComponent(<fileManager />, document.querySelector('.fileManager'));

var myTabs = tabs(document.getElementById('sequence-panel'));

function updateSequence() {
  sequencerPanelComponent.setProps({sequencers: sequencers});
}

function addTrack(track) {
  var activeSequencer = getActiveSequencer();
  activeSequencer.tracks.push(track);
  updateSequence();
}

emitter.on('sequence:activate', function(ev) {
  updateActiveSequence(ev.id);
})

emitter.on('sequence:add', function(ev) {
  getFreshSequence();
  updateSequence();
})

emitter.on('sequence:remove', function(ev) {
  for (var i = sequencers.length-1; i >= 0; i--) {
    if (sequencers[i].id == ev.id) {
      sequencers.splice(i, 1);
      break;
    }
  }

  updateSequence();
})

emitter.on('track:remove', function (obj) {
  sequencers.forEach(function(seq) {
    if (seq.id === obj.seqId) {
      for (var i = seq.tracks.length-1; i >= 0; i--) {
        if (seq.tracks[i].id == obj.id) {
          seq.tracks.splice(i, 1);
          break;
        }
      }
    }
  });

  updateSequence();
});

emitter.on('track:add', function (trackid) {
  var track = trackStore.getReference(trackid);
  if (!track.url) {
    genURL(track.key, function(err, url) {
      if (err) console.log('err getting track =>', track.key, ' from local store');
      var trackObj = new TrackSource(context, {url: url, ffts: [fft, fftime], gainNode: gainNode});
      trackStore.add(trackid, trackObj);

      // fix dis shit;
      track.name = track.key;
      addTrack(track);
    });
  } else {
    var trackObj = new TrackSource(context, {url: track.url, ffts: [fft, fftime], gainNode: gainNode});
    trackStore.add(trackid, trackObj);
    addTrack(track);
  }

  placeholder.style.display = 'none';
});
