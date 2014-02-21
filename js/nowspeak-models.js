/* MODELS: contains various helpers to help recurrent operations on Firebase references */

var Room = {
	update: function(roomName){
		firebaseRootRef.child('Rooms').child(roomName).update({'name' : roomName, 'latest' : new Date().getTime() });
		return firebaseRootRef.child('Rooms').child(roomName);
	}
};

var PrivateRoom = {
	create: function(roomName) {
		firebaseRootRef.child('PrivateRooms').child(roomName).set({'name' : roomName, 'created' : new Date().getTime(), 'latest' : new Date().getTime() });
		return firebaseRootRef.child('PrivateRooms').child(roomName);
	},

	update: function(roomName){
		firebaseRootRef.child('PrivateRooms').child(roomName).update({'latest' : new Date().getTime() });
		return firebaseRootRef.child('PrivateRooms').child(roomName);
	}
};