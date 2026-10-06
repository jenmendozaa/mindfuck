import Phaser from 'phaser';

import DebugMenu from '../debug/DebugMenu.js';
import saveManager from '../systems/saveManager.js';
import achievements from '../data/achievements.js';

import sfxManager from '../systems/SFXManager.js';
import { UI_FONT } from '../ui/uiTheme.js';

export default class AchievementsScene extends Phaser.Scene {
  constructor() {
    super('AchievementsScene');
  }

  create() {
    this.debugMenu = new DebugMenu(this);

    this.cameras.main.setBackgroundColor(
      '#100d16'
    );

    this.saveData = saveManager.load();

    this.createUI();

    this.escHandler = (event) => {
      if (event.key === 'Escape') {
        this.returnToTitle();
      }
    };

    window.addEventListener(
      'keydown',
      this.escHandler
    );

    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        window.removeEventListener(
          'keydown',
          this.escHandler
        );
      }
    );

    this.cameras.main.fadeIn(
      400,
      0,
      0,
      0
    );

    this.transitioning = false;
  }

  createUI() {
  // -----------------------------------------------
  // BACKGROUND
  // -----------------------------------------------

  this.add.rectangle(
    320,
    180,
    640,
    360,
    0x17101f
  );

  this.add.rectangle(
    320,
    180,
    560,
    310,
    0x24182d,
    0.92
  );

  // Decorative framing
  this.add.text(
    70,
    45,
    '♡  ✦',
    {
      fontFamily: UI_FONT,
      fontSize: '11px',
      color: '#d996b7',
    }
  );

  this.add.text(
    550,
    292,
    '✦  ♡',
    {
      fontFamily: UI_FONT,
      fontSize: '11px',
      color: '#9c7ab5',
    }
  );

  // -----------------------------------------------
  // TITLE
  // -----------------------------------------------

  this.add.text(
    320,
    35,
    'ACHIEVEMENTS',
    {
      fontFamily: UI_FONT,
      fontSize: '20px',
      color: '#fff0f6',
      stroke: '#542f4c',
      strokeThickness: 3,
    }
  ).setOrigin(0.5);

  const unlockedCount =
    achievements.filter(
      (achievement) =>
        this.saveData.achievements.includes(
          achievement.id
        )
    ).length;

  this.add.text(
    320,
    58,
    `${unlockedCount} / ${achievements.length} FOUND`,
    {
      fontFamily: UI_FONT,
      fontSize: '10px',
      color: '#c995ad',
    }
  ).setOrigin(0.5);

  // -----------------------------------------------
  // ACHIEVEMENTS
  // -----------------------------------------------

  const startY = 88;
  const spacing = 42;

  achievements.forEach(
    (achievement, index) => {
      const unlocked =
        this.saveData.achievements.includes(
          achievement.id
        );

      const y =
        startY + index * spacing;

      // Achievement card
      this.add.rectangle(
        320,
        y + 9,
        455,
        34,
        unlocked
          ? 0x35233f
          : 0x2a202f,
        unlocked
          ? 0.88
          : 0.6
      )
        .setStrokeStyle(
          1,
          unlocked
            ? 0x765477
            : 0x4c414f,
          0.8
        );

      // Icon slot
      this.add.rectangle(
        116,
        y + 9,
        28,
        28,
        unlocked
          ? 0x4a3049
          : 0x211a25,
        1
      )
        .setStrokeStyle(
          1,
          unlocked
            ? 0xb47b9d
            : 0x514653,
          0.9
        );

      const iconKey =
  achievement.iconKey;

      if (unlocked && iconKey) {
        this.add.image(
          116,
          y + 9,
          iconKey
        )
          .setDisplaySize(23, 23);
      } else {
        this.add.text(
          116,
          y + 9,
          unlocked ? '✦' : '?',
          {
            fontFamily: UI_FONT,
            fontSize: unlocked
              ? '10px'
              : '12px',
            color: unlocked
              ? '#d996b7'
              : '#625667',
          }
        ).setOrigin(0.5);
      }

      // Name
      this.add.text(
        140,
        y - 2,
        unlocked
          ? achievement.title
          : '???',
        {
          fontFamily: UI_FONT,
          fontSize: '11px',
          color: unlocked
            ? '#fff0f6'
            : '#665b69',
        }
      );

      // Description
      this.add.text(
        140,
        y + 10,
        unlocked
          ? achievement.description
          : 'Undiscovered.',
        {
          fontFamily: UI_FONT,
          fontSize: '10px',
          color: unlocked
            ? '#c9aebf'
            : '#5e5361',
        }
      );
    }
  );

  // -----------------------------------------------
  // CONTROLS
  // -----------------------------------------------

  this.add.text(
    320,
    333,
    '[ESC] BACK',
    {
      fontFamily: UI_FONT,
      fontSize: '10px',
      color: '#9f849d',
    }
  ).setOrigin(0.5);
}

 returnToTitle() {
  if (this.transitioning) {
    return;
  }

  sfxManager.play(this, 'click');

  this.transitioning = true;

  // existing fade code...

    this.cameras.main.fadeOut(
      400,
      0,
      0,
      0
    );

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events
        .FADE_OUT_COMPLETE,
      () => {
        this.scene.start(
          'TitleScene'
        );
      }
    );
  }

  update() {
    if (this.debugMenu) {
      this.debugMenu.update();
    }
  }
}