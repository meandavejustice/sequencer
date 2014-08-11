/** @jsx React.DOM */
var React = require('react/addons');
var Emitter = require('tiny-emitter');
var trackStore = require('./trackStore');
var TrackSource = require('./tracksource');
var orm = require('./orm');
var context = require('./audioContext')();
var genURL = require('./urlGen');
var FFT = require('./fft');
var placeholder = document.querySelector('.welcome');

var tabs = require('hut-tabs');

var getId = function() { return Math.random().toString(16).slice(2);};

var gainNode = context.createGain();
var fft = new FFT(context, {canvas: document.getElementById('fft')});
var fftime = new FFT(context, {canvas: document.getElementById('fftime'), type: "time"});
var emitter = new Emitter();

var sequencers = [];

var files = [];
var userFiles = [];

var sequencePanel = require('./sequencePanel')(emitter);
var filelist = require('./filelist')(emitter);
var controls = require('./controls/controls')(emitter);
var fileManager = require('./filemanager/filemanager')(emitter);

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

function bootstrap() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/files');
  xhr.onloadend = function(ev) {
    var response = JSON.parse(ev.target.response);
    response.forEach(function(result) {
      result.id = getId();
      trackStore.addReference(result.id, result);
      files.push(result);
    });
    renderFileList(files, userFiles);
  };
  xhr.send();
  loadUserFiles();
}

function loadUserFiles() {
  orm.keyStream()
  .on('data', function(data) {
    registerFile(data);
  }).on('end', function() {
    renderFileList(files, userFiles);
  });
}


// This should be passed a data object from ORM
function registerFile(data) {
  var id = getId();
  var userFile = {
    id: id,
    name: data
  };

  trackStore.addReference(id, {
    id: id,
    key: data
  });
  userFiles.push(userFile);

  return data.name;
}

bootstrap();
var fileListComponent;
getActiveSequencer();
var sequencerPanelComponent = React.renderComponent(<sequencePanel sequencers={sequencers} />, document.querySelector('.sequence-contain'));
var controlsComponent = React.renderComponent(<controls />, document.querySelector('.control'));
var fileManagerComponenet = React.renderComponent(<fileManager />, document.querySelector('.fileManager'));

var myTabs = tabs(document.getElementById('sequence-panel'));

function renderFileList (files, userFiles) {
  fileListComponent = React.renderComponent(<filelist files={files} userFiles={userFiles} />, document.querySelector('.filelist'));
}

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

emitter.on('track:upload', function(ev) {
  orm.get(ev.key, function(err, data) {
    if (err) console.warn('couldn\'t get ' + ev.key + ' from indexedDB');

    var userFile = registerFile(ev.key);
    fileListComponent.setProps({userFiles: userFiles});
  });
})

emitter.on('track:remove', function (trackid) {
  alert('NOT IMPLEMENTED');
})

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
