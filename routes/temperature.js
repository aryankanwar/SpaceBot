const rp = require('request-promise');
const Promise = require('bluebird');
const weather = require('weather-js');
const commonFunctions = require('./commonFunctions.js');

const fbPageToken = process.env.PAGE_ACCESS_TOKEN;
const googleKey = process.env.GOOGLE_KEY;

exports.sendLocationResponse = sendLocationResponse;
exports.sendResponse = sendResponse;
// /////////////////////////////////////////////////////////////////////
// //////////////////////FETCH LOCATION////////////////////////////////
// ///////////////////////////////////////////////////////////////////S

function sendLocationResponse(event) {
  Promise.coroutine(function* () {
    const sendLocResponse = yield sendLocationTextResponseToUser(event);
    return sendLocResponse;
  })().then(sendLocResponse => sendLocResponse, error => error);
}

function sendLocationTextResponseToUser(event, quoteToUser) {
  const sender = event.sender.id;
  const options = {
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: fbPageToken },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: {
        text: 'I can tell you Temperature of your region',
        quick_replies: [
          {
            content_type: 'location',
            payload: 'TEMPERATURE_FROM_LOCATION',
          },
        ],
      },
    },
  };
  rp(options)
    .then(result => result)
    .catch((err) => {
      console.log(err);
      return err;
    });
}
// //////////////////////////////////////////////////////////////////////
// //////////////// FINAL TEMPERATURE RESPONSE////////////////////////
// //////////////////////////////////////////////////////////////////

function sendResponse(event, locationObj) {
  Promise.coroutine(function* () {
    const getLocation = yield findLocation(event, locationObj);
    const sendWeatherResponse = yield findWeather(event, getLocation);
    const sendFinalResponse = yield sendResponseToFb(event, sendWeatherResponse);

    return sendFinalResponse;
  })().then(sendFinalResponse => sendFinalResponse, error => error);
}

// ///////////////////////////////////////////////////////////////////////////
// /////////////////////////////AFTER USER ENTERS LOCATION/////////////////////
// ///////////////////////////////////////////////////////////////////////////

function findLocation(event, locationObj) {
  return new Promise((resolve, reject) => {
    const sender = event.sender.id;
    const options = {
      uri: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: { latlng: `${locationObj.latitude},${locationObj.longitude}`, key: googleKey },
      headers: {
        'User-Agent': 'Request-Promise',
      },
      json: true,
    };
    rp(options)
      .then((result) => {
        if (result.results && Array.isArray(result.results) && result.results.length > 0) {
          var resultObj = result.results[0].address_components[3].long_name;
        } else {
          var resultObj = 'earth';
        }
        return resolve(resultObj);
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });
}

function findWeather(event, regionObj) {
  return new Promise((resolve, reject) => {
    weather.find({ search: regionObj, degreeType: 'C' }, (err, result) => {
      let resultObj;
      if (result
                && result[0]
                && Object.keys(result[0]).length
                && result[0].current
                && result[0].current.temperature
                && result[0].current.humidity
                && result[0].current.windspeed
                && result[0].current.skytext) {
        resultObj = `The temperature of ${regionObj} is ${result[0].current.temperature}°C ` + '\n'
                    + ` - Humidity level is ${result[0].current.humidity}% ` + '\n'
                    + ` - Wind speed is ${result[0].current.windspeed}\n`
                    + ` and it is ${result[0].current.skytext}`;
      } else {
        resultObj = `Sorry I couldnt find temperature of ${regionObj} :(`;
      }
      return resolve(resultObj);
    });
  });
}

function sendResponseToFb(event, WeathObj) {
  return new Promise((resolve, reject) => {
    commonFunctions.sendTextResponseToUser(event, WeathObj, {
      send(obj) {
        const resultObj = obj;
        return resolve(resultObj);
      },
    });
  });
}
