var quotes = require('random-movie-quotes')
exports.quoteUser = quoteUser;

function quoteUser(callback){
	return callback(null,quotes.getQuote());
}
