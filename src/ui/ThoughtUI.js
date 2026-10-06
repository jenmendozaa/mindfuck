import {
  UI_FONT,
  UI_COLORS,
} from './uiTheme.js';

export const MIN_THOUGHT_DURATION = 3200;

export default class ThoughtUI {
  constructor(scene) {
    this.scene = scene;

    this.container = scene.add
      .container(320, 314)
      .setScrollFactor(0)
      .setDepth(300)
      .setVisible(false);

    // Final generated thought frame.
    this.frame = scene.add
      .image(
        0,
        0,
        'thought-frame'
      )
      .setDisplaySize(
        570,
        150
      );

    // Jen's thought text sits over the empty
    // center of the generated frame.
    this.text = scene.add
      .text(
        0,
        17,
        '',
        {
          fontFamily: UI_FONT,
          fontSize: '11px',
          color: UI_COLORS.text,

          align: 'center',

          wordWrap: {
            width: 430,
            useAdvancedWrap: true,
          },

          lineSpacing: 2,
        }
      )
      .setOrigin(0.5);

    this.container.add([
      this.frame,
      this.text,
    ]);

    this.hideTimer = null;
  }

  show(
  text,
  duration = MIN_THOUGHT_DURATION,
  fontSize = '11px'
) {
  if (this.hideTimer) {
    this.hideTimer.remove(false);
    this.hideTimer = null;
  }

  const actualDuration =
    duration === null
      ? null
      : Math.max(
          duration,
          MIN_THOUGHT_DURATION
        );

  this.text.setFontSize(fontSize);
  this.text.setText(text);

  this.container.setVisible(true);

  if (actualDuration !== null) {
    this.hideTimer =
      this.scene.time.delayedCall(
        actualDuration,
        () => {
          this.hide();
        }
      );
  }
}

  hide() {
    this.container.setVisible(false);

    if (this.hideTimer) {
      this.hideTimer.remove(false);
      this.hideTimer = null;
    }
  }

  destroy() {
    if (this.hideTimer) {
      this.hideTimer.remove(false);
      this.hideTimer = null;
    }

    this.container.destroy(true);
  }
}