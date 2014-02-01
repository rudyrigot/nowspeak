var ConfCall = Parse.Object.extend("ConfCall", {
	defaults: {
		"public" : true,
		"name" : "bistro"
	}
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