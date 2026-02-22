var preloader = {};
var barBg, barFill, loadingText;

preloader.preload = function () {
  var cx = this.game.world.centerX;
  var cy = this.game.world.centerY;
  var barWidth = 200;
  var barHeight = 12;

  // loading text
  loadingText = this.game.add.text(cx, cy - 20, 'LOADING...', {
    font: '14px Courier New',
    fill: '#FFFFFF',
    align: 'center'
  });
  loadingText.anchor.setTo(0.5);

  // progress bar background
  barBg = this.game.add.graphics(cx - barWidth / 2, cy);
  barBg.beginFill(0x333333);
  barBg.drawRect(0, 0, barWidth, barHeight);
  barBg.endFill();

  // progress bar fill (used as preload sprite)
  var bmd = this.game.add.bitmapData(barWidth, barHeight);
  bmd.ctx.fillStyle = '#00AAAA';
  bmd.ctx.fillRect(0, 0, barWidth, barHeight);
  barFill = this.game.add.sprite(cx - barWidth / 2, cy, bmd);
  this.game.load.setPreloadSprite(barFill);

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
  this.game.load.audio('music', 'audio/music.mp3');
  this.game.load.audio('beep', 'audio/boom.mp3');
  this.game.load.audio('get_ready', 'audio/ready-set-pixelduel.mp3');
  this.game.load.audio('pixel1_wins', 'audio/pixel-one-wins.mp3');
  this.game.load.audio('pixel2_wins', 'audio/pixel-two-wins.mp3');
  this.game.load.audio('left', 'audio/left.mp3');
  this.game.load.audio('right', 'audio/right.mp3');
  this.game.load.audio('up', 'audio/up.mp3');
  this.game.load.audio('down', 'audio/down.mp3');
};

preloader.create = function () {
  this.game.state.start('loading_screen');
};

module.exports = preloader;
