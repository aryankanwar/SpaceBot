const rp                = require('request-promise');
const Promise           = require('bluebird');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const NASA_TOKEN        = process.env.NASA_KEY

exports.sendResponse = sendResponse;

function sendResponse(event) {
    Promise.coroutine(function* () {
        var marsPicObj = yield marsPicture();
        var sendResponse = yield sendResponseLinkToFb(event, marsPicObj);

        return sendResponse;
    })().then((sendResponse) => {
        return sendResponse;
    }, (error) => {
        return error;
    })
}
function marsPicture() {
    var sol = (parseInt(Math.random() * 9) + 1) * 10;
    var options = {
        uri: "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=" + sol + "&api_key="+ NASA_TOKEN,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    return rp(options)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });
}

function sendResponseLinkToFb(event, marsPicObj) {
    let sender = event.sender.id;
    const max = 10;
    const min = 1;
    var i = parseInt(Math.random() * (max - min) + min);
    var j = parseInt(Math.random() * (max - min) + min);
    var k = parseInt(Math.random() * (max - min) + min);
    var l = parseInt(Math.random() * (max - min) + min);
    var m = parseInt(Math.random() * (max - min) + min);
    var options = {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title"     : marsPicObj.photos[i].camera.full_name,
                                "image_url" : marsPicObj.photos[i].img_src,
                                "subtitle"  : marsPicObj.photos[i].earth_date

                            },
                            {
                                "title"     : marsPicObj.photos[j].camera.full_name,
                                "image_url" : marsPicObj.photos[j].img_src,
                                "subtitle"  : marsPicObj.photos[k].earth_date
                            },
                            {
                                "title"     : marsPicObj.photos[k].camera.full_name,
                                "image_url" : marsPicObj.photos[k].img_src,
                                "subtitle"  : marsPicObj.photos[k].earth_date
                            }, {
                                "title"     : marsPicObj.photos[l].camera.full_name,
                                "image_url" : marsPicObj.photos[l].img_src,
                                "subtitle"  : marsPicObj.photos[l].earth_date
                            },
                            {
                                "title"     : marsPicObj.photos[m].camera.full_name,
                                "image_url" : marsPicObj.photos[m].img_src,
                                "subtitle"  : marsPicObj.photos[m].earth_date
                            }
                        ]
                    }
                }
            }
        }
    };

    return rp(options)
        .then((result) => {
        })
        .catch((err) => {
        });
}
