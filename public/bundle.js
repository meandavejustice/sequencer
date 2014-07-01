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
var TrackSource = require('./tracksource.js');
var context = require('./audioContext.js')();
var setup = false;
var tracks = {};
var butts = [];
var sequence = {};

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
    var url = trackObj.url;
    var name = trackObj.name;
    var trackEl = document.createElement('li');
    trackEl.innerText = name;
    trackEl.setAttribute('data-id', url);
    trackEl.addEventListener('click', function(ev) {
        if (!ev.target.className) {
            ev.target.className = "added";
            addNewTrack({
                name: ev.target.innerText,
                url: ev.target.attributes['data-id'].textContent
            });
        } else {
            ev.target.className = "";
            removeTrack(null, url);
        }
    }, false);
    document.querySelector('.fileList ul').appendChild(trackEl);
}

function getInputArray(index) {
  var selector = '#sequence tbody tr:nth-child('+ index + ') td:not(.track)';
  var tds = Array.prototype.slice.call(document.querySelectorAll(selector), 0);
  return tds.map(function(td) {
           return td.classList.contains('on');
  });
}

var trackIndex = 1;
var trackMap = {};

function addNewTrack (trackObj) {
  var url = trackObj.url;
  var name = trackObj.name;
  var track = new TrackSource(context, {url: url});
  trackMap[trackIndex] = url;
  tracks[url] = track;
  sequence[url] = getInputArray(trackIndex + 1);
  var row = document.createElement('tr');
  var trackEl = document.createElement('td');
  trackEl.innerText = name;
  trackEl.classList.add('track');
  trackEl.setAttribute('data-id', url);
  trackEl.addEventListener('click', function(ev) {
    var url = ev.target.attributes['data-id'].textContent;
    tracks[url].play();
  }, false);
  var tds = getTds(trackIndex);
  row.appendChild(trackEl);
  for(var i = 0; i < tds.length; i++) {
    row.appendChild(tds[i]);
  }
  document.querySelector('tbody').appendChild(row);
  trackIndex++;
}

function getTds(trackIndex) {
  var tds = [];

  for(var i = 0; i < 16; i++) {
    var td = document.createElement('td');
    var dataGrid = trackIndex + '-' + (i+1);
    td.setAttribute('data-grid', dataGrid);

    td.addEventListener('click', function(ev) {
      var el = ev.target;
      var grid = el.attributes['data-grid'].textContent;
      var index = grid.indexOf('-');
      trackIndex = parseInt(grid.substring(0, index), 10);
      index = parseInt(grid.substring(index + 1), 10);
      var trackUrl = trackMap[trackIndex];
      if (el.classList.contains('on')) {
        el.classList.remove('on');
        sequence[trackUrl][index] = false;
      } else {
        el.classList.add('on');
        sequence[trackUrl][index] = true;
      }
    })
    tds.push(td);
  }
  return tds;
}

function makeMyDay () {
    for(var i = 0; i < 17; i++) {
        var seq = document.querySelector('#sequence thead tr');
        var butt = document.createElement('th');
      if (i === 0) {
        butt.innerText = 'Tracklist';
      } else {
        butt.innerText = i;
        butt.setAttribute('data-id', i);
        butt.addEventListener('click', function() {
          alert('skewer is REALLY working!');
        }, false);
        butt.addEventListener('deactivate', function() {
          if (this.className === "active") {
            this.className = '';
          }
        }, false);
        butts.push(butt);
      }
        seq.appendChild(butt);
    }
    setup = true;
}

function updateActiveIndex(i, max) {
    var eventActive = new CustomEvent("deactivate", {"blah": true});
    if (i !== 0) {
      butts[i - 1].dispatchEvent(eventActive);
    } else {
      butts[max - 1].dispatchEvent(eventActive);
    }
  butts[i].className = 'active';

  var keys = Object.keys(sequence);
  keys.forEach(function(key) {
    if (sequence[key][i + 1]) {
      tracks[key].play();
    }
  })
}

var activeIndex = 0;

function intervalFunc() {
  if (!setup) return;
  updateActiveIndex(activeIndex, 16);
  if (activeIndex < 15) {
    activeIndex++;
  } else {
    activeIndex = 0;
  }
}

var bpm = 60000/180;
var beat;

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
  bpm = 60000 / parseInt(ev.target.value, 10);
  clearInterval(beat);
  beat = setInterval(intervalFunc, bpm);
})


makeMyDay();

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