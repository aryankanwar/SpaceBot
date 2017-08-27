const express     = require('express');
const bodyParser  = require('body-parser');
const app         = express();
const request     = require('request');
const rp          = require('request-promise');
var smallTalk     = require('./routes/smallTalk');
var peopleInIss   = require('./routes/peopleInIss');
var issLocation   = require('./routes/issLocation');
var nasa          = require('./routes/nasa');
var marsrover     = require('./routes/marsrover');
var news          = require('./routes/news');
var quotes        = require('./routes/quote');
var joke          = require('./routes/jokes');
var getStarted    = require('./routes/getStarted');
var temperature   = require('./routes/temperature');
var helpSection   = require('./routes/help');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//////////////////////////////////////////////////////////
/////////////////////DEFINING SERVER///////////////////////
///////////////////////////////////////////////////////////

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

///////////////////////////////////////////////////////////////
////////////////VERIFICATION PART/////////////////////////////
//////////////////////////////////////////////////////////////
app.get('/webhook', (req, res) => {
  console.log(req.query, "===============check===================");
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_bat') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

app.post('/webhook', (req, res) => {
  console.log("====================WEBHOOK REQUEST============================>");
  if (req.body.object === 'page' && req.body.entry && Array.isArray(req.body.entry) && req.body.entry.length > 0) {
    req.body.entry.forEach((entry) => {
      ////////////////////////////////////////////////////////
      ////////////////Location Fetching////////////////////////
      ////////////////////////////////////////////////////////
      if (entry.messaging && Array.isArray(entry.messaging) && entry.messaging.length > 0) {
        entry.messaging.forEach((event) => {
          if (event.message && event.message.attachments && Array.isArray(event.message.attachments)
            && event.message.attachments[0].payload && event.message.attachments[0].payload.coordinates) {
            var locationObj = {
              "latitude": event.message.attachments[0].payload.coordinates.lat,
              "longitude": event.message.attachments[0].payload.coordinates.long
            };
            var payload = "TEMPERATURE_FROM_LOCATION";
          }

          ////////////////////////////////////////////////////////////////
          //////////////////////FOR TEXT MESSAGE USING API AI/////////////
          ///////////////////////////////////////////////////////////////

          if (event.message && event.message.text
            && typeof event.message.quick_reply == "undefined") {
            var menuArray = ["help", "request", "start", "no", "more", "settings", "setting"];
            if (~(menuArray.indexOf(event.message.text.toString().toLowerCase()))) {
              helpSection.sendMenuResponseToUser(event);
            } else if (event.message.text.toString().toLowerCase().indexOf("news") !== -1) {
              news.sendResponse(event);
            }
            else if (event.message.text.toString().toLowerCase().indexOf("joke") !== -1) {
              joke.sendResponse(event);
            }
            else if (event.message.text.toString().toLowerCase().indexOf("quote") !== -1) {
              quotes.sendResponse(event);
            }
            else if (event.message.text.toString().toLowerCase().indexOf("nasa") !== -1) {
              helpSection.sendNasaResponseToUser(event);
            }
            else if (event.message.text.toString().toLowerCase().indexOf("iss") !== -1) {
              helpSection.sendIssResponseToUser(event);
            }
            else if (event.message.text.toString().toLowerCase().indexOf("temperature") !== -1) {
              helpSection.sendIssResponseToUser(event);
            }
            else {
              smallTalk.sendMessage(event);
            }
          }
          /////////////////////////////////////////////////////////////
          ///////////////// FOR HANDLING POSTBACKS/////////////////////
          //////////////////////////////////////////////////////////

          if (event.postback && event.postback.payload) {
            var payload = event.postback.payload;
          }
          /////////////////////////////////////////////////////////////
          //////// FOR HANDLING POSTBACKS WITH QUICK REPLY BUTTON//////
          ////////////////////////////////////////////////////////////

          if (event.message && event.message.quick_reply) {
            var payload = event.message.quick_reply.payload;
          }

          if (payload == "GET_STARTED") {
            console.log(event, "event");
            getStarted.sendResponse(event);
          }
          else if (payload == "PEOPLE_IN_ISS") {
            peopleInIss.sendResponse(event);
          }
          else if (payload == "ISS_Location_Now") {
            issLocation.sendResponse(event);
          } else if (payload == "ASTRONOMICAL_PICTURE") {
            nasa.sendResponse(event);
          } else if (payload == "MARS_ROVER_PICTURE") {
            marsrover.sendResponse(event);
          }
          else if (payload == "NEWS") {
            news.sendResponse(event);
          }
          else if (payload == "JOKES") {
            joke.sendResponse(event);
          }
          else if (payload == "QUOTES") {
            quotes.sendResponse(event);
          }
          else if (payload == "TEMPERATURE") {
            temperature.sendLocationResponse(event);
          }
          else if (payload == "TEMPERATURE_FROM_LOCATION") {
            temperature.sendResponse(event, locationObj);
          }
          else if (payload == "NASA") {
            helpSection.sendNasaResponseToUser(event);
          }
          else if (payload == "ISS") {
            helpSection.sendIssResponseToUser(event);
          }
        });
      }
    });
    res.status(200).end();
  } else {
    res.status(200).end();
  }
});
