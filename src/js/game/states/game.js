var game = {};

game.create = function () {
  // use arcade physics
  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  // start the clock
  ticker = 0;

  // directions
  direction  = "";
  directions = ["up", "down", "left", "right"];

  // build some walls
  left_wall   = this.game.add.sprite(0, 0, 'left_wall');
  right_wall  = this.game.add.sprite(665, 0, 'right_wall');
  top_wall    = this.game.add.sprite(0, 0, 'top_wall');
  bottom_wall = this.game.add.sprite(0, 665, 'bottom_wall');

  // make the walls a lil' bouncy
  this.game.physics.arcade.enable(left_wall);
  this.game.physics.arcade.enable(right_wall);
  this.game.physics.arcade.enable(top_wall);
  this.game.physics.arcade.enable(bottom_wall);

  // introduce our hero
  player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
  player.anchor.setTo(0.5, 0.5);
  player.scale.setTo(200,200);
  this.game.physics.arcade.enable(player);
  player.enableBody = true;
  player.body.drag.set(70);
  player.body.bounce.setTo(0.9, 0.9);
  player.body.collideWorldBounds=true;

  // enable cursor keys
  cursors = this.input.keyboard.createCursorKeys();
};

game.update = function () {
  // update the diddy ticker
  ticker = ticker + 1;

  if (ticker % 100 == 0) {
    direction = directions[Math.floor(Math.random()*directions.length)];
  }

  // player controls
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
