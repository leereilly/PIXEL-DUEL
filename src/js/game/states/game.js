var game = {};
var p1_color = 0x00AAAA; // cyan
var p2_color = 0xAA00AA; // magenta
var starting_size = 75;

var filter;
var sprite;

game.create = function () {
  // use arcade physics
  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  //  From http://glslsandbox.com/e#16133.0

    var fragmentSrc = [

      "precision mediump float;",

      "uniform float     time;",
      "uniform vec2      resolution;",

      "#define PI 0.0001",

      "void main( void ) {",

          "vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;",

          "float sx = 0.2*sin( 25.0 * p.y - time * 5.);",

          "float dy = 0.9/ ( 5. * abs(p.y - sx));",

          "gl_FragColor = vec4( (p.x + 0.01) * dy, 0.01 * dy, dy-1.65, 5.0 );",

      "}"
  ];

  filter = new Phaser.Filter(game, null, fragmentSrc);
  filter.setResolution(640, 200);

  sprite = game.add.sprite();
  sprite.width = 2000;
  sprite.height = 2000;

  sprite.filters = [ filter ];

  music = this.game.add.audio('music');
  music.loopFull(0.5);

  p1_starting_size = starting_size;
  p2_starting_size = starting_size;

  p1_text = game.add.text(200, 200, 'score: 0', { fontSize: '32px', fill: '#ff' });

  p1_text = game.add.text(10, 10, "Score", {
    font: "14px Courier new",
    fill: "#55FFFF",
    align: "left"
  });

  p2_text = game.add.text(570, 10, "Score", {
    font: "14px Courier new",
    fill: "#FF55FF",
    align: "right"
  });


  // start the clock
  ticker = 0;

  // directions
  direction  = "";
  directions = ["up", "down", "left", "right"];

  // build some walls
  left_wall   = this.game.add.sprite(0, 0, 'left_wall');
  right_wall  = this.game.add.sprite(639, 0, 'right_wall');
  top_wall    = this.game.add.sprite(0, 0, 'top_wall');
  bottom_wall = this.game.add.sprite(0, 199, 'bottom_wall');

  // make the walls a lil' bouncy
  this.game.physics.arcade.enable(left_wall);
  left_wall.body.immovable = true;
  this.game.physics.arcade.enable(right_wall);
  right_wall.body.immovable = true;
  this.game.physics.arcade.enable(top_wall);
  top_wall.body.immovable = true;
  this.game.physics.arcade.enable(bottom_wall);
  bottom_wall.body.immovable = true;

  // introduce player1
  player1 = this.game.add.sprite(this.game.world.centerX - (starting_size * 2), this.game.world.centerY, 'player1');
  player1.anchor.setTo(0.5, 0.5);
  player1.scale.setTo(starting_size, starting_size);
  this.game.physics.arcade.enable(player1);
  player1.enableBody = true;
  player1.body.drag.set(70);
  player1.body.bounce.setTo(0.9, 0.9);
  player1.body.collideWorldBounds = false;

  // introduce player2
  player2 = this.game.add.sprite(this.game.world.centerX + (starting_size * 2), this.game.world.centerY, 'player2');
  player2.anchor.setTo(0.5, 0.5);
  player2.scale.setTo(starting_size, starting_size);
  this.game.physics.arcade.enable(player2);
  player2.enableBody = true;
  player2.body.drag.set(70);
  player2.body.bounce.setTo(0.9, 0.9);
  player2.body.collideWorldBounds = false;
  player2.angle += 180;

  // enable cursor keys for p1
  cursors = this.input.keyboard.createCursorKeys();

  // enable WASD keys for p2
  wasd = {
    up: game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: game.input.keyboard.addKey(Phaser.Keyboard.S),
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D),
  };
};

game.update = function () {

  filter.update(game.input.activePointer);

  // update the diddy ticker
  ticker = ticker + 1;

  if (ticker % 100 == 0) {
    direction = directions[Math.floor(Math.random()*directions.length)];
  }

  // velocity controls for p1
  if (wasd.up.isDown) {
      this.game.physics.arcade.accelerationFromRotation(player1.rotation, 300, player1.body.acceleration);
  } else {
      player1.body.acceleration.set(0);
  }

  // velocity controls for p2
  if (cursors.up.isDown) {
      this.game.physics.arcade.accelerationFromRotation(player2.rotation, 300, player2.body.acceleration);
  } else {
      player2.body.acceleration.set(0);
  }

  // steering controls for p1
  if (wasd.left.isDown) {
      player1.body.angularVelocity = -300;
  } else if (wasd.right.isDown) {
      player1.body.angularVelocity = 300;
  } else {
      player1.body.angularVelocity = 0;
  }

  // steering controls for p2
  if (cursors.left.isDown) {
      player2.body.angularVelocity = -300;
  } else if (cursors.right.isDown) {
      player2.body.angularVelocity = 300;
  } else {
      player2.body.angularVelocity = 0;
  }

  // this is what it's like when world collide for p1
  game.physics.arcade.collide(player1, left_wall, p1_score, null);
	game.physics.arcade.collide(player1, right_wall, p1_score, null);
  game.physics.arcade.collide(player1, top_wall, p1_score, null);
  game.physics.arcade.collide(player1, bottom_wall, p1_score, null);

  // this is what it's like when world collide for p2
  game.physics.arcade.collide(player2, left_wall, p2_score, null);
	game.physics.arcade.collide(player2, right_wall, p2_score, null);
  game.physics.arcade.collide(player2, top_wall, p2_score, null);
  game.physics.arcade.collide(player2, bottom_wall, p2_score, null);

  game.physics.arcade.collide(player1, player2)

}

p1_score = function () {
  p1_starting_size = p1_starting_size - 10;
  if (p1_starting_size > 10) {
    player1.scale.setTo(p1_starting_size, p1_starting_size);
  }
  game.sound.play('beep');
  game.camera.flash(p1_color, 200);
  game.camera.shake(0.15, 200);
}

p2_score = function () {
  p2_starting_size = p2_starting_size - 10;
  if (p2_starting_size > 10) {
    player2.scale.setTo(p2_starting_size, p2_starting_size);
    binary = p2_starting_size.toString(2);
    n = "00000000".substr(binary.length)+binary;
    p2_text.setText(n);
  } else {
      game.sound.stopAll();
      game.sound.play('pixel1_wins');
  }

  game.sound.play('beep');
  game.camera.flash(p2_color, 200);
  game.camera.shake(0.15, 200);
}

module.exports = game;
