'use strict';

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const port = process.env.PORT || '5001';

// Configure view engine
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'app/views/layouts'),
}));
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'app/views'));

// Serve static content
app.use(express.static(path.join(__dirname, 'app/public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.use((err, req, res, next) => {
  // log the error, for now just console.log
  console.log(err);
  res.status(500).send('Server error!');
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Sorry, there was a system error: ', err)
  }
  console.log(`Server listening on port ${port}.`)
});
