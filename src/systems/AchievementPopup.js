import Phaser from 'phaser';

import achievements from '../data/achievements.js';
import saveManager from './saveManager.js';
import sfxManager from './SFXManager.js';

import {
  UI_FONT,
  UI_COLORS,
} from '../ui/uiTheme.js';

export default class AchievementPopup {
  constructor(scene) {
    this.scene = scene;

    this.active = false;
    this.objects = [];
    this.enterKey = null;
    this.onComplete = null;
  }

  show(id, onComplete = null) {
    if (this.active) {
      return false;
    }

    const achievement =
      achievements.find(
        (item) => item.id === id
      );

    if (!achievement) {
      console.warn(
        `Unknown achievement: ${id}`
      );

      if (onComplete) {
        onComplete();
      }

      return false;
    }

    // Don't show the popup again if the
    // achievement was already unlocked.
    const newlyUnlocked =
      saveManager.unlockAchievement(id);

    if (!newlyUnlocked) {
      if (onComplete) {
        onComplete();
      }

      return false;
    }

    this.active = true;
    this.onComplete = onComplete;

    this.createPopup(achievement);

    return true;
  }

  createPopup(achievement) {
  const scene = this.scene;
  const width = scene.scale.width;
  const height = scene.scale.height;

  const centerX = width / 2;
  const centerY = height / 2;

  // -----------------------------------------
  // PALETTE
  // -----------------------------------------

  const COLORS = {
    panel: 0xfff9fc,
    panelPink: 0xfff4fa,
    border: 0xe5a8c8,
    accent: 0xd96fa3,
    accentDark: 0xb85c91,
    text: '#4a2945',
    secondaryText: '#6b4963',
    artFrame: 0xf3d9e8,
    shadow: 0x5c3652,
  };

  // -----------------------------------------
  // DARK OVERLAY
  // -----------------------------------------

  const overlay = scene.add
    .rectangle(
      centerX,
      centerY,
      width,
      height,
      0x1b1020,
      0.62
    )
    .setScrollFactor(0)
    .setDepth(6000);

  // -----------------------------------------
  // SOFT CARD SHADOW
  // -----------------------------------------

  const shadow = scene.add
    .rectangle(
      centerX + 5,
      centerY + 6,
      410,
      275,
      COLORS.shadow,
      0.35
    )
    .setScrollFactor(0)
    .setDepth(6001);

  // -----------------------------------------
  // MAIN CARD
  // -----------------------------------------

  const box = scene.add.graphics();

  box.fillStyle(
    COLORS.panel,
    1
  );

  box.fillRoundedRect(
    centerX - 200,
    centerY - 135,
    400,
    270,
    10
  );

  box.lineStyle(
    3,
    COLORS.border,
    1
  );

  box.strokeRoundedRect(
    centerX - 200,
    centerY - 135,
    400,
    270,
    10
  );

  box
    .setScrollFactor(0)
    .setDepth(6002);

  // -----------------------------------------
  // INNER CARD
  // -----------------------------------------

  const innerCard = scene.add.graphics();

  innerCard.lineStyle(
    1,
    0xf0c6dc,
    1
  );

  innerCard.strokeRoundedRect(
    centerX - 191,
    centerY - 126,
    382,
    252,
    7
  );

  innerCard
    .setScrollFactor(0)
    .setDepth(6003);

  // -----------------------------------------
  // LITTLE CORNER HEARTS
  // -----------------------------------------

  const cornerTL = scene.add
    .text(
      centerX - 180,
      centerY - 116,
      '♡',
      {
        fontFamily: UI_FONT,
        fontSize: '15px',
        color: COLORS.accent,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(6004);

  const cornerTR = scene.add
    .text(
      centerX + 180,
      centerY - 116,
      '♡',
      {
        fontFamily: UI_FONT,
        fontSize: '15px',
        color: COLORS.accent,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(6004);

  const cornerBL = scene.add
    .text(
      centerX - 180,
      centerY + 116,
      '✦',
      {
        fontFamily: UI_FONT,
        fontSize: '10px',
        color: COLORS.accentDark,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(6004);

  const cornerBR = scene.add
    .text(
      centerX + 180,
      centerY + 116,
      '✦',
      {
        fontFamily: UI_FONT,
        fontSize: '10px',
        color: COLORS.accentDark,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(6004);

  // -----------------------------------------
  // TOP DECORATION
  // -----------------------------------------

  const decoration = scene.add
    .text(
      centerX,
      65,
      '♡  ✦  ♡  ACHIEVEMENT  ♡  ✦  ♡',
      {
        fontFamily: UI_FONT,
        fontSize: '10px',
        color: COLORS.accentDark,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(6004);

  // -----------------------------------------
  // CUTE HEADER RIBBON
  // -----------------------------------------

  const ribbon = scene.add.graphics();

  ribbon.fillStyle(
    COLORS.accent,
    1
  );

  ribbon.fillRoundedRect(
    centerX - 125,
    80,
    250,
    27,
    7
  );

  ribbon
    .setScrollFactor(0)
    .setDepth(6003);

  // Little ribbon tails

  const ribbonLeft = scene.add
    .triangle(
      centerX - 132,
      93,
      0,
      0,
      18,
      8,
      0,
      16,
      COLORS.accentDark,
      1
    )
    .setScrollFactor(0)
    .setDepth(6003);

  const ribbonRight = scene.add
    .triangle(
      centerX + 132,
      93,
      18,
      0,
      0,
      8,
      18,
      16,
      COLORS.accentDark,
      1
    )
    .setScrollFactor(0)
    .setDepth(6003);

  const unlockedText = scene.add
    .text(
      centerX,
      93,
      'ACHIEVEMENT UNLOCKED',
      {
        fontFamily: UI_FONT,
        fontSize: '12px',
        color: '#fff9fc',
        stroke: '#b85c91',
        strokeThickness: 1,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(6005);

  // -----------------------------------------
  // ART FRAME
  // -----------------------------------------

  const artShadow = scene.add
    .rectangle(
      centerX + 2,
      153,
      78,
      62,
      COLORS.shadow,
      0.18
    )
    .setScrollFactor(0)
    .setDepth(6003);

  const artFrame = scene.add.graphics();

  artFrame.fillStyle(
    COLORS.artFrame,
    1
  );

  artFrame.fillRoundedRect(
    centerX - 38,
    122,
    76,
    58,
    5
  );

  artFrame.lineStyle(
    2,
    COLORS.border,
    1
  );

  artFrame.strokeRoundedRect(
    centerX - 38,
    122,
    76,
    58,
    5
  );

  artFrame
    .setScrollFactor(0)
    .setDepth(6004);

  // -----------------------------------------
  // ART DECORATION
  // -----------------------------------------

  const artDecorationLeft = scene.add
    .text(
      centerX - 52,
      150,
      '✦',
      {
        fontFamily: UI_FONT,
        fontSize: '8px',
        color: COLORS.accent,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(6005);

  const artDecorationRight = scene.add
    .text(
      centerX + 52,
      150,
      '✦',
      {
        fontFamily: UI_FONT,
        fontSize: '8px',
        color: COLORS.accent,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(6005);

  // -----------------------------------------
  // ACHIEVEMENT ART
  // -----------------------------------------

  let art;

  if (
    achievement.iconKey &&
    scene.textures.exists(
      achievement.iconKey
    )
  ) {
    art = scene.add
      .image(
        centerX,
        151,
        achievement.iconKey
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(6005);

    const maxSize = 58;

    const scale = Math.min(
      maxSize / art.width,
      maxSize / art.height
    );

    art.setScale(scale);
  } else {
    art = scene.add
      .text(
        centerX,
        151,
        '✦',
        {
          fontFamily: UI_FONT,
          fontSize: '18px',
          color: COLORS.accent,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(6005);
  }

  // -----------------------------------------
  // ACHIEVEMENT TITLE
  // -----------------------------------------

  const title = scene.add
    .text(
      centerX,
      192,
      achievement.title,
      {
        fontFamily: UI_FONT,
        fontSize: '17px',
        color: COLORS.text,
        stroke: '#f3d9e8',
        strokeThickness: 2,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(6005);

  // -----------------------------------------
  // DESCRIPTION
  // -----------------------------------------

  const description = scene.add
    .text(
      centerX,
      222,
      achievement.description,
      {
        fontFamily: UI_FONT,
        fontSize: '12px',
        color: COLORS.secondaryText,
        align: 'center',

        wordWrap: {
          width: 320,
          useAdvancedWrap: true,
        },

        lineSpacing: 4,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(6005);

  // -----------------------------------------
  // CONTINUE
  // -----------------------------------------

  const continueText = scene.add
    .text(
      centerX,
      273,
      '♡  [ENTER] CONTINUE  ♡',
      {
        fontFamily: UI_FONT,
        fontSize: '12px',
        color: COLORS.accentDark,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(6005);

  // -----------------------------------------
  // POPUP OBJECTS
  // -----------------------------------------

  this.objects = [
    overlay,
    shadow,
    box,
    innerCard,

    cornerTL,
    cornerTR,
    cornerBL,
    cornerBR,

    decoration,

    ribbon,
    ribbonLeft,
    ribbonRight,
    unlockedText,

    artShadow,
    artFrame,
    artDecorationLeft,
    artDecorationRight,
    art,

    title,
    description,
    continueText,
  ];

  // -----------------------------------------
  // ENTRANCE
  // -----------------------------------------

  this.objects.forEach(
    (object) => {
      object.setAlpha(0);
    }
  );

  scene.tweens.add({
    targets: this.objects,
    alpha: 1,
    duration: 300,
    ease: 'Sine.easeOut',
  });

  // -----------------------------------------
  // ENTER
  // -----------------------------------------

  this.enterKey =
    scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

  this.enterHandler = () => {
    sfxManager.play(
      scene,
      'click'
    );

    this.close();
  };

  this.enterKey.once(
    'down',
    this.enterHandler
  );
}

  close() {
    if (!this.active) {
      return;
    }

    this.active = false;

    if (this.enterKey) {
      this.enterKey.removeListener(
        'down',
        this.enterHandler
      );

      this.enterKey.destroy();

      this.enterKey = null;
    }

    const objects = [
      ...this.objects,
    ];

    this.objects = [];

    this.scene.tweens.add({
      targets: objects,
      alpha: 0,
      duration: 250,
      ease: 'Sine.easeIn',

      onComplete: () => {
        objects.forEach(
          (object) => {
            object.destroy();
          }
        );

        if (this.onComplete) {
          const callback =
            this.onComplete;

          this.onComplete = null;

          callback();
        }
      },
    });
  }

  isActive() {
    return this.active;
  }
}