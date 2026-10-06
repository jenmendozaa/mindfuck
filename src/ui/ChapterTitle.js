import Phaser from 'phaser';

import {
  UI_FONT,
  UI_COLORS,
} from './uiTheme.js';

export default class ChapterTitle {
  constructor(scene) {
    this.scene = scene;
    this.objects = [];
  }

  show(chapterNumber, title, onComplete = null) {
  const width = this.scene.scale.width;
  const height = this.scene.scale.height;

  const background = this.scene.add
    .rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x08070a
    )
    .setScrollFactor(0)
    .setDepth(1000);

  const chapterText = this.scene.add
  .text(
    width / 2,
    height / 2 - 48,
    `CHAPTER ${chapterNumber}`,
    {
      fontFamily: UI_FONT,
      fontSize: '11px',
      color: UI_COLORS.secondaryText,
      align: 'center',
    }
  )
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(1001);

const titleText = this.scene.add
  .text(
    width / 2,
    height / 2 - 8,
    title,
    {
      fontFamily: UI_FONT,
      fontSize: '24px',
      color: UI_COLORS.text,
      align: 'center',

      wordWrap: {
        width: 500,
        useAdvancedWrap: true,
      },
    }
  )
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(1001);

const decorationText = this.scene.add
  .text(
    width / 2,
    height / 2 + 27,
    '♡  ✦  ♡',
    {
      fontFamily: UI_FONT,
      fontSize: '9px',
      color: UI_COLORS.accent,
    }
  )
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(1001);

const continueText = this.scene.add
  .text(
    width / 2,
    height / 2 + 68,
    '[ ENTER ]  CONTINUE',
    {
      fontFamily: UI_FONT,
      fontSize: '9px',
      color: UI_COLORS.secondaryText,
    }
  )
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(1001);

  this.objects = [
    background,
    chapterText,
    titleText,
    decorationText,
    continueText,
  ];

  const enterKey =
    this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

  this.continueHandler = () => {
  this.scene.sound.play('click');

  this.hide();

  if (onComplete) {
    onComplete();
  }
};

  enterKey.once('down', this.continueHandler);
}

  hide() {
  this.objects.forEach((object) => {
    object.destroy();
  });

  this.objects = [];
  this.continueHandler = null;
}
}