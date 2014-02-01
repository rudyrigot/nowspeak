var ConfCall = Parse.Object.extend("ConfCall", {
});

var Message = Parse.Object.extend("Message", {
	defaults: {
		"content" : "",
		"isComment" : false
	}
});

var Messages = Parse.Collection.extend({
  model: Message
});