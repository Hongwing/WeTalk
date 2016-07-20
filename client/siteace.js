/** Acounts config */
Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL'
});


/** Router */
Router.configure({
	layoutTemplate: 'Layout'
});

Router.route('/', function () {
	this.render('website_form', {
		to: 'main'
	});
	this.render('nav', {
		to: 'head'
	});
});

Router.route('/allsites', function () {
	this.render('website_list', {
		to: 'main'
	});
	this.render('search-nav', {
		to: 'head'
	});
});

Router.route('/details/:_id', function () {
	this.render('nav', {
		to: 'head'
	});
	this.render('detail', {
		to: 'main',
		data: function () {
			console.log(Websites.findOne({_id: this.params._id}));
			return Websites.findOne({_id: this.params._id});
		}
	});
});


	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			if (Session.get('myFilter')) {
				return Session.get("myFilter");
				//console.log(Session.get('myFilter'));
				//return Websites.find({_id: Session.get('myFilter')});
			}else
			{
				return Websites.find({}, {sort: {'votes': -1, 'createdOn': -1}});
			}
		}
	});


	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+this.title);
			// put the code in here to add a vote to a website!
			Websites.update({_id: website_id}, {$set: {votes: this.votes + 1}});
			//Websites.update({_id: website_id}, {$set: {votes: this.votes + 1}});
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);
			// put the code in here to remove a vote from a website!
			if (this.votes === 0) {
				this.votes = 1;
			}
			Websites.update({_id: website_id}, {$set: {votes: this.votes - 1}});
			/**
			* Progress bar processor
			*/
			$(function () {
				var Progressbar = $("#myProgressbar");
				console.log(Progressbar.attr('aria-valuenow', '10'));
			});

			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.helpers({
		isPosted: function() {
			if (Meteor.user()) {
				return false;
			}else
			{
				return true;
			}
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
			console.log($("#website_form"));
			console.log($("#website_form")[0].style.cssText);
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			//  put your website saving code in here!
			var website_url = event.target.url.value;
			var website_title = event.target.title.value;
			var website_description = event.target.description.value;
			console.log("The url they entered is: "+ website_url);
			if (!(website_url && website_description)) {
				return true;
			}
			Websites.insert({
    			title:website_title, 
    			url:website_url, 
    			description:website_description, 
    			createdOn:new Date(),
    			votes: 0
    		});
			console.log(Meteor.user().username);
			$("#all-sites").click();
			return false;// stop the form submit from reloading the page

		}
	});

	Template.detail.helpers({
		isPosted: function() {
			if (Meteor.user()) {
				return false;
			}else
			{
				return true;
			}
		}
	});

	Template.detail.events({
		"submit .js-submit-comment": function(event) {
			var content = event.target.yourComment.value;
			console.log(content);
			console.log(Meteor.user().username);
			console.log(this._id);
			if (content === "") {
				return true;
			}
			if (Meteor.user()) {
				Comments.insert({
					content: content,
					createdOn: new Date(),
					createdBy: Meteor.user()._id,
					createdFor: this._id // IN this site .
				});
				event.target.yourComment.value = "";
			}
			return false;
		}
	});

	Template.comments_list.helpers({
		/*name: function() {
			// var id = Comments.findOne({}, {sort: {'createdOn': -1}}).createdBy;
			// var user = Meteor.users.findOne({_id: id});
			return Meteor.user().username;
		},*/
		getAuthor: function(user_Id) {
			var user = Meteor.users.findOne({_id: user_Id});
			if (user) {
				return user.username;
			}else
			{
				return 'Anon';
			}
		},
		allcomments: function() {
			return Comments.find({createdFor: this._id}, {sort: {'createdOn': -1}});
		}
	});

Template.search_form.events({
	'submit .js-search-items': function(event) {
		var keywords = event.target.searchbox.value;
		console.log(keywords);

		if (keywords === "") {
			Session.set('myFilter', undefined);
		}else
		{
			var matchSites = [];
			var allSites = Websites.find({}, {sort: {'votes': -1, 'createdOn': -1}});
			allSites.map(function (site) {
				var count = 0;
				if (site.description.indexOf(keywords) != -1) {/* keywords find() */
					console.log('ok' + site.description);
					matchSites.push(site._id);
					count = count + 1;
				}
			});
			var result = [];
			matchSites.map(function (id) {
				result.push(Websites.findOne({_id: id}));
			});
			Session.set('myFilter', result);
		}

		event.target.searchbox.value = "";
		return false;
	}
});