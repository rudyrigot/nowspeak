/* CONTROLLERS: this is where business logic happens, and views are called */

var Controllers = {

  /* Initialization of all the various needed stuff */
  initApp : function() {

    /* Initializing the Speech Recognition API */
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
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
      $('#messages').html(interim.replace(/\n\n/g, "<br>").replace(/\n/g, "<br>"));
    }
    recognition.onerror = function(event) {
      Views.recordingError(event.error);
      currentlyRecording = false;
      Views.idleBottomBar();
    }
    recognition.onend = function() {
      currentlyRecording = false;
      Views.idleBottomBar();
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

      if (Helpers.getRoomName()) {
        Views.showRoom(Helpers.getRoomName());
      }
      else {
        Views.showWelcome();
      }

    });

  }

};