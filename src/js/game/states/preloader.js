var preloader = {};

preloader.preload = function () {
  // images
  this.game.load.image('player',      'images/player.png');
  this.game.load.image('left_wall',   'images/vertical-wall.png');
  this.game.load.image('right_wall',  'images/vertical-wall.png');
  this.game.load.image('top_wall',    'images/horizontal-wall.png');
  this.game.load.image('bottom_wall', 'images/horizontal-wall.png');

  // audio
  this.game.load.audio('beep', 'audio/beep.mp3');
};

preloader.create = function () {
  this.game.state.start('game');
};

module.exports = preloader;
