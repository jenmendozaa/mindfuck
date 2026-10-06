import {
  UI_FONT,
  UI_COLORS,
} from './uiTheme.js';

export default class ObjectiveUI {
 constructor(scene, compact = false, light = false) {
  this.scene = scene;
  this.compact = compact;

    // Keep the HUD fixed to the camera.
    this.container = scene.add
      .container(14, 12)
      .setScrollFactor(0)
      .setDepth(300);

    // --------------------------------
    // PANEL
    // --------------------------------

    // Slightly smaller than the first version.
    this.width = 180;
    this.height = compact ? 45 : 67;

    // CookingScene can request a lighter panel
    // without changing the normal global style.
    const panelColor = light
      ? 0x6f557c
      : UI_COLORS.panel;

    this.panel = scene.add
      .rectangle(
        0,
        0,
        this.width,
        this.height,
        panelColor,
        0.96
      )
      .setOrigin(0, 0);

      this.panel.setDepth(0);

    // --------------------------------
    // PIXEL FRAME
    // --------------------------------

    // Instead of a normal stroke, the border is
    // built from rectangles so it feels more like
    // part of the pixel-art game.
    const border = UI_COLORS.border;
    const accent = UI_COLORS.accent;

    this.framePieces = [
      // Top
      scene.add.rectangle(
        6,
        0,
        this.width - 12,
        3,
        border
      ).setOrigin(0, 0),

      // Bottom
      scene.add.rectangle(
        6,
        this.height - 3,
        this.width - 12,
        3,
        border
      ).setOrigin(0, 0),

      // Left
      scene.add.rectangle(
        0,
        6,
        3,
        this.height - 12,
        border
      ).setOrigin(0, 0),

      // Right
      scene.add.rectangle(
        this.width - 3,
        6,
        3,
        this.height - 12,
        border
      ).setOrigin(0, 0),

      // Stepped corners
      scene.add.rectangle(
        3,
        3,
        6,
        3,
        border
      ).setOrigin(0, 0),

      scene.add.rectangle(
        this.width - 9,
        3,
        6,
        3,
        border
      ).setOrigin(0, 0),

      scene.add.rectangle(
        3,
        this.height - 6,
        6,
        3,
        border
      ).setOrigin(0, 0),

      scene.add.rectangle(
        this.width - 9,
        this.height - 6,
        6,
        3,
        border
      ).setOrigin(0, 0),
    ];

    // --------------------------------
    // LABEL
    // --------------------------------

    this.labelText = scene.add.text(
      12,
      8,
      'OBJECTIVE',
      {
        fontFamily: UI_FONT,
        fontSize: '8px',
        color: UI_COLORS.secondaryText,
      }
    );

    // Small pink line next to the label.
    this.labelAccent = scene.add.rectangle(
      12,
      20,
      42,
      2,
      accent
    ).setOrigin(0, 0);

    this.labelText.setDepth(1);

    // --------------------------------
    // OBJECTIVE
    // --------------------------------

    this.objectiveText = scene.add.text(
      12,
      25,
      '',
      {
        fontFamily: UI_FONT,
        fontSize: '13px',
        color: UI_COLORS.text,
      }
    );

    this.objectiveText.setDepth(1);

    // --------------------------------
    // PROGRESS
    // --------------------------------

    this.progressLabel = scene.add.text(
  12,
  compact ? 32 : 49,
  '',
  {
    fontFamily: UI_FONT,
    fontSize: '8px',
    color: UI_COLORS.secondaryText,
  }
);

    this.progressDots = [];

    this.container.add([
      this.panel,
      ...this.framePieces,
      this.labelText,
      this.labelAccent,
      this.objectiveText,
      this.progressLabel,
    ]);
  }

  setObjective(text, progress = null) {
    this.objectiveText.setText(text);

    if (progress) {
      this.progressLabel.setText(
        progress.label
      );

      this.createProgress(
        progress.current,
        progress.total
      );
    } else {
      this.progressLabel.setText('');
      this.clearProgress();
    }
  }

  setProgress(current, total = null) {
    const finalTotal =
      total ?? this.progressTotal;

    this.createProgress(
      current,
      finalTotal
    );
  }

  createProgress(current, total) {
    this.clearProgress();

    this.progressTotal = total;

    const startX = 72;
    const y = 54;

    for (let i = 0; i < total; i += 1) {
      const filled = i < current;

      // Dark backing square.
      const backing = this.scene.add
        .rectangle(
          startX + i * 16,
          y,
          11,
          9,
          UI_COLORS.progressEmpty
        )
        .setOrigin(0, 0.5);

      this.progressDots.push(backing);
      this.container.add(backing);

      // Filled squares get a smaller bright
      // center, giving them a chunky pixel look.
      if (filled) {
        const fill = this.scene.add
          .rectangle(
            startX + 2 + i * 16,
            y,
            7,
            5,
            UI_COLORS.progressFilled
          )
          .setOrigin(0, 0.5);

        this.progressDots.push(fill);
        this.container.add(fill);
      }
    }
  }

  clearProgress() {
    this.progressDots.forEach(
      (dot) => dot.destroy()
    );

    this.progressDots = [];
  }

  complete(text = 'COMPLETE!') {
    this.objectiveText.setText(text);
    this.progressLabel.setText('');
    this.clearProgress();

    // Make completion feel a little different
    // without needing a whole animation yet.
    this.labelText.setText('OBJECTIVE COMPLETE');
    this.labelAccent.width = 72;
  }

  hide() {
    this.container.setVisible(false);
  }

  show() {
    this.container.setVisible(true);
  }

  destroy() {
    this.container.destroy(true);
  }
}