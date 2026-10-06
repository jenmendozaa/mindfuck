import Phaser from 'phaser';

import DebugMenu from '../debug/DebugMenu.js';
import saveManager from '../systems/saveManager.js';
import sfxManager from '../systems/SFXManager.js';

import { UI_FONT } from '../ui/uiTheme.js';

export default class ChapterSelectScene extends Phaser.Scene {
  constructor() {
    super('ChapterSelectScene');
  }

  init(data) {
    this.endingComplete =
      data?.endingComplete ?? false;
  }

  create() {
    this.debugMenu =
      new DebugMenu(this);

    this.cameras.main.setBackgroundColor(
      '#100d16'
    );

    this.selectedIndex = 0;

    this.saveData =
     saveManager.load();

    const allChapters = [
  {
    number: 1,
    title: 'JUST A HOOK UP',
    scene: 'BedroomScene',
  },
  {
    number: 2,
    title: 'WE STILL GOING?',
    scene: 'DriveToHerScene',
  },
  {
    number: 3,
    title: 'FUCK, I MAYBE LIKE YOU',
    scene: 'RealizationScene',
  },
  {
    number: 4,
    title: 'BIT CITY',
    scene: 'BitCityScene',
  },
  {
    number: 5,
    title: 'ESCAPING THE BEDROOM',
    scene: 'AdventureDriveScene',
  },
  {
    number: 6,
    title: 'KEEPING IT COOL',
    scene: 'MorningScene',
  },
];

this.chapters = allChapters
  .filter(
    (chapter) =>
      chapter.number <=
      this.saveData.highestChapter
  )
  .map((chapter) => ({
    ...chapter,
    locked: false,
  }));

  if (this.saveData.endingComplete) {
  this.chapters.push({
    number: 7,
    title: '?',
    scene: null,
    locked: true,
  });
}

    this.createUI();
    this.createControls();

    if (this.endingComplete) {
      this.playEndingEntrance();
    } else {
      this.cameras.main.fadeIn(
        400,
        0,
        0,
        0
      );
    }

    this.transitioning = false;

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
  }

  createUI() {
  // -----------------------------------------------
  // BACKGROUND DECORATION
  // -----------------------------------------------

  this.add.rectangle(
    320,
    180,
    640,
    360,
    0x17101f
  );

  // Soft inner scrapbook area
  this.add.rectangle(
    320,
    180,
    560,
    310,
    0x24182d,
    0.92
  );

  // Little decorative stars/hearts
  this.add.text(
    70,
    45,
    '✦  ♡',
    {
      fontFamily: UI_FONT,
      fontSize: '11px',
      color: '#d996b7',
    }
  );

  this.add.text(
    550,
    292,
    '♡  ✦',
    {
      fontFamily: UI_FONT,
      fontSize: '11px',
      color: '#9c7ab5',
    }
  );

  // -----------------------------------------------
  // TITLE
  // -----------------------------------------------

  this.titleText = this.add.text(
    320,
    38,
    'CHAPTER SELECT',
    {
      fontFamily: UI_FONT,
      fontSize: '20px',
      color: '#fff0f6',
      stroke: '#542f4c',
      strokeThickness: 3,
    }
  )
    .setOrigin(0.5);

  this.add.text(
    320,
    60,
    'pick a memory',
    {
      fontFamily: UI_FONT,
      fontSize: '7px',
      color: '#c995ad',
    }
  )
    .setOrigin(0.5);

  // -----------------------------------------------
  // CHAPTER LIST
  // -----------------------------------------------

  this.chapterTexts = [];
  this.chapterCards = [];

  const startY = 92;
  const spacing = 32;

  this.chapters.forEach((chapter, index) => {
    const y =
      startY + index * spacing;

    const card = this.add.rectangle(
      320,
      y,
      455,
      25,
      0x35233f,
      0.82
    )
      .setStrokeStyle(
        1,
        0x765477,
        0.8
      );

    const text = this.add.text(
      320,
      y,
      '',
      {
        fontFamily: UI_FONT,
        fontSize: '9px',
        color: '#c3a8bd',
      }
    )
      .setOrigin(0.5);

    this.chapterCards.push(card);
    this.chapterTexts.push(text);
  });

  // -----------------------------------------------
  // CONTROLS
  // -----------------------------------------------

  this.controlsText = this.add.text(
    320,
    326,
    '[↑ ↓] SELECT   [ENTER] PLAY   [ESC] BACK',
    {
      fontFamily: UI_FONT,
      fontSize: '11px',
      color: '#9f849d',
    }
  )
    .setOrigin(0.5);

  this.updateSelection();
}

  createControls() {
    this.upKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard
          .KeyCodes.UP
      );

    this.downKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard
          .KeyCodes.DOWN
      );

    this.wKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard
          .KeyCodes.W
      );

    this.sKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard
          .KeyCodes.S
      );

    this.enterKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard
          .KeyCodes.ENTER
      );

  }

  updateSelection() {
  this.chapterTexts.forEach(
    (text, index) => {
      const chapter =
        this.chapters[index];

      const selected =
        index === this.selectedIndex;

      const marker =
        chapter.locked
          ? '?'
          : selected
            ? '♡'
            : '✦';

      text.setText(
        `${marker}   CHAPTER ${chapter.number} — ${chapter.title}`
      );

      text.setColor(
        chapter.locked
          ? '#766979'
          : selected
            ? '#fff0f6'
            : '#c3a8bd'
      );

      text.setScale(
        selected ? 1.05 : 1
      );

      this.chapterCards[index]
        .setFillStyle(
          selected
            ? 0x55364f
            : 0x35233f,
          selected ? 0.96 : 0.82
        )
        .setStrokeStyle(
          selected ? 2 : 1,
          selected
            ? 0xe0a4c1
            : 0x765477,
          selected ? 1 : 0.8
        );
    }
  );

  const selected =
    this.chapters[this.selectedIndex];

  if (selected.locked) {
    this.controlsText.setText(
      '[↑ ↓] SELECT   NOT YET...   [ESC] BACK'
    );
  } else {
    this.controlsText.setText(
      '[↑ ↓] SELECT   [ENTER] PLAY   [ESC] BACK'
    );
  }
}

  moveSelection(direction) {
  this.selectedIndex =
    Phaser.Math.Wrap(
      this.selectedIndex + direction,
      0,
      this.chapters.length
    );

  sfxManager.play(this, 'click');

  this.updateSelection();
}

  selectChapter() {
  const chapter =
    this.chapters[this.selectedIndex];

  if (chapter.locked) {
    return;
  }

  sfxManager.play(this, 'click');

  this.transitioning = true;

  this.cameras.main.fadeOut(
    350,
    0,
    0,
    0
  );

  this.cameras.main.once(
    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
    () => {
      this.scene.start(
        chapter.scene
      );
    }
  );
}

  playEndingEntrance() {
    // Coming here from the library should feel
    // slightly different from opening Chapter
    // Select normally.

    this.titleText.setAlpha(0);
    this.controlsText.setAlpha(0);

    this.chapterTexts.forEach(
      (text) => {
        text.setAlpha(0);
      }
    );

    this.chapterCards.forEach(
      (card) => {
        card.setAlpha(0);
      }
    );

    this.cameras.main.fadeIn(
      1000,
      0,
      0,
      0
    );

    this.time.delayedCall(
      700,
      () => {
        this.tweens.add({
          targets:
            this.titleText,
          alpha: 1,
          duration: 600,
        });

        this.chapterTexts.forEach(
          (text, index) => {
            const delay =
              250 + index * 180;

            this.tweens.add({
              targets: [
                this.chapterCards[index],
                text,
              ],
              alpha: 1,
              duration: 500,
              delay,
            });
          }
        );

        this.time.delayedCall(
          1800,
          () => {
            this.tweens.add({
              targets:
                this.controlsText,
              alpha: 1,
              duration: 400,
            });
          }
        );
      }
    );
  }

 returnToTitle() {
  if (this.transitioning) {
    return;
  }

  sfxManager.play(this, 'click');

  this.transitioning = true;

  // rest of your existing method stays the same
  this.cameras.main.fadeOut(
    400,
    0,
    0,
    0
  );

  this.cameras.main.once(
    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
    () => {
      this.scene.start('TitleScene');
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
    Phaser.Input.Keyboard.JustDown(this.upKey) ||
    Phaser.Input.Keyboard.JustDown(this.wKey)
  ) {
    this.moveSelection(-1);
  }

  if (
    Phaser.Input.Keyboard.JustDown(this.downKey) ||
    Phaser.Input.Keyboard.JustDown(this.sKey)
  ) {
    this.moveSelection(1);
  }

  if (
    Phaser.Input.Keyboard.JustDown(this.enterKey)
  ) {
    this.selectChapter();
  }
}
}