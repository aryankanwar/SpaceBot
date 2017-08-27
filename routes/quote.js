const rp                = require('request-promise');
const Promise           = require('bluebird');
var commonFunctions     = require('./commonFunctions.js'); 
const fbPageToken       = process.env.PAGE_ACCESS_TOKEN;

exports.sendResponse    = sendResponse;

function sendResponse(event) {
    Promise.coroutine(function* () {
        var getQuote = yield quoteUser();
        var sendResponse = yield sendTextResponseToUser(event, getQuote);
        return sendResponse;
    })().then((sendResponse) => {
        return sendResponse;
    }, (error) => {
        return error;
    })
}

function quoteUser() {
    var options = {
        uri: 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    }
    return rp(options)
        .then((result) => {
            var quoteObj    = result;
            var quoteText   = quoteObj.quoteText;
            var quoteAuthor = quoteObj.quoteAuthor || '';
            var quote       = quoteText + '-' + quoteAuthor;
            var quotestring = quote.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
            if (typeof quotestring == "undefined" || quotestring == "undefined-") {
                quotestring = "Success is not the key to happiness Happiness is the key to success.\n" +
                    " If you love what you are doing you will be successful -Albert Schweitzer .";
            }
            return quotestring;
        })
        .catch((err) => {
            return err;
        });
}

function sendTextResponseToUser(event, quoteToUser) {
    let sender = event.sender.id;
    var options = {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: fbPageToken },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: {
                text: quoteToUser,
                quick_replies: [{
                    content_type: "text",
                    title: "One more Quote?",
                    payload: "QUOTES"
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
