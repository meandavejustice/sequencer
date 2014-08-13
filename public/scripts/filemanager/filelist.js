/** @jsx React.DOM */
var React = require('react/addons');
var orm = require('../orm');
var trackStore = require('../trackStore');
var getId = require('../utils/getId');

var userFiles = [];
var files = [];

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

module.exports = function(emitter) {
  var DefaultList = React.createClass({
    getInitialState: function() {
      return {
        files: files
      };
    },
    getFiles: function() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/files');
      xhr.onloadend = function(ev) {
        var response = JSON.parse(ev.target.response);
        response.forEach(function(result) {
          result.id = getId();
          trackStore.addReference(result.id, result);
          files.push(result);
        });
        this.setState({files: files});
      }.bind(this);
      xhr.send();
    },
    componentDidMount: function() {
      this.getFiles();
    },
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
      return {
        files: files,
        userFiles: userFiles
      };
    },
    componentDidMount: function() {
      this.loadUserFiles();
      var cb = function() {
        this.setFiles();
      }.bind(this);

      emitter.on('track:upload', function(ev) {
        orm.get(ev.key, function(err, data) {
          if (err) console.warn('couldn\'t get ' + ev.key + ' from indexedDB');

          registerFile(ev.key);
          cb();
        });
      }, this);

      emitter.on('files:remove-all', function() {
        var cb = function() {
          this.loadUserFiles();
        }.bind(this);

        orm.removeAll(function() {
          cb();
        })
      }, this);
    },
    setFiles: function() {
      this.setState({files: files, userFiles: userFiles});
    },
    loadUserFiles: function() {
      userFiles = [];
      var cb = function() {
        this.setFiles();
      }.bind(this);

      orm.keyStream(cb)
        .on('data', function(data) {
          registerFile(data);
        }).on('end', function() {
          cb();
        })
    },
    showDefault: function() {
      this.refs.users.getDOMNode().style.display = 'none';
      this.refs.default.getDOMNode().style.display = 'block';
    },
    showUserFiles: function() {
      this.refs.default.getDOMNode().style.display = 'none';
      this.refs.users.getDOMNode().style.display = 'block';
    },
    render: function() {
      return (
          <div>
          <button onClick={this.showDefault}>Default Files</button>
          <button onClick={this.showUserFiles}>User Files</button>
          <DefaultList ref="default" listTitle={'default files'} files={this.state.files} />
          <DefaultList ref="users" listTitle={'users files'} files={this.state.userFiles} />
          </div>
      );
    }
  });

  return FileList;
};
