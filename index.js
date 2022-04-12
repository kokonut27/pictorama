const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const upload = multer();
const cookie = require('cookie');
const db = require('better-replit-db');
const cookieParse = require('cookie-parser');
const escapeHtml = require('escape-html');
const url = require('url');
const session = require('express-session');
const flash = require('connect-flash');


const mySecret = process.env['secret']
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.use(cookieParse());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(upload.array());
app.use(session({ 
  cookie: { 
    maxAge: 60 * 60 * 24 * 7 
  }, 
  secret: mySecret,
  resave: false, 
  saveUninitialized: false
}));
app.use(flash());

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable('verbose errors');

// console.log(db.list());
// db.empty();

app.get('/', (req, res) => {
  res.setHeader('Set-Cookie', cookie.serialize('loggedin', Boolean(false), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7 // 1 week
  }));

  req.app.locals.loggedin = cookies.loggedin
  res.render('index.ejs', {
    loggedin: req.app.locals.loggedin
  });
});

app.get('/post', (req, res) => { // use post request later to recieve title content etc.
  res.render('post.ejs', {
    loggedin: req.app.locals.loggedin
  });
});

app.post('/post', (req, res) => {
  console.log(req.body);
  // res.send(`${req.body.title} has been posted!`);

  // actually create post here

  res.statusCode = 302;
  
  res.redirect('/explore'); // add id
});

app.get('/explore', (req, res) => {
  let post_id = req.query.id;
  res.render('explore.ejs', {
    post_id: post_id,
    loggedin: req.app.locals.loggedin
  });
});

app.get('/draw', (req, res) => {
  res.render('draw.ejs', {
    loggedin: req.app.locals.loggedin
  });
});

app.get('/rules', (req, res) => {
  res.render('rules.ejs', {
    loggedin: req.app.locals.loggedin
  });
});

app.get('/signup', (req, res) => {
  res.render('signup.ejs', {
    loggedin: req.app.locals.loggedin
  });
});

app.post('/signup', (req, res) => {
  res.setHeader('Set-Cookie', cookie.serialize('loggedin', Boolean(true), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7 // 1 week
  }));

  res.statusCode = 302;
  res.setHeader('Location', req.headers.referer || '/signup');

  let cookies = cookie.parse(req.headers.cookie || '');
  req.app.locals.loggedin = cookies.loggedin;
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');

  let username = req.body.signupUsername;
  let password = req.body.signupPassword;
  let confirmPassword = req.body.confirmSignupPassword;

  if (confirmPassword != password) {
    req.flash('error', 'Password has been confirmed incorrectly!');
    console.log("hello buddy ur password is incorrect D:")
  };

  db.get(username).then(k => {
    if (k) {
      req.flash('error', `'${username}' username already exists!`);
    } else {
      db.set(username, password);

      res.redirect("/profile");
    };
  });
});

app.get('/login', (req, res) => {
  res.render('login.ejs', {
    loggedin: req.app.locals.loggedin
  });
});

// app.post('/login') - use db.get();

app.get('/profile', (req, res) => {
  res.render('profile.ejs', {
    loggedin: req.app.locals.loggedin
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
    loggedin: req.app.locals.loggedin
  });
});

/*
  Runs server
*/
app.listen(8080, () => {
  console.log('pictorama is running');
});