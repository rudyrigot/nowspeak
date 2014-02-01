/* Initializing Parse */
Parse.initialize(parseClientID, parseJavascriptKey);

var requirementsOk = function() {
  if (!('webkitSpeechRecognition' in window)) {
    alert(i18n.error_requirements_speech);
    return false;
  }
  return true;
}
var recordingError = function (error, message) {
  alert("Error while recording: "+error+" / "+message);
}

if (requirementsOk) {

  /* Initializing the Speech Recognition API */
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

  $(function(){

    /* Initializing the DOM to communicate with the Speech Recognition API */
    $('button').click(function(){
      if (!currentlyRecording) {
        recognition.start();
      }
      else {
        recognition.stop();
      }
    });

    /* Setting the bits of interface in place */
    $('#bottom-bar').html(i18n.bottom_bar_hold_space);
    $('#comment-icon').html(i18n.comment_invite);

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