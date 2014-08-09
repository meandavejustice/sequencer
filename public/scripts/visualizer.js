/** @jsx React.DOM */
var FFT = require('./fft');
var canvasEl = document.getElementById('fft');

module.exports = function(ctx, emitter) {
  return new FFT(ctx, { canvas: canvasEl /* type: "time" */ });
};