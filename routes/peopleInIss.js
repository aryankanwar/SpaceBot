const rp = require('request-promise');
const Promise = require('bluebird');
const commonFunctions = require('./commonFunctions.js');

exports.sendResponse = sendResponse;

function sendResponse(event) {
  Promise.coroutine(function* () {
    const spaceNumber = yield peopleInSpace();
    const sendResponse = yield sendResponseToFb(event, spaceNumber);
    return sendResponse;
  })().then(sendResponse => sendResponse, error => error);
}
function peopleInSpace() {
  const options = {
    uri: 'http://api.open-notify.org/astros.json',
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  return rp(options)
    .then((result) => {
      if (result.number && result.people && Array.isArray(result.people)) {
        let peopleObj = '';
        result.people.map((n) => {
          const spaceInfo = `- ${n.name} is on ${n.craft}\n`;
          peopleObj += spaceInfo;
        });
        var resultObj = `Total Number : ${result.number}\n${
          peopleObj}`;
      } else {
        resultObj = 'Sorry! People in Iss are not available';
      }
      return resultObj;
    })
    .catch(err => err);
}

function sendResponseToFb(event, spaceObj) {
  return new Promise((resolve, reject) => {
    commonFunctions.sendTextResponseToUser(event, spaceObj, {
      send(obj) {
        const resultObj = obj;
        return resolve(resultObj);
      },
    });
  });
}
