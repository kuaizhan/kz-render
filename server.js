var express = require('express');
var http = require('http');
var path = require('path');
var port = 18080;
var render = require('./render');


var app = express();

// all environments
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
    var data = require('./pages/page_full.json');
    res.end(render.render(data));
});


http.createServer(app).listen(app.get('port'), function(){
    //console.log('Express server listening on port ' + app.get('port'));
});


