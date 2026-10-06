import Phaser from 'phaser';

import DebugMenu from '../debug/DebugMenu.js';
import saveManager from '../systems/saveManager.js';
import musicManager from '../systems/MusicManager.js';
import sfxManager from '../systems/SFXManager.js';

import { UI_FONT } from '../ui/uiTheme.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    musicManager.play(this, 'music-title');
    
    this.debugMenu = new DebugMenu(this);

    this.cameras.main.setBackgroundColor('#100d16');

    this.saveData = saveManager.load();

    this.selectedIndex = 0;
    this.transitioning = false;

    this.createBackground();
    this.createTitle();
    this.createMenu();
    this.createControls();

    this.cameras.main.fadeIn(
      600,
      0,
      0,
      0
    );
  }

  createBackground() {
  this.add
    .image(320, 180, 'title-desk-final')
    .setDisplaySize(640, 360)
    .setDepth(0);
}

  createTitle() {
  // Small decorative line
  this.add.text(
    390,
    60,
    '♡  ✦  ♡',
    {
      fontFamily: UI_FONT,
      fontSize: '9px',
      color: '#f1b8d2',
    }
  )
    .setOrigin(0.5)
    .setDepth(10);

  // Main title
  this.add.text(
    390,
    82,
    'MINDFUCK',
    {
      fontFamily: UI_FONT,
      fontSize: '30px',
      color: '#fff0f6',
      stroke: '#542f4c',
      strokeThickness: 4,
    }
  )
    .setOrigin(0.5)
    .setDepth(10);

  // Subtitle
  this.add.text(
    390,
    108,
    'getting in my head',
    {
      fontFamily: UI_FONT,
      fontSize: '10px',
      color: '#e7b8cc',
    }
  )
    .setOrigin(0.5)
    .setDepth(10);
}

  createMenu() {
  this.menuItems = [
    { label: 'PLAY', action: 'play' },
    ...(this.saveData.gameStarted
      ? [{ label: 'CHAPTER SELECT', action: 'chapters' }]
      : []),
    { label: 'ACHIEVEMENTS', action: 'achievements' },
    { label: 'ABOUT YOUR GF', action: 'about' },
    { label: 'PICTURES', action: 'pictures' },
    { label: 'SETTINGS', action: 'settings' },
  ];

  this.menuTexts = [];

  const startY = 145;
  const spacing = 27;

  this.menuItems.forEach((item, index) => {
    const text = this.add.text(
      390,
      startY + index * spacing,
      '',
      {
        fontFamily: UI_FONT,
        fontSize: '13px',
        color: '#d6a9bd',

        stroke: '#4c2b43',
        strokeThickness: 2,
      }
    )
      .setOrigin(0.5)
      .setDepth(10);

    this.menuTexts.push(text);
  });

  this.controlsText = this.add.text(
    390,
    325,
    '[↑ ↓] SELECT   [ENTER] CONFIRM',
    {
      fontFamily: UI_FONT,
      fontSize: '12px',
      color: '#b98da3',
    }
  )
    .setOrigin(0.5)
    .setDepth(10);

  this.updateSelection();
}

  createControls() {
    this.upKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.UP
      );

    this.downKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.DOWN
      );

    this.wKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.W
      );

    this.sKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.S
      );

    this.enterKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
      );
  }

  updateSelection() {
  this.menuTexts.forEach((text, index) => {
    const selected = index === this.selectedIndex;

    text.setText(
      `${selected ? '♡  ' : '   '}${this.menuItems[index].label}`
    );

    text.setColor(
      selected ? '#fff0f6' : '#d6a9bd'
    );

    text.setScale(
      selected ? 1.08 : 1
    );
  });
}

  moveSelection(direction) {
  this.selectedIndex =
    Phaser.Math.Wrap(
      this.selectedIndex + direction,
      0,
      this.menuItems.length
    );

  sfxManager.play(this, 'click');

  this.updateSelection();
}

  selectItem() {
  if (this.transitioning) {
    return;
  }

  const selected =
    this.menuItems[
      this.selectedIndex
    ];

  sfxManager.play(this, 'click');

    switch (selected.action) {
      case 'play':
        this.startGame();
        break;

      case 'chapters':
        this.startChapterSelect();
        break;

      case 'achievements':
        this.startAchievements();
        break;

      case 'about':
        this.startAboutYourGF();
        break;

      case 'pictures':
        this.startPictures();
        break;

      case 'settings':
        this.startSettings();
        break;
    }
  }

  startGame() {
    saveManager.reachChapter(1);

    this.transitioning = true;

    this.cameras.main.fadeOut(
      600,
      0,
      0,
      0
    );

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events
        .FADE_OUT_COMPLETE,
      () => {
        this.scene.start(
          'PrologueScene'
        );
      }
    );
  }

  startChapterSelect() {
    this.transitioning = true;

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
          'ChapterSelectScene',
          {
            endingComplete: false,
          }
        );
      }
    );
  }

  startAchievements() {
  if (this.transitioning) {
    return;
  }

  this.transitioning = true;

  this.cameras.main.fadeOut(
    400,
    0,
    0,
    0
  );

  this.cameras.main.once(
    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
    () => {
      this.scene.start(
        'AchievementsScene'
      );
    }
  );
}

startAboutYourGF() {
  if (this.transitioning) {
    return;
  }

  this.transitioning = true;

  this.cameras.main.fadeOut(
    400,
    0,
    0,
    0
  );

  this.cameras.main.once(
    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
    () => {
      this.scene.start(
        'AboutYourGFScene'
      );
    }
  );
}

startPictures() {
  if (this.transitioning) {
    return;
  }

  this.transitioning = true;

  this.cameras.main.fadeOut(
    400,
    0,
    0,
    0
  );

  this.cameras.main.once(
    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
    () => {
      this.scene.start('PicturesScene');
    }
  );
}

startSettings() {
  if (this.transitioning) {
    return;
  }

  this.transitioning = true;

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
        'SettingsScene'
      );
    }
  );
}

  update() {
    if (this.debugMenu) {
      this.debugMenu.update();

      if (this.debugMenu.isOpen) {
        return;
      }
    }

    if (this.transitioning) {
      return;
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.upKey
      ) ||
      Phaser.Input.Keyboard.JustDown(
        this.wKey
      )
    ) {
      this.moveSelection(-1);
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.downKey
      ) ||
      Phaser.Input.Keyboard.JustDown(
        this.sKey
      )
    ) {
      this.moveSelection(1);
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.enterKey
      )
    ) {
      this.selectItem();
    }
  }
}