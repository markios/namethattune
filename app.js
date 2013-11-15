// requirements
var http = require('http'),
    _ = require('lodash'),
    io = require('socket.io'),
    Game = require('./scripts/game'),
    guid = require('./scripts/guid'),
    Player = require('./scripts/player'),
    express = require('express'),
    fs = require('fs'),
    argv = require('optimist').argv,
    app = express(),
    port = 5111,
    players = [],
    currentGame;
    
// configure
app.use(express.bodyParser());
app.use(express['static'](__dirname + '/public/'));
app.use('/styles', express['static'](__dirname + '/styles'));
app.use('/images', express['static'](__dirname + '/images'));
app.use('/players', express['static'](__dirname + '/players'));
app.use('/scripts', express['static'](__dirname + '/scripts'));
// app.use('/socket.io', express['static'](__dirname + '/node_modules/socket.io/node_modules/socket.io-client/dist'));

app.post('/postimage', function(req, res){
    var base64Data = req.body.imgBase64.replace(/^data:image\/png;base64,/,""),
        newPath = '/players/' + Date.now() + '.png';

    fs.writeFile(__dirname + newPath, base64Data, 'base64', function(err) {
        if(err) { res.json(400, {'message' : 'fucked'}); }
        else {
          res.json(200, {'message' : 'worked', 'player' : newPath});
        }
    });
    
});

// routes
// app.get('/', function(req, res){ });
app = app.listen(port);

var s = io.listen(app);

var getUser = function(id){
    return _.find(players, function(item, key){
       return item.id === id;
    });
};

s.sockets.on('connection', function (socket) {
    var newPlayer;
    socket.on('newPlayer', function (user) {

      if(currentGame) return;

      newPlayer = new Player.createPlayer(user, guid.new());
      players.push(newPlayer);
      // update other sockets in group
      s.sockets.emit('players', players);
    });

    socket.on('player_ready', function(id){
        var user = getUser(id);
        user.ready = true;

        s.sockets.emit('p_ready', user);

        var stillWaiting = _.find(players, function(player){
            return ! player.ready;
        });

        if(! stillWaiting) startGame();
    });

    socket.on('guess', function(guess){
        var result = currentGame.isCorrect(guess.result),
           nextQuestion;

        if(result) getUser(guess.playerId).score += 1;
        s.sockets.emit('player_chosen', guess.playerId);
        if(! currentGame.allAnswersIn()) return;

        nextQuestion = currentGame.nextQuestion();
        if(nextQuestion) s.sockets.emit('game_proceed', nextQuestion);
    });

    socket.on('chat', function(message){
        s.sockets.emit('new_chat_message', message);
    });

    socket.on('disconnect', function () {
        players = _.filter(players, function(p){ return p.id !== newPlayer.id; });
        s.sockets.emit('r_user', newPlayer);
    });
});

var startGame = function(){
     currentGame = new Game();
     currentGame.gameComplete = function(){
       console.log('im ending it');
       s.sockets.emit('game_over', players);
     };
     currentGame.userCount = players.length;
     s.sockets.emit('game_proceed', currentGame.start());
};


// run the app

console.log(
    '\n\nWidget test running on ' + port
);
