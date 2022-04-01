const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const upload = multer();
const cookie = require('cookie');
const dbe = require('@replit/database');
const db = new dbe.Database();
const cookieparser = require('cookie-parser');

app.use(cookieparser.cookieParse());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(upload.array()); 

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable('verbose errors');

let loggedin = true; // dummy variable for now


app.get('/', (req, res) => {
  res.render('index.ejs', {
    loggedin: loggedin
  });
});

app.get('/post', (req, res) => { // use post request later to recieve title content etc.
  res.render('post.ejs', {
    loggedin: loggedin
  });
});

app.post('/post', (req, res) => {
  console.log(req.body);
  // res.send(`${req.body.title} has been posted!`);

  // actually create post here
  
  res.redirect('/explore', {
    loggedin: loggedin
  }); // add id
});

app.get('/explore', (req, res) => {
  let post_id = req.query.id;
  res.render('explore.ejs', {
    post_id: post_id,
    loggedin: loggedin
  });
});

app.get('/draw', (req, res) => {
  res.render('draw.ejs', {
    loggedin: loggedin
  });
});

app.get('/rules', (req, res) => {
  res.render('rules.ejs', {
    loggedin: loggedin
  });
});

app.get('/signup', (req, res) => {
  res.render('signup.ejs', {
    loggedin: loggedin
  });
});

// app.post('/signup')

app.get('/login', (req, res) => {
  res.render('login.ejs', {
    loggedin: loggedin
  });
});

// app.post('/login')

app.get('/profile', (req, res) => {
  res.render('profile.ejs', {
    loggedin: loggedin
  });
});


/*
  404 error status requests
*/
app.get('/404', (req, res, next) => {
  next();
});

app.use((req, res, next) => {
  res.status(404);

  res.format({
    html: () => {
      res.render('404', { 
        url: req.url, 
        loggedin: loggedin
      });
    },
    json: () => {
      res.json({ error: 'Not found' })
    },
    default: () => {
      res.type('txt').send('Not found')
    }
  })
});

/*
  500 error status
*/
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('500', { 
    error: err,
    loggedin: loggedin
  });
});

/*
  Runs server
*/
app.listen(8080, () => {
  console.log('pictorama is running');
});