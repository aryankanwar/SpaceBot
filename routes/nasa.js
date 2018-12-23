const rp = require('request-promise');
const Promise = require('bluebird');
const commonFunctions = require('./commonFunctions.js');

const NASA_TOKEN = process.env.NASA_KEY;
const PAGE_ACCESS_TOKEN = process.env.API_AI_ACCESS_TOKEN;

exports.sendResponse = sendResponse;

function sendResponse(event) {
  Promise.coroutine(function* () {
    const nasaPicObj = yield nasaPicture();
    const sendResponsetext = yield sendResponseTextToFb(event, nasaPicObj);
    const sendResponselink = yield sendResponseLinkToFb(event, nasaPicObj);
    return sendResponselink;
  })().then(sendResponselink => sendResponselink, error => error);
}

function nasaPicture() {
  const options = {
    uri: `https://api.nasa.gov/planetary/apod?api_key=${NASA_TOKEN}`,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  return rp(options)
    .then(result => result)
    .catch(err => err);
}

function sendResponseTextToFb(event, nasaPicObj) {
  const sender = event.sender.id;
  if (nasaPicObj.hasOwnProperty('title') && nasaPicObj.hasOwnProperty('explanation')) {
    var nasapictext = `${(`-Title : ${nasaPicObj.title}\n`
        + `-Picture Description : ${nasaPicObj.explanation}`).toString().substring(0, 630)}...`;
  } else {
    nasapictext = 'Sorry couldnt connect to Nasa API';
  }
  const options = {
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: { text: nasapictext },
    },
  };
  return rp(options)
    .then((result) => {
    })
    .catch((err) => {
    });
}

function sendResponseLinkToFb(event, nasaPicObj) {
  return new Promise((resolve, reject) => {
    if (nasaPicObj.url && nasaPicObj.media_type) {
      const type = nasaPicObj.media_type;
      if (type == 'video') {
        commonFunctions.sendButtonResponseToUser(event, nasaPicObj.url, {
          send(obj) {
            const resultObj = obj;
            return resolve();
          },
        });
      } else {
        commonFunctions.sendImageResponseToUser(event, nasaPicObj.url, type, {
          send(obj) {
            const resultObj = obj;
            return resolve();
          },
        });
      }
    } else {
      return reject();
    }
  });
}
