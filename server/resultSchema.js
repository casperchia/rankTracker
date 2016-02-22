/**
 * Created by Casper on 13/02/2016.
 */
var mongoose = require('mongoose');



var Result = mongoose.model('Result', resultSchema);

module.exports = Result;