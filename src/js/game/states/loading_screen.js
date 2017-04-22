var loading_screen = {};
var effect;
var image;
var mask = new Phaser.Rectangle();
var spaceKey;

loading_screen.create = function () {
  effect = loading_screen.make.bitmapData();
  effect.load('logo');

  image = loading_screen.add.image(loading_screen.world.centerX, loading_screen.world.centerY, effect);
  image.anchor.set(0.5);
  image.scale.setTo(0.5, 0.5);
  image.smoothed = false;

  mask.setTo(0, 0, effect.width, loading_screen.cache.getImage('raster').height);

  //  Tween the rasters
  loading_screen.add.tween(mask).to( { y: -(mask.height - effect.height) }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, 100, true);

  //  Tween the image
  loading_screen.add.tween(image.scale).to( { x: 1, y: 1 }, 1500, Phaser.Easing.Elastic.InOut, true, 100, 100, true);

  this.spaceKey = loading_screen.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  loading_screen.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
};


loading_screen.update = function () {
  effect.alphaMask('raster', effect, mask);
  // image.rotation += 0.001

  if (this.spaceKey.isDown) {
    loading_screen.sound.play('get_ready');
    this.game.state.start('game');
  }
};

module.exports = loading_screen;
