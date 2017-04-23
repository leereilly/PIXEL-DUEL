var game = {};
var p1_color = 0x00AAAA; // cyan
var p2_color = 0xAA00AA; // magenta
var starting_size = 32;
var direction = "N/A";
var filter;
var sprite;
var speed = 4;
var acceleration = 200;
var max_speed = 250;
var drag = 0;
var velocity = 100;


var points_correct_wall   = 5;
var points_incorrect_wall = 2;

// visual effects
var flash_timer = 300;
var flash_timer_penalty = flash_timer * 10;
var shake_timer = 300;
var pointsAwarded = false;
var gameOver = false;


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
  music.volume = 0.2;

  p1_starting_size = starting_size;
  p2_starting_size = starting_size;

  binary = starting_size.toString(2);
  n = "00000000".substr(binary.length) + binary;

  p1_text = game.add.text(10, 10, n, {
    font: "14px Courier new",
    fill: "#55FFFF",
    align: "left"
  });

  p2_text = game.add.text(565, 10, n, {
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
  player1.body.bounce.setTo(0.5);
  player1.body.collideWorldBounds = false;
  player1.body.mass = 2;

  // introduce player2
  player2 = this.game.add.sprite(this.game.world.centerX + (starting_size * 2), this.game.world.centerY, 'player2');
  player2.anchor.setTo(0.5, 0.5);
  player2.scale.setTo(starting_size, starting_size);
  this.game.physics.arcade.enable(player2);
  player2.enableBody = true;
  player2.body.drag.set(70);
  player2.body.bounce.setTo(0.5);
  player2.body.collideWorldBounds = false;
  player2.angle += 180;
  player2.body.mass = 2;

  // enable cursor keys for p1
  cursors = this.input.keyboard.createCursorKeys();

  // enable WASD keys for p2
  wasd = {
    up: game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: game.input.keyboard.addKey(Phaser.Keyboard.S),
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D),
  };

  player2.body.maxVelocity.setTo(max_speed, max_speed);
  player2.body.drag.setTo(drag, drag);
};

game.update = function () {
  if (gameOver == true) {
      this.game.state.start('loading_screen');
  }

  filter.update(game.input.activePointer);

  // update the diddy ticker
  ticker = ticker + 1;

  if (ticker % 300 == 0) {
    direction = directions[Math.floor(Math.random()*directions.length)];
    console.debug("DIRECTION now " + direction);
    pointsAwarded = false;

    if (direction == "up") {
      game.sound.play('up');
    } else if (direction == "down") {
      game.sound.play('down');
    } else if (direction == "left") {
      game.sound.play('left');
    } else if (direction == "right") {
      game.sound.play('right');
    }
  }

  // velocity controls for p1
  if (wasd.up.isDown) {
      // player1.body.acceleration.x = Math.cos(player1.rotation) * acceleration;
      // player1.body.acceleration.y = Math.sin(player1.rotation) * acceleration;
      this.game.physics.arcade.accelerationFromRotation(player1.rotation, 100, player1.body.acceleration);
  } else {
      player1.body.acceleration.set(0);
  }

  // velocity controls for p2
  if (cursors.up.isDown) {
      // player2.body.acceleration.x = Math.cos(player2.rotation) * acceleration;
      // player2.body.acceleration.y = Math.sin(player2.rotation) * acceleration;
      this.game.physics.arcade.accelerationFromRotation(player2.rotation, 100, player2.body.acceleration);

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
  game.physics.arcade.collide(player1, left_wall, calculate_score, null);
	game.physics.arcade.collide(player1, right_wall, calculate_score, null);
  game.physics.arcade.collide(player1, top_wall, calculate_score, null);
  game.physics.arcade.collide(player1, bottom_wall, calculate_score, null);

  // this is what it's like when world collide for p2
  game.physics.arcade.collide(player2, left_wall, calculate_score, null);
	game.physics.arcade.collide(player2, right_wall, calculate_score, null);
  game.physics.arcade.collide(player2, top_wall, calculate_score, null);
  game.physics.arcade.collide(player2, bottom_wall, calculate_score, null);

  game.physics.arcade.collide(player1, player2)

}

calculate_score = function(player, wall) {
  score = 0;
  velocity = 0;

  console.debug("Calculating score for " + player.key + " against wall " + wall.key);

  if (wall.key == "top_wall") {
    if (direction == "up" && !pointsAwarded) {
      console.debug ("Top wall struck! + " + points_correct_wall);
      pointsAwarded = true;
      score = -points_correct_wall;
    }

    else {
      console.debug ("Top wall incorrect! - " + points_incorrect_wall);
      score = score + points_incorrect_wall;
    }
  }

  else if (wall.key == "bottom_wall" && !pointsAwarded) {
    if (direction == "down") {
      console.debug ("Bottom wall struck! + " + points_correct_wall);
      pointsAwarded = true;
      score = -points_correct_wall;
    }

    else {
      console.debug ("Bottom wall incorrect! - " + points_incorrect_wall)
      score = score + points_incorrect_wall;
    }
  }

  else if (wall.key == "left_wall" && !pointsAwarded) {
    if (direction == "left") {
      console.debug ("Left wall struck! + " + points_correct_wall);
      pointsAwarded = true;
      score = -points_correct_wall;
    }

    else {
      console.debug ("Left wall incorrect! - " + points_incorrect_wall);
      score = score + points_incorrect_wall;
    }
  }

  else if (wall.key == "right_wall" && !pointsAwarded) {
    if (direction == "right") {
      console.debug ("Right wall struck! + " + points_correct_wall);
      pointsAwarded = true;
      score = -points_correct_wall;
    }

    else {
      console.debug ("Right wall incorrect! - " + points_incorrect_wall);
      score = score + points_incorrect_wall;
    }
  }

  if (player.key == "player1") {
    console.debug("Awarding points and resizing for player 1");
    p1_starting_size = p1_starting_size + score;
    player1.scale.setTo(p1_starting_size, p1_starting_size);
    game.camera.flash(p1_color, flash_timer);
    p1_binary = p1_starting_size.toString(2);
    p1_n = "00000000".substr(p1_binary.length) + p1_binary;
    p1_text.setText(p1_n);
    game.sound.play('beep');
    game.camera.shake(0.15, shake_timer);

    if (p1_starting_size <= 0) {
      game.sound.stopAll();
      game.sound.play('pixel1_wins');
      gameOver = true;
    }

    else if (p1_starting_size > 200) {
      game.sound.stopAll();
      game.sound.play('pixel2_wins');
      gameOver = true;
    }

    else {
      p1_text.setText(p1_n);
      game.sound.play('beep');
      game.camera.shake(0.15, shake_timer);
    }
  }

  else {
    console.debug("Awarding points and resizing for player 2");
    p2_starting_size = p2_starting_size + score;
    player2.scale.setTo(p2_starting_size, p2_starting_size);
    game.camera.flash(p2_color, flash_timer);
    p2_binary = p2_starting_size.toString(2);
    p2_n = "00000000".substr(p2_binary.length) + p2_binary;

    if (p2_starting_size <= 0) {
      game.sound.stopAll();
      game.sound.play('pixel2_wins');
      gameOver = true;
    }

    else if (p2_starting_size > 200) {
      game.sound.stopAll();
      game.sound.play('pixel1_wins');
      gameOver = true;
    }

    else {
      p2_text.setText(p2_n);
      game.sound.play('beep');
      game.camera.shake(0.15, shake_timer);
    }
  }
}

module.exports = game;
