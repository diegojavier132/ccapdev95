const https = require('https');
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const { connect } = require('http2');
const Movie = require('./models/Movies');
const User = require('./models/User');
const Post = require('./models/Post');
const bodyparser = require('body-parser');
const { title } = require('process');
const crypto = require('crypto');
const session = require('express-session');
const app = express();

var db = mongoose.connection;
const salt = crypto.randomBytes(16).toString('hex');
db.on('error', console.error.bind(console, 'connection error:'));


function hash_password_with_salt(password, salt) {
  // Use the SHA-256 algorithm to hash the password with the salt
  const hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}


app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
  }));

// CONNECT TO MONGODB
const uri = "mongodb+srv://admin:ninja132@ccapdev95.6r0kwxm.mongodb.net/phase3?retryWrites=true&w=majority"
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => app.listen(3000, function(){
            console.log("Server started on port 3000");
        }))
        .catch((err) => console.log(err));



    app.get('/add-movie', (req,res) => {
                            const movie = new Movie({
                                title: 'test3',
                                genre: 'test',
                                runTime: 'test',
                                year: 'test',
                                director: 'test',
                                cast: ['test'],
                                type: 'test',
                                lastUpdated: 'test',
                                plot: 'test',
                                img: 'https://hmhub.in/wp-content/uploads/2018/08/02775157-3c14-4f31-8337-3b63c1b01d25_2-Keys-for-a-Proactive-Maintenance-Approach_extra_large.jpeg',
                                
                                // Reviews of the Posts
                                comments: [{
                                    user: 'test',
                                    content: 'test',
                                    likes: 'test',
                                }]
                            })

                            movie.save()
                            .then((result) => {
                                res.send(result)
                            })
                            .catch((err) =>{
                                console.log(err);
                            })
                        
     })
    


app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/images"));

// EJS 
app.set('view engine', 'ejs');

// INDEX
app.get("/",function(req,res){
    Movie.find()
    .then((result) => {
        testmovie = result;
        res.render("index.ejs", testmovie);
        })
    .catch((err) => {
        console.log(err);
    })
   
    console.log("ENTERED userin res REnder");
 });


// Movies Tab
app.get("/movies",function(req,res){
    Movie.find()
    .then((result) => {
        testmovie = result;
        res.render("movies.ejs",testmovie);
        })
    .catch((err) => {
        console.log(err);
    })
   
    console.log("ENTERED userin res REnder");
 });


 app.post('/movies', function(req, res) {
  let newMovie = new Movie(req.body);


  newMovie.save(function(err, movie) {
    if (err) return res.status(500).send(err);
    return res.status(200).send(movie);
  });
});


app.put('/movies/:id', function(req, res) {
  // Retrieve the movie with the specified id from the collection
  Movie.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, movie) {
    if (err) return res.status(500).send(err);

    // Return the updated movie
    return res.status(200).send(movie);
  });
});

// TV Series Tab
app.get("/tvseries",function(req,res){
    
        res.render("tvSeries.ejs");
        console.log("tvSeries.ejs entered");
    });
// Register Tab
app.get("/register",function(req,res){

        res.render("register.ejs");
        console.log("register.ejs entered");
    });

    // REGISTER POST
// Handle form submission
app.post('/register', (req, res) => {
    // Generate a salt for the password
  const salt = crypto.randomBytes(16).toString('hex');
     // Hash the password using the salt
  const passwordHash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 512, 'sha512').toString('hex');

    // Create a new user with the form data
    const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        passwordHash: passwordHash,
        passwordSalt: salt
    });
  
    // Save the new user to the database
    newUser.save((err) => {
      if (err) {
        // Handle the error
      } else {
        // Redirect to a confirmation page
        res.render("login.ejs", );
      }
    });
    console.log("register.ejs entered");
  });
  


    
// Login Tab
app.get("/login",function(req,res){
    res.render('login', { errorMessage: res.locals.errorMessage });
    console.log("ENTERED login res REnder");
 });
 


// Handle form submission
app.post('/login', (req, res) => {

  const user = req.body;
  const username = req.body.username;
  const password = req.body.password;

    User.findOne({
      $or: [
        { email: req.body.usernameOrEmail },
        { username: req.body.usernameOrEmail }
      ],
    }, (err, user) => {
      if (err) {
      } else {
        if (user) {
          const hashed_password = crypto.pbkdf2Sync(password, user.passwordSalt, 10000, 512, 'sha512').toString('hex');
    

          if (hashed_password == user.passwordHash){
            req.session.user = user;
            res.redirect('/userin');
          }
          
          else {
            res.locals.errorMessage = 'Incorrect username or email or password.';
            res.redirect('/login');
          }
        } else {
          res.locals.errorMessage = 'Incorrect username or email or password.';
          res.redirect('/login');
        }
      }
    });
  });
  
  




 // UserIn Page

app.get('/userin', function(req, res) {
  // Retrieve the user and movie data from the collections
  const user = req.session.user;
  User.find({}, function(err, users) {
    if (err) return res.status(500).send(err);

    Movie.find({}, function(err, movies) {
      if (err) return res.status(500).send(err);

      // Render the main page and pass the user and movie data as local variables
      res.render('userin', {user: user, users: users, movies: movies});
    });
  });
});

  // About Page

  app.get("/about",function(req,res){
    res.render('about', { errorMessage: res.locals.errorMessage });
    console.log("ENTERED about res REnder");
 });


  // Profile Page

    
 // Route to view a user's profile
app.get('/profile', function(req, res) {
  // Retrieve the user with the specified id from the collection
  const user = req.session.user;
  res.render('profile', {user: user});
});


// MOVIE PAGES 
    // Interstellar
    db.once('open', function() {
        app.get('/interstellar', function(req, res) {
          var movies = db.collection('movies');
          var query = { title: 'Interstellar' };
      
          movies.findOne(query, function(err, movie) {
            if (err) throw err;
      
            res.render('moviePage.ejs', { movie: movie });
          });
        });
      
    // 500 days
        app.get("/500Days",function(req,res){
            var movies = db.collection('movies');
            var query = { title: '500 Days of Summer' };
            
            movies.findOne(query, function(err, movie) {
            if (err) throw err;
      
            res.render('moviePage.ejs', { movie: movie });
          });
        });

    
     // One Piece
        app.get("/OnePiece",function(req,res){
            var movies = db.collection('movies');
            var query = { title: 'One Piece Film: Red' };
            
            movies.findOne(query, function(err, movie) {
            if (err) throw err;
    
            res.render('moviePage.ejs', { movie: movie });
            });
        });


        // Pulp Fiction
        app.get("/pulpfiction",function(req,res){
            var movies = db.collection('movies');
            var query = { title: 'Pulp Fiction' };
            
            movies.findOne(query, function(err, movie) {
            if (err) throw err;
    
            res.render('moviePage.ejs', { movie: movie });
            });
        });


         // your name
        app.get("/yourname",function(req,res){
            var movies = db.collection('movies');
            var query = { title: 'Your Name.' };
            
            movies.findOne(query, function(err, movie) {
            if (err) throw err;
    
            res.render('moviePage.ejs', { movie: movie });
            });
        });



        // Parasite
        app.get("/parasite",function(req,res){
            var movies = db.collection('movies');
            var query = { title: 'Parasite' };
            
            movies.findOne(query, function(err, movie) {
            if (err) throw err;
    
            res.render('moviePage.ejs', { movie: movie });
            });
        });

        // The Shining
        app.get("/shining",function(req,res){
            var movies = db.collection('movies');
            var query = { title: 'The Shining' };
            
            movies.findOne(query, function(err, movie) {
            if (err) throw err;
    
            res.render('moviePage.ejs', { movie: movie });
            });
        });

        // The Shining
        app.get("/dahmer",function(req,res){
            var movies = db.collection('movies');
            var query = { title: 'Dahmer' };
            
            movies.findOne(query, function(err, movie) {
            if (err) throw err;
    
            res.render('moviePage.ejs', { movie: movie });
            });
        });
    });





    
   
    
    
    
    
    
