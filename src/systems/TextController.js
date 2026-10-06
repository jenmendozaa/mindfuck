import Phaser from 'phaser';

export default class TextController {
  constructor(scene) {
    this.scene = scene;

    this.isTyping = false;
    this.currentText = '';
    this.currentIndex = 0;

    this.typeDelay = 65;
    this.typeEvent = null;

    // Stores the callback that should happen when
    // the current text finishes.
    this.currentOnComplete = null;

    this.enterKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
  }

  typeText(
    textObject,
    text,
    onComplete = null
  ) {
    this.stopTyping();

    this.isTyping = true;
    this.currentText = text;
    this.currentIndex = 0;
    this.currentOnComplete = onComplete;

    textObject.setText('');

    this.typeEvent = this.scene.time.addEvent({
      delay: this.typeDelay,
      repeat: text.length - 1,

      callback: () => {
        textObject.setText(
          text.substring(
            0,
            this.currentIndex + 1
          )
        );

        this.currentIndex += 1;

        if (
          this.currentIndex >= text.length
        ) {
          this.isTyping = false;
          this.typeEvent = null;

          const callback =
            this.currentOnComplete;

          this.currentOnComplete = null;

          if (callback) {
            callback();
          }
        }
      },
    });
  }

  appendText(
    textObject,
    text,
    onComplete = null
  ) {
    this.stopTyping();

    const startingText =
      textObject.text;

    let appendIndex = 0;

    this.isTyping = true;
    this.currentText =
      startingText + text;

    this.currentOnComplete =
      onComplete;

    this.typeEvent =
      this.scene.time.addEvent({
        delay: this.typeDelay,
        repeat: text.length - 1,

        callback: () => {
          appendIndex += 1;

          textObject.setText(
            startingText +
              text.substring(
                0,
                appendIndex
              )
          );

          if (
            appendIndex >= text.length
          ) {
            this.isTyping = false;
            this.typeEvent = null;

            const callback =
              this.currentOnComplete;

            this.currentOnComplete =
              null;

            if (callback) {
              callback();
            }
          }
        },
      });
  }

  completeImmediately(textObject) {
    if (!this.isTyping) {
      return false;
    }

    if (this.typeEvent) {
      this.typeEvent.remove();
      this.typeEvent = null;
    }

    textObject.setText(
      this.currentText
    );

    this.currentIndex =
      this.currentText.length;

    this.isTyping = false;

    // IMPORTANT:
    // Finishing with Enter should behave
    // exactly like finishing naturally.
    const callback =
      this.currentOnComplete;

    this.currentOnComplete = null;

    if (callback) {
      callback();
    }

    return true;
  }

  stopTyping() {
    if (this.typeEvent) {
      this.typeEvent.remove();
      this.typeEvent = null;
    }

    this.isTyping = false;
    this.currentOnComplete = null;
  }
}