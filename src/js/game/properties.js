var npmProperties = require('../../../package.json');

module.exports = {
  title: 'Phaser JS Boilerplate',
  description: npmProperties.description,
  port: 3017,
  liveReloadPort: 3018,
  mute: false,
  showStats: false,
  size: {
    x: 640,
    y: 200
  },
  //analyticsId: 'UA-50892214-2'
};
