import Phaser from 'phaser';
import { DEBUG_MODE } from './debugConfig.js';
import saveManager from '../systems/saveManager.js';

export default class DebugMenu {
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;
    this.narrationMenuOpen = false;
    this.chapterOneMenuOpen = false;
    this.objects = [];
    

    if (!DEBUG_MODE) {
      return;
    }

    this.devKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.BACKTICK
    );

    if (this.narrationMenuOpen) {
      for (let i = 0; i < 6; i += 1) {
        if (
          Phaser.Input.Keyboard.JustDown(
            this.numberKeys[i]
          )
        ) {
          this.startNarrationTest(i + 1);
          return;
        }
      }

      return;
    }

    this.numberKeys = [
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ONE
      ),
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.TWO
      ),
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.THREE
      ),
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.FOUR
      ),
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.FIVE
      ),
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SIX
      ),
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SEVEN
      ),
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.EIGHT
      ),
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.NINE
      ),
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ZERO
      ),
    ];

    

    this.createHint();

    this.narrationKey = scene.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.N
  ); 

  this.resetKey =
  scene.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.R
  );

  this.resetConfirmEnterKey =
  scene.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.ENTER
  );

this.resetConfirmEscapeKey =
  scene.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.ESC
  );

this.resetConfirmOpen = false;


  }

  createHint() {
    this.hint = this.scene.add
      .text(
        630,
        8,
        '[`] DEV',
        {
          fontFamily: 'monospace',
          fontSize: '7px',
          color: '#77727f',
        }
      )
      .setOrigin(1, 0)
      .setDepth(9998)
      .setScrollFactor(0);
  }

  openResetConfirmation() {
  this.resetConfirmOpen = true;

  this.objects.forEach((object) => {
    if (object && object.active) {
      object.destroy();
    }
  });

  this.objects = [];

  const overlay = this.scene.add
    .rectangle(
      320,
      180,
      640,
      360,
      0x08070a,
      0.96
    )
    .setDepth(9999)
    .setScrollFactor(0);

  const box = this.scene.add
    .rectangle(
      320,
      180,
      330,
      150,
      0x211729,
      1
    )
    .setStrokeStyle(
      2,
      0xd996b7,
      1
    )
    .setDepth(10000)
    .setScrollFactor(0);

  const title = this.scene.add
    .text(
      320,
      135,
      'RESET SAVE DATA?',
      {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#fff0f6',
        stroke: '#542f4c',
        strokeThickness: 2,
      }
    )
    .setOrigin(0.5)
    .setDepth(10001)
    .setScrollFactor(0);

  const warning = this.scene.add
    .text(
      320,
      165,
      'This will erase all progress\\nand achievements.',
      {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#c9aebf',
        align: 'center',
        lineSpacing: 4,
      }
    )
    .setOrigin(0.5)
    .setDepth(10001)
    .setScrollFactor(0);

  const confirm = this.scene.add
    .text(
      320,
      210,
      '[ENTER] YES     [ESC] NO',
      {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#d996b7',
      }
    )
    .setOrigin(0.5)
    .setDepth(10001)
    .setScrollFactor(0);

  this.objects = [
    overlay,
    box,
    title,
    warning,
    confirm,
  ];
}

cancelReset() {
  this.resetConfirmOpen = false;

  this.objects.forEach((object) => {
    if (object && object.active) {
      object.destroy();
    }
  });

  this.objects = [];

  this.open();
}

confirmReset() {
  this.resetConfirmOpen = false;

  this.objects.forEach((object) => {
    if (object && object.active) {
      object.destroy();
    }
  });

  this.objects = [];

  saveManager.reset();

  this.scene.scene.stop();

  this.scene.scene.start(
    'TitleScene'
  );
}

  update() {
  if (!DEBUG_MODE) {
    return;
  }

  if (this.resetConfirmOpen) {
  if (
    Phaser.Input.Keyboard.JustDown(
      this.resetConfirmEnterKey
    )
  ) {
    this.confirmReset();
    return;
  }

  if (
    Phaser.Input.Keyboard.JustDown(
      this.resetConfirmEscapeKey
    )
  ) {
    this.cancelReset();
    return;
  }

  return;
}

  // Backtick opens/closes the developer menu.
  if (
    Phaser.Input.Keyboard.JustDown(
      this.devKey
    )
  ) {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }

    return;
  }

  if (!this.isOpen) {
    return;
  }

  // R opens the reset confirmation.
if (
  Phaser.Input.Keyboard.JustDown(
    this.resetKey
  )
) {
  this.openResetConfirmation();
  return;
}

  // --------------------------------
  // NARRATION SUBMENU
  // --------------------------------

  // If we're already inside the narration submenu,
  // number keys belong to narration, NOT the main menu.
  if (this.narrationMenuOpen) {
    for (let i = 0; i < 6; i += 1) {
      if (
        Phaser.Input.Keyboard.JustDown(
          this.numberKeys[i]
        )
      ) {
        this.startNarrationTest(i + 1);
        return;
      }
    }

    return;
  }

  // --------------------------------
// CHAPTER 1 SUBMENU
// --------------------------------

if (this.chapterOneMenuOpen) {
  for (let i = 0; i < 3; i += 1) {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.numberKeys[i]
      )
    ) {
      this.startChapterOneTest(i + 1);
      return;
    }
  }

  return;
}

  // N opens the narration submenu.
  if (
    Phaser.Input.Keyboard.JustDown(
      this.narrationKey
    )
  ) {
    this.openNarrationMenu();
    return;
  }

  // --------------------------------
  // NORMAL DEVELOPER MENU
  // --------------------------------

  for (
    let i = 0;
    i < this.numberKeys.length;
    i += 1
  ) {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.numberKeys[i]
      )
    ) {
      this.select(i);
      return;
    }
  }
}

  open() {
    this.isOpen = true;

    const overlay = this.scene.add
      .rectangle(
        320,
        180,
        640,
        360,
        0x08070a,
        0.96
      )
      .setDepth(9999)
      .setScrollFactor(0);

    const title = this.scene.add
      .text(
        320,
        55,
        'DEVELOPER MENU',
        {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#ffffff',
        }
      )
      .setOrigin(0.5)
      .setDepth(10000)
      .setScrollFactor(0);

    const menuText = this.scene.add
      .text(
        180,
        88,
        [
          '[1] PROLOGUE',
          '[2] PARTY',
          '[3] CHAPTER 1 — TEST MENU',
          '[4] CHAPTER 1 — COOKING',
          '[5] CHAPTER 2 — START',
          '[6] CHAPTER 3 — START',
          '[7] CHAPTER 4 — START',
          '[8] CHAPTER 5 — START',
          '[9] CHAPTER 6 — START',
          '[0] MINDFUCK — START',
          '',
          '[N] NARRATION — TRANSITION 1',
          '[R] RESET SAVE + RESTART',
        ].join('\n'),
        {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#ffffff',
          lineSpacing: 5,
        }
      )
      .setDepth(10000)
      .setScrollFactor(0);

    const closeText = this.scene.add
      .text(
        320,
        325,
        '[`] CLOSE',
        {
          fontFamily: 'monospace',
          fontSize: '8px',
          color: '#77727f',
        }
      )
      .setOrigin(0.5)
      .setDepth(10000)
      .setScrollFactor(0);

    this.objects = [
      overlay,
      title,
      menuText,
      closeText,
    ];

    // Freeze Arcade Physics while we're choosing.
    if (this.scene.physics?.world) {
      this.scene.physics.world.pause();
    }
  }

  

  close() {
    this.isOpen = false;

    this.narrationMenuOpen = false;
  this.chapterOneMenuOpen = false;

    this.objects.forEach((object) => {
      if (object && object.active) {
        object.destroy();
      }
    });

    this.objects = [];

    if (this.scene.physics?.world) {
      this.scene.physics.world.resume();
    }
  }

  openNarrationMenu() {
  this.narrationMenuOpen = true;

  this.objects.forEach((object) => {
    if (object && object.active) {
      object.destroy();
    }
  });

  this.objects = [];

  const overlay = this.scene.add
    .rectangle(
      320,
      180,
      640,
      360,
      0x08070a,
      0.96
    )
    .setDepth(9999)
    .setScrollFactor(0);

  const title = this.scene.add
    .text(
      320,
      60,
      'NARRATION TEST',
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff',
      }
    )
    .setOrigin(0.5)
    .setDepth(10000)
    .setScrollFactor(0);

  const menuText = this.scene.add
    .text(
      220,
      105,
      [
        '[1] TRANSITION 1',
        '[2] TRANSITION 2',
        '[3] TRANSITION 3',
        '[4] TRANSITION 4',
        '[5] TRANSITION 5',
        '[6] TRANSITION 6',
      ].join('\n\n'),
      {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ffffff',
      }
    )
    .setDepth(10000)
    .setScrollFactor(0);

  const closeText = this.scene.add
    .text(
      320,
      325,
      '[`] CLOSE',
      {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#77727f',
      }
    )
    .setOrigin(0.5)
    .setDepth(10000)
    .setScrollFactor(0);

  this.objects = [
    overlay,
    title,
    menuText,
    closeText,
  ];
}

startNarrationTest(number) {
  this.close();

  this.scene.scene.start(
    'NarrationScene',
    {
      transitionId: `transition${number}`,
    }
  );
}
openChapterOneMenu() {
  this.chapterOneMenuOpen = true;

  this.objects.forEach((object) => {
    if (object && object.active) {
      object.destroy();
    }
  });

  this.objects = [];

  const overlay = this.scene.add
    .rectangle(
      320,
      180,
      640,
      360,
      0x08070a,
      0.96
    )
    .setDepth(9999)
    .setScrollFactor(0);

  const title = this.scene.add
    .text(
      320,
      75,
      'CHAPTER 1 TEST',
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff',
      }
    )
    .setOrigin(0.5)
    .setDepth(10000)
    .setScrollFactor(0);

  const menuText = this.scene.add
    .text(
      175,
      125,
      [
        '[1] BEDROOM — START',
        '',
        '[2] BEDROOM — AFTER COOKING',
        '',
        '[3] COOKING',
      ].join('\n'),
      {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ffffff',
      }
    )
    .setDepth(10000)
    .setScrollFactor(0);

  const closeText = this.scene.add
    .text(
      320,
      325,
      '[`] CLOSE',
      {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#77727f',
      }
    )
    .setOrigin(0.5)
    .setDepth(10000)
    .setScrollFactor(0);

  this.objects = [
    overlay,
    title,
    menuText,
    closeText,
  ];
}

startChapterOneTest(option) {
  this.close();

  switch (option) {
    case 1:
      // Bedroom from the actual beginning:
      // undressed Jen + clothing collection
      this.scene.scene.start('BedroomScene', {
        returningFromCooking: false,
      });
      break;

    case 2:
      // Bedroom after cooking:
      // dressed Jen + breakfast dialogue
      this.scene.scene.start('BedroomScene', {
        returningFromCooking: true,
      });
      break;

    case 3:
      // Cooking minigame
      this.scene.scene.start('CookingScene');
      break;
  }
}

  select(index) {

     if (index === 2) {
    this.openChapterOneMenu();
    return;
  }

    const scenes = [
      'PrologueScene',
      'PartyScene',
      'BedroomScene',
      'CookingScene',
      'DriveToHerScene',
      'RealizationScene',
      'BitCityScene',
      'AdventureDriveScene',
      'MorningScene',
      'MindfuckScene'
    ];

    const targetScene = scenes[index];

    if (!targetScene) {
      return;
    }

    this.close();

    this.scene.scene.start(targetScene);
  }

  
}