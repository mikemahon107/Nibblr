var express = require('express')
var path = require('path')
var morgan = require('morgan')
var router = require('./router')

var app = express()

app.use(morgan('dev'));

// app.use(express.static(__dirname));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/', express.static(path.join(__dirname, '../')))


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'));
})

app.use('/', router);

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})