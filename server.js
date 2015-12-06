var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongodbURL = 'mongodb://localhost:27017/test';
var mongoose = require('mongoose');

// C1
app.post('/',function(req,res) {
	//console.log(req.body);
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		rObj.address = {};
		rObj.address.building = req.body.building;
		rObj.address.street = req.body.street;
		rObj.address.zipcode = req.body.zipcode;
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		rObj.borough = req.body.borough;
		rObj.cuisine = req.body.cuisine;
		rObj.name = req.body.name;
		rObj.restaurant_id = req.body.restaurant_id;

		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		//console.log(r);
		r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant created!')
       		db.close();
			res.status(200).json({message: 'insert done', id: r._id});
    	});
    });
});

//R1:  remove by using anyone field.

app.delete('/:field/:keyword',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		criteria[req.params.field] = req.params.keyword;
		Restaurant.find(criteria).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			var message = {};
			message[message] = 'delete done';
			message[req.params.field] = req.params.keyword;
			res.status(200).json(message);
    	});
    });
});

//R2: redirect /delete?restaurant_id=xxx to /xxx/yyy
app.delete('/delete',function(req,res) {
	
	res.redirect(/restaurant_id/+req.query.restaurant_id);
});


//U1: add grade
app.put('/:when_field/:when_keyword/grade/', function(req, res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);

		var criteria = {};
		criteria[req.params.when_field] = req.params.when_keyword;
		var grade = {};
		grade.date = req.body.date;
		grade.grade =  req.body.grade;
		grade.score = req.body.score;
		Restaurant.update(criteria, {$push:{grades: grade}}, function(err, results){
		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				fieldname = 
				res.status(200).json({message: 'update done'});
			}
			db.close();
    	});
    });	
});

//U2: modify a field 
app.put('/:when_field/:when_keyword/:set_field/:set_keyword', function(req, res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		criteria[req.params.when_field] = req.params.when_keyword;
		var update = {};
		update[req.params.set_field] = req.param.set_keyword;
		Restaurant.update(criteria, update, function(err, results){
		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				fieldname = 
				res.status(200).json({message: 'update done'});
			}
			db.close();
    	});
    });	
});

// U3: redirect /update?searchfield=xxx?searchkeyword?yyy?setfield=zzz?setkeyword=aaa
app.put('/update',function(req,res) {
		res.redirect(/req.query.searchfield/req.query.searchkeyword/req.query.setfield/setkeyword);
	

});
//D1: search by anyone field 
app.get('/:search_field/:search_keyword', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		criteria[req.params.search_field] = req.params.search_keyword;
		Restaurant.find(criteria,function(err, results){
		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				var message = {};
				message[message] = 'No matching document';
				message[req.params.search_field] = req.params.search_keyword;
				fieldname = 
				res.status(200).json(message);
			}
			db.close();
    	});
    });
});

//D2:  redirect /search?restaurant_id=xxx
app.get('/search',function(req,res) {
	
	res.redirect(/restaurant_id/+req.query.restaurant_id);
});



app.listen(process.env.PORT || 8099);
