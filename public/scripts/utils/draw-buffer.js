// audioContext.decodeAudioData( audioRequest.response,
//                               function(buffer) {
//                                 var canvas = document.getElementById("view1");
//                                 drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffer );
//                               } );


module.exports = function (module) {
  var ctx = module.canvas.getContext('2d');
  ctx.fillStyle = module.fillStyle || '#000000';
  ctx.strokeStyle = module.strokeStyle || '#000000';

  var height = module.canvas.height;
  var width = module.canvas.width;
  var data = module.data;

  var data = buffer.getChannelData( 0 );
  var step = Math.ceil( data.length / width );
  var amp = height / 2;
  for(var i=0; i < width; i++){
    var min = 1.0;
    var max = -1.0;
    for (var j=0; j<step; j++) {
      var datum = data[(i*step)+j];
      if (datum < min)
        min = datum;
      if (datum > max)
        max = datum;
    }
    ctx.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
  }
}
