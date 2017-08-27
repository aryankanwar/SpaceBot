const Promise               = require('bluebird');
const rp                    = require('request-promise');
var commonFunctions         = require('./commonFunctions.js'); 
var helpSection             = require('./help');
const PAGE_ACCESS_TOKEN     = process.env.PAGE_ACCESS_TOKEN;
exports.sendResponse        = sendResponse;

function sendResponse(event) {
    Promise.coroutine(function* () {
        var fetchUserInfo          = yield fetchUserInformation(event);
        var sendResponse           = yield sendResponseToFb(event, fetchUserInfo); 
        return sendResponse;
    })().then((sendResponse) => {
        return helpSection.sendMenuResponseToUser(event);
    }, (error) => {
        return error;
    })
}

function fetchUserInformation(event){
    let sender  = event.sender.id;
    var options = {
        uri: 'https://graph.facebook.com/v2.6/'+ sender,
        qs: {
            access_token:  PAGE_ACCESS_TOKEN// -> uri + '?access_token=xxxxx%20xxxxx'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        }
    };
    console.log(options.uri);
    return rp(options)
        .then((result) => {
            result = JSON.parse(result);
            return result;
        })
        .catch((err) => {
            return err;
        });
}

function sendResponseToFb(event, userObj) {
    let sender       = event.sender.id;
    let getStatredObject = " Hi " + userObj.first_name + " , I'm A Space bot.\n" +
                            "I can tell you \n"+ 
                             " - Latest News \n" + 
                             " - International Space\ISS \n" +
                             " - NASA \n" +
                             " - Funny Jokes\n"+ 
                             " - Wise Quotes. \n"+
                             " - Temperature of your region"
                            "Well I am chat bot! so we can always talk :\n";                  
    var options = {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: { text: getStatredObject }
        }
    };
    return rp(options)
        .then((result) => {
        })
        .catch((err) => {
        });
}
