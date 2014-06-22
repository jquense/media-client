var express = require('express')
  , _ = require('lodash')
  , app = express();


app.use(require('serve-static')(__dirname + '/public'))

app.get('*', function (req, res){
	console.log('hi')
    res.sendfile(__dirname + '/public/index.html'); 
})

app.listen(3001)