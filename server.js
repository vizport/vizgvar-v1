const express = require('express');
const path = require('path');

const app = express();

// app.use(express.static(path.join(__dirname, 'client/built')));

app.use('/api', require('./controllers'));

app.use(express.static(path.join(__dirname, 'client/built/static')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/built/static/index.html'));
});

const port = process.env.PORT || 8000;
app.listen(port);

console.log(`Server running on ${port}`);