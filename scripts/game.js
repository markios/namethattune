/*
    A class for a user game
*/

var question = function(songId, answers, correct, title, pic){
    this.songId = songId;
    this.title = title;
    this.answers = answers;
    this.correct = correct;
    this.picture = pic;
},

game = function(){
    this.items = [
        new question('88365103', ['Bernard Wright', 'Nile Rodgers', 'Hank Shocklee', 'Roy Budd'], 1, 'This is epic, and we all know who it is, but who is the famous guitarist?', 'get_lucky'),
        new question('16850898', ['LMAFO', 'LMMO', 'PMSL', 'LOLLOL'], 0, 'Its friday, lets get fired up...with?', 'bodyrocking'),
        new question('129495405', ['Eagulls', 'Cheatuhs', 'Mazes', 'Childhood'], 0, 'Ahh Leeds, birthplace of Kaiser Chiefs, Keith Lemon and now.....', 'punk'),
        new question('114238860', ['Pink', 'Katy B', 'Keisha', 'Katy Perry'], 2, 'Pitbull, man he churns em out right?. But who is his latest partner in this annoying tune!', 'chineselady'),
        new question('82301115', ['Riptide', 'Big Waves', 'Dark Side', 'Left Hand Man'], 0, 'A brilliant new singer from Melbourne Vance Joy, name that tune?', 'friends'),
        new question('92347741', ['Drank a potion', 'Rolling One', 'Dark Side', 'Sat by the Ocean'], 3, 'Queens of the stone age and their new tune called.....'),
        new question('50548577', ['j Holiday', 'Bobby V', 'Jeremia', 'Miguel'], 3, 'Adorn you is a tune, by who though?', 'rnb'),
        new question('106411581', ['When your down', 'Personnel Holiday', 'Prime Time', 'Prime Moment'], 2, 'So Miguel, pretty good right? well hes recently appeared on a song with Janelle Monae called?', 'bob')
    ];
    this.gameFinished = false;
    this.currentQuestion = 0;
    this.answerCount = 0;
};

game.prototype.allAnswersIn = function(){
    return this.answerCount === this.userCount;
};

game.prototype.isCorrect = function(answer){
    this.answerCount++;
    return this.items[this.currentQuestion].correct === +answer;
};

game.prototype.start = function(){
   return this.items[this.currentQuestion];
};

game.prototype.nextQuestion = function(){
    this.currentQuestion++;
    this.answerCount = 0;
    if(this.currentQuestion > this.items.length - 1) {
        this.gameFinished = true;
        if(this.gameComplete) this.gameComplete();
        return;
    } else {
        return this.items[this.currentQuestion];
    }
};

module.exports = game;