/** @jsx React.DOM */
var React = require('react/addons');
var orm = require('./orm');

module.exports = function(emitter) {
  var DefaultList = React.createClass({
    onClick: function(ev) {
      emitter.emit('track:add', ev.target.attributes['data-id'].textContent);
    },
    render: function() {
      var addFile = function(file) {
        return <li onClick={this.onClick} data-id={file.id}>{file.name}</li>;
      };
      return <ul className={this.props.listTitle}>{this.props.files.map(addFile, this)}</ul>;

    }
  });

  var FileList = React.createClass({
    render: function() {
      return (
          <div>
          <DefaultList listTitle={'default'} files={this.props.files} />
          <DefaultList listTitle={'users'} files={this.props.userFiles} />
          </div>
      );
    }
  });

  return FileList;
}








// var html = require('./html');
// var hb = require('handlebars');
// var trackTmp = require("../templates/track.hbs");
// var trackStore = require('./trackStore');

// var sequencePanel = document.querySelector('.sequencer-panel');
// var defaultList = document.querySelector('.fileList .default');
// var userList = document.querySelector('.fileList .user');

// function addFile(id, data) {
//   if (typeof data === "string") {
//     data = {
//       name: data,
//       key: data
//     }
//   }
//   data.id = id;
//   trackReference[id] = data;

//   renderFile(data);
// }

// function onFileClicked(ev) {
//   var trackInfo = trackReference[ev.target.id];
//   var newTrackEvent = new CustomEvent("track:new", trackInfo);
//   sequencePanel.dispatchEvent(newTrackEvent);

//   ev.target.className = "added";
// }

// function renderFile(data) {
//   var trackEl = html(trackTmp(data))[0];

//   if (data.url) {
//     defaultList.appendChild(trackEl);
//   } else {
//     userList.appendChild(trackEl);
//   }

//   // trackEl = userList.querySelector('li[data-id="' + data.id + '"]');
//   // trackEl.addEventListener('click', onFileClicked, false);
// }

// function loadUserFiles() {
//   orm.keyStream().on('data', function(data) {
//     addFile(getId(), data);
//   })
// }

// function getTracklist() {
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', '/files');
//   xhr.onloadend = function(ev) {
//     var trackList = JSON.parse(ev.target.response);
//     trackList.forEach(function(trackObj) {
//       addFile(getId(), trackObj);
//     });
//   };
//   xhr.send();

//   loadUserFiles();
// }

// function init() {
//   getTracklist();
//   loadUserFiles();
// }

// module.exports = {
//   init: init,
//   addFile: addFile
// }
