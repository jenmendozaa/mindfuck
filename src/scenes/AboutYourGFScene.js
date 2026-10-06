import Phaser from 'phaser';

import DebugMenu from '../debug/DebugMenu.js';
import aboutJen from '../data/aboutJen.js';

import sfxManager from '../systems/SFXManager.js';

import { UI_FONT } from '../ui/uiTheme.js';

export default class AboutYourGFScene extends Phaser.Scene {
  constructor() {
    super('AboutYourGFScene');
  }

  create() {
    this.debugMenu = new DebugMenu(this);
    this.transitioning = false;

    this.cameras.main.setBackgroundColor(
      '#100d16'
    );

    // Starting height. This gets updated after
    // all of the dossier content is created.
    this.pageHeight = 1500;

    this.physics.world.setBounds(
      0,
      0,
      640,
      this.pageHeight
    );

    this.cameras.main.setBounds(
      0,
      0,
      640,
      this.pageHeight
    );

    this.createUI();

    this.cursors =
      this.input.keyboard.createCursorKeys();

    this.wKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.W
      );

    this.sKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.S
      );

    this.escHandler = (event) => {
      if (event.key === 'Escape') {
        this.returnToTitle();
      }
    };

    window.addEventListener(
      'keydown',
      this.escHandler
    );

    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        window.removeEventListener(
          'keydown',
          this.escHandler
        );
      }
    );

    this.cameras.main.fadeIn(
      400,
      0,
      0,
      0
    );
  }

  createUI() {
    // =================================
    // DOSSIER BACKGROUND
    // =================================

    this.dossierBackground =
      this.add.rectangle(
        320,
        this.pageHeight / 2,
        560,
        this.pageHeight,
        0x24182d,
        0.96
      );

    this.dossierBorder =
      this.add.rectangle(
        320,
        this.pageHeight / 2,
        558,
        this.pageHeight - 4,
        0x24182d,
        0
      )
        .setStrokeStyle(
          1,
          0x765477,
          0.8
        );

    // =================================
    // HEADER
    // =================================

    this.add.text(
      320,
      28,
      'ABOUT YOUR GF',
      {
        fontFamily: UI_FONT,
        fontSize: '20px',
        color: '#fff0f6',
        stroke: '#542f4c',
        strokeThickness: 3,
      }
    ).setOrigin(0.5);

    this.add.text(
      320,
      52,
      'THE OFFICIAL REFERENCE GUIDE',
      {
        fontFamily: UI_FONT,
        fontSize: '11px',
        color: '#9f849d',
      }
    ).setOrigin(0.5);

    // ---------------------------------
    // PORTRAIT
    // ---------------------------------

    this.add.rectangle(
      105,
      135,
      105,
      125,
      0x35233f
    )
      .setStrokeStyle(
        2,
        0xd996b7
      );

    this.add.image(
      105,
      135,
      'jen-dialogue'
    )
      .setDisplaySize(
        100,
        100
      );

    // ---------------------------------
    // BASIC JEN INFO
    // ---------------------------------

    this.add.text(
      180,
      83,
      aboutJen.name,
      {
        fontFamily: UI_FONT,
        fontSize: '16px',
        color: '#fff0f6',
      }
    );

    this.add.text(
      180,
      108,
      aboutJen.subtitle,
      {
        fontFamily: UI_FONT,
        fontSize: '11px',
        color: '#d996b7',

        wordWrap: {
          width: 350,
          useAdvancedWrap: true,
        },
      }
    );

    this.add.text(
      180,
      145,
      aboutJen.blurb,
      {
        fontFamily: UI_FONT,
        fontSize: '12px',
        color: '#c9c2d0',

        wordWrap: {
          width: 350,
          useAdvancedWrap: true,
        },

        lineSpacing: 3,
      }
    );

    // =================================
    // IMPORTANT SHIT
    // =================================

    this.createSectionTitle(
      320,
      235,
      'THE IMPORTANT SHIT'
    );

    let y = 270;

    aboutJen.importantShit.forEach(
      (fact) => {
        this.add.text(
          60,
          y,
          `${fact.label}:`,
          {
            fontFamily: UI_FONT,
            fontSize: '12px',
            color: '#9f849d',
          }
        );

        const valueText =
          this.add.text(
            225,
            y,
            fact.value,
            {
              fontFamily: UI_FONT,
              fontSize: '12px',
              color: '#fff0f6',

              wordWrap: {
                width: 350,
                useAdvancedWrap: true,
              },
            }
          );

        y += Math.max(
          26,
          valueText.height + 12
        );
      }
    );

    // =================================
    // FAMILY TREE
    // =================================

    y += 20;

    this.createSectionTitle(
      320,
      y,
      'FAMILY TREE'
    );

    y += 38;

    this.createLabelValue(
      60,
      y,
      'PARENTS',
      aboutJen.family.parents
    );

    y += 46;

    this.createLabelValue(
      60,
      y,
      'SIBLINGS (IN BIRTH ORDER)',
      aboutJen.family.siblings
    );

    y += 58;

    this.add.text(
      60,
      y,
      '* Technically, it is complicated.',
      {
        fontFamily: UI_FONT,
        fontSize: '12px',
        fontStyle: 'italic',
        color: '#d996b7',
      }
    );

    y += 32;

    aboutJen.family.notes.forEach(
      (note) => {
        const noteText =
          this.add.text(
            75,
            y,
            `• ${note}`,
            {
              fontFamily: UI_FONT,
              fontSize: '12px',
              color: '#c9c2d0',

              wordWrap: {
                width: 500,
                useAdvancedWrap: true,
              },

              lineSpacing: 3,
            }
          );

        y += noteText.height + 18;
      }
    );

    // =================================
    // CHARACTER STATS
    // =================================

    y += 20;

    this.createSectionTitle(
      320,
      y,
      'CHARACTER STATS'
    );

    y += 42;

    this.add.text(
      90,
      y,
      'STRENGTHS',
      {
        fontFamily: UI_FONT,
        fontSize: '14px',
        color: '#d996b7',
      }
    );

    this.add.text(
      365,
      y,
      'WEAKNESSES',
      {
        fontFamily: UI_FONT,
        fontSize: '14px',
        color: '#d996b7',
      }
    );

    y += 28;

    const statsStartY = y;

    aboutJen.strengths.forEach(
      (strength, index) => {
        this.add.text(
          90,
          statsStartY +
            index * 25,
          `+ ${strength}`,
          {
            fontFamily: UI_FONT,
            fontSize: '12px',
            color: '#fff0f6',
          }
        );
      }
    );

    aboutJen.weaknesses.forEach(
      (weakness, index) => {
        this.add.text(
          365,
          statsStartY +
            index * 25,
          `- ${weakness}`,
          {
            fontFamily: UI_FONT,
            fontSize: '12px',
            color: '#fff0f6',
          }
        );
      }
    );

    y =
      statsStartY +
      Math.max(
        aboutJen.strengths.length,
        aboutJen.weaknesses.length
      ) * 25 +
      35;

    // =================================
    // MISC. JEN LORE
    // =================================

    this.createSectionTitle(
      320,
      y,
      'MISC. JEN LORE'
    );

    y += 44;

    const loreTitles = [
      'THE GOOSE INCIDENT',
      'BLOOD COASTER',
      'LITERARY BEEF',
    ];

    aboutJen.lore.forEach(
      (story, index) => {
        this.add.text(
          60,
          y,
          loreTitles[index] ??
            `JEN LORE #${index + 1}`,
          {
            fontFamily: UI_FONT,
            fontSize: '13px',
            color: '#d996b7',
          }
        );

        y += 24;

        const storyText =
          this.add.text(
            60,
            y,
            story,
            {
              fontFamily: UI_FONT,
              fontSize: '12px',
              color: '#fff0f6',

              wordWrap: {
                width: 520,
                useAdvancedWrap: true,
              },

              lineSpacing: 4,
            }
          );

        y +=
          storyText.height + 34;
      }
    );

    // =================================
    // FOOTER
    // =================================

    this.add.text(
      320,
      y + 10,
      aboutJen.footer,
      {
        fontFamily: UI_FONT,
        fontSize: '11px',
        fontStyle: 'italic',
        color: '#9f849d',
      }
    ).setOrigin(0.5);

    // =================================
    // FINAL PAGE HEIGHT
    // =================================

    this.pageHeight =
      y + 100;

    this.cameras.main.setBounds(
      0,
      0,
      640,
      this.pageHeight
    );

    this.physics.world.setBounds(
      0,
      0,
      640,
      this.pageHeight
    );

    this.dossierBackground
      .setPosition(
        320,
        this.pageHeight / 2
      )
      .setSize(
        560,
        this.pageHeight
      )
      .setDisplaySize(
        560,
        this.pageHeight
      );

    this.dossierBorder
      .setPosition(
        320,
        this.pageHeight / 2
      )
      .setSize(
        558,
        this.pageHeight - 4
      )
      .setDisplaySize(
        558,
        this.pageHeight - 4
      );

    // ---------------------------------
    // FIXED CONTROLS
    // ---------------------------------

    this.add.text(
      320,
      343,
      '[↑ ↓ / W S] SCROLL     [ESC] BACK',
      {
        fontFamily: UI_FONT,

        // Intentionally left unchanged.
        fontSize: '9px',

        color: '#9f849d',
        backgroundColor: '#17101f',

        padding: {
          x: 8,
          y: 4,
        },
      }
    )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1000);
  }

  createSectionTitle(
    x,
    y,
    text
  ) {
    this.add.text(
      x,
      y,
      `♡  ${text}  ♡`,
      {
        fontFamily: UI_FONT,
        fontSize: '14px',
        color: '#f1b8d2',
      }
    ).setOrigin(0.5);
  }

  createLabelValue(
    x,
    y,
    label,
    value
  ) {
    this.add.text(
      x,
      y,
      label,
      {
        fontFamily: UI_FONT,
        fontSize: '12px',
        color: '#9f849d',
      }
    );

    this.add.text(
      x,
      y + 18,
      value,
      {
        fontFamily: UI_FONT,
        fontSize: '12px',
        color: '#fff0f6',

        wordWrap: {
          width: 500,
          useAdvancedWrap: true,
        },
      }
    );
  }

  returnToTitle() {
    if (this.transitioning) {
      return;
    }

    sfxManager.play(
      this,
      'click'
    );

    this.transitioning = true;

    this.cameras.main.fadeOut(
      400,
      0,
      0,
      0
    );

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events
        .FADE_OUT_COMPLETE,
      () => {
        this.scene.start(
          'TitleScene'
        );
      }
    );
  }

  update() {
    if (this.debugMenu) {
      this.debugMenu.update();

      if (this.debugMenu.isOpen) {
        return;
      }
    }

    const camera =
      this.cameras.main;

    const scrollSpeed = 4;

    if (
      this.cursors.down.isDown ||
      this.sKey.isDown
    ) {
      camera.scrollY +=
        scrollSpeed;
    }

    if (
      this.cursors.up.isDown ||
      this.wKey.isDown
    ) {
      camera.scrollY -=
        scrollSpeed;
    }

    camera.scrollY =
      Phaser.Math.Clamp(
        camera.scrollY,
        0,
        Math.max(
          0,
          this.pageHeight - 360
        )
      );
  }
}