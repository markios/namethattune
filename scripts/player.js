var player = function(np, id){
    this.id = id;
    this.name = np.name;
    this.ready = false;
    this.avatar = np.avatar;
    this.score = 0;
    this.colour = np.colour || '#7B68EE';
};

player.prototype.updateGuess = function(game, question, answer){
    this[game].question = answer;
};

module.exports.createPlayer = player;