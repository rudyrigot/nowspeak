/* Those are some helpers to manipulate Firebase references */

var Room = {
	max_date: new Date(2050,1,1,1,1,1,1).getTime(),

	update: function(roomName){
		firebaseRootRef.child('Rooms').child(roomName).remove();
		firebaseRootRef.child('Rooms').child(roomName).setWithPriority({'name' : roomName, 'latest' : new Date().getTime() }, Room.max_date - new Date().getTime());
		return firebaseRootRef.child('Rooms').child(roomName);
	}
}