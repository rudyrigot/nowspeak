/* INIT: set all the global variables, and routes to the right controller */

/* Firebase initialization */
var firebaseRootRef = new Firebase(firebaseEndpoint);
var firebaseConnected = new Firebase(firebaseEndpoint+'.info/connected');

/* The Firebase reference that represents the current room */
var currentRoomRef;

/* The current user, and their specifics */
var userID;
var userAlias;
var userColor;
var userMessageIDs = []; // an array of their messages, in order to update the user's alias easily on all of them.

/* Keeping the recognition engine in a global variable somewhere */
var recognition;

/* Was the warning displayed already? (display it at least 3 seconds after the app was started) */
var wasDisplayedWarning = true;
setTimeout(function(){ wasDisplayedWarning=false; }, 3000);

/* Redirecting to HTTPS if need be */
if (mustRedirectToHttps()) { window.location = window.location.href.replace('http://', 'https://'); }

/* AND NOW, LET'S KICKSTART THE APP ITSELF! */
/* Depending on the situation, routing to initiate the app to the right controller */
$(function(){
	if (Helpers.requirementsOk()) {
		if (!Helpers.getRoomName()) Controllers.welcome();
		else if (Helpers.isPrivateRoom()) Controllers.joinPrivateRoom(Helpers.getRoomName());
		else Controllers.room(Helpers.getRoomName());
	}
});
