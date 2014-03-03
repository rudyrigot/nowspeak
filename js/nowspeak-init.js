/* INIT: set all the global variables, and routes to the right controller */

/* Firebase initialization */
var firebaseRootRef = new Firebase(firebaseEndpoint);

/* The reference */
var currentRoomRef;

/* The current userID */
var userID;

/* Keeping the recognition engine in a global variable somewhere */
var recognition;

/* Routing to initiate the app to the right controller */
$(function(){
	if (Helpers.requirementsOk()) {
		if (!Helpers.getRoomName()) Controllers.welcome();
		else if (Helpers.isPrivateRoom()) Controllers.joinPrivateRoom(Helpers.getRoomName());
		else Controllers.room(Helpers.getRoomName());
	}
});
