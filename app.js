var express = require("express"),
  bodyParser = require("body-parser"),
  http = require("http"),
  privateHtml = require("./privacy"),
  request = require("request");
    app            = express();

var transport_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkRCMDI3QUJFN0MyMkNGQzAyNDg2ODVGNTJBRDNBQjU4QkY4MzNERjEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiIyd0o2dm53aXo4QWtob1gxS3RPcldMLURQZkUifQ.eyJuYmYiOjE1NDMwMjk2OTEsImV4cCI6MTU0MzAzMzI5MSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS53aGVyZWlzbXl0cmFuc3BvcnQuY29tIiwiYXVkIjoiaHR0cHM6Ly9pZGVudGl0eS53aGVyZWlzbXl0cmFuc3BvcnQuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6ImFkMjcxYjc5LTRjNTQtNDNmNS1iNjhhLTc5N2M3NTZhMmJjZCIsImNsaWVudF9jb3ZlcmFnZSI6IktUeFZhR08weFVDQXE5ekd0OHM1R1EiLCJjbGllbnRfdGVuYW50IjoiMTExNzg1NDktODFjMC00ODNkLWJiN2UtNzYyYWYzNmYyYjY1IiwianRpIjoiZGJkYjNkOGY0MGE5NzUzZjUzZWU2MDRhOGEwNjQ3MDYiLCJzY29wZSI6WyJ0cmFuc3BvcnRhcGk6YWxsIl19.Yy3UDXXMorCsL9fm2YGVg4_Npxc1tNMMG2hGjdtuVLUpScrl8AXMz94fmxPJmrk1NcemifkEFY_op8an8ZQo9wtgl0gwTH40Atxwh9T5XitZGMo30YQLUdEQzuYt4e93uTR0fSBqj4StPkERqg0bRmqRpgW3g_rV9-DcPn97A1la1YefbbPUAkbfpmu-mUEHP19fVgr0Hp-DUA-Jv0kuLw-5pupYTPFLwUNjngNUUT7GY282amLSWJb2lmW9Vb5rS3sapS3T00kSu4uqSPbpXitoWIg2JW3f28pGwKN56BxTBkkeaPkBYtfrD4-yM8O915A516KtuAZYrq5FD1Hqbg';
   
var fb_token =
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
    "https://graph.facebook.com/v2.6/me/messages?access_token=" + fb_token,
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


// where's my transport start 

var options = {
  headers: {
    Accept: 'application/json',
    Authorization: 'Bearer ' + transport_TOKEN
  },
  url: 'https://platform.whereismytransport.com/api/agencies'
}; 

app.get('/agencies' , function(req,res)
{
  request(options, function (error, response, body) {
    res.send('Number of Agencies : ' + JSON.parse(body).length) ; 
  });  
})

// start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
