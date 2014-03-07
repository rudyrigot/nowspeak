/* VIEWS: mainly, executes templates and attaches event listeners. On bad days, throws alert boxes. */

var Views = {

	/* Allows to get the bottom bar back to its default message */
	idleBottomBar : function(){
	  $('#bottom-bar').html((keepSpacebarPressed ? i18n.bottombar_hold_space : i18n.bottombar_hit_space)+ " ("+recognition.lang+")");
	},

	/* Initialization of a room (whether public or private, whether new or existing) */
	room : function(roomID) {
	  /* Changing the URL */
	  window.location = '#'+roomID;

	  /* Setting the bits of interface in place */
	  Views.idleBottomBar(); // the bottom bar
	  $('#comment-icon').html(i18n.comment_invite); // the comment icon (that was postponed)
	  $('aside').html(_.template($('#users-template').html(), {})); // the aside


		/* Setting the action listeners */
		$('#your_alias_form').submit(function(e){ // for the alias change
			User.update($('#your_alias_text').val());
			e.preventDefault();
		});
		$('#warning #close').click(function(e){ // for the warning closing
			$('#warning').slideUp();
			e.preventDefault();
		});

	  /* And setting the focus, for the glory to happen */
	  $('#spacebar-listening').focus();
	},

	/* Managing the interim message (the one that updates while the user is speaking) */
	room_updateinterimmessage : function(message){
		$('#temporary-message').show();
		$('#temporary-message').html(message);
		Helpers.forceStickToBottom();
	},
	room_reinitinterimmessage : function(){
		$('#temporary-message').hide();
		$('#temporary-message').html('');
	},

	/* Managing the warning */
	maybeDisplayWarning : function () {
		if (!wasDisplayedWarning) {
			$('#warning').slideDown();
			wasDisplayedWarning = true;
		}
	},

	/* The welcome aside */
	welcome : function(){
		/* Setting up the aside */
	  $('aside').html(_.template($('#welcome-template').html(), {}));
		/* Listening to the click on "New private room" */
	  $('#newprivatebutton').click(function(e){
	  	Controllers.newPrivateRoom();
	    e.preventDefault();
	  });
		/* Listening to the click on "New public room" */
	  $('#newpublicbutton').click(function(e){
	    $(this).addClass("active");
	    $('#newpublicform').slideDown('fast'); // displaying the form
			// hiding the list of public rooms, if it was open
	    $('#seepublicbutton').removeClass('active');
	    $('#seepubliclist').slideUp('fast');
	    e.preventDefault();
	  });
		/* Listening to the validation of the form to create a new public room */
	  $('#newpublicform').submit(function(e){
	    var roomName = getSlug($('#newpublicinput').val()); // we're slugifying the name (using the SpeakingUrl library)
	    Controllers.room(roomName);
	    e.preventDefault();
	  });
		/* Listening to the click on "See public rooms" */
	  $('#seepublicbutton').click(function(e){
			Room.listen(); // updating the list (continually)
	    $(this).addClass("active");
	    $('#seepubliclist').slideDown('fast'); // displaying the list
			// hiding the new room form, if it was open
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
