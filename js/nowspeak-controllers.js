/* CONTROLLERS: this is where business logic happens, and views are called */

var Controllers = {

  /* Initialization of all the various needed stuff */
  welcome : function() {
    Views.welcome();
  },

  room : function(roomName){
    Helpers.initSpeechRecognition();
    currentRoomRef = Room.update(roomName);
    Views.room(roomName);
  },

  newPrivateRoom : function(){
    Helpers.initSpeechRecognition();
    var roomName = uuid.v1();
    currentRoomRef = PrivateRoom.create(roomName);
    Views.room(roomName);
  },

  joinPrivateRoom : function(roomName) {
    Helpers.initSpeechRecognition();
    currentRoomRef = PrivateRoom.update(roomName);
    Views.room(roomName);
  }

};