Websites = new Mongo.Collection("websites");

Comments = new Mongo.Collection("comments");

Websites.allow({
	insert: function (userId, doc) {
		if (Meteor.user()) { /* insert a website with a loggin account */ 
			return true;
		}else
		{
			return false;
		}
	},
	update: function (userId, doc) {
		if (Meteor.user()) { /* insert a website with a loggin account */ 
			return true;
		}else
		{
			return false;
		}
	}
});

Comments.allow({
	insert: function (userId, doc) {
		if (Meteor.user()) { /* insert a website with a loggin account */ 
			return true;
		}else
		{
			return false;
		}
	},
	update: function (userId, doc) {
		if (Meteor.user()) { /* insert a website with a loggin account */ 
			return true;
		}else
		{
			return false;
		}
	}
});