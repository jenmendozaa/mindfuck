import Phaser from 'phaser';

import DebugMenu from '../debug/DebugMenu.js';
import pictures from '../data/pictures.js';

import sfxManager from '../systems/SFXManager.js';
import { UI_FONT } from '../ui/uiTheme.js';

export default class PicturesScene extends Phaser.Scene {
  constructor() {
    super('PicturesScene');
  }

  create() {
    this.debugMenu = new DebugMenu(this);

    this.transitioning = false;
    this.startedGallery = false;
    this.currentPicture = 0;

    this.cameras.main.setBackgroundColor(
      '#17101f'
    );

    this.createIntro();

    // -----------------------------
    // KEYBOARD
    // -----------------------------

    this.enterKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
      );

    this.leftKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.LEFT
      );

    this.rightKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.RIGHT
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

  createIntro() {
    this.introObjects = [];

    // =================================
    // SCRAPBOOK PAGE
    // =================================

    const page =
      this.add.rectangle(
        320,
        180,
        560,
        310,
        0x24182d,
        0.96
      )
        .setStrokeStyle(
          1,
          0x765477,
          0.8
        );

    const decorationLeft =
      this.add.text(
        92,
        47,
        '✦ ♡',
        {
          fontFamily: UI_FONT,
          fontSize: '11px',
          color: '#d996b7',
        }
      );

    const decorationRight =
      this.add.text(
        548,
        47,
        '♡ ✦',
        {
          fontFamily: UI_FONT,
          fontSize: '11px',
          color: '#d996b7',
        }
      )
        .setOrigin(1, 0);

    // =================================
    // TITLE
    // =================================

    const title =
      this.add.text(
        320,
        68,
        'PICTURES',
        {
          fontFamily: UI_FONT,
          fontSize: '20px',
          color: '#fff0f6',
          stroke: '#542f4c',
          strokeThickness: 3,
        }
      ).setOrigin(0.5);

    const subtitle =
      this.add.text(
        320,
        94,
        'our little photo album',
        {
          fontFamily: UI_FONT,
          fontSize: '9px',
          color: '#9f849d',
        }
      ).setOrigin(0.5);

    // =================================
    // INTRO MESSAGE
    // =================================

    const message =
      this.add.text(
        320,
        172,
        'Some of my favorite\nphotos of you/us',
        {
          fontFamily: UI_FONT,
          fontSize: '15px',
          color: '#fff0f6',
          align: 'center',
          lineSpacing: 8,
        }
      ).setOrigin(0.5);

    const littleHeart =
      this.add.text(
        320,
        225,
        '♡',
        {
          fontFamily: UI_FONT,
          fontSize: '15px',
          color: '#d996b7',
        }
      ).setOrigin(0.5);

    const continueText =
      this.add.text(
        320,
        278,
        '[ENTER] OPEN ALBUM',
        {
          fontFamily: UI_FONT,
          fontSize: '10px',
          color: '#f1b8d2',
        }
      ).setOrigin(0.5);

    const backText =
      this.add.text(
        320,
        323,
        '[ESC] BACK',
        {
          fontFamily: UI_FONT,
          fontSize: '9px',
          color: '#9f849d',
        }
      ).setOrigin(0.5);

    this.introObjects.push(
      page,
      decorationLeft,
      decorationRight,
      title,
      subtitle,
      message,
      littleHeart,
      continueText,
      backText
    );
  }

  startGallery() {
    if (this.startedGallery) {
      return;
    }

    this.startedGallery = true;

    sfxManager.play(
      this,
      'click'
    );

    this.introObjects.forEach(
      (object) => object.destroy()
    );

    this.createGalleryUI();
    this.showPicture(0);
  }

  createGalleryUI() {
    // =================================
    // SCRAPBOOK PAGE
    // =================================

    this.add.rectangle(
      320,
      180,
      560,
      310,
      0x24182d,
      0.96
    )
      .setStrokeStyle(
        1,
        0x765477,
        0.8
      );

    this.add.text(
      92,
      28,
      '✦ ♡',
      {
        fontFamily: UI_FONT,
        fontSize: '10px',
        color: '#d996b7',
      }
    );

    this.add.text(
      548,
      28,
      '♡ ✦',
      {
        fontFamily: UI_FONT,
        fontSize: '10px',
        color: '#d996b7',
      }
    )
      .setOrigin(1, 0);

    // =================================
    // HEADER
    // =================================

    this.add.text(
      320,
      32,
      'PICTURES',
      {
        fontFamily: UI_FONT,
        fontSize: '16px',
        color: '#fff0f6',
        stroke: '#542f4c',
        strokeThickness: 2,
      }
    ).setOrigin(0.5);

    // =================================
    // PHOTO / POLAROID AREA
    // =================================

    // White outer border gives the photo
    // a physical printed-photo feeling.
    this.photoFrame =
      this.add.rectangle(
        320,
        157,
        408,
        222,
        0xf2e6eb
      )
        .setStrokeStyle(
          2,
          0xd996b7
        );

        this.photoFrame.setDepth(1);

    // Dark area where the actual photo
    // will eventually be displayed.
    this.photoBox =
      this.add.rectangle(
        320,
        151,
        390,
        196,
        0x211b28
      );

      this.photoBox.setDepth(2);

    // This will later become our actual
    // photo image object.
    this.photoImage = null;

    this.placeholderText =
      this.add.text(
        320,
        151,
        'PHOTO',
        {
          fontFamily: UI_FONT,
          fontSize: '14px',
          color: '#9f849d',
        }
      ).setOrigin(0.5)
        .setDepth(5);

    // =================================
    // CAPTION
    // =================================

    this.captionText =
      this.add.text(
        320,
        282,
        '',
        {
          fontFamily: UI_FONT,
          fontSize: '10px',
          color: '#fff0f6',
          align: 'center',

          wordWrap: {
            width: 470,
            useAdvancedWrap: true,
          },

          lineSpacing: 2,
        }
      ).setOrigin(0.5);

    // =================================
    // COUNTER
    // =================================

    this.counterText =
      this.add.text(
        320,
        315,
        '',
        {
          fontFamily: UI_FONT,
          fontSize: '9px',
          color: '#d996b7',
        }
      ).setOrigin(0.5);

    // =================================
    // CONTROLS
    // =================================

    this.add.text(
      320,
      343,
      '[← →] FLIP     [ESC] BACK',
      {
        fontFamily: UI_FONT,
        fontSize: '9px',
        color: '#9f849d',
      }
    ).setOrigin(0.5);
  }

  showPicture(index) {
    if (pictures.length === 0) {
      return;
    }

    this.currentPicture =
      Phaser.Math.Wrap(
        index,
        0,
        pictures.length
      );

    const picture =
      pictures[this.currentPicture];

    // =================================
    // PHOTO
    // =================================

    if (this.photoImage) {
      this.photoImage.destroy();
      this.photoImage = null;
    }

    // Hide the placeholder now that we
    // have real photos.
    this.placeholderText.setVisible(false);

    this.photoImage =
      this.add.image(
        320,
        151,
        picture.key
      );

    // Maximum usable area inside the
    // physical photo frame.
    const maxWidth = 390;
    const maxHeight = 196;

    // Preserve the original photo's
    // aspect ratio.
    const scale = Math.min(
      maxWidth / this.photoImage.width,
      maxHeight / this.photoImage.height
    );

    this.photoImage.setScale(scale);

    this.photoImage.setDepth(3);

    // Make sure the actual photo appears
    // above the dark photo backing.

    // =================================
    // CAPTION
    // =================================

    this.captionText.setText(
      picture.caption
    );

    // =================================
    // COUNTER
    // =================================

    this.counterText.setText(
      `${this.currentPicture + 1} / ${pictures.length}`
    );
  }

  nextPicture() {
    sfxManager.play(
      this,
      'click'
    );

    this.showPicture(
      this.currentPicture + 1
    );
  }

  previousPicture() {
    sfxManager.play(
      this,
      'click'
    );

    this.showPicture(
      this.currentPicture - 1
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

    // =================================
    // INTRO
    // =================================

    if (
      !this.startedGallery &&
      Phaser.Input.Keyboard.JustDown(
        this.enterKey
      )
    ) {
      this.startGallery();
      return;
    }

    if (!this.startedGallery) {
      return;
    }

    // =================================
    // GALLERY
    // =================================

    if (
      Phaser.Input.Keyboard.JustDown(
        this.rightKey
      )
    ) {
      this.nextPicture();
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.leftKey
      )
    ) {
      this.previousPicture();
    }
  }
}