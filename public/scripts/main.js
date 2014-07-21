/** @jsx React.DOM */
var React = require('react/addons');
var Emitter = require('tiny-emitter');
var trackStore = require('./trackStore');
var TrackSource = require('./tracksource');
var orm = require('./orm');
var context = require('./audioContext')();
var genURL = require('./urlGen');

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
});







// var orm = require('./upload');
// var uploader = document.querySelector('.upload');
// var sequenceBody = document.querySelector('tbody');
// var stepElements = Array.prototype.slice.call(document.querySelectorAll('.step'), 0);
// var TrackSource = require('./tracksource.js');
// var context = require('./audioContext.js')();
// var tracks = {}; // track audio object store
// var activeIndex = 0; // out of 16
// var bpm = 1000 / (180 / 60); // 60000/180;
// var beat; // interval
// var crate = {};

// var getId = function() { return Math.random().toString(16).slice(2);};

// stepElements.forEach(function(el) {
//   el.addEventListener('deactivate', function() {
//     this.classList.remove('active');
//   });
// });

// var step; // int

// uploader.addEventListener('change', function(ev) {
//   var file = ev.target.files[0];
//   debugger;
//   var reader = new FileReader();
//   reader.onloadend = function(buf) {
//     var mahKeys = [];
//     orm.put(file.name, {buffer: buf.target.result}, function(err) {
//       if (!err) console.log('PUT! ', file);
//       orm.keyStream().on('data', function(data) {
//         var li = document.createElement('li');
//         mahKeys.push(data.toString());
//         li.textContent = data.toString();
//         // userFiles.appendChild(li);
//       }).on('end', function() {
//         orm.get(mahKeys[0], function(err, data) {
//           var obj = JSON.parse(data).buffer;
//           debugger;
//           var blob = new Blob(obj, {type: "audio/mp3"});
//           var urly = URL.createObjectUrl(blob);
//           var tracky = new TrackSource(context, {url: urly});
//           tracky.play();
//         })
//       });
//     });
//   }
//   reader.readAsArrayBuffer(file);
//   // var url = URL.createObjectURL(ev.target.files[0]);
// })

// // fix dis shitd
// function removeTrack(ev, url) {
//     if (ev) {
//         ev.target.remove();
//     } else {
//         document.querySelector('.tracks *[data-id="'+ url + '"]').remove();
//     }

//     tracks[url].disconnect();
//     tracks[url] = '';
// }

// function getInputArray(id) {
//   var selector = '#sequence tbody tr:nth-child('+ index + ') td:not(.track)';
//   var tds = Array.prototype.slice.call(document.querySelectorAll(selector), 0);
//   return tds.map(function(td) {
//            return td.classList.contains('on');
//   });
// }

// function addNewTrack (trackObj) {
//   var url = trackObj.url;
//   var name = trackObj.name;
//   var id = trackObj.id;
//   tracks[url] = new TrackSource(context, {url: url});
//   crate[id] = {
//     track: {
//       url: url,
//       name: name
//     },
//     sequence: []
//   };

//   var row = document.createElement('tr');
//   var trackEl = document.createElement('td');
//   trackEl.innerText = name;
//   trackEl.classList.add('track');
//   trackEl.setAttribute('data-id', id);
//   trackEl.addEventListener('click', function(ev) {
//     var id = ev.target.attributes['data-id'].textContent;
//     var url = crate[id].track.url;
//     tracks[url].play();
//   }, false);

//   var tds = getTds(id);
//   row.appendChild(trackEl);
//   for(var i = 0; i < tds.length; i++) {
//     row.appendChild(tds[i]);
//   }
//   sequenceBody.appendChild(row);
// }

// function getTds(id) {
//   var tds = [];

//   for(var i = 0; i < 16; i++) {
//     var td = document.createElement('td');
//     td.setAttribute('data-grid', i + 1);
//     td.setAttribute('data-id', id);

//     td.addEventListener('mousedown', function(ev) {
//       var el = ev.target;
//       var grid = el.attributes['data-grid'].textContent;
//       var id = el.attributes['data-id'].textContent;
//       var index = parseInt(grid, 10);
//       var trackUrl = crate[id].sequence;
//       if (el.classList.contains('on')) {
//         el.classList.remove('on');
//         crate[id].sequence[index] = false;
//       } else {
//         el.classList.add('on');
//         crate[id].sequence[index] = true;
//       }
//     })
//     tds.push(td);
//   }
//   return tds;
// }

// function updateActiveIndex(i, max) {
//   var eventActive = new CustomEvent("deactivate", {});
//   if (i !== 0) {
//     stepElements[i - 1].dispatchEvent(eventActive);
//   } else {
//     stepElements[max - 1].dispatchEvent(eventActive);
//   }
//   stepElements[i].classList.add('active');

//   var keys = Object.keys(crate);
//   keys.forEach(function(key) {
//     if (crate[key].sequence[i + 1]) {
//       var url = crate[key].track.url;
//       tracks[url].play();
//     }
//   });
// }

// function intervalFunc() {
//   updateActiveIndex(activeIndex, 16);
//   if (activeIndex < 15) {
//     activeIndex++;
//   } else {
//     activeIndex = 0;
//   }
// }

// var playButton = document.getElementById('play');
// playButton.addEventListener('click', function(ev) {
//   if (playButton.classList.contains('on')) {
//     activeIndex = 0;
//     clearInterval(beat);
//     playButton.classList.remove('on');
//     playButton.innerText = "PLAY"
//   } else {
//     beat = setInterval(intervalFunc, bpm);
//     playButton.classList.add('on');
//     playButton.innerText = "PAUSE"
//   }
// })

// document.getElementById('bpm').addEventListener('change', function(ev) {
//   bpm = 1000 / (parseInt(ev.target.value,10) / 60); // 60000 / parseInt(ev.target.value, 10);
//   clearInterval(beat);
//   beat = setInterval(intervalFunc, bpm);
// })
