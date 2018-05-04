var express = require('express');
var router = express.Router();
// var multer = require('multer');
// var uploads = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');




router.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
router.get('/error', (req, res) => res.send("error logging in"));

// passport.serializeUser(function(user, cb) {
//   cb(null, user.id);
// });

// passport.deserializeUser(function(id, cb) {
//   User.findById(id, function(err, user) {
//     cb(err, user);
//   });
// });


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next){
  res.render('register' , {
    'title': 'Register' 
  });
});
// ,uploads.single('profileimg')
router.post('/register', function(req, res, next){
    //get form value
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    // console.log(req.body);
    // console.log(req.files);



 if(req.files.profileimage){
      console.log('Uploading file....');

      // var profileImageOriginalName = req.files.profileimage.name;
      var profileImageName = req.files.profileimage.name;
      var profileImageMime = req.files.profileimage.mimetype;
      var profileImagePath = req.files.profileimage.path;
      var profileImageExt = req.files.profileimage.extension;
      var profileImageSize = req.files.profileimage.size;
    }else{

      var profileImageName = 'noimage.png';
    }

      //  form validation

      req.checkBody('name','Name field is required').notEmpty();
      req.checkBody('email','Email field is required').notEmpty();
      req.checkBody('email', 'Email is not Valid').isEmail();
      req.checkBody('username','Username field is required').notEmpty();
      req.checkBody('password','Password field is required').notEmpty();
      req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

      //  variable for errors
       var errors = req.validationErrors();
       if(errors){
         res.render('register', {
           errors : errors,
           name : name,
           email : email,
           username : username,
           password : password,
           password2 : password2
         });
       }else{
         var newUser = new User({
          name : name,
          email : email,
          username : username,
          password : password,
          profileimage : profileImageName
         });
          //  create User
      User.createUser(newUser, function(error, user){
        if(error) throw err;
        console.log(user);
        
      });

      // success message

      req.flash('success', 'You are now registered, proceed to login');

      res.location('/');
      res.redirect('/')
         
       }

     

      

});

passport.serializeUser(function(user, done){
  done(null, user.id);

});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
    done(err, user);
  });
});








router.get('/login', function(req, res, next){
  res.render('login' , {
    'title': 'Login' 
  })
})


passport.use(new LocalStrategy(
    function(username, password, done){
      User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
          console.log('Unknown User');
          return done(null, false, {message: 'unknown User'});
          
        }

        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
              return done(null, user);
            }else{
              console.log('Invalid password');
              done(null, false, {message : 'Invalid Password'});
            }
        });
      })

    }

))

router.post('/login', passport.authenticate('local', {failureRedirect : '/users/login', failureFlash : 'Invalid username or password'}), function(req ,res){
    console.log('Authentication Successful');
    req.flash('success' , 'You are logged in');
    res.redirect('/');

});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You Have Logged out');
  res.redirect('/users/login');
})

module.exports = router;
