// canvas app with drawing tools - can also post like instagram
const express = require('express');
const app = express();
const path = require('path');


app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable('verbose errors');


app.get('/', (req, res) => {
  res.render('index.ejs');
});

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

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('500', { error: err });
});

app.listen(8080, () => {
  console.log('pictorama is running');
});