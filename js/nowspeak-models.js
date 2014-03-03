/* MODELS: contains various helpers to help recurrent operations on Firebase references */

var Room = {
	update: function(roomName){
		firebaseRootRef.child('Rooms').child(roomName).update({'name' : roomName, 'latest' : new Date().getTime() });
		return firebaseRootRef.child('Rooms').child(roomName);
	},

	listen: function() {
		// First, the method to insert a FB reference properly as a DOM element
		var insertReferenceInOrder = function(snapshot) {
			var roomName = snapshot.val().name,
				order = snapshot.val().latest,
				liStr = '<li data-roomname="'+roomName+'" data-order="'+order+'">'
					+'<a href="javascript:Controllers.room(\''+roomName+'\')">'+roomName+'</a>'
					+' <span class="ago">('+moment(snapshot.val().latest).fromNow()+')</span>'
					+' <span>→</span>'
					+'</li>';
			$('#seepubliclist').insertinorder(
				liStr,
				order,
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
		currentRoomRef.child('Messages').push({ 'message': message, 'date': new Date().getTime() });
	},

	listen: function(){
		currentRoomRef.child('Messages').on('child_added', function(snapshot){
			var date = snapshot.val().date;
			var liStr = '<li data-order="'+date+'">'
				+ snapshot.val().message
				+ '</li>';
			$('#messageList').insertinorder(liStr, date);
		});
	}
};
