// canvas app with drawing tools - can also post like instagram
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const upload = multer();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(upload.array()); 

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable('verbose errors');


app.get('/', (req, res) => {
  
  res.render('index.ejs');
});

app.get('/post', (req, res) => { // use post request later to recieve title content etc.
  res.render('post.ejs');
});

app.post('/post', (req, res) => {
  console.log(req.body);
  // res.send(`${req.body.title} has been posted!`);

  // actually create post here
  
  res.redirect('/explore'); // add id
});

app.get('/explore', (req, res) => {
  let post_id = req.query.id;
  res.render('explore.ejs', {
    post_id: post_id
  });
});

app.get('/draw', (req, res) => {
  res.render('draw.ejs');
});

app.get('/rules', (req, res) => {
  res.render('rules.ejs');
});

app.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

// app.post('/signup')

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

// app.post('/login')

app.get('/profile', (req, res) => {
  res.render('profile.ejs');
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
    html: function () {
      res.render('404', { url: req.url })
    },
    json: function () {
      res.json({ error: 'Not found' })
    },
    default: function () {
      res.type('txt').send('Not found')
    }
  })
});

/*
  500 error status
*/
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('500', { error: err });
});

/*
  Runs server
*/
app.listen(8080, () => {
  console.log('pictorama is running');
});