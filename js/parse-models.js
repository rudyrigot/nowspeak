var ConfCall = Parse.Object.extend("ConfCall", {
	defaults: {
		"public" : true,
		"name" : "bistro",
		"latestActivity" : new Date()
	}
});

var ConfCalls = Parse.Collection.extend({
	model: ConfCall,

	// ConfCalls are sorted by the date at which they had their latest activity.
	comparator: function(message) {
		return message.get('latestActivity');
	},

	// Filter down the list of all ConfCalls that are public
	public: function() {
		return this.filter(function(confCall){ return confCall.get('public'); });
	},
});

var Message = Parse.Object.extend("Message", {
	defaults: {
		"content" : "",
		"isComment" : false,
		"datePosted" : new Date()
		/* other fields to set: user */
	}
});

var Messages = Parse.Collection.extend({
	model: Message,

	// Messages are sorted by the date at which they were posted.
	comparator: function(message) {
		return message.get('datePosted');
	}
});

/**
 * And the fields for Users are:
 *  * username
 *  * password
 *  * lang
 *  * firstSeen
 *  * currentConversation
 */