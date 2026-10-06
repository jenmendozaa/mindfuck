import Phaser from 'phaser';
import config from './config.js';
import './style.css';

async function startGame() {
  await document.fonts.ready;

  await document.fonts.load(
    '32px Yabikoma',
    'Mindfuck OBJECTIVE GET DRESSED'
  );

  console.log(
    'Yabikoma loaded before Phaser:',
    document.fonts.check('32px Yabikoma')
  );

  new Phaser.Game(config);
}

startGame();