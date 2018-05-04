var express = require('express');
var router = express.Router();
// var multer = require('multer');
// var uploads = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');


router.use(passport.initialize());
router.use(passport.session());

router.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
router.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});


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



// passport.use(new LocalStrategy(
//   function(username, password, cb) {
//     User.getUserByUsername(username, function(err, user) {
//       if (err) { return cb(err); }
//       if (!user) { console.log('Unknown User'); return cb(null, false); }
//       if (user.password != password) { return cb(null, false); }
//       return cb(null, user);
//     });
//   }));


passport.use(new LocalStrategy(
  function(username, password, done) {
      User.findOne({
        username: username
      }, function(err, user) {
        console.log('here');
        if (err) {
          console.log('her1');
          return done(err);
        }

        if (!user) {
          console.log('her2');
          return done(null, false);
        }

        if (user.password != password) {
          return done(null, false);
        }
        return done(null, user);
      });
  }
));

// passport.use(new (
//   function(username, password, done){
//     console.log('here');
//     User.getUserByUsername(username, function(err, user){
//       if(err) throw err;
//       if(!user){
//         console.log('Unknown User');
//         return done(null, false, {message: 'Unknown User'});
//       }
//     })
//   }
// ) );



router.get('/login', function(req, res, next){
  res.render('login' , {
    'title': 'Login' 
  })
})

router.post('/login', 
passport.authenticate('local', { failureRedirect: '/error' }),
function(req, res) {
  console.log('redirect');
  
  res.redirect('/');
});
module.exports = router;
