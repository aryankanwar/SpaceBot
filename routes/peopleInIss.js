const rp                = require('request-promise');
const Promise           = require('bluebird');
var commonFunctions     = require('./commonFunctions.js'); 
exports.sendResponse    = sendResponse;

function sendResponse(event) {
    Promise.coroutine(function* () {
        var spaceNumber      = yield peopleInSpace();
        var sendResponse     = yield sendResponseToFb(event, spaceNumber);
        return sendResponse;
    })().then((sendResponse) => {
        return sendResponse;
    }, (error) => {
        return error;
    })
}
function peopleInSpace() {
    var options = {
        uri: 'http://api.open-notify.org/astros.json',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    return rp(options)
        .then((result) => {
            if(result.number && result.people && Array.isArray(result.people)){
                var peopleObj = '';
                result.people.map((n)=>{
                    spaceInfo = "- "  + n.name + " is on " + n.craft + "\n" ;
                    peopleObj += spaceInfo 
                 })    
                 var resultObj = "Total Number : " + result.number +  "\n"  
                                 + peopleObj;     
            }else {
                resultObj = "Sorry! People in Iss are not available";              
            }
            return resultObj;
        })
        .catch((err) => {
            return err;
        });
}

function sendResponseToFb(event, spaceObj) {
    return new Promise((resolve, reject) => {
        commonFunctions.sendTextResponseToUser(event, spaceObj, {
            send: function(obj) {
                var resultObj = obj;
                return resolve(resultObj);           
            }
        });
    })
}
