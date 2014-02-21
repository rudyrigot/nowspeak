/* INIT: set all the global variables, and launches the entry controller */

/* Firebase initialization */
var firebaseRootRef = new Firebase(firebaseEndpoint);

/* The reference */
var currentRoomRef;

/* Keeping the recognition engine in a global variable somewhere */
var recognition;

/* initiating the app */
if (Helpers.requirementsOk()) Controllers.initApp();