var game = {};

game.create = function () {
  // use arcade physics
  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  // introduce our hero
  player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
  player.anchor.setTo(0.5, 0.5);
  player.scale.setTo(300,300);
  this.game.physics.arcade.enable(player);
  player.enableBody = true;
  player.body.bounce.setTo(0.9, 0.9);
  player.body.collideWorldBounds=true;

  // enable cursor keys
  cursors = this.input.keyboard.createCursorKeys();
};

game.update = function () {
  if (cursors.up.isDown) {
      this.game.physics.arcade.accelerationFromRotation(player.rotation, 300, player.body.acceleration);
  } else {
      player.body.acceleration.set(0);
  }

  if (cursors.left.isDown) {
      player.body.angularVelocity = -300;
  } else if (cursors.right.isDown) {
      player.body.angularVelocity = 300;
  } else {
      player.body.angularVelocity = 0;
  }
}

module.exports = game;
