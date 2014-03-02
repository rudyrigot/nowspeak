/* VIEWS: mainly, executes templates and attaches event listeners. On bad days, throws alert boxes. */

var Views = {

	/* Allows to get the bottom bar back to its default message */
	idleBottomBar : function(){
	  $('#bottom-bar').html((keepSpacebarPressed ? i18n.bottombar_hold_space : i18n.bottombar_hit_space)+ " ("+recognition.lang+")");
	},

	/* Initialization of a room */
	room : function(roomID) {
	  /* Changing the URL */
	  window.location = '#'+roomID;

	  /* Setting the bits of interface in place */
	  Views.idleBottomBar();
	  $('#comment-icon').html(i18n.comment_invite);
	  $('aside').html(_.template($('#users-template').html(), {}));

	  /* And setting the focus, for the glory to happen */
	  $('#spacebar-listening').focus();
	},

	/* The welcome aside */
	welcome : function(){
	  $('aside').html(_.template($('#welcome-template').html(), {}));
	  $('#newprivatebutton').click(function(e){
	  	Controllers.newPrivateRoom();
	    e.preventDefault();
	  });
	  $('#newpublicbutton').click(function(e){
	    $(this).addClass("active");
	    $('#newpublicform').slideDown('fast');
	    $('#seepublicbutton').removeClass('active');
	    $('#seepubliclist').slideUp('fast');
	    e.preventDefault();
	  });
	  $('#newpublicform').submit(function(e){
	    var roomName = getSlug($('#newpublicinput').val());
	    Controllers.room(roomName);
	    e.preventDefault();
	  });
		/*
			When people click the "See public room" button, we need to start listening to
			public room references in Firebase, and insert them in order of their latest
			interaction (so the most recently accessed are showed at the top)
		*/
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
		}
	  $('#seepublicbutton').click(function(e){
	    if (!$(this).hasClass("already-listening")) {
	      firebaseRootRef.child('Rooms').on('child_added', insertReferenceInOrder);
				firebaseRootRef.child('Rooms').on('child_changed', function(snapshot){
					$("#seepubliclist li[data-roomname="+snapshot.val().name+"]").remove();
					insertReferenceInOrder(snapshot);
				});
	    }
	    $(this).addClass("already-listening");
	    $(this).addClass("active");
	    $('#seepubliclist').slideDown('fast');
	    $('#newpublicbutton').removeClass('active');
	    $('#newpublicform').slideUp('fast');
	    e.preventDefault();
	  });
	},

	/* Handles recording errors */
	recordingError : function (error) {
		/* checking if there's a "human" translation available for the error code */
		if (error in i18n.error_recording_by_code) {
		  error = i18n.error_recording_by_code[error];
		}
		alert(i18n.error_recording+": "+error);
	},

};