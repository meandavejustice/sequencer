(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function () {
  var context;

  if (typeof AudioContext !== "undefined") {
    context = new AudioContext();
  } else if (typeof webkitAudioContext !== "undefined") {
    context = new webkitAudioContext();
  } else {
    throw new Error('AudioContext not supported. :(');
  }

  return context;
};

},{}],2:[function(require,module,exports){
var uploader = document.querySelector('.upload');
var sequenceBody = document.querySelector('tbody');
var stepElements = Array.prototype.slice.call(document.querySelectorAll('.step'), 0);
var TrackSource = require('./tracksource.js');
var context = require('./audioContext.js')();
var tracks = {}; // track audio object store
var activeIndex = 0; // out of 16
var bpm = 1000 / (180 / 60); // 60000/180;
var beat; // interval
var crate = {};

var getId = function() { return Math.random().toString(16).slice(2);};

stepElements.forEach(function(el) {
  el.addEventListener('deactivate', function() {
    this.classList.remove('active');
  });
});

var step; // int


uploader.addEventListener('change', function(ev) {
  debugger;
})


function getTracklist() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/files');
  xhr.onloadend = function(ev) {
    var trackList = JSON.parse(ev.target.response);
    trackList.forEach(function(trackObj) {
      addFile(trackObj);
    });
  };
  xhr.send();
}

getTracklist();

// fix dis shitd
function removeTrack(ev, url) {
    if (ev) {
        ev.target.remove();
    } else {
        document.querySelector('.tracks *[data-id="'+ url + '"]').remove();
    }

    tracks[url].disconnect();
    tracks[url] = '';
}

function addFile(trackObj) {
  var id = getId();
  var url = trackObj.url;
  var name = trackObj.name;
  var trackEl = document.createElement('li');
  trackEl.innerText = name;
  trackEl.setAttribute('data-id', id);
  trackEl.setAttribute('data-url', url);
  trackEl.addEventListener('click', function(ev) {
    if (!ev.target.className) {
      ev.target.className = "added";
      addNewTrack({
        name: ev.target.innerText,
        url: ev.target.attributes['data-url'].textContent,
        id: ev.target.attributes['data-id'].textContent
      });
    } else {
      ev.target.className = "";
      removeTrack(null, url);
    }
  }, false);
  document.querySelector('.fileList ul').appendChild(trackEl);
}

function getInputArray(id) {
  var selector = '#sequence tbody tr:nth-child('+ index + ') td:not(.track)';
  var tds = Array.prototype.slice.call(document.querySelectorAll(selector), 0);
  return tds.map(function(td) {
           return td.classList.contains('on');
  });
}

function addNewTrack (trackObj) {
  var url = trackObj.url;
  var name = trackObj.name;
  var id = trackObj.id;
  tracks[url] = new TrackSource(context, {url: url});
  crate[id] = {
    track: {
      url: url,
      name: name
    },
    sequence: []
  };

  var row = document.createElement('tr');
  var trackEl = document.createElement('td');
  trackEl.innerText = name;
  trackEl.classList.add('track');
  trackEl.setAttribute('data-id', id);
  trackEl.addEventListener('click', function(ev) {
    var id = ev.target.attributes['data-id'].textContent;
    var url = crate[id].track.url;
    tracks[url].play();
  }, false);

  var tds = getTds(id);
  row.appendChild(trackEl);
  for(var i = 0; i < tds.length; i++) {
    row.appendChild(tds[i]);
  }
  sequenceBody.appendChild(row);
}

function getTds(id) {
  var tds = [];

  for(var i = 0; i < 16; i++) {
    var td = document.createElement('td');
    td.setAttribute('data-grid', i + 1);
    td.setAttribute('data-id', id);

    td.addEventListener('mousedown', function(ev) {
      var el = ev.target;
      var grid = el.attributes['data-grid'].textContent;
      var id = el.attributes['data-id'].textContent;
      var index = parseInt(grid, 10);
      var trackUrl = crate[id].sequence;
      if (el.classList.contains('on')) {
        el.classList.remove('on');
        crate[id].sequence[index] = false;
      } else {
        el.classList.add('on');
        crate[id].sequence[index] = true;
      }
    })
    tds.push(td);
  }
  return tds;
}

function updateActiveIndex(i, max) {
  var eventActive = new CustomEvent("deactivate", {});
  if (i !== 0) {
    stepElements[i - 1].dispatchEvent(eventActive);
  } else {
    stepElements[max - 1].dispatchEvent(eventActive);
  }
  stepElements[i].classList.add('active');

  var keys = Object.keys(crate);
  keys.forEach(function(key) {
    if (crate[key].sequence[i + 1]) {
      var url = crate[key].track.url;
      tracks[url].play();
    }
  });
}

function intervalFunc() {
  updateActiveIndex(activeIndex, 16);
  if (activeIndex < 15) {
    activeIndex++;
  } else {
    activeIndex = 0;
  }
}

var playButton = document.getElementById('play');
playButton.addEventListener('click', function(ev) {
  if (playButton.classList.contains('on')) {
    activeIndex = 0;
    clearInterval(beat);
    playButton.classList.remove('on');
    playButton.innerText = "PLAY"
  } else {
    beat = setInterval(intervalFunc, bpm);
    playButton.classList.add('on');
    playButton.innerText = "PAUSE"
  }
})

document.getElementById('bpm').addEventListener('change', function(ev) {
  bpm = 1000 / (parseInt(ev.target.value,10) / 60); // 60000 / parseInt(ev.target.value, 10);
  clearInterval(beat);
  beat = setInterval(intervalFunc, bpm);
})

},{"./audioContext.js":1,"./tracksource.js":3}],3:[function(require,module,exports){
/*
 * TrackSource
 *
 * * MUST pass an audio context
 *
 */
function TrackSource (context, opts) {
    if (!context) {
        throw new Error('You must pass an audio context to use this module');
    }

    this.context = context;
    this.url = opts.url ? opts.url : undefined;
}

TrackSource.prototype = {
    needBuffer: function() {
        return this.buffer === undefined;
    },

    loadSound: function(url, cb) {
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = 'arraybuffer';
        var self = this;
        req.onloadend = function() {
            self.decode.call(self, req.response, cb);
        };
        req.send();
    },
    onLoaded: function(source, silent) {
        this.buffer = source;
        this.disconnect();
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.context.destination);
        if (!silent) this.playSound();
    },
    disconnect: function() {
        if (this.source) {
            this.source.disconnect(this.context.destination);
        }
    },
    playSound: function() {
        this.source.start(this.context.currentTime);
    },
    loadSilent: function() {
        if (!this.needBuffer()) return;
        var self = this;
        this.loadSound(this.url, function(data) {
            self.onLoaded.call(self, data, true);
        });
    },
    play: function() {
        if (this.needBuffer()) {
            var self = this;
            this.loadSound(this.url, function(data) {
                self.onLoaded.call(self, data);
            });
        } else {
            this.onLoaded(this.buffer);
        }       
    },
    stop: function() {
        this.source.stop(this.context.currentTime);
    },
    decode: function(data, success, error) {
        this.context.decodeAudioData(data, success, error);
    }  
};

module.exports = TrackSource;

},{}]},{},[2])