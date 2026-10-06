import {
  UI_FONT,
  UI_COLORS,
} from './uiTheme.js';

export default class MessageUI {
  constructor(
    scene,
    {
      sender = 'nat',
      x = 475,
      y = 85,
      width = 275,
      height = 115,
      depth = 300,
    } = {}
  ) {
    this.scene = scene;
    this.sender = sender;

    this.container = scene.add
      .container(x, y)
      .setScrollFactor(0)
      .setDepth(depth)
      .setVisible(false);

    // Nat and Jen each have their own frame art.
    this.frame = scene.add
      .image(
        0,
        0,
        this.getTexture(sender)
      )
      .setDisplaySize(
        width,
        height
      );

    // The sender's name is already baked into
    // the frame, so this is only message content.
    this.text = scene.add
      .text(
        0,
        8,
        '',
        {
          fontFamily: UI_FONT,
          fontSize: '12px',
          color: UI_COLORS.text,

          align: 'center',

          wordWrap: {
            width: width - 65,
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

  getTexture(sender) {
    return sender === 'jen'
      ? 'jen-message'
      : 'nat-message';
  }

  setSender(sender) {
    this.sender = sender;

    this.frame.setTexture(
      this.getTexture(sender)
    );
  }

  show(
    text,
    {
      duration = 4000,
      fontSize = '12px',
      playSound = true,
    } = {}
  ) {
    if (this.hideTimer) {
      this.hideTimer.remove(false);
      this.hideTimer = null;
    }

    this.text
      .setFontSize(fontSize)
      .setText(text);

    this.container.setVisible(true);

    if (
      playSound &&
      this.scene.cache.audio.exists('message')
    ) {
      this.scene.sound.play(
        'message',
        {
          volume: 0.8,
        }
      );
    }

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