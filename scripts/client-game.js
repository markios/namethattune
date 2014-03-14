(function($, _, undefined){
    "use strict";

    window.version = 'tune-0.3';
    
    var frame, widget, socket, me;

    var tracks = ['23907786', '10029874', '19456444', '31017858'],
        palette = ['#790C7C', '#EEE744', '#5144EE', '#D35B8D', '#54A545'],
        players = [],
        clock,
        currentIndex = 0,
        funnyPics = {
            'rnb' : 'http://s3-ec.buzzfed.com/static/enhanced/web03/2012/9/8/17/anigif_enhanced-buzz-25954-1347139839-3.gif',
            'bodyrocking' : 'http://s3-ec.buzzfed.com/static/enhanced/web03/2012/9/8/17/anigif_enhanced-buzz-25952-1347141072-1.gif',
            'freshprince' : 'http://s3-ec.buzzfed.com/static/enhanced/web04/2012/9/8/18/anigif_enhanced-buzz-9349-1347142980-9.gif',
            'friends' : 'http://s3-ec.buzzfed.com/static/enhanced/web03/2012/9/8/18/anigif_enhanced-buzz-25977-1347143100-8.gif',
            'snoop' : 'http://s3-ec.buzzfed.com/static/enhanced/terminal05/2012/9/8/18/anigif_enhanced-buzz-14286-1347143996-12.gif',
            'zeebra' : 'http://s3-ec.buzzfed.com/static/enhanced/terminal05/2012/9/8/18/anigif_enhanced-buzz-13568-1347144320-19.gif',
            'disco' : 'http://s3-ec.buzzfed.com/static/enhanced/terminal05/2012/9/8/17/anigif_enhanced-buzz-5303-1347139716-5.gif',
            'chineselady' : 'http://24.media.tumblr.com/0b28d1bee4a0c68998abc15dab10cb53/tumblr_mftq7seB1C1rex97yo1_250.gif',
            'bob' : 'http://media.giphy.com/media/COn3OThVtaq1W/giphy.gif',
            'get_lucky' : 'http://media.giphy.com/media/mRknlUA0mux8s/giphy.gif',
            'will' : 'http://stream1.gifsoup.com/view5/4650025/will-i-am-o.gif',
            'punk' : 'http://31.media.tumblr.com/tumblr_lm59o0Ch6k1qj73e2o1_400.gif'

        },
        winning = [
            "Damn, you're on fire homes!",
            "Too easy",
            "Pretty quick, not bad!",
            "Not bad",
            "Muchos music knowledge my friend",
            "Australia salutes you....you know your stuff",
            "Im impressed"
        ],
        rubbish = [
            "On your bike",
            "Is your name Edwin?......",
            "So so wrong",
            "Get out, GET OUT!",
            "Not even close compadre!",
            "Oops, not the right answer",
            "Nope not that one"
        ];

    var createAndLoadImage = function(image, name){
        var i = new Image();
        i.src = image;
        i.onload = function(){
            console.log('image loaded ' + name);
        };
    };

    var getRandom = function(){
        return ~~(Math.random() * 7); 
    };

    var preloadImages = function(){
        for(var key in funnyPics){
            createAndLoadImage(funnyPics[key], key);
        }
    };

    var getURLForTrack = function(track) {
        return encodeURIComponent('http://api.soundcloud.com/tracks/') + track;
    };

    var bindAndPlay = function(){
      widget.bind(SC.Widget.Events.READY, function(){
        widget.play();
        $game.find('.game-area').fadeIn('fast');
        $game.find('.loading').hide();

        if(clock) clearTimeout(clock);
        clock = setTimeout(function(){ widget.pause(); }, 60000);
      });
    };

    var nextSong = function(track){
       widget.load(getURLForTrack(track), {
          show_artwork: false
       });
       bindAndPlay();
    };

    var createIframeFor = function(item){
    
      var urlTemplate = getURLForTrack(item),
          urlSalt = 'http://w.soundcloud.com/player/?url=';

        frame = $('<iframe width="150" height="166">').attr('src', urlSalt + urlTemplate);
          
        $('#player-area').html(frame);
        var widgetIframe = frame[0];
        widget = SC.Widget(widgetIframe);
        bindAndPlay();
    };


    var $signup = $('.sign-up'),
        $box = $('.box'),
        $players = $('.players'),
        $game = $('.game'),
        $chat = $('#chat-box'),
        $funnyPic = $('.funny-pic'),
        $chatInput = $('#chat-text', $chat),
        $chatContent = $('.content', $chat),
        $palette = $('.colour-palette'),
        currentPalette = 0,
        p_items = [];

    var canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        video = document.getElementById("video"),
        videoObj = { "video": true },
        errBack = function(error) {
          console.log("Video capture error: ", error.code); 
        };

    var addChat = function(){
       $chat.find('#submit-chat').click(function(){
          setChat();
       });

       $chatInput.on('keypress', function(e){
          if (e.keyCode == 13) setChat();
       });
    };

    var questionsSet = {};

    var currentQuestionNumber = 0;

    var setChat = function(){
          var message = $chatInput.val();

          if(message.length === 0) return;

          $chatInput.val('');

          socket.emit('chat', {playerName : me.name, playerColour : me.colour, message : message});
    };

    var showQuestion = function(game){
       $funnyPic.empty();
       $players.find('.player').removeClass('chosen');
       $game.html(_.template(questionTemplate, game));
       var $buttons = $game.find('button');
       if(game.picture) {
          $funnyPic.append('<img src="{pic}">'.replace('{pic}', funnyPics[game.picture]));

          setTimeout(function(){
              $funnyPic.find('img').fadeIn('slow');
          }, 5000);
       }
       $buttons.click(function(e){

          if(questionsSet[currentQuestionNumber]) return;

          var guess = $(e.currentTarget),
              guessIndex = +guess.attr('data-rel'),
              isRight = game.correct === guessIndex;
          // socket.emit('guess');
          guess.css('color', isRight ? '#54A545' : '#D35B8D');
          $game.find('.how-i-did').html(isRight ? winning[getRandom()] : rubbish[getRandom()]);
          if(! isRight) $($buttons.get(game.correct)).css('color', '#54A545');

          questionsSet[currentQuestionNumber] = true;

          setTimeout(function(){
            socket.emit('guess', {result : +guess.attr('data-rel'), playerId : me.id });
          }, 5000);
       });
       
       if(! widget) {
         createIframeFor(game.songId);
       }
       else {
         nextSong(game.songId);
       }
    };

    var getReadyForNextRound = function(){
        $game.html(_.template(getReadyTemplate));
    };

    var registerUser = function(userName, picture){

        socket = io.connect('http://' + window.location.hostname + ':5111');

        socket.on('connect', function () {
          socket.emit('newPlayer', { name : userName, colour : palette[currentPalette], avatar :  picture});

          socket.on('players', function (players) {
              $.each(players, function(key, player){
                player.isMe = player.name === userName;
                if(player.isMe) me = player;
                addPlayerName(player);
              });
              $('.player button', $players).on('click', function(e){
                  socket.emit('player_ready', $(e.currentTarget).parent().attr('id'));
              });
          });

          socket.on('p_ready', function(p){
              $players.find('#' + p.id).addClass('ready');
          });

          socket.on('new_chat_message', function(message){
              $chatContent.append(_.template(chatTemplate, message));
              $chatContent.animate({ scrollTop: $chatContent.prop("scrollHeight") - $chatContent.height() }, 500);
          });

          socket.on('round_over', function(game){
              getReadyForNextRound();
          });

          socket.on('game_proceed', function(game){
             currentQuestionNumber +=1;
             showQuestion(game);
          });

          socket.on('player_chosen', function(id){
             $players.find('#' + id).addClass('chosen');
          });

          socket.on('game_over', function(players){
             var highestScore = { score : 0 };
             _.each(players, function(p){
                if(p.score > highestScore.score) highestScore = p;
                $players.find('#' + p.id + ' .score').html(p.score);
             });
             $game.html("Sorry Gringos, it's all over <br><br>And the winner is " + highestScore.name);
          });

          socket.on('r_user', function(r){
            players = _.filter(players, function(p){ return p.id !== r.id; });
            $players.find('#' + r.id).remove();
          });

        });
    };

    var template =
      '<div id="<%=id%>" style="background-image:url(<%=avatar%>);" class="player <%if(ready){%>ready<%}%>" style="color:<%=colour%>">' +
      '<span><%=name%></span>'+
      '<span class="score"></span>'+
      '<%if(isMe){%>'+
      '  <button>Ready</button>' +
      '<%}%>'+
      '</div>';

    var questionTemplate =
      '<div class="loading">Loading track</div>' +
      '<div class="game-area">' +
      '    <div><%=title%></div><br>' +
      '    <% _.each(answers, function(name, index){ %>' +
      '       <button data-rel="<%=index%>" class="btn"><%=name%></button>' +
      '    <%});%>' +
      '    <div class="how-i-did"></div>' +
      '</div>';

    var getReadyTemplate = 
      '<h3>Get ready for the next question</h3>';

    var chatTemplate =
      '<div><span style="color:<%=playerColour%>" class="who"><%=playerName%> : </span><span class="what"><%=message%></span></div>';

    var addPlayerName = function(player){
      if(_.find(players, function(e){ return player.id === e.id; })) return;
      $players.append(_.template(template, player));
      players.push(player);
    };

    var postCanvasAsImage = function(){
        var dataURL = canvas.toDataURL();
        return $.ajax({
          type: "POST",
          url: "/postimage",
          data: { 
             imgBase64: dataURL
          }
        });
    };

    var HasPic = false;

    // BOOTSTRAP
    
    window.addEventListener("DOMContentLoaded", function() {
      
      // Put video listeners into place
      if(navigator.getUserMedia) { // Standard
          navigator.getUserMedia(videoObj, function(stream) {
          video.src = stream;
          video.play();
        }, errBack);
      } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
          navigator.webkitGetUserMedia(videoObj, function(stream){
          video.src = window.webkitURL.createObjectURL(stream);
          video.play();
        }, errBack);
      }

      $.each(palette, function(key, value){
         p_items.push($('<span>').addClass(key === 0 ? 'chosen' : '').css({'background-color' : value}));
      });

      $palette.append(p_items);

      $palette.find('span').click(function(e){
         p_items[currentPalette].removeClass('chosen');
         currentPalette = $(e.currentTarget).index();
         p_items[currentPalette].addClass('chosen');
      });

      /*  
          SIGNUP
      */
      $signup.find('.letsgo').click(function(){
        
         if(!HasPic) { alert('You need to take a picture homie'); return; }

         postCanvasAsImage()
             .then(function(data){
                 var name = $signup.find('#player_name').val();
                 if(name.length <= 0) return;
                 $signup.hide();
                 $box.show();
                 addChat();
                 registerUser(name, window.location.origin + data.player);
             }).fail(function(err){
                 console.log(error);
             });

      });

      document.getElementById("snap").addEventListener("click", function() {
        ctx.save();
        ctx.beginPath();
        // ctx.arc(150, 125, 100, 0, Math.PI*2, true); 
        ctx.rect(0, 0, 500, 500);
        ctx.closePath();
        ctx.clip();
        // draw the image
        ctx.drawImage(video, 0, 0, 320, 240);
        ctx.restore();
        HasPic = true;
      });

      preloadImages();

    }, false);

}(jQuery, _));