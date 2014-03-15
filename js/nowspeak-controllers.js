/* CONTROLLERS: this is where business logic happens, and views are called */

var Controllers = {

  /* Getting the welcome screen in place */
  welcome : function() {
    Views.welcome(); // just a view to set up
  },

  /* From the roomName, getting the public room in place */
  room : function(roomName){
    Helpers.temporarilyPauseWarnings(); // pauses for warnings for 3 seconds, so that the room has time to load without firing the warning
    Helpers.initSpeechRecognition(); // initializing the speech recognition
    currentRoomRef = Room.update(roomName); // retrieving (or creating) the current room in the data store
    Views.room(roomName); // setting up the view for this room
    Message.listen(); // making sure the message list is up to date
    User.create(); // creating the current user
    User.listen(); // making sure the user list is up to date
    Helpers.listenToSelfDisconnection(); // making sure the app gets notified if this user disconnects
  },

  /* Sending the interim message (currently being composed) as a new message */
  room_sendnewmessage : function() {
    Message.create($('#temporary-message').html()); // sending it
    Views.room_reinitinterimmessage(); // cleaning the interim area
    Views.maybeDisplayWarning(); // if not shown before, display right-column warning now
    Views.idleBottomBar(); // reinit the bottom bar
  },

  /* Create a new private room from scratch */
  newPrivateRoom : function(){
    Helpers.temporarilyPauseWarnings(); // pauses for warnings for 3 seconds, so that the room has time to load without firing the warning
    Helpers.initSpeechRecognition(); // initializing the speech recognition
    var roomName = uuid.v1(); // generating a unique identifier
    currentRoomRef = PrivateRoom.create(roomName); // creating the current room in the data store
    Views.room(roomName); // setting up the view for this room
    Message.listen(); // making sure the message list is up to date
    User.create(); // creating the current user
    User.listen(); // making sure the user list is up to date
    Helpers.listenToSelfDisconnection(); // making sure the app gets notified if this user disconnects
  },

  /* Join an existing private room from its name */
  joinPrivateRoom : function(roomName) {
    Helpers.temporarilyPauseWarnings(); // pauses for warnings for 3 seconds, so that the room has time to load without firing the warning
    Helpers.initSpeechRecognition(); // initializing the speech recognition
    currentRoomRef = PrivateRoom.update(roomName); // retrieving the current room in the data store
    Views.room(roomName); // setting up the view for this room
    Message.listen(); // making sure the message list is up to date
    User.create(); // creating the current user
    User.listen(); // making sure the user list is up to date
    Helpers.listenToSelfDisconnection(); // making sure the app gets notified if this user disconnects
  }

};
