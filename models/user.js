var mongoose = require('mongoose');
// mongoose.connect = ('localhost', 'nodeauth');
var connection = mongoose.createConnection('mongodb://localhost/nodeauth');
var db = mongoose.connection;
var bcrypt = require('bcrypt');

// user schema

var UserSchema = new mongoose.Schema({
    username : {
        type : String,
        index : true
    },
    password : {
        type : String,
        required: true,
        bcrypt : true
    },
    email : {
        type : String
    },
    name : {
        type : String
    },
    profileimage : { 
        type : String
    },
});

var User = module.exports = connection.model('User', UserSchema);

module.exports.getUserByUsername = function(username, callback){
    var query = {username : username };
    User.findOne(query, callback);
}

module.exports.createUser = function(newUser,callback){
        bcrypt.hash(newUser.password, 10, function(err, hash){
                if(err) throw err;

                // set password
                newUser.password = hash;
                newUser.save(callback);
                // console.log(newUser);
        })
        
        
}