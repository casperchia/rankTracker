/**
 * Created by Casper on 13/02/2016.
 */

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var PORT = 8080;
var bodyParser = require('body-parser');
var path = require('path');

//var Result = require('./resultSchema');
var autoIncrement = require('mongoose-auto-increment');

app.set('views', path.join(__dirname, '/client'));
app.set('view engine', 'ejs');

app.use(express.static('../node_modules'));
app.use(express.static(path.join(__dirname, '/client')));
//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/test3')
var db = mongoose.connection;
autoIncrement.initialize(db);

var resultSchema = mongoose.Schema({
    gameMode: {type: String, required: true},
    result: {type: String, required: true},
    rank: {type: Number, required: true},
    gameNumber: {type: Number, required: true},
    date: Date
});

resultSchema.plugin(autoIncrement.plugin, 'Result')
var Result = mongoose.model('Result', resultSchema);


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("Connected to MongoDB...");
})



app.get('/results/:gameMode', function(req, res){
    var gameMode = req.params.gameMode;
    Result.find({gameMode: gameMode}, function(err, results){
        if(err){
            res.json([]);
            return console.error(err);
        }else{
            res.json(results);;
        }
    })
})

app.post('/results/:gameMode', function(req, res){
    console.log("print request: " + req);
    console.log(req.body);
    var gameMode = req.params.gameMode;
    var result = req.body.result;
    var rank = req.body.rank;
    var gameNumber = req.body.gameNumber;
    var date = new Date();
    var newResult = new Result({gameMode: gameMode, result: result, rank: rank, gameNumber: gameNumber, date: date});
    newResult.save(function(err, result){
        if(err){
            res.send(err);
            return console.error(err);
        }else{
            console.log("Saved: " + result);
            res.json(result);
        }
    });

})

app.get('/recent/:gameMode', function(req, res){
    var gameMode = req.params.gameMode;
    var RESULTS_TO_SHOW = 20;

    //Result.find({gameMode: gameMode})
    //    .sort({date: -1})
    //    .limit(20)
    //    .exec(function(err, results){
    //        if(err){
    //            res.json([]);
    //            return console.error(err);
    //        }else{
    //            res.json(results);;
    //        }
    //    });

    Result.count({gameMode: gameMode}, function(err, count){
        if(err){
            console.log("Result.count() error: " + err);
        }else{
            if(count < 20) RESULTS_TO_SHOW = count;
            Result.find({gameMode: gameMode})
                .skip(count - RESULTS_TO_SHOW)
                .exec(function(err, results){
                    if(err){
                        res.json([]);
                        return console.error(err);
                    }else{
                        console.log("TEST: " + results);
                        res.json(results);;
                    }
                }
            );
        }
    })

})

app.get('/last_game_data/:gameMode', function(req, res){
    var gameMode = req.params.gameMode;
    Result.find({gameMode: gameMode})
        .sort({gameNumber: -1})
        .limit(1)
        .select('gameNumber rank')
        .exec(function(err, results){
           if(err){
               res.json([]);
               return console.error(err);
           }else{
               console.log(results);
               if(results.length < 1){
                   res.json({});
               }else{
                   res.json(results[0]);
               }
           }
        });
})

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/client/index.html'));
    //res.render('index.html');
})

app.listen(PORT, function(err){
    if(err) return console.error(err);
    console.log("rankTracker api running on localhost:" + PORT);
})

