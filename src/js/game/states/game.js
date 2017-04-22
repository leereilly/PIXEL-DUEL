var game = {};

game.create = function () {
  var player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
  player.anchor.setTo(0.5, 0.5);
  player.scale.setTo(600,600);
};

module.exports = game;
