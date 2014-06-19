var TrackSource = require('./tracksource.js');
var Grid = require('game-grid');
var context = new AudioContext();
var setup = false;
var tracks = {};
var butts = [];
var timeline = [];

for(var i = 0; i < 16; i++) {
    timeline.push(0);
}

(function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/files');
    xhr.onloadend = function(ev) {
        var trackList = JSON.parse(ev.target.response);
        trackList.forEach(function(trackObj) {
            addFile(trackObj);
        });
    };
    xhr.send();
})();

var canvas = document.getElementById("seq-table");

ggConfig = {
    size: 25,
    scale: 30,
    gridStyle: '#eee',
    borderStyle: "#000",
    __modelSize: 50
}

ggView = new Grid.GridView(canvas, {size: 25, scale: 30});

function ggListener (cell) {
    var modelCell = ggModel.getCell(cell.x, cell.y);
    debugger;
}


ggView.onCellClick(function(cell) {
    var modelCell = ggModel.getCell(cell.x, cell.y);
    debugger;
});

ggView.paintGrid();

ggRegen = function() {
    ggView = new Grid.GridView(document.getElementById("seq-table"), ggConfig);
    ggView.onCellClick = ggListener;
    ggView.paintGrid();
    ggModel = new Grid.GridModel(ggConfig.__modelSize);
}


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
    document.querySelector('.fileList').appendChild(trackEl);
}

function addNewTrack (trackObj) {
    var url = trackObj.url;
    var name = trackObj.name;
    var track = new TrackSource(context, {url: url});
    tracks[url] = track;
    var trackEl = document.createElement('li');
    trackEl.innerText = name;
    trackEl.setAttribute('data-id', url);
    trackEl.addEventListener('click', function(ev) {
        var url = ev.target.attributes['data-id'].textContent;
        tracks[url].play();
    }, false);
    document.querySelector('.tracks').appendChild(trackEl);
}

function makeMyDay () {
    for(var i = 0; i < timeline.length; i++) {
        var seq = document.querySelector('#sequence .topper');
        var butt = document.createElement('button');
        butt.setAttribute('data-id', i+1);
        butt.innerText = "butt: "+ (i+1);
        butt.addEventListener('click', function() {
            alert('skewer is REALLY working!');
        }, false);
        butt.addEventListener('deactivate', function() {
            if (this.className === "active") {
                this.className = '';
            }
        }, false);
        butts.push(butt);
        seq.appendChild(butt);
    }
    setup = true;
}

function updateActiveIndex(i, max) {
    var eventActive = new CustomEvent("deactivate", {"blah": true});
    if (i !=0) {
        butts[i-1].dispatchEvent(eventActive);
    } else {
        butts[max].dispatchEvent(eventActive);
    }
    butts[i].className = 'active';
}

var activeIndex = 0;

setInterval(function(){
    if (!setup) return;
    updateActiveIndex(activeIndex, 15);
    if (activeIndex < 15) {
        activeIndex++;
    } else {
        activeIndex = 0;
    }
}, 2000 / 16); // 120 bpm?

makeMyDay();

