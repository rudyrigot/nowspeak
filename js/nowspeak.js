/* Firebase initialization */
var firebaseRootRef = new Firebase(firebaseEndpoint);

var currentRoomRef;

/* Keeping the recognition engine in a global variable somewhere */
var recognition;

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

/* Returning the name of the current conversation room */
var getRoomName = function() {
  return (window.location.hash ? window.location.hash.substring(1) : null);
}

/* Allows to get the bottom bar back to its default message */
var idleBottomBar = function(){
  $('#bottom-bar').html((keepSpacebarPressed ? i18n.bottombar_hold_space : i18n.bottombar_hit_space)+ " ("+recognition.lang+")");
}

/* Initialization of a room */
var showRoom = function(roomID) {
  /* Changing the URL */
  window.location = '#'+roomID;

  /* Setting the bits of interface in place */
  idleBottomBar();
  $('#comment-icon').html(i18n.comment_invite);
  $('aside').html(_.template($('#users-template').html(), {}));

  /* And setting the focus, for the glory to happen */
  $('#spacebar-listening').focus();
}

/* The welcome aside */
var showWelcome = function(){
  $('aside').html(_.template($('#welcome-template').html(), {}));
  $('#newprivatebutton').click(function(e){
    var roomName = uuid.v1();
    firebaseRootRef.child('PrivateRooms').child(roomName).set({'name' : roomName, 'created' : new Date().getTime() });
    showRoom(roomName);
    e.preventDefault();
  });
  $('#newpublicbutton').click(function(e){
    $(this).addClass("active");
    $('#newpublicform').slideDown('fast');
    $('#seepublicbutton').removeClass('active');
    $('#seepubliclist').slideUp('fast');
    e.preventDefault();
  });
  $('#newpublicform').submit(function(e){
    var roomName = getSlug($('#newpublicinput').val());
    currentRoomRef = Room.update(roomName);
    showRoom(roomName);
    e.preventDefault();
  });
  $('#seepublicbutton').click(function(e){
    if (!$(this).hasClass("already-listening")) {
      firebaseRootRef.child('Rooms').on('child_added', function(snapshot){
        var roomName = snapshot.val().name;
        $('#seepubliclist').append('<li><a href="javascript:currentRoomRef=Room.update(\''+roomName+'\'); showRoom(\''+roomName+'\')">'+roomName+'</a> <span class="ago">('+moment(snapshot.val().latest).fromNow()+')</spam> <span>→</span></li>')
      })
    }
    $(this).addClass("already-listening");
    $(this).addClass("active");
    $('#seepubliclist').slideDown('fast');
    $('#newpublicbutton').removeClass('active');
    $('#newpublicform').slideUp('fast');
    e.preventDefault();
  });
}

/* Initialization of all the various needed stuff */
var initApp = function() {

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
    recordingError(event.error);
    currentlyRecording = false;
    idleBottomBar();
  }
  recognition.onend = function() {
    currentlyRecording = false;
    idleBottomBar();
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

    if (getRoomName()) {
      showRoom(getRoomName());
    }
    else {
      showWelcome();
    }

  });

}

if (requirementsOk()) initApp();