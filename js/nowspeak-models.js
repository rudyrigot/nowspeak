/* MODELS: contains various helpers to help recurrent operations on Firebase references */

/* Represents a public room*/
var Room = {
	/* Creating or updating a public room (it's the same thing) */
	update: function(roomName){
		firebaseRootRef.child('Rooms').child(roomName).update({'name' : roomName, 'latest' : new Date().getTime() });
		return firebaseRootRef.child('Rooms').child(roomName);
	},

	/* Listening to the list of public rooms, to update it in the right column when the user is out of a room */
	listen: function() {
		// First, the method to insert a Firebase reference properly as a DOM element
		var insertReferenceInOrder = function(snapshot) {
			var liStr = _.template($('#room-template').html(), {name: snapshot.val().name, latest: snapshot.val().latest});
			$('#seepubliclist').insertinorder(
				liStr,
				snapshot.val().latest,
				{ direction: 'desc' }
			);
		};
		// Now, updating the list
		if (!$('#seepublicbutton').hasClass("already-listening")) { // making sure we're not setting listeners twice
			firebaseRootRef.child('Rooms').on('child_added', insertReferenceInOrder);
			firebaseRootRef.child('Rooms').on('child_changed', function(snapshot){
				// The change that can happen: new "latest" date; we need to remove an reinsert the room in order.
				$("#seepubliclist li[data-roomname="+snapshot.val().name+"]").remove();
				insertReferenceInOrder(snapshot);
			});
		}
		$('#seepublicbutton').addClass("already-listening");
	}
};

/* Represents a private room */
var PrivateRoom = {
	/* Creating a private room */
	create: function(roomName) {
		firebaseRootRef.child('PrivateRooms').child(roomName).set({'name' : roomName, 'created' : new Date().getTime(), 'latest' : new Date().getTime() });
		return firebaseRootRef.child('PrivateRooms').child(roomName);
	},

	/* Updating a private room's "latest" date */
	update: function(roomName){
		firebaseRootRef.child('PrivateRooms').child(roomName).update({'latest' : new Date().getTime() });
		return firebaseRootRef.child('PrivateRooms').child(roomName);
	}

	/* There is no listening, since it shouldn't be possible to list private rooms in the app */
};

/* Represents a message that gets sent */
var Message = {
	/* Creating (sending) a message */
	create: function(message) {
		var messageID = uuid.v1(); // this is a unique identifier
		currentRoomRef.child('Messages').child(messageID).set({ 'id': messageID, 'message': message, 'date': new Date().getTime(), 'user' : userID, 'alias' : userAlias, 'color' : userColor });
		userMessageIDs.push(messageID); // keeping it safe, in order to change the alias in it, if needed
		Helpers.forceStickToBottom();
	},

	/* Listening to messages */
	listen: function(){
		/* If this is a new incoming message */
		currentRoomRef.child('Messages').on('child_added', function(snapshot){
			var liStr = _.template( // building the <li> tag from its template
				$('#message-template').html(),
				{ id: snapshot.val().id, message: snapshot.val().message, date:snapshot.val().date, user: snapshot.val().user, alias: snapshot.val().alias, color: snapshot.val().color }
			);
			$('#messageList').insertinorder(liStr, snapshot.val().date);
			Helpers.maybeStickToBottom();
			Views.maybeDisplayWarning();
		});
		/* If this is a change, then for now there's only one reason: this is a user alias change */
		currentRoomRef.child('Messages').on('child_changed', function(snapshot){
			var id = snapshot.val().id;
			$('#messageList li#'+id+' .alias').html(snapshot.val().alias);
		});
	}
};

/* Represents a user connected in the room */
var User = {
	/* Creating a new user (when the user joins the room) */
	create: function(){
		userID = uuid.v1(); // Unique identifier
		userColor = Helpers.getRandomColor();
		var now = moment();
		var hour = now.hour()==0 ? "12" : (now.hour()>12 ? now.hour()-12 : now.hour());
		var minutes = now.minutes() < 10 ? "0"+now.minutes() : now.minutes();
		var am_pm = now.hour()<=12 ? "am" : "pm";
		userAlias = i18n.user_defaultname+hour+':'+minutes+am_pm;
		currentRoomRef.child('Users').child(userID).set({'id' : userID, 'alias' : userAlias, 'latest' : new Date().getTime(), 'color' : userColor});
		currentRoomRef.child('Users').child(userID).onDisconnect().remove(); // If user disconnects, just delete its Firebase reference
		$('#your_alias_text').val(userAlias); // setting the right value in the "change your alias" input text
	},

	/* Updating a new user with a new alias name */
	update: function(newAlias){
		currentRoomRef.child('Users').child(userID).update({ 'alias' : newAlias }); // updating the user in Firebase
		userMessageIDs.forEach(function(messageID){
			currentRoomRef.child('Messages').child(messageID).update({'alias' : newAlias}); // update the user's messages in Firebase
		});
		userAlias = newAlias; // changing the global variable
		$('#spacebar-listening').focus(); // And setting the focus again
	},

	/* Listening to users, in order to keep the user list up to date */
	listen: function(){
		// In case of a new user coming in
		currentRoomRef.child('Users').on('child_added', function(snapshot){
			var liStr = _.template(
				$('#user-template').html(),
				{ id: snapshot.val().id, alias: snapshot.val().alias, latest: snapshot.val().latest, color: snapshot.val().color }
			);
			$('#userList').insertinorder(liStr, snapshot.val().latest);
		});
		// User changed, only one reason for this today: his alias changed
		currentRoomRef.child('Users').on('child_changed', function(snapshot){
			$('#userList li#'+snapshot.val().id+' .alias').html(snapshot.val().alias);
		});
		// User got removed (disconnected): let's remove it
		currentRoomRef.child('Users').on('child_removed', function(snapshot){
			$('#userList li#'+snapshot.val().id).remove();
		});
	}
}
