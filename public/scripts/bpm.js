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
  bpm = 1000 / (parseInt(ev.target.value,10) / 60); // 60000 / parseInt(ev.target.value, 10);
  clearInterval(beat);
  beat = setInterval(intervalFunc, bpm);
});

1000/(bpm/60))

/*
 * Original:  Derek Chilcote-Batto (dac-b@usa.net)
 * Web Site:  http://www.mixed.net
 * Rewritten by: Rich Reel all8.com
 */

// var count = 0;
// var msecsFirst = 0;
// var msecsPrevious = 0;

// function ResetCount()
//   {
//   count = 0;
//   document.TAP_DISPLAY.T_AVG.value = "";
//   document.TAP_DISPLAY.T_TAP.value = "";
//   document.TAP_DISPLAY.T_RESET.blur();
//   }

// function TapForBPM(e)
//   {
//   document.TAP_DISPLAY.T_WAIT.blur();
//   timeSeconds = new Date;
//   msecs = timeSeconds.getTime();
//   if ((msecs - msecsPrevious) > 1000 * document.TAP_DISPLAY.T_WAIT.value)
//     {
//     count = 0;
//     }

//   if (count == 0)
//     {
//     document.TAP_DISPLAY.T_AVG.value = "First Beat";
//     document.TAP_DISPLAY.T_TAP.value = "First Beat";
//     msecsFirst = msecs;
//     count = 1;
//     }
//   else
//     {
//     bpmAvg = 60000 * count / (msecs - msecsFirst);
//     document.TAP_DISPLAY.T_AVG.value = Math.round(bpmAvg * 100) / 100;
//     document.TAP_DISPLAY.T_WHOLE.value = Math.round(bpmAvg);
//     count++;
//     document.TAP_DISPLAY.T_TAP.value = count;
//     }
//   msecsPrevious = msecs;
//   return true;
//   }
// document.onkeypress = TapForBPM;
