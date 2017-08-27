const oneLinerJoke     = require('one-liner-joke');
const Promise          = require('bluebird');
var commonFunctions    = require('./commonFunctions.js');
const rp               = require('request-promise');
const fbPageToken      = process.env.PAGE_ACCESS_TOKEN;

exports.sendResponse   = sendResponse;

function sendResponse(event) {
    Promise.coroutine(function* () {
        var Joke = yield getJoke(event);
        var sendJokeResposne = yield sendTextResponseToUser(event, Joke);
        return sendJokeResposne;
    })().then((sendJokeResposne) => {
        return sendJokeResposne;
    }, (error) => {
        return error;
    })
}

function getJoke(event) {
    var getRandomJoke = oneLinerJoke.getRandomJoke();
    return new Promise((resolve, reject) => {
        if (getRandomJoke.body) {
            var jokeObj = getRandomJoke.body;
        } else {
            var jokeObj = "Every Scooby-Doo episode would literally be two minutes long if the gang went to the mask store first and asked a few questions.";
        }
        resolve(jokeObj);
    });
}

function sendTextResponseToUser(event, ObjJoke) {
    let sender = event.sender.id;
    var options = {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: fbPageToken },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: {
                text: ObjJoke,
                quick_replies: [{
                    content_type: "text",
                    title: "One more Joke?",
                    payload: "JOKES"
                },
                {
                    content_type: "text",
                    title: "No",
                    payload: ""
                }
                ]
            }
        }
    };
    rp(options)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            console.log(err);
            return err;
        });
}
