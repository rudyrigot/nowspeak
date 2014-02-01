/* Initializing Parse */
Parse.initialize(parseClientID, parseJavascriptKey);

/* Checking if all that's required to boot is there */
var requirementsOk = function() {
  if (!('webkitSpeechRecognition' in window)) {
    alert(i18n.error_requirements_speech);
    return false;
  }
  return true;
}

/* Handles recording errors */
var recordingError = function (error) {
  /* checking if there's a "human" translation available for the error code */
  if (error in i18n.error_recording_by_code) {
    error = i18n.error_recording_by_code[error];
  }
  alert(i18n.error_recording+": "+error);
}

if (requirementsOk) {

  /* Initializing the Speech Recognition API */
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en";
  var currentlyRecording = false;

  recognition.onstart = function() {
    currentlyRecording = true;
    $('#bottom-bar').html(
      '<span class="recording"><span class="blink">&#9679;</span>&nbsp;&nbsp;'
      +i18n.bottombar_recording
      +'</span>');
  }
  recognition.onresult = function(event) {
    var interim = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      interim += event.results[i][0].transcript;
    }
    $('#results').html(interim.replace(/\n\n/g, "<br>").replace(/\n/g, "<br>"));
  }
  recognition.onerror = function(event) {
    recordingError(event.error);
    currentlyRecording = false;
    $('#bottom-bar').html(keepSpacebarPressed ? i18n.bottombar_hold_space : i18n.bottombar_hit_space);
  }
  recognition.onend = function() {
    currentlyRecording = false;
    $('#bottom-bar').html(keepSpacebarPressed ? i18n.bottombar_hold_space : i18n.bottombar_hit_space);
  }

  $(function(){

    /* Binding the events to start/stop recording */
    if(keepSpacebarPressed) {
      $('#spacebar-listening')
      .on("keydown", function(e){
        if ((e.keyCode || e.which) == 32){ recognition.start(); }
      })
      .on("keyup", function(e){
        if ((e.keyCode || e.which) == 32){ recognition.stop(); }
      });
    }
    else {
      $('#spacebar-listening').on("keydown", function(e){
        if ((e.keyCode || e.which) == 32){
          if (!currentlyRecording) { recognition.start(); }
          else { recognition.stop(); }
        }
      });
    }

    /* Setting the bits of interface in place */
    $('#bottom-bar').html(keepSpacebarPressed ? i18n.bottombar_hold_space : i18n.bottombar_hit_space);
    $('#comment-icon').html(i18n.comment_invite);

    /* And setting the focus, for the glory to happen */
    $('#spacebar-listening').focus();

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