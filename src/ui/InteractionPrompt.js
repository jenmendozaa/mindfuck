import {
  UI_FONT,
  UI_COLORS,
} from './uiTheme.js';

export default class InteractionPrompt {
  constructor(scene) {
    this.scene = scene;

    this.container = scene.add
      .container(320, 306)
      .setScrollFactor(0)
      .setDepth(300)
      .setVisible(false);

    // Dark backing panel.
    this.panel = scene.add
      .rectangle(
        0,
        0,
        150,
        30,
        UI_COLORS.panel,
        0.96
      )
      .setOrigin(0.5);

    // Pixel-style border.
    const border = UI_COLORS.border;
    const accent = UI_COLORS.accent;

    this.framePieces = [
      // Top / bottom
      scene.add.rectangle(
        0, -15, 138, 2, border
      ).setOrigin(0.5),

      scene.add.rectangle(
        0, 15, 138, 2, border
      ).setOrigin(0.5),

      // Left / right
      scene.add.rectangle(
        -75, 0, 2, 20, border
      ).setOrigin(0.5),

      scene.add.rectangle(
        75, 0, 2, 20, border
      ).setOrigin(0.5),

      // Small accent blocks.
      scene.add.rectangle(
        -69, -12, 8, 3, accent
      ).setOrigin(0.5),

      scene.add.rectangle(
        69, 12, 8, 3, accent
      ).setOrigin(0.5),
    ];

    this.text = scene.add
      .text(
        0,
        1,
        '',
        {
          fontFamily: UI_FONT,
          fontSize: '10px',
          color: UI_COLORS.text,
          align: 'center',
        }
      )
      .setOrigin(0.5);

    this.container.add([
      this.panel,
      ...this.framePieces,
      this.text,
    ]);
  }

  show(label = 'INTERACT') {
    this.text.setText(
      `[ ENTER ]  ${label}`
    );

    this.container.setVisible(true);
  }

  hide() {
    this.container.setVisible(false);
  }

  destroy() {
    this.container.destroy(true);
  }
}