const rp                          = require('request-promise');
exports.sendTextResponseToUser    = sendTextResponseToUser;
exports.sendImageResponseToUser   = sendImageResponseToUser;
exports.sendButtonResponseToUser  = sendButtonResponseToUser; 
const PAGE_ACCESS_TOKEN           = process.env.PAGE_ACCESS_TOKEN;

/////////////////////////////////////////////////////////////////////////////////////
///////////////////FUNCTION FOR BOT TO SEND TEXT RESPONSE ///////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

function sendTextResponseToUser(event, textToSend) {
    let sender  = event.sender.id;
    let text    = textToSend;
    if(typeof text == "undefined"){
        text = "Sorry! I can't respond to this command at this moment";
    }
    var options = {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: { text: text }
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

/////////////////////////////////////////////////////////////////////////////////////
///////////////////FUNCTION FOR BOT TO VIDEO/IMAGE TEXT RESPONSE ///////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

function sendImageResponseToUser(event, Link, type) {
    let sender       = event.sender.id;
    if(typeof Link == "undefined"){
        text = "Sorry! I can't respond to this command at this moment";
    }
    var options = {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: {
                attachment: {
                    type: type,
                    payload: { url: Link }
                }
            }
        }
    };
     rp(options)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });
}

/////////////////////////////////////////////////////////////////////////////////////
////////////////////////SENDING BUTTON TEMPLATE//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

function sendButtonResponseToUser(event, linkObj) {
    let sender = event.sender.id;
    var options = {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: sender },            
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "Check Video!",
                        buttons: [{
                            type  : "web_url",
                            url   :  linkObj,
                            title : "Visit Link"
                        }]
                    }
                }
            }
        }
    };
    rp(options)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });
}
