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
        new question('16850898', ['LMAFO', 'LMMO', 'PMSL', 'LOLLOL'], 0, 'Its friday, lets get fired up...with?', 'bodyrocking'),
        new question('95489889', ['Lorde', 'Ellie Goulding', 'Yuna', 'Aluna George'], 0, 'Lets start Modern this time, which artist is this?', 'chineselady'),
        new question('83047270', ['Pharrell', 'Justin Timberlake', 'Snoop Dog', 'Ruff Styles'], 0, 'Just cos I love RnB so much. who does snoop dog feature?', 'zeebra'),
        new question('58641962', ['Ll Cool J', 'Will Smith', 'Jam Master Jay', 'MC Hammer'], 3, 'This singer is sexual chocolate, but who is it?...makes me wanna dance!', 'rnb'),
        new question('36953427', ['Kylie', 'Jessy J', 'Adele', 'Madonna'], 1, 'Something girly, for the girls........name the artist'),
        new question('75868018', ['Disclosure - White noize', 'Deadmauz - simple people', 'Groove Armada - deep', 'Zero 7 - home'], 0, 'My old dear got me into this tune, but what is it?'),
        new question('12438205', ['John Legend', 'Adele', 'Justin Timberlake', 'Snoop Dog'], 0, 'Name the artist, im already getting bored of trying to write something witty.', 'freshprince'),
        new question('38039626', ['John Legend', 'Usher feat Will-i-am', 'Usher', 'Ludacris'], 1, 'Curve ball.'),
        new question('49468930', ['Earth wind & fire', 'Marvin Gaye', 'Al Green', 'Otis Redding'], 2, 'Name this epic soul artist.'),
        new question('39798604', ['Mr Wendle', 'Mr Jones', 'Under the bridge', 'Loosing my religion'], 1, 'What is the song title of this Counting Crows classic!', 'friends'),
        new question('4617147', ['Marvin Gaye', 'Stevie Wonder',  'Al Green', 'Otis Redding'], 3, 'We aint done on the soul people.', 'disco'),
        new question('17806709', ['Sisqo - Thong song',  'Usher - U make me wanna', 'Genuwine - Pony', 'Jaheim - Just in case'], 2, 'Last one now guys. Almost there.'),
        new question('49393632', ['Marvin Gaye', 'Will Smith',  'Jazzy Jeff', 'Usher'], 1, 'Getting more modern now.'),
        new question('21890126', ['MGMT', 'The Foals',  'Keane', 'Snow Patrol'], 3, 'Going dawsons creek on you now.', 'friends'),
        new question('93555520', ['Deadmau5', 'Kaskade', 'Benny Benassi', 'Disclosure'], 3, 'No banter, name the artist.'),
        new question('59051244', ['Latch Feat Sam Smith', 'AudioFiles Feat Will-iam',  'Deadmauz', 'Mark Ronson feat Sam Smith'], 0, 'My favourite tune recently, name the artist.'),
        new question('9494852', ['Peter Andre', 'Chaka Demus and Pliers',  'Will Smith', 'Aswad'], 1, 'Who is this?')
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