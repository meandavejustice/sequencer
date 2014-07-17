/** @jsx React.DOM */
var React = require('react/addons');
var getId = function() { return Math.random().toString(16).slice(2);};
var orm = require('./orm');
var trackStore = require('./trackStore');

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
    getInitialState: function() {
      return {files: [], userFiles: []};
    },

    componentDidMount: function() {
      var _this = this;
      var results = [];
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/files');
      xhr.onloadend = function(ev) {
        var response = JSON.parse(ev.target.response);
        response.forEach(function(result) {
          result.id = getId();
          results.push(result);
        });
        _this.setState({files: results});
      };
      xhr.send();
      orm.keyStream()
        .on('data', function(data) {
          _this.state.userFiles.concat([data])
        })
    },

    render: function() {
      return (
          <div>
          <DefaultList listTitle={'default'} files={this.state.files} />
          <DefaultList listTitle={'users'} files={this.state.userFiles} />
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