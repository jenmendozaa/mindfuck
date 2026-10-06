import {
  UI_FONT,
  UI_COLORS,
} from './uiTheme.js';

export default class CompactThoughtUI {
  constructor(scene) {
    this.scene = scene;

    // Chapter 2 placement:
    // mostly on the left shoulder, with a little road overlap.
    this.container = scene.add
      .container(102, 185)
      .setScrollFactor(0)
      .setDepth(300)
      .setVisible(false);

    this.frame = scene.add
      .image(
        0,
        0,
        'thought-frame-compact'
      )
      .setDisplaySize(
        180,
        150
      );

    this.text = scene.add
      .text(
        -3,
        -5,
        '',
        {
          fontFamily: UI_FONT,
          fontSize: '14px',
          color: UI_COLORS.text,

          align: 'center',

          wordWrap: {
            width: 125,
            useAdvancedWrap: true,
          },

          lineSpacing: 3,
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
    duration = 3200,
    fontSize = '14px'
  ) {
    if (this.hideTimer) {
      this.hideTimer.remove(false);
      this.hideTimer = null;
    }

    this.text.setFontSize(fontSize);
    this.text.setText(text);

    this.container.setVisible(true);

    if (duration !== null) {
      this.hideTimer =
        this.scene.time.delayedCall(
          duration,
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