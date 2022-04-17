// SPEECH SYNTHESIS SETUP
var voicesReady = false;
window.speechSynthesis.onvoiceschanged = function () {
  voicesReady = true;
  // Uncomment to see a list of voices
  //console.log("Choose a voice:\n" + window.speechSynthesis.getVoices().map(function(v,i) { return i + ": " + v.name; }).join("\n"));
};

var generateSpeech = function (message, callback) {
  if (voicesReady) {
    var msg = new SpeechSynthesisUtterance();
    msg.voice = window.speechSynthesis.getVoices()[VOICEINDEX];
    msg.text = message;
    msg.rate = 0.2;
    if (typeof callback !== "undefined") msg.onend = callback;
    speechSynthesis.speak(msg);
  }
};

function arrayRemoveItem(array, item) {
  var index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
}

function withinBoundingBox(position, xRange, yRange) {
  withinX = xRange[0] <= position[0] && position[0] <= xRange[1];
  withinY = yRange[0] <= position[1] && position[1] <= yRange[1];
  return withinX && withinY;
}

// make the program sleep for ms number of milliseconds
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var getRandomPhrase = function (phrases) {
  return phrases[Math.floor(Math.random() * phrases.length)];
};

// nextTurn()
//    Moves the game state to the next turn after TURNDELAY ms
var nextTurn = function () {
  setTimeout(gameState.nextTurn, TURNDELAY);
};

var vectorAdd = function (v1, v2) {
  return v1.map(function (x, i) {
    return x + v2[i];
  })
};

var vectorSub = function (v1, v2) {
  return v1.map(function (x, i) {
    return x - v2[i];
  })
};