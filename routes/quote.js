const rp = require('request-promise');
const Promise = require('bluebird');
const commonFunctions = require('./commonFunctions.js');

const fbPageToken = process.env.PAGE_ACCESS_TOKEN;

exports.sendResponse = sendResponse;

function sendResponse(event) {
  Promise.coroutine(function* () {
    const getQuote = yield quoteUser();
    const sendResponse = yield sendTextResponseToUser(event, getQuote);
    return sendResponse;
  })().then(sendResponse => sendResponse, error => error);
}

function quoteUser() {
  const options = {
    uri: 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json',
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  return rp(options)
    .then((result) => {
      const quoteObj = result;
      const quoteText = quoteObj.quoteText;
      const quoteAuthor = quoteObj.quoteAuthor || '';
      const quote = `${quoteText}-${quoteAuthor}`;
      let quotestring = quote.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
      if (typeof quotestring === 'undefined' || quotestring == 'undefined-') {
        quotestring = 'Success is not the key to happiness Happiness is the key to success.\n'
                    + ' If you love what you are doing you will be successful -Albert Schweitzer .';
      }
      return quotestring;
    })
    .catch(err => err);
}

function sendTextResponseToUser(event, quoteToUser) {
  const sender = event.sender.id;
  const options = {
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: fbPageToken },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: {
        text: quoteToUser,
        quick_replies: [{
          content_type: 'text',
          title: 'One more Quote?',
          payload: 'QUOTES',
        },
        {
          content_type: 'text',
          title: 'No',
          payload: '',
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
