/**
 * Created by Casper on 13/02/2016.
 */

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var PORT = 8080;
var bodyParser = require('body-parser');
var path = require('path');
var Result = require('./resultSchema.js');

app.set('views', path.join(__dirname, '/client'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/client')));
//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/season2')
//mongoose.connect('mongodb://localhost/test0')
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("Connected to MongoDB...");
})

app.get('/results/all', function(req, res){
    Result.find({}, function(err, results){
        if(err){
            res.json([]);
            return console.error(err);
        }else{
            console.log("app.get('/results/all') successful.")
            res.json(results);;
        }
    })
})


app.get('/results/:gameMode', function(req, res){
    var gameMode = req.params.gameMode;
    Result.find({gameMode: gameMode}, function(err, results){
        if(err){
            res.json([]);
            return console.error(err);
        }else{
            console.log("app.get('/results/:gameMode') successful.")
            res.json(results);;
        }
    })
})

app.post('/results/:gameMode', function(req, res){
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
            console.log("app.post('/results/:gameMode') save successful.")
            console.log("Saved: " + result);
            res.json(result);
        }
    });

})

app.get('/recent/:gameMode', function(req, res){
    var gameMode = req.params.gameMode;
    var RESULTS_TO_SHOW = 12;

    Result.count({gameMode: gameMode}, function(err, count){
        if(err){
            console.log("Result.count() error: " + err);
        }else{
            if(count < RESULTS_TO_SHOW) RESULTS_TO_SHOW = count;
            Result.find({gameMode: gameMode})
                .skip(count - RESULTS_TO_SHOW)
                .exec(function(err, results){
                    if(err){
                        res.json([]);
                        return console.error(err);
                    }else{
                        console.log("app.get('/recent/:gameMode') successful.")
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
               console.log("app.get('/last_game_data/:gameMode') successful.");
               if(results.length < 1){
                   res.json({});
               }else{
                   res.json(results[0]);
               }
           }
        });
})

// Delete most recent result
app.delete('/results/:gameMode', function(req, res){
    var gameMode = req.params.gameMode;

    Result.findOneAndRemove({gameMode: gameMode}, {sort: {gameNumber: -1}})
        .exec(function(error, doc){
        if(error){
            console.log(error);
            res.send(error);
        }else{
            console.log("app.delete('/results/:gameMode) successful.");
            res.send(doc);
        }
    });


})

app.get('/games_played_today/:gameMode', function(req, res){
    var gameMode = req.params.gameMode;

    var start = new Date();
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(0, 0, 0, 0);
    end.setDate(start.getDate() + 1);

    var query;
    if(gameMode == 'all'){
        query = {date: {$gte: start, $lt: end}};
    }else{
        query = {date: {$gte: start, $lt: end}, gameMode: gameMode};
    }

    Result.find(query)
        .count()
        .exec(function(err, results){
            if(err){
                console.log(err);
                res.json({});
            }else{
                console.log("app.get('/games_played_today/:gameMode') successful.");
                res.json({count: results})
            }
        });

});

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/client/index.html'));
    //res.render('index.html');
})

app.listen(PORT, function(err){
    if(err) return console.error(err);
    console.log("rankTracker api running on localhost:" + PORT);
})

