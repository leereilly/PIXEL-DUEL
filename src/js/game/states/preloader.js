var preloader = {};

preloader.preload = function () {
  // images
  this.game.load.image('player1',     'images/player1.png');
  this.game.load.image('player2',     'images/player2.png');
  this.game.load.image('left_wall',   'images/vertical-wall.png');
  this.game.load.image('right_wall',  'images/vertical-wall.png');
  this.game.load.image('top_wall',    'images/horizontal-wall.png');
  this.game.load.image('bottom_wall', 'images/horizontal-wall.png');

  this.game.load.image('logo', 'images/logo.png');
  this.game.load.image('raster', 'images/raster.png');

  // audio
  this.game.load.audio('music', 'audio/music.wav');
  this.game.load.audio('beep', 'audio/boom.mp3');
  this.game.load.audio('get_ready', 'audio/ready-set-pixelduel.mp3');
  this.game.load.audio('pixel1_wins', 'audio/pixel-one-wins.mp3');
  this.game.load.audio('pixel2_wins', 'audio/pixel-two-wins.mp3');
};

preloader.create = function () {
  this.game.state.start('loading_screen');
};

module.exports = preloader;
