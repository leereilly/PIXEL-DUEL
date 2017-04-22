var preloader = {};

preloader.preload = function () {
  this.game.load.image('player',      'images/player.png');
  this.game.load.image('left_wall',   'images/vertical-wall.png');
  this.game.load.image('right_wall',  'images/vertical-wall.png');
  this.game.load.image('top_wall',    'images/horizontal-wall.png');
  this.game.load.image('bottom_wall', 'images/horizontal-wall.png');
};

preloader.create = function () {
  this.game.state.start('game');
};

module.exports = preloader;
