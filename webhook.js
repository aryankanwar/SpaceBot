'use strict';
const PAGE_ACCESS_TOKEN =  process.env.PAGE_ACCESS_TOKEN;


const express      = require('express');
const bodyParser   = require('body-parser');
const request      = require('request');
const quotes       = require('./routes/quote');
const joke         = require('./routes/joke');
const news         = require('./routes/news');   
const weather      = require('./routes/weather');
const greeting     = require('./routes/greeting');                  
const async        = require('async');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get('/webhook', function(req, res) {
  console.log(req.query['hub.verify_token'] ,req.query['hub.mode'] );
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] ==='tuxedo_cat') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          var resultWraper = {};
          var asyncTasks = [sendMessage.bind(null, event , resultWraper ), 
                            getResponse.bind(null, resultWraper)];
          async.series(asyncTasks ,function(err){
            if(err){
              console.log(err);
              return err;
            }
          })
        }
      });
    });
    res.status(200).end();
  }
});

function sendMessage(event , resultWraper, callback) {
  let sender    = event.sender.id;
  let text      = event.message.text;
  var expression = '';
  resultWraper.sender  = sender;
  var string   = text.toLowerCase();
  var substring = ['hello', 'joke', 'quote', 'news','weather', 'temperature', 'hey'];
 
  var doubles = substring.map(function(x) {
    if(string.includes(x)){
      expression = x;
    }
  });
 console.log(expression);
  switch(expression) {
    case 'hello':
    case 'hey':
    text = greeting.greetUser(function (err, result){
      if(err){
        err = err || "Couldnt fetch latest greeting";
        resultWraper.text = err;
        return callback(err, null);
      }
      resultWraper.text = result;
      return  callback(null, result); 
    });   
    break;    
    case 'joke':
    text = joke.getJoke(function (err, result){
      if(err){
        err = err || "Couldnt fetch latest news";
        resultWraper.text = err;
        return callback(err, null);
      }
      resultWraper.text = result;
      return  callback(null, result); 
    });    
    break;
    case 'quote':
    text = quotes.quoteUser(function(err,result){
      if(err){
            err = err || "Couldnt fetch quote";
            resultWraper.text = err;
            return callback(err, null);
          }
          resultWraper.text = result;
          return  callback(null, result);
    });
    break;
    case 'weather':
    case 'temperature':
    text = weather.getLatestTemp(string, function (err ,result){
      if(err){
            err = err || "Couldnt fetch weather";
            resultWraper.text = err;
            return callback(err, null);
          }
          resultWraper.text = result;
          return  callback(null, result);
        });
    break;
    case 'news':
    text = news.getLatestNews(function (err ,result){
      if(err){
            err = err || "Couldnt fetch latest news";
            resultWraper.text = err;
            return callback(err, null);
          }
          resultWraper.text = result;
          console.log(result, "}====================================================");
          return  callback(null, result);
        });
        break;
    default:
        text = "Sorry I didnt get you";
        resultWraper.text = text
        callback(null , resultWraper.text);
      }
    }

function getResponse(resultWraper, callback){
  console.log('*** RECEIVED ***');
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: resultWraper.sender},
      message: {text: resultWraper.text}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
        return callback(error ,null);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
        return callback(response.body.error ,null);
    }
    return callback(null);
  });
}


