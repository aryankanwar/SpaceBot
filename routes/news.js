const cheerio  = require('cheerio');
const request  = require('request');
exports.getLatestNews = getLatestNews;

function getLatestNews(callback){
  request('http://timesofindia.indiatimes.com', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $          = cheerio.load(html); //loading hrml content through cheerio
      var ulList     = $('.list9').text(); //this ullist string contains list of latest news
      var listArray  = ulList.split("\n"); //converting ulList string to array
      var cleanArray = listArray.filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")}); //remove
      return callback(null, cleanArray[1]);
  }
  return callback(error ,null);
}); 
}