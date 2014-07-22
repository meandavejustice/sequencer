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
          <DefaultList ref="default" listTitle={'default files'} files={this.props.files} />
          <DefaultList ref="users" listTitle={'users files'} files={this.props.userFiles} />
          </div>
      );
    }
  });

  return FileList;
};
