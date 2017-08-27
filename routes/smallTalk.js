const rp                       = require('request-promise');
const fbPageToken              = process.env.PAGE_ACCESS_TOKEN;
const apiAiToken               = process.env.API_AI_ACCESS_TOKEN
const apiaiApp                 = require('apiai')(apiAiToken);

exports.sendMessage = sendMessage;

function sendMessage(event) {
    let sender = event.sender.id;
    let text = event.message.text;
  
    let apiai = apiaiApp.textRequest(text, {
      sessionId: 'tabby_cat'
    });
  
    apiai.on('response', (response) => {
      if(response.result && response.result.hasOwnProperty("fulfillment" ) && 
          response.result.fulfillment.hasOwnProperty("speech")){
            var aiText = response.result.fulfillment.speech;
          } else {
            aiText   = "Sorry I didn't get that"; 
          }      
      var options = {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: fbPageToken },
        method: 'POST',
        json: {
          recipient: { id: sender },
          message: { text: aiText }
        }
      };
      rp(options)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          return err;
        });
    });
  
    apiai.on('error', (error) => {
      console.log(error);
    });
  
    apiai.end();
  }