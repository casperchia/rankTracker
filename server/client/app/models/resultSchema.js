/**
 * Created by Casper on 13/02/2016.
 */
var mongoose = require('mongoose');

var resultSchema = mongoose.Schema({
    gameMode: {type: String, required: true},
    result: {type: String, required: true},
    rank: {tier: Number, division: Number},
    gameNumber: {type: Number, required: true},
    date: Date
});

var Result = mongoose.model('Result', resultSchema);

module.exports = Result;