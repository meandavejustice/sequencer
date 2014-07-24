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
    renderFileList();
  };
  xhr.send();
  orm.keyStream()
  .on('data', function(data) {
    var id = getId();
    trackStore.addReference(id, {
      id: id,
      key: data
    });
    userFiles.push({
      id: id,
      name: data
    });
  }).on('end', renderFileList);
}

bootstrap();

React.renderComponent(<sequencer tracks={tracks} />, document.querySelector('.sequence-panel'));
React.renderComponent(<controls />, document.querySelector('.control'));

function renderFileList () {
  React.renderComponent(<filelist files={files} userFiles={userFiles} />, document.querySelector('.filelist'));
}

function addTrack(track) {
  tracks.push(track);
  React.renderComponent(<sequencer tracks={tracks} title={"Demo"} />, document.querySelector('.sequence-panel'));
}

emitter.on('track:add', function (trackid) {
  var track = trackStore.getReference(trackid);
  if (!track.url) {
    genURL(track.key, function(err, url) {
      if (err) console.log('err getting track =>', track.key, ' from local store');
      var trackObj = new TrackSource(context, {url: url});
      debugger;
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

  placeholder.style.display = 'none';
});
