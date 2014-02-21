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
  }

};