import { UI_FONT, UI_COLORS } from '../ui/uiTheme.js';

export default class MessagePlatform {
  constructor(
    scene,
    x,
    y,
    {
      speaker = '',
      text = '',
      width = 180,
      style = 'nat',
    } = {}
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.speaker = speaker;
    this.message = text;
    this.requestedWidth = width;
    this.style = style;

    this.container = null;
    this.background = null;
    this.messageText = null;
    this.physicsBody = null;

    this.create();
  }

  // ---------------------------------
  // SIZE
  // ---------------------------------

  getBubbleSize() {
    if (this.requestedWidth <= 145) {
      return {
        width: 145,
        height: 72,
        fontSize: '10px',
        textWidth: 105,
      };
    }

    if (this.requestedWidth <= 190) {
      return {
        width: 185,
        height: 82,
        fontSize: '10px',
        textWidth: 140,
      };
    }

    return {
      width: 225,
      height: 94,
      fontSize: '10px',
      textWidth: 175,
    };
  }

  getTexture() {
    return this.style === 'jen'
      ? 'jen-message'
      : 'nat-message';
  }

  create() {
    const size = this.getBubbleSize();

    this.width = size.width;
    this.height = size.height;

    // ---------------------------------
    // CONTAINER
    // ---------------------------------

    this.container = this.scene.add.container(
      this.x,
      this.y
    );

    // ---------------------------------
    // MESSAGE FRAME
    // ---------------------------------

    this.background = this.scene.add
      .image(
        0,
        0,
        this.getTexture()
      )
      .setDisplaySize(
        this.width,
        this.height
      );

    // ---------------------------------
    // MESSAGE
    // ---------------------------------

    this.messageText = this.scene.add.text(
      0,
      5,
      this.message,
      {
        fontFamily: UI_FONT,
        fontSize: size.fontSize,
        color: UI_COLORS.text,

        align: 'center',

        wordWrap: {
          width: size.textWidth,
          useAdvancedWrap: true,
        },

        lineSpacing: 2,
      }
    );

    this.messageText.setOrigin(0.5);

    this.container.add([
      this.background,
      this.messageText,
    ]);

    this.container.setDepth(50);

    // ---------------------------------
    // PHYSICS PLATFORM
    // ---------------------------------

    // Keep the collision surface shallower
    // than the visible message bubble.
    // Jen should feel like she's standing
    // ON the message, not inside it.

    const platformHeight = 14;

    this.physicsBody = this.scene.add.rectangle(
    this.x,
    this.y - this.height / 2 + 35,
    this.width - 12,
    platformHeight,
    0x000000,
    0
  );

    this.scene.physics.add.existing(
      this.physicsBody,
      true
    );

    this.physicsBody.setDepth(49);
  }

  getPlatform() {
    return this.physicsBody;
  }

  destroy() {
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }

    if (this.physicsBody) {
      this.physicsBody.destroy();
      this.physicsBody = null;
    }
  }
}