const Promise = require('bluebird');
const commonFunctions = require('./commonFunctions.js');

const fbPageToken = process.env.PAGE_ACCESS_TOKEN;
const rp = require('request-promise');

exports.sendMenuResponseToUser = sendMenuResponseToUser;
exports.sendNasaResponseToUser = sendNasaResponseToUser;
exports.sendIssResponseToUser = sendIssResponseToUser;

function sendMenuResponseToUser(event) {
  const sender = event.sender.id;
  const options = {
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: fbPageToken },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: {
        text: 'What do you want me to do ?',
        quick_replies: [
          {
            content_type: 'text',
            title: 'NASA',
            payload: 'NASA',
          },
          {
            content_type: 'text',
            title: 'ISS',
            payload: 'ISS',
          },
          {
            content_type: 'text',
            title: 'Tell me a Joke',
            payload: 'JOKES',
          }, {
            content_type: 'text',
            title: 'A Quote?',
            payload: 'QUOTES',
          },
          {
            content_type: 'text',
            title: 'Latest News?',
            payload: 'NEWS',
          },
          {
            content_type: 'text',
            title: 'Temparature?',
            payload: 'TEMPERATURE',
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

function sendNasaResponseToUser(event) {
  const sender = event.sender.id;
  const options = {
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: fbPageToken },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: {
        text: 'The National Aeronautics and Space Administration is an independent agency of the United States Federal Government responsible for the civilian space program',
        quick_replies: [
          {
            content_type: 'text',
            title: 'Nasa Pic of Day',
            payload: 'ASTRONOMICAL_PICTURE',
          }, {
            content_type: 'text',
            title: 'Mars Rover Photos',
            payload: 'MARS_ROVER_PICTURE',
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


function sendIssResponseToUser(event) {
  const sender = event.sender.id;
  const options = {
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: fbPageToken },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: {
        text: 'The International Space Station is a space station, or a habitable artificial satellite, in low Earth orbit',
        quick_replies: [
          {
            content_type: 'text',
            title: 'Iss Location',
            payload: 'ISS_Location_Now',
          }, {
            content_type: 'text',
            title: 'Astronauts in ISS',
            payload: 'PEOPLE_IN_ISS',
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
