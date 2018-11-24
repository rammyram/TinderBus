var express        = require('express'),
    bodyParser     = require('body-parser'),
    http           = require('http'),
    server         = require('request'),
    privateHtml    = require('./privacy');
    app            = express();
   
var token = 'EAAEaUgjyijIBAIyHcZClsEXUmiyEKZCSEn9vyWMQwS5P9RGOwhyU9VZAy8sRFFmuoZCGBKqEYuq1bVzEHONirDeqTqnnZCQ0JyZAiWMvn2Gpscg1MkLuLrlmWhCk8duZBM82hkntTZCDn0TvJQA1cqH3wPODxgit4ZAsBVr0L1dzyCdDBtPPcxfFE';
app.use(bodyParser.json());

// set port
app.set('port', process.env.PORT || 8080);

// create a health check endpoint
app.get('/health', function(req, res) {
  res.send('okay');
});

app.post('/fb',  function(req,res){
  console.log(JSON.stringify(req.body));
  app.messageHandler(req.body, function(result) {
      console.log("Async Handled: " + result);
  })
  res.send(req.body)
})

app.get('/fb', function(req, res) {
    console.log("received");
    if (req.query['hub.verify_token'] === 'abc') {
       res.send(req.query['hub.challenge']);
     } else {
       res.send('Error, wrong validation token');
     }
  });

app.get('/privacy', function(req, res) {
    res.send(privateHtml);
})

app.messageHandler = function(j, cb) {
    setTimeout(function(){
      cb(true);
    }, 10000)
  }

// start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});