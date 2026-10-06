import Phaser from 'phaser';

import TextController from '../systems/TextController.js';
import narration from '../data/narration.js';
import DebugMenu from '../debug/DebugMenu.js';
import {
  UI_FONT,
  UI_COLORS,
} from '../ui/uiTheme.js';

import sfxManager from '../systems/SFXManager.js';

import SettingsAccess from '../systems/SettingsAccess.js';

import musicManager from '../systems/MusicManager.js';

export default class NarrationScene extends Phaser.Scene {
  constructor() {
    super('NarrationScene');
  }

  init(data) {
    // Which narration transition should we play?
    this.transitionId = data?.transitionId || 'transition1';
  }

  create() {

    this.settingsAccess =
  new SettingsAccess(this);
  
    this.cameras.main.setBackgroundColor('#08070a');

    this.textController = new TextController(this);
    this.lastTypingSoundAt = 0;
this.typingSoundInterval = 140;

    // Narration should type a little faster than the Prologue.
    this.textController.typeDelay = 45;
    this.typingSound = null;

    this.transition = narration[this.transitionId];


    if (!this.transition) {
      console.error(
        `NarrationScene: No narration found for "${this.transitionId}".`
      );
      return;
    }

    // Chapter 5 music begins during its narration,
// after Chapter 4 has ended.
if (this.transitionId === 'transition5') {
  musicManager.interrupt(
    this,
    'ch5-ch6',
    {
      volume: 1,
      loop: true,
      fadeIn: true,
    }
  );
}

    this.pageIndex = 0;
    this.beatIndex = 0;

    this.isWaitingForPage = false;
    this.isFinished = false;
    this.currentPause = null;

    this.narrationText = this.add
  .text(320, 82, '', {
    fontFamily: UI_FONT,
    fontSize: '16px',
    color: UI_COLORS.text,
    align: 'center',

    wordWrap: {
      width: 500,
      useAdvancedWrap: true,
    },

    lineSpacing: 7,
  })
  .setOrigin(0.5, 0);

this.enterPrompt = this.add
  .text(320, 310, '', {
    fontFamily: UI_FONT,
    fontSize: '9px',
    color: UI_COLORS.secondaryText,
  })
  .setOrigin(0.5);

  this.leftDecoration = this.add
  .text(65, 180, '✦', {
    fontFamily: UI_FONT,
    fontSize: '11px',
    color: UI_COLORS.accent,
  })
  .setOrigin(0.5);

this.rightDecoration = this.add
  .text(575, 180, '♡', {
    fontFamily: UI_FONT,
    fontSize: '11px',
    color: UI_COLORS.accent,
  })
  .setOrigin(0.5);

    this.enterKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.debugMenu = new DebugMenu(this);

    this.startPage();
  }

  update() {
    if (this.debugMenu) {
      this.debugMenu.update();

      if (this.debugMenu.isOpen) {
        return;
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.handleEnter();
    }
  }

  startPage() {
    this.beatIndex = 0;
    this.isWaitingForPage = false;

    this.narrationText.setText('');
    this.hideEnterPrompt();

    this.playCurrentBeat();
  }

  playCurrentBeat() {
    const page = this.transition.pages[this.pageIndex];
    const beat = page.beats[this.beatIndex];

    if (!beat) {
      this.finishPage();
      return;
    }

    const textToAdd =
      this.beatIndex === 0
        ? beat.text
        : `\n\n${beat.text}`;

    const onComplete = () => {
      this.currentPause = this.time.delayedCall(
        beat.pauseAfter ?? 0,
        () => {
          this.currentPause = null;

          this.beatIndex += 1;

          if (this.beatIndex >= page.beats.length) {
            this.finishPage();
          } else {
            this.playCurrentBeat();
          }
        }
      );
    };

    this.startTypingSound();

if (this.beatIndex === 0) {
  this.textController.typeText(
    this.narrationText,
    textToAdd,
    () => {
      this.stopTypingSound();
      onComplete();
    }
  );
} else {
  this.textController.appendText(
    this.narrationText,
    textToAdd,
    () => {
      this.stopTypingSound();
      onComplete();
    }
  );
}
  }

  finishPage() {
    const isLastPage =
      this.pageIndex >= this.transition.pages.length - 1;

    this.isWaitingForPage = true;
    this.isFinished = isLastPage;

    this.showEnterPrompt();
  }

  playTypingSound(character) {
  // Don't make sounds for spaces or line breaks.
  if (/\s/.test(character)) {
    return;
  }

  const now = this.time.now;

  // Prevent the sound from becoming machine-gun fast.
  if (
    now - this.lastTypingSoundAt <
    this.typingSoundInterval
  ) {
    return;
  }

  this.lastTypingSoundAt = now;

  sfxManager.play(
  this,
  'typing',
  {
    volume: 0.35,
    rate: 1,
  }
);
}

startTypingSound() {
  this.stopTypingSound();

  this.typingSound = this.sound.add(
    'typing',
    {
      volume: sfxManager.isMuted
        ? 0
        : sfxManager.volume * 0.45,

      loop: true,
    }
  );

  // The first ~1.25 seconds of the recording
  // is mostly silence.
  this.typingSound.play({
    seek: 1.25,
  });
}

stopTypingSound() {
  if (this.typingSound) {
    this.typingSound.stop();
    this.typingSound.destroy();
    this.typingSound = null;
  }
}

  handleEnter() {
    // First press while text is typing:
    // finish the current beat immediately.
    if (this.textController.isTyping) {
  sfxManager.play(this, 'click');

  this.textController.completeImmediately(
    this.narrationText
  );

  this.stopTypingSound();

  return;
}
    // Don't interrupt the intentional pause between beats.
    if (this.currentPause) {
      return;
    }

    if (!this.isWaitingForPage) {
  return;
}

sfxManager.play(this, 'click');

if (this.isFinished) {
  this.finishNarration();
  return;
}

    this.pageIndex += 1;
    this.startPage();
  }

  finishNarration() {
    this.stopTypingSound();
    this.hideEnterPrompt();

    this.cameras.main.fadeOut(
      500,
      0,
      0,
      0
    );

    this.time.delayedCall(550, () => {
      this.scene.start(this.transition.nextScene);
    });
  }

  showEnterPrompt() {
    this.enterPrompt.setText('[ ENTER ] CONTINUE');
  }

  hideEnterPrompt() {
    this.enterPrompt.setText('');
  }
}