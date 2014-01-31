/* Initializing Parse */
Parse.initialize(parseClientID, parseJavascriptKey);

var upgradeBrowser = function () {
  alert("It seems like your browser is not up-to-date to run NowSpeak");
}
var recordingError = function (error, message) {
  alert("Error while recording: "+error+" / "+message);
}

/* Initializing the Speech Recognition API */
if (!('webkitSpeechRecognition' in window)) {
  upgradeBrowser();
}
else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en";
  var currentlyRecording = false;

  recognition.onstart = function() {
    $('button').html('Stop');
    currentlyRecording = true;
  }
  recognition.onresult = function(event) {
    var interim = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      interim += event.results[i][0].transcript;
    }
    $('#results').html(interim.replace(/\n\n/g, "<br>").replace(/\n/g, "<br>"));
  }
  recognition.onerror = function(event) {
    recordingError(event.error, event.message);
    currentlyRecording = false;
  }
  recognition.onend = function() {
    $('button').html('Record');
    currentlyRecording = false;
  }

  /* Initializing the DOM to communicate with the Speech Recognition API */
  $(function(){
    $('button').click(function(){
      if (!currentlyRecording) {
        recognition.start();
      }
      else {
        recognition.stop();
      }
    });
  });

}

// var TestObject = Parse.Object.extend("TestObject");
// var testObject = new TestObject();
// testObject.save({foo: "bar"}, {
//   success: function(object) {
//     $(".success").show();
//   },
//   error: function(model, error) {
//     $(".error").show();
//   }
// });