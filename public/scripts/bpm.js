var playButton = document.getElementById('play');
var bpmEl = document.getElementById('bpm');
var bpm = 60000/180;
var beat;



playButton.addEventListener('click', function(ev) {
  if (playButton.classList.contains('on')) {
//    activeIndex = 0;
    clearInterval(beat);
    playButton.classList.remove('on');
    playButton.innerText = "PLAY"
  } else {
    beat = setInterval(intervalFunc, bpm);
    playButton.classList.add('on');
    playButton.innerText = "PAUSE"
  }
});

bpmEl.addEventListener('change', function(ev) {
  bpm = 60000 / parseInt(ev.target.value, 10);
  clearInterval(beat);
  beat = setInterval(intervalFunc, bpm);
});
