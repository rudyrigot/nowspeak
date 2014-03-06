/* HELPERS: recurrent non-contextual operations used across controllers and views */

var Helpers = {

  requirementsOk : function() {
    if (!('webkitSpeechRecognition' in window)) {
      alert(i18n.error_requirements_speech);
      return false;
    }
    return true;
  },

  /* Returning the name of the current conversation room */
  getRoomName : function() {
    return (window.location.hash ? window.location.hash.substring(1) : null);
  },

  isPrivateRoom : function(){
    var roomName = Helpers.getRoomName();
    return roomName.length == 36 && roomName.charAt(8) === '-' && roomName.charAt(13) === '-' && roomName.charAt(18) === '-' && roomName.charAt(23) === '-';
  },

  listenToSelfDisconnection : function() {
    setTimeout(function(){
      firebaseConnected.on('value', function(snap){
        if (!snap.val()) {
          $('body').html(_.template($('#disconnected').html()));
          setInterval(function(){
            location.reload();
          }, 5000);
        }
      });
    }, 10000); // waiting for the Firebase I/O to be up before starting to check on disconnections
  },

  getRandomColor : function(){
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  },

  /* stick to bottom, but only if we're 100 px from the bottom */
  maybeStickToBottom : function(){
    var actualOffset = $('#messages').scrollTop();
    if (actualOffset + document.getElementById('messages').offsetHeight - document.getElementById('messages').scrollHeight > -100) {
      Helpers.forceStickToBottom();
    }
  },

  /* send to bottom now, whatever happens */
  forceStickToBottom : function() {
    var actualOffset = document.getElementById('messages').scrollHeight - document.getElementById('messages').offsetHeight;
    $('#messages').scrollTop(actualOffset);
  },

  initSpeechRecognition : function() {

    if (recognition) return; // was already initialized

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
      Views.room_updateinterimmessage(interim.replace(/\n\n/g, "<br>").replace(/\n/g, "<br>"));
    }
    recognition.onerror = function(event) {
      Views.recordingError(event.error);
      currentlyRecording = false;
      Views.idleBottomBar();
    }
    recognition.onend = function() {
      currentlyRecording = false;
      Controllers.room_sendnewmessage();
    }

    $(function(){
      /* Binding the events to start/stop recording */
      if(keepSpacebarPressed) {
        $('.spacebar-listening')
        .on("keydown", function(e){
          if ((e.keyCode || e.which) == 32){ recognition.start(); }
        })
        .on("keyup", function(e){
          if ((e.keyCode || e.which) == 32){ recognition.stop(); }
        });
      }
      else {
        $('.spacebar-listening').on("keydown", function(e){
          if ((e.keyCode || e.which) == 32){
            if (!currentlyRecording) { recognition.start(); }
            else { recognition.stop(); }
          }
        });
      }
    });

  }

};
