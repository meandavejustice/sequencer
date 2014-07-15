var path = require('path');
var ls = require('ls-stream');

module.exports = [
  {
    method: 'GET', path: '/{path*}',
    handler: {
      directory: {
        path: './public',
        listing: false,
        index: true
      }
    }
  },
  {
    method: 'GET',
    path: '/files',
    handler: getFiles
  }
];

function parsePath(fullPath) {
  var fileName = path.basename(fullPath);
  var index = fullPath.indexOf('/public/') + 8;
  var url = fullPath.substr(index);
  return {
    name: fileName,
    url: url
  };
}

function getFiles (req, reply) {
  var response = [];
  var lsPath = path.resolve(__dirname, '../public/sounds/');
  ls(lsPath)
    .on('data', function(data) {
      var file = parsePath(data.path);
      response.push(file);
    })
    .on('end', function() {
      reply(response);
    });
}
