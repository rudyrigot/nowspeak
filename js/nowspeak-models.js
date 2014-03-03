/* MODELS: contains various helpers to help recurrent operations on Firebase references */

var Room = {
	update: function(roomName){
		firebaseRootRef.child('Rooms').child(roomName).update({'name' : roomName, 'latest' : new Date().getTime() });
		return firebaseRootRef.child('Rooms').child(roomName);
	},

	listen: function() {
		// First, the method to insert a FB reference properly as a DOM element
		var insertReferenceInOrder = function(snapshot) {
			var liStr = _.template($('#room-template').html(), {name: snapshot.val().name, latest: snapshot.val().latest});
			$('#seepubliclist').insertinorder(
				liStr,
				snapshot.val().latest,
				{ direction: 'desc' }
			);
		};
		if (!$('#seepublicbutton').hasClass("already-listening")) {
			firebaseRootRef.child('Rooms').on('child_added', insertReferenceInOrder);
			firebaseRootRef.child('Rooms').on('child_changed', function(snapshot){
				$("#seepubliclist li[data-roomname="+snapshot.val().name+"]").remove();
				insertReferenceInOrder(snapshot);
			});
		}
		$('#seepublicbutton').addClass("already-listening");
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

var Message = {
	create: function(message) {
		var messageID = uuid.v1();
		currentRoomRef.child('Messages').child(messageID).set({ 'id': messageID, 'message': message, 'date': new Date().getTime(), 'user' : userID, 'alias' : userAlias, 'color' : userColor });
		userMessageIDs.push(messageID);
	},

	listen: function(){
		currentRoomRef.child('Messages').on('child_added', function(snapshot){
			var liStr = _.template(
				$('#message-template').html(),
				{ id: snapshot.val().id, message: snapshot.val().message, date:snapshot.val().date, user: snapshot.val().user, alias: snapshot.val().alias, color: snapshot.val().color }
			);
			$('#messageList').insertinorder(liStr, snapshot.val().date);
		});
		currentRoomRef.child('Messages').on('child_changed', function(snapshot){
			var id = snapshot.val().id;
			$('#messageList li#'+id+' .alias').html(snapshot.val().alias);
		});
	}
};

var User = {
	create: function(){
		userID = uuid.v1();
		userColor = 'blue';
		var now = moment();
		var hour = now.hour()==0 ? "12" : (now.hour()>12 ? now.hour()-12 : now.hour());
		var minutes = now.minutes() < 10 ? "0"+now.minutes() : now.minutes();
		var am_pm = now.hour()<=12 ? "am" : "pm";
		userAlias = 'anonymous from '+hour+':'+minutes+am_pm;
		currentRoomRef.child('Users').child(userID).set({'id' : userID, 'alias' : userAlias, 'latest' : new Date().getTime(), 'color' : userColor});
		currentRoomRef.child('Users').child(userID).onDisconnect().remove();
		$('#your_alias_text').val(userAlias);
	},

	update: function(newAlias){
		currentRoomRef.child('Users').child(userID).update({ 'alias' : newAlias });
		userMessageIDs.forEach(function(messageID){
			currentRoomRef.child('Messages').child(messageID).update({'alias' : newAlias});
		});
		userAlias = newAlias;
	},

	listen: function(){
		currentRoomRef.child('Users').on('child_added', function(snapshot){
			var liStr = _.template(
				$('#user-template').html(),
				{ id: snapshot.val().id, alias: snapshot.val().alias, latest: snapshot.val().latest, color: snapshot.val().color }
			);
			$('#userList').insertinorder(liStr, snapshot.val().latest);
		});
		currentRoomRef.child('Users').on('child_changed', function(snapshot){
			$('#userList li#'+snapshot.val().id+' .alias').html(snapshot.val().alias);
		});
		currentRoomRef.child('Users').on('child_removed', function(snapshot){
			$('#userList li#'+snapshot.val().id).remove();
		});
	}
}
