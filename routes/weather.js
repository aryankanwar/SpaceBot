
const cheerio  = require('cheerio');
const request  = require('request');
exports.getLatestTemp = getLatestTemp;

 function getLatestTemp(query, callback){
 url = 'https://www.google.com/search' + "?"  + "q=" +query;
  request(url, function (error, response, html) {
  	//console.log(html);
    if (!error && response.statusCode == 200) {
      var $             = cheerio.load(html); //loading hrml content through cheerio
      var weatherText   = $('#ires').text();
      var weatherList   = weatherText.split("\n");
      var cleanArray    = weatherList.filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")});
       var weatherList1 = cleanArray[0].split("|")[0].replace("�", "°"); 
       var weatherList2 = cleanArray[0].split(":")[2].split("%")[0];
       var Temp         = weatherList1 + "and Humidity is" +  weatherList2 +"%"; 
      return callback(null, Temp);
  }
   return callback(error ,null);
}); 
}