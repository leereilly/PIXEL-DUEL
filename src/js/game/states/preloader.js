var preloader = {};

preloader.preload = function () {
  this.game.load.image('player', 'images/player.png');
};

preloader.create = function () {
  this.game.state.start('game');
};

module.exports = preloader;
