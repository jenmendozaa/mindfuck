import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import PrologueScene from './scenes/PrologueScene.js';
import PartyScene from './scenes/PartyScene.js';
import BedroomScene from './scenes/BedroomScene.js';
import CookingScene from './scenes/CookingScene.js';
import DriveToHerScene from './scenes/DriveToHerScene.js';
import RealizationScene from './scenes/RealizationScene.js';
import BitCityScene from './scenes/BitCityScene.js';
import { AdventureDriveScene } from './scenes/AdventureDriveScene.js';
import MorningScene from './scenes/MorningScene.js';
import MindfuckScene from './scenes/MindfuckScene.js';
import AchievementsScene from './scenes/AchievementsScene.js';
import AboutYourGFScene from './scenes/AboutYourGFScene.js';
import PicturesScene from './scenes/PicturesScene.js';
import NarrationScene from './scenes/NarrationScene.js';
import SettingsScene from './scenes/SettingsScene.js';



import ChapterSelectScene from './scenes/ChapterSelectScene.js';

import TitleScene from './scenes/TitleScene.js';


const config = {
  type: Phaser.AUTO,

  width: 640,
  height: 360,

  parent: 'game',

  backgroundColor: '#17141f',

  pixelArt: true,
  antialias: false,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 900,
      },
      debug: false,
    },
  },

  scene: [BootScene,  TitleScene, SettingsScene, AchievementsScene, AboutYourGFScene, PicturesScene, PrologueScene, NarrationScene,
   PartyScene, BedroomScene, CookingScene, DriveToHerScene, RealizationScene,
    BitCityScene, AdventureDriveScene, MorningScene, MindfuckScene, ChapterSelectScene,],
};

export default config;