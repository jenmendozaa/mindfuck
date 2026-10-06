import Phaser from 'phaser';

import {
  UI_FONT,
  UI_COLORS,
} from '../ui/uiTheme.js';

import sfxManager from './SFXManager.js';

export default class DialogueManager {
  constructor(scene) {
    this.scene = scene;

    this.isActive = false;
    this.isTyping = false;

    this.lines = [];
    this.currentLineIndex = 0;

    this.currentText = '';
    this.visibleText = '';

    this.typeDelay = 35;
    this.typeEvent = null;

    this.onComplete = null;
    this.lockMovement = true;

    this.objects = [];

    this.enterKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
  }

  start(lines, options = {}) {
    if (!lines || lines.length === 0) {
      return;
    }

    this.cleanup();

    this.isActive = true;
    this.lines = lines;
    this.currentLineIndex = 0;

    this.onComplete =
      options.onComplete ?? null;

    this.lockMovement =
      options.lockMovement ?? true;

    this.createDialogueBox();
    this.showCurrentLine();
  }

  createDialogueBox() {
  // --------------------------------
  // GENERATED FRAME
  // --------------------------------

  this.frame = this.scene.add
    .image(
      320,
      318,
      'dialogue-frame'
    )
    .setDisplaySize(
      570,
      105
    )
    .setDepth(5000)
    .setScrollFactor(0);

  // --------------------------------
  // TEMP PORTRAIT
  // --------------------------------
  // This sits inside the portrait opening
  // built into the generated frame.
  //
  // We'll replace J / N with actual portrait
  // images once the frame positioning is locked.

 this.portraitImage = this.scene.add
  .image(
    100,
    318,
    'nat-dialogue'
  )
  .setOrigin(0.5)
  .setDisplaySize(100, 100)
  .setDepth(5001)
  .setScrollFactor(0);

  // --------------------------------
  // SPEAKER NAME
  // --------------------------------

  this.speakerText = this.scene.add
  .text(
    150,
    330,
    '',
    {
      fontFamily: UI_FONT,
      fontSize: '8px',
      color: '#f1b8d2',
      align: 'center',
    }
  )
  .setOrigin(0.5)
  .setDepth(5001)
  .setScrollFactor(0);

  // --------------------------------
  // DIALOGUE TEXT
  // --------------------------------

  this.dialogueText = this.scene.add
  .text(
    380,
    329,
    '',
    {
      fontFamily: UI_FONT,
      fontSize: '12px',
      color: UI_COLORS.text,

      align: 'center',

      wordWrap: {
        width: 430,
        useAdvancedWrap: true,
      },

      lineSpacing: 3,
    }
  )
  .setOrigin(0.5)
  .setDepth(5001)
  .setScrollFactor(0);
  // --------------------------------
  // CONTINUE
  // --------------------------------

  this.continueText = this.scene.add
    .text(
      580,
      344,
      '[ENTER]',
      {
        fontFamily: UI_FONT,
        fontSize: '6px',
        color: UI_COLORS.secondaryText,
      }
    )
    .setOrigin(1, 0.5)
    .setDepth(5001)
    .setScrollFactor(0);

  this.objects = [
    this.frame,
    this.portraitImage,
    this.speakerText,
    this.dialogueText,
    this.continueText,
  ];
}

  showCurrentLine() {
    const line =
      this.lines[this.currentLineIndex];

    if (!line) {
      this.finish();
      return;
    }

    this.speakerText.setText(
      line.speaker ?? ''
    );

    this.updatePortrait(
    line.speaker
  );

    this.currentText = line.text ?? '';
    this.visibleText = '';

    this.dialogueText.setText('');
    this.continueText.setVisible(false);

    this.isTyping = true;

    let characterIndex = 0;

    this.typeEvent =
      this.scene.time.addEvent({
        delay: this.typeDelay,
        repeat:
          Math.max(
            this.currentText.length - 1,
            0
          ),

        callback: () => {
          if (!this.isTyping) {
            return;
          }

          this.visibleText +=
            this.currentText[
              characterIndex
            ] ?? '';

          characterIndex += 1;

          this.dialogueText.setText(
            this.visibleText
          );

          if (
            characterIndex >=
            this.currentText.length
          ) {
            this.completeTyping();
          }
        },
      });
  }

 updatePortrait(speaker) {
  const normalizedSpeaker =
    speaker?.toUpperCase() ?? '';

  if (normalizedSpeaker === 'NAT') {
    this.portraitImage
      .setTexture('nat-dialogue')
      .setDisplaySize(100, 100)
      .setVisible(true);

    return;
  }

  if (normalizedSpeaker === 'JEN') {
    this.portraitImage
      .setTexture('jen-dialogue')
      .setDisplaySize(90, 90)
      .setVisible(true);

    return;
  }

  this.portraitImage.setVisible(false);
}

  update() {
  if (!this.isActive) {
    return;
  }

  if (
    Phaser.Input.Keyboard.JustDown(
      this.enterKey
    )
  ) {
    // Enter while text is typing:
    // play the click and finish the line.
    if (this.isTyping) {
      sfxManager.play(
        this.scene,
        'click'
      );

      this.skipTyping();
      return;
    }

    // Enter after the line is finished:
    // play the click and advance.
    sfxManager.play(
      this.scene,
      'click'
    );

    this.advance();
  }
}

  skipTyping() {
    if (!this.isTyping) {
      return;
    }

    if (this.typeEvent) {
      this.typeEvent.remove(false);
      this.typeEvent = null;
    }

    this.visibleText = this.currentText;

    this.dialogueText.setText(
      this.currentText
    );

    this.completeTyping();
  }

  completeTyping() {
    this.isTyping = false;

    if (this.typeEvent) {
      this.typeEvent.remove(false);
      this.typeEvent = null;
    }

    this.continueText.setVisible(true);
  }

  advance() {
    this.currentLineIndex += 1;

    if (
      this.currentLineIndex >=
      this.lines.length
    ) {
      this.finish();
      return;
    }

    this.showCurrentLine();
  }

  finish() {
    const callback = this.onComplete;

    this.cleanup();

    if (callback) {
      callback();
    }
  }

  cleanup() {
    if (this.typeEvent) {
      this.typeEvent.remove(false);
      this.typeEvent = null;
    }

    this.objects.forEach((object) => {
      if (object && object.active) {
        object.destroy();
      }
    });

    this.objects = [];

    this.isActive = false;
    this.isTyping = false;

    this.lines = [];
    this.currentLineIndex = 0;

    this.currentText = '';
    this.visibleText = '';

    this.onComplete = null;
  }
}