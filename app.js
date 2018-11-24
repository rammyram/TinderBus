var express = require("express"),
  bodyParser = require("body-parser"),
  http = require("http"),
  privateHtml = require("./privacy"),
  request = require("request");
    app            = express();
   
var token =
  "EAAEaUgjyijIBAOz87xlbMxjBg2KybvJV0ZCel1VJkfa4uHq8wHQYgj6KC7hWOkUw7O48jp3B7ZAFAZCtvStcRZAUncNoz464Ns7j3FjpFNem3NyaBcoC7eFDYmLA1shRYjtCswuEoBkfUyaZAOzXpAQVkKZCDkCYn9DpB5QtNtdKkpjvfpXyEI";
app.use(bodyParser.json());

// set port
app.set('port', process.env.PORT || 8080);

// create a health check endpoint
app.get('/health', function(req, res) {
  res.send('okay');
});

app.post('/fb',  function(req,res){
  var userPSID = req.body.entry[0].messaging[0].sender.id;
  request.post(
    "https://graph.facebook.com/v2.6/me/messages?access_token=" + token,
    {
      json: {
        messaging_type: "RESPONSE",
        recipient: {
          id: userPSID
        },
        message: {
          text: "hello, world!"
        }
      }
    }
  );
  res.send(req.body);
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
