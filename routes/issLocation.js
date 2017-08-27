const rp = require('request-promise');
const Promise = require('bluebird');
const commonFunctions = require('./commonFunctions.js');

const googleKey = process.env.GOOGLE_KEY;
exports.sendResponse = sendResponse;

function sendResponse(event) {
  Promise.coroutine(function* () {
    const isslocation = yield issPosition();
    const sendResponse = yield sendResponseToFb(event, isslocation);
    return sendResponse;
  })().then(sendResponse => sendResponse, error => error);
}
function issPosition() {
  const options = {
    uri: 'http://api.open-notify.org/iss-now.json',
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  return rp(options)
    .then((result) => {
      if (result.hasOwnProperty('iss_position') && result.iss_position.hasOwnProperty('latitude')
                && result.iss_position.hasOwnProperty('longitude')) {
        const latitude = result.iss_position.latitude;
        const longitude = result.iss_position.longitude;
        const spaceObj = `${latitude},${longitude}`;
        var googleObj = `https://maps.googleapis.com/maps/api/staticmap?center=${spaceObj}&zoom=2&size=680x385&markers=color:red%7C${spaceObj}&key=${googleKey}`;
        console.log(googleObj, 'googleObj---');
      } else {
        googleObj = 'http://web-hosting-blog.rackservers.com.au/wp-content/uploads/2012/08/internet-error-404-file-not-found.jpg';
      }
      return googleObj;
    })
    .catch(err => err);
}

function sendResponseToFb(event, locationObj) {
  return new Promise((resolve, reject) => {
    const type = 'image';
    commonFunctions.sendImageResponseToUser(event, locationObj, type, {
      send(obj) {
        const resultObj = obj;
        return resolve(resultObj);
      },
    });
  });
}
