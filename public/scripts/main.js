/** @jsx React.DOM */
var React = require('react/addons');
var Emitter = require('tiny-emitter');
var trackStore = require('./trackStore');
var TrackSource = require('./tracksource');
var orm = require('./orm');
var context = require('./audioContext')();
var genURL = require('./urlGen');
var placeholder = document.querySelector('.welcome');

var getId = function() { return Math.random().toString(16).slice(2);};

var gainNode = context.createGain();
var fft = require('./visualizer');
var emitter = new Emitter();
var tracks = [];

var files = [];
var userFiles = [];

var filelist = require('./filelist')(emitter);
var sequencer = require('./sequencer')(emitter);
var controls = require('./controls/controls')(emitter);

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

  return userFile;
}

bootstrap();

React.renderComponent(<sequencer tracks={tracks} />, document.querySelector('.sequence-panel'));
React.renderComponent(<controls />, document.querySelector('.control'));

function renderFileList (files, userFiles) {
  debugger;
  React.renderComponent(<filelist files={files} userFiles={userFiles} />, document.querySelector('.filelist'));
}

function addTrack(track) {
  tracks.push(track);
  React.renderComponent(<sequencer tracks={tracks} title={"Demo"} />, document.querySelector('.sequence-panel'));
}

emitter.on('track:upload', function(ev, track) {
  orm.get(track.key, function(err, data) {
    if (err) console.warn('couldn\'t get ' + track.key + ' from indexedDB');

    var userFile = registerFile(data);
    renderFileList([], [userFile]);
  });
})

function updateGainNodeConnection() {
  gainNode.disconnect(context.destination);
  updateTrackConnection(function(source) {
    source.connect(gainNode);
  });
  gainNode.connect(fft.input);
  gainNode.connect(context.destination);
}

function updateTrackConnection(cb) {
  var keys = trackStore.keys();
  keys.forEach(function(key) {
    var source = trackStore.get(key);
    source.getSource(function(source) {
      cb(source);
    })
  });
}

emitter.on('track:add', function (trackid) {
  var track = trackStore.getReference(trackid);
  if (!track.url) {
    genURL(track.key, function(err, url) {
      if (err) console.log('err getting track =>', track.key, ' from local store');
      var trackObj = new TrackSource(context, {url: url});
      trackStore.add(trackid, trackObj);

      // fix dis shit;
      track.name = track.key;
      addTrack(track);
    });
  } else {
    var trackObj = new TrackSource(context, {url: track.url});
    trackStore.add(trackid, trackObj);
    addTrack(track);
  }

  updateGainNodeConnection();
  placeholder.style.display = 'none';
});
