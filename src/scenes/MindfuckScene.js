import Phaser from 'phaser';

import Player from '../gameplay/Player.js';
import DebugMenu from '../debug/DebugMenu.js';
import saveManager from '../systems/saveManager.js';

import ObjectiveUI from '../ui/ObjectiveUI.js';
import InteractionPrompt from '../ui/InteractionPrompt.js';
import ThoughtPrompt from '../ui/ThoughtPrompt.js';
import ThoughtUI from '../ui/ThoughtUI.js';
import sfxManager from '../systems/SFXManager.js';
import SettingsAccess from '../systems/SettingsAccess.js';

import {
  MAGIC_FONT,
  UI_FONT,
} from '../ui/uiTheme.js';

export default class MindfuckScene extends Phaser.Scene {
  constructor() {
    super('MindfuckScene');
  }

  create() {
    this.settingsAccess =
  new SettingsAccess(this);
    this.sound.stopAll();

  // Start ending music.
  this.endingMusic = this.sound.add(
    'ending',
    {
      loop: true,
      volume: 0,
    }
  );

  this.endingMusic.play();

  this.tweens.add({
    targets: this.endingMusic,
    volume: 0.5,
    duration: 3000,
    ease: 'Linear',
  });

    this.debugMenu = new DebugMenu(this);

    this.createLibrary();
    this.createPlayer();
    this.createModule05Platforms();


    // -------------------------------------------------
    // ENDING UI / INTERACTIONS
    // -------------------------------------------------

    this.objectiveUI =
      new ObjectiveUI(this);

    this.interactionPrompt =
      new InteractionPrompt(this);

    this.thoughtPrompt =
      new ThoughtPrompt(this);

    this.thoughtUI =
      new ThoughtUI(this);

    this.enterKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
      );

    this.qKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.Q
      );

    this.entranceThoughtAvailable = false;
    this.entranceThoughtUsed = false;

    this.touchObjectUsed = false;
    this.nearTouchObject = false;

    this.createEntranceNarration();

    this.endingStarted = false;
  }

  createLibrary() {
  // -------------------------------------------------
  // WORLD
  // -------------------------------------------------

  this.physics.world.setBounds(
    0,
    0,
    13975,
    360
  );

  this.cameras.main.setBounds(
    0,
    0,
    13975,
    360
  );

  this.cameras.main.setBackgroundColor(
    '#100d16'
  );


  // -------------------------------------------------
  // FLOOR
  // -------------------------------------------------

this.floor = this.add.rectangle(
  6500,
  350,
  15000,
  46,
  0x000000,
  0
);

  this.physics.add.existing(
    this.floor,
    true
  );

  // -------------------------------------------------
  // SECTION 1 — ENTRANCE / JEN'S BRAIN
  // -------------------------------------------------

  this.createBrainEntranceSection();
}

createBrainEntranceSection() {

  const deepLibrary01Start = this.add.image(
  650,
  180,
  'library-deep-01'
)
  .setOrigin(0.5)
  .setDepth(-20)
  .setAlpha(0.55);

deepLibrary01Start.setDisplaySize(
  1300,
  deepLibrary01Start.height *
    (1300 / deepLibrary01Start.width)
);

  const deepLibrary01 = this.add.image(
  1300,
  180,
  'library-deep-01'
)
  .setOrigin(0.5)
  .setDepth(-20)
  .setAlpha(0.55);

deepLibrary01.setDisplaySize(
  2300,
  deepLibrary01.height *
    (2300 / deepLibrary01.width)
);

const deepLibrary01B = this.add.image(
  3300,
  180,
  'library-deep-01'
)
  .setOrigin(0.5)
  .setDepth(-20)
  .setAlpha(0.55);

deepLibrary01B.setDisplaySize(
  2300,
  deepLibrary01B.height *
    (2300 / deepLibrary01B.width)
);

  const balcony01 = this.add.image(
  650,
  215,
  'library-balcony-01'
)
  .setOrigin(0.5)
  .setDepth(2);

balcony01.setDisplaySize(
  1300,
  balcony01.height *
    (1300 / balcony01.width)
);

const balcony02 = this.add.image(
  1500,
  215,
  'library-balcony-02'
)
  .setOrigin(0.5)
  .setDepth(2);

balcony02.setDisplaySize(
  1300,
  balcony02.height *
    (1300 / balcony02.width)
);

const balcony03 = this.add.image(
  2350,
  215,
  'library-balcony-03'
)
  .setOrigin(0.5)
  .setDepth(2);

balcony03.setDisplaySize(
  1300,
  balcony03.height *
    (1300 / balcony03.width)
);

const room04 = this.add.image(
  3250,
  215,
  'library-room-04'
)
  .setOrigin(0.5)
  .setDepth(2);

room04.setDisplaySize(
  1300,
  room04.height *
    (1300 / room04.width)
);

this.createMagicLetterText(
  2850,
  125,
  'So here it is,\nwhat you asked for.',
  22,
  300
);

this.createMagicLetterText(
  3500,
  120,
  'You wanted a timeline, a look into what all was\ngoing through my head then and now.',
  22,
  300
);

const archiveDeep05 = this.add.image(
  4400,
  180,
  'library-archive-deep-05'
)
  .setOrigin(0.5)
  .setDepth(-20)
  .setAlpha(0.55);

archiveDeep05.setDisplaySize(
  1150,
  archiveDeep05.height *
    (1150 / archiveDeep05.width)
);

const archive05 = this.add.image(
  4400,
  190,
  'library-archive-05'
)
  .setOrigin(0.5)
  .setDepth(2);

archive05.setDisplaySize(
  1150,
  archive05.height *
    (1150 / archive05.width)
);

this.createMagicLetterText(
  4200,
  115,
  'You said that sometimes you get unsure\nof my feelings for you, which I really regret.',
  22,
  300
);

this.createMagicLetterText(
  4850,
  105,
  'You deserve to know how great you are\nand all the ways you snuck your way\ninto my heart and mind.',
  22,
  300
);

const transition0506Back = this.add.image(
  5150,
  180,
  'library-transition-05-06-back'
)
  .setOrigin(0.5)
  .setDepth(3);

transition0506Back.setDisplaySize(
  650,
  transition0506Back.height *
    (650 / transition0506Back.width)
);

// 05 → 06 TRANSITION — FRONT
const transition0506Front = this.add.image(
  5150,
  180,
  'library-transition-05-06-front'
)
  .setOrigin(0.5)
  .setDepth(8);

transition0506Front.setDisplaySize(
  650,
  transition0506Front.height *
    (650 / transition0506Front.width)
);

this.createMagicLetterText(
  5350,
  85,
  'So I hope all of this\nmakes it clear.',
  22,
  300
);

// MODULE 06 — DEEP BACKGROUND
const chamberDeep06 = this.add.image(
  5650,
  100,
  'library-chamber-deep-06'
)
  .setOrigin(0.5)
  .setDepth(-20)
  .setAlpha(0.55);

chamberDeep06.setDisplaySize(
  1150,
  chamberDeep06.height *
    (1150 / chamberDeep06.width)
);

// MODULE 06 — OPEN CHAMBER
const chamber06 = this.add.image(
  5650,
  85,
  'library-chamber-06'
)
  .setOrigin(0.5)
  .setDepth(2);

chamber06.setDisplaySize(
  1000,
  chamber06.height *
    (1000 / chamber06.width)
);

this.createMagicLetterText(
  5900,
  295,
  "I'll keep doing other shit, don't worry,\nbut I think this is a good start.",
  22,
  300
);

const column0607 = this.add.image(
  6140,
  180,
  'library-column-06-07'
)
  .setOrigin(0.5)
  .setDepth(8);

column0607.setDisplaySize(
  1150,
  column0607.height *
    (1150 / column0607.width)
);

const room07 = this.add.image(
  6680,
  165,
  'library-room-07'
)
  .setOrigin(0.5)
  .setDepth(2);

room07.setDisplaySize(
  1100,
  room07.height *
    (1100 / room07.width)
);

this.createMagicLetterText(
  6450,
  85,
  "I can't promise forever or even any specific amount of time\nbecause we both crazy and so is life.",
  22,
  300
);

this.createMagicLetterText(
  6950,
  205,
  "I can't promise I won't hurt you\nor that you won't hurt me,",
  22,
  300
);


const room08 = this.add.image(
  8100,
  150,
  'library-room-08'
)
  .setOrigin(0.5)
  .setDepth(2);

room08.setDisplaySize(
  1100,
  room08.height *
    (1100 / room08.width)
);

const roomDeep08 = this.add.image(
  7250,
  150,
  'library-deep-01'
)
  .setOrigin(0.5)
  .setDepth(-20)
  .setAlpha(0.55);

roomDeep08.setDisplaySize(
  1150,
  roomDeep08.height *
    (1150 / roomDeep08.width)
);

const transition0708Back = this.add.image(
  7375,
  165,
  'library-transition-07-08-back'
)
  .setOrigin(0.5)
  .setDepth(3);

transition0708Back.setDisplaySize(
  450,
  transition0708Back.height *
    (450 / transition0708Back.width)
);

const transition0708Front = this.add.image(
  7450,
  165,
  'library-transition-07-08-front'
)
  .setOrigin(0.5)
  .setDepth(8);

transition0708Front.setDisplaySize(
  450,
  transition0708Front.height *
    (450 / transition0708Front.width)
);

this.createMagicLetterText(
  7700,
  85,
  'but I can promise that\nfor right now',
  22,
  300
);

this.createMagicLetterText(
  8500,
  205,
  'I want more.',
  22,
  300
);

const room09 = this.add.image(
  9450,
  150,
  'library-room-09'
)
  .setOrigin(0.5)
  .setDepth(2);

room09.setDisplaySize(
  1500,
  room09.height *
    (1500 / room09.width)
);

const column0809 = this.add.image(
  8680,
  150,
  'library-column-06-07'
)
  .setOrigin(0.5)
  .setDepth(8);

column0809.setDisplaySize(
  1150,
  column0809.height *
    (1150 / column0809.width)
);

this.createMagicLetterText(
  8850,
  85,
  "More late nights\nand slow mornings.",
  22,
  100
);

this.createMagicLetterText(
  9050,
  205,
  "More bad cups of coffee.",
  22,
  100
);

this.createMagicLetterText(
  9250,
  100,
  "More scenes and songs\nin the car.",
  22,
  100
);

this.createMagicLetterText(
  9450,
  215,
  "More bits and laughs",
  22,
  100
);

this.createMagicLetterText(
  9650,
  105,
  "and even more conflicts because",
  22,
  100
);

this.createMagicLetterText(
  9850,
  210,
  "we are getting pretty good at",
  22,
  100
);

this.createMagicLetterText(
  10050,
  115,
  "having those now.",
  22,
  100
);

const bookshelf0910 = this.add.image(
  10250,
  185,
  'library-bookshelf-09-10'
)
  .setOrigin(0.5)
  .setDepth(8);

bookshelf0910.setDisplaySize(
  450,
  bookshelf0910.height *
    (450 / bookshelf0910.width)
);

const room10 = this.add.image(
  10750,
  185,
  'library-room-10'
)
  .setOrigin(0.5)
  .setDepth(2);

room10.setDisplaySize(
  900,
  room10.height *
    (900 / room10.width)
);

this.createMagicLetterText(
  10500,
  95,
  'Most importantly,',
  22,
  120
);

this.createMagicLetterText(
  10750,
  145,
  'I want more you',
  36,
  180
);

this.createMagicLetterText(
  11050,
  220,
  'In whatever form that takes.',
  22,
  120
);

const curtain1011 = this.add.image(
  11250,
  150,
  'library-curtain-10-11'
)
  .setOrigin(0.5)
  .setDepth(8);

curtain1011.setDisplaySize(
  450,
  curtain1011.height *
    (450 / curtain1011.width)
);

const room11 = this.add.image(
  11800,
  160,
  'library-room-11'
)
  .setOrigin(0.5)
  .setDepth(2);

room11.setDisplaySize(
  1150,
  room11.height *
    (1150 / room11.width)
);

this.createMagicLetterText(
  11450,
  85,
  "You caught me off guard and I didn’t see you\nor what we would become coming.",
  22,
  150
);

this.createMagicLetterText(
  11650,
  210,
  "But I couldn’t be more grateful\nthat it did happen,",
  22,
  150
);

this.createMagicLetterText(
  11850,
  110,
  "that you happened.",
  28,
  150
);

this.createMagicLetterText(
  12100,
  205,
  "And I can’t wait for whatever\nelse is in store.",
  22,
  150
);

const ladder1112 = this.add.image(
  12425,
  150,
  'library-ladder-11-12'
)
  .setOrigin(0.5)
  .setDepth(8);

ladder1112.setDisplaySize(
  300,
  ladder1112.height *
    (300 / ladder1112.width)
);

const room12 = this.add.image(
  13225,
  155,
  'library-room-12'
)
  .setOrigin(0.5)
  .setDepth(2);

room12.setDisplaySize(
  1500,
  room12.height *
    (1500 / room12.width)
);

this.createMagicLetterText(
  12700,
  85,
  "Anyway this is about as mushy\nas I can get,",
  22,
  120
);

this.createMagicLetterText(
  13000,
  205,
  "hope it's not too much.",
  22,
  120
);

this.createMagicLetterText(
  13275,
  100,
  "I fuck with you or whatever.",
  22,
  120
);

this.createMagicLetterText(
  13550,
  205,
  "Love ya",
  30,
  120
);
  
  // -------------------------------------------------
  // TREASURE CHEST — ENTRANCE INTERACTION
  // -------------------------------------------------

  const touchChest = this.add.image(
    810,
    335,
    'library-touch-chest'
  )
    .setOrigin(0.5, 1)
    .setDepth(5);

  touchChest.setDisplaySize(
    160,
    touchChest.height *
      (160 / touchChest.width)
  );

  this.touchObject = {
    x: 700,
    y: 275,
  };

}

createEntranceDivider() {
  const x = 2550;

  // Back portion.
  // Nat will eventually walk through/under
  // the real staircase architecture here.
  this.add.rectangle(
    x,
    175,
    180,
    310,
    0x2b2133,
    0.8
  )
    .setDepth(2);

  // Temporary opening.
  this.add.rectangle(
    x,
    235,
    90,
    190,
    0x100d16
  )
    .setDepth(3);

  // Front column.
  // This deliberately renders ABOVE Nat.
  this.add.rectangle(
    x + 65,
    190,
    24,
    290,
    0x594461
  )
    .setDepth(8);

  // Temporary label so we remember what
  // this programmer art represents.
  this.add.text(
    x,
    65,
    'FUTURE\nSTAIRCASE / SEAM',
    {
      fontFamily: 'monospace',
      fontSize: '6px',
      color: '#756b7b',
      align: 'center',
    }
  )
    .setOrigin(0.5)
    .setDepth(9);
}

updateEntranceInteraction() {
  if (
    !this.touchObject ||
    this.touchObjectUsed ||
    this.entranceActive
  ) {
    this.nearTouchObject = false;
    this.interactionPrompt.hide();
    return;
  }

  const distance =
    Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.touchObject.x,
      this.touchObject.y
    );

  if (distance < 90) {
    if (!this.nearTouchObject) {
      this.nearTouchObject = true;

      this.interactionPrompt.show(
        'TOUCH IT'
      );
    }
  } else {
    if (this.nearTouchObject) {
      this.nearTouchObject = false;
      this.interactionPrompt.hide();
    }
  }
}

handleEntranceInteraction() {
  if (
    !this.nearTouchObject ||
    this.touchObjectUsed ||
    this.entranceActive
  ) {
    return;
  }

  if (
    !Phaser.Input.Keyboard.JustDown(
      this.enterKey
    )
  ) {
    return;
  }

  this.touchObjectUsed = true;
  this.nearTouchObject = false;

  this.interactionPrompt.hide();

  sfxManager.play(
    this,
    'interact'
  );

  this.thoughtUI.show(
    'I literally just said—',
    1800
  );
}

createMagicLetterText(
  x,
  y,
  text,
  fontSize = 22,
  triggerDistance = 300
) {

  const container = this.add
    .container(x, y)
    .setDepth(20);

    container.setAlpha(0);
    let hasRevealed = false;

  // Soft magical haze behind the words.
 const hazeOuter = this.add.ellipse(
  0,
  0,
  410,
  145,
  0x3b2447,
  0.08
);

const hazeMid = this.add.ellipse(
  0,
  0,
  385,
  130,
  0x3b2447,
  0.16
);

const haze = this.add.ellipse(
  0,
  0,
  350,
  110,
  0x3b2447,
  0.38
);
 

  const letterText = this.add.text(
  0,
  0,
  text,
  {
    fontFamily: MAGIC_FONT,
    fontSize: `${fontSize}px`,
    color: '#fff8e7',
    align: 'center',
    lineSpacing: 6,

    stroke: '#fff8e7',
    strokeThickness: 1,

    shadow: {
      offsetX: 0,
      offsetY: 0,
      color: '#ff8fda',
      blur: 14,
      fill: true,
    },
  }
)
  .setOrigin(0.5);

  this.tweens.add({
  targets: letterText,

  alpha: {
    from: 0.9,
    to: 1,
  },

  duration: 1100,
  yoyo: true,
  repeat: -1,
  ease: 'Sine.easeInOut',
});

  container.add([
  hazeOuter,
  hazeMid,
  haze,
  letterText,
]);

  // Haze slowly breathes.
  this.tweens.add({
  targets: [
    hazeOuter,
    hazeMid,
    haze,
  ],

  scaleX: {
    from: 0.97,
    to: 1.04,
  },

  scaleY: {
    from: 0.97,
    to: 1.07,
  },

  duration: 1800,
  yoyo: true,
  repeat: -1,
  ease: 'Sine.easeInOut',
});

  // Text has a much subtler pulse.
  this.tweens.add({
    targets: [
      letterText,
    ],
    alpha: {
      from: 0.88,
      to: 1,
    },
    duration: 1500,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });

  // Little magical stars.
  const sparklePositions = [
    [-145, -28],
    [-115, 38],
    [-65, -45],
    [80, -40],
    [125, 32],
    [155, -12],
  ];

  sparklePositions.forEach(
    ([sparkleX, sparkleY], index) => {
      const sparkle = this.add.text(
        sparkleX,
        sparkleY,
        '✦',
        {
          fontFamily: 'Arial',
          fontSize: '8px',
          color: '#fff4cf',
        }
      )
        .setOrigin(0.5)
        .setAlpha(0.25);

        sparkle.setBlendMode(
          Phaser.BlendModes.ADD
        );

      container.add(sparkle);

      this.tweens.add({
        targets: sparkle,
        alpha: {
          from: 0.15,
          to: 1,
        },
        scale: {
          from: 0.5,
          to: 1.35,
        },
        angle: {
          from: -10,
          to: 10,
        },
        duration:
          700 + index * 110,
        delay:
          index * 170,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  );

  const travelingSparkle = this.add.text(
  -160,
  0,
  '✦',
  {
    fontFamily: 'Arial',
    fontSize: '12px',
    color: '#fffbe8',
  }
)
  .setOrigin(0.5)
  .setAlpha(0)
  .setBlendMode(
    Phaser.BlendModes.ADD
  );

container.add(travelingSparkle);

const revealLetter = () => {
  if (hasRevealed) {
    return;
  }

  hasRevealed = true;

  // Haze and words materialize.
  this.tweens.add({
    targets: container,
    alpha: 1,
    duration: 900,
    ease: 'Sine.easeOut',
  });

  // Traveling magical sparkle.
  this.time.delayedCall(
    250,
    () => {
      travelingSparkle
        .setPosition(-160, -5)
        .setAlpha(1)
        .setScale(0.7);

      this.tweens.add({
        targets: travelingSparkle,

        x: 160,

        alpha: {
          from: 1,
          to: 0.2,
        },

        scale: {
          from: 0.7,
          to: 1.4,
        },

        duration: 1100,
        ease: 'Sine.easeInOut',

        onComplete: () => {
          travelingSparkle.setAlpha(0);
        },
      });
    }
  );
};

const proximityEvent =
  this.time.addEvent({
    delay: 100,
    loop: true,

    callback: () => {
      if (hasRevealed) {
        proximityEvent.remove();
        return;
      }

      if (!this.player) {
        return;
      }

      const distance = Math.abs(
        this.player.x - x
      );

      if (distance <= triggerDistance) {
        revealLetter();
      }
    },
  });

  return container;

}

createModule05Platforms() {
  // TEMP: visible while positioning.
  this.module05Ledge = this.add.rectangle(
    4800, // x - tune this
    281,  // y - tune this
    340,  // width - tune this
    12,
    0xff00ff,
    0
  )

  .setDepth(100);

  this.physics.add.existing(
    this.module05Ledge,
    true
  );

  this.physics.add.collider(
    this.player,
    this.module05Ledge
  );
}

createNatShelf() {
  const shelfStart = 5750;
  const shelfEnd = 12600;

  const shelfY = 170;
  const shelfHeight = 190;

  const shelfColor = 0x594461;
  const innerColor = 0x211927;

  // -------------------------------------------------
  // CONTINUOUS SHELF
  // -------------------------------------------------

  const width =
    shelfEnd - shelfStart;

  const centerX =
    shelfStart + width / 2;

  this.add.rectangle(
    centerX,
    shelfY,
    width,
    shelfHeight,
    shelfColor
  );

  this.add.rectangle(
    centerX,
    shelfY,
    width - 14,
    shelfHeight - 14,
    innerColor
  );

  // Horizontal shelf boards
  const shelfRows = [
    115,
    175,
    235,
  ];

  shelfRows.forEach((y) => {
    this.add.rectangle(
      centerX,
      y,
      width - 14,
      5,
      shelfColor
    );
  });

  // Vertical divisions.
  // These make it still feel like part of
  // the larger library rather than one giant box.
  for (
    let x = shelfStart + 300;
    x < shelfEnd;
    x += 500
  ) {
    this.add.rectangle(
      x,
      shelfY,
      6,
      shelfHeight - 14,
      shelfColor
    );
  }

  // -------------------------------------------------
  // RANDOM BOOKS
  //
  // Important: Nat's shelf doesn't ONLY contain
  // relationship artifacts. It still belongs inside
  // the larger brain/library.
  // -------------------------------------------------

  const bookPositions = [
    5840,
    5880,
    5940,
    6350,
    6390,
    7160,
    7200,
    7920,
    7960,
    8680,
  ];

  bookPositions.forEach(
    (x, index) => {
      this.add.rectangle(
        x,
        218,
        12,
        28 + (index % 3) * 6,
        0x705a78
      );
    }
  );

  // -------------------------------------------------
  // MORE — LATE NIGHTS / SLOW MORNINGS
  // -------------------------------------------------

  this.createLetterText(
    6150,
    65,
    'More late nights\n' +
      'and slow mornings.'
  );

  this.createShelfArtifact(
    6050,
    205,
    'CLOTHES'
  );

  this.createShelfArtifact(
    6250,
    205,
    'BREAKFAST'
  );

  // -------------------------------------------------
  // MORE — BAD COFFEE
  // -------------------------------------------------

  this.createLetterText(
    6900,
    65,
    'More bad cups of coffee.'
  );

  this.createShelfArtifact(
    6900,
    205,
    'INCENSE\nCOFFEE'
  );

  // -------------------------------------------------
  // MORE — CAR / MUSIC
  // -------------------------------------------------

  this.createLetterText(
    7650,
    65,
    'More scenes and songs\n' +
      'in the car.'
  );

  this.createShelfArtifact(
    7550,
    205,
    'CAR'
  );

  this.createShelfArtifact(
    7750,
    205,
    'MUSIC'
  );

  // -------------------------------------------------
  // MORE — BITS
  // -------------------------------------------------

  this.createLetterText(
    8400,
    65,
    'More bits and laughs'
  );

  this.createShelfArtifact(
    8250,
    205,
    'CARDS'
  );

  this.createShelfArtifact(
    8380,
    205,
    'PUPPET'
  );

  this.createShelfArtifact(
    8510,
    205,
    'NOSE'
  );

  this.createShelfArtifact(
    8640,
    205,
    'PP'
  );

  // -------------------------------------------------
    // MORE — CONFLICTS
    // -------------------------------------------------

    this.createLetterText(
    9200,
    65,
    'and even more conflicts because\n' +
        'we are getting pretty good at\n' +
        'having those now.'
    );

    // -------------------------------------------------
// MOST IMPORTANTLY
// -------------------------------------------------

this.createLetterText(
  10150,
  65,
  'Most importantly I want more you\n' +
    'in whatever form that takes.'
);

// -------------------------------------------------
// CLOSING — EMPTY SHELF
// -------------------------------------------------

this.createLetterText(
  11200,
  65,
  'Anyway this is about as mushy\n' +
    'as I can get,\n' +
    'hope its not too much.'
);

this.createLetterText(
  11900,
  65,
  'I fuck with you or whatever.'
);

this.createLetterText(
  12500,
  65,
  'Love ya',
  14
);

this.add.rectangle(
  12850,
  180,
  4,
  300,
  0x7c687f
);

this.add.text(
  12790,
  50,
  'ENDING\nTRIGGER',
  {
    fontFamily: 'monospace',
    fontSize: '7px',
    color: '#756b7b',
    align: 'center',
  }
)
  .setOrigin(0.5);
}

createShelfArtifact(
  x,
  y,
  label
) {
  // Programmer art only.
  // Eventually each of these becomes the
  // recognizable object from its chapter.

  this.add.rectangle(
    x,
    y,
    72,
    42,
    0x816989
  );

  this.add.text(
    x,
    y,
    label,
    {
      fontFamily: 'monospace',
      fontSize: '6px',
      color: '#f1e6f2',
      align: 'center',
    }
  )
    .setOrigin(0.5)
    .setDepth(10);
}

  createLetterText(
  x,
  y,
  text,
  fontSize = 11
) {
  return this.add.text(
    x,
    y,
    text,
    {
      fontFamily: 'monospace',
      fontSize: `${fontSize}px`,
      color: '#f4e8d7',
      align: 'center',
      lineSpacing: 4,
    }
  )
    .setOrigin(0.5)
    .setDepth(20);
}

  createShelf(
    x,
    y,
    width,
    height
  ) {
    const shelfColor = 0x45334f;
    const innerColor = 0x211927;

    this.add.rectangle(
      x,
      y,
      width,
      height,
      shelfColor
    );

    this.add.rectangle(
      x,
      y,
      width - 14,
      height - 14,
      innerColor
    );

    const shelfCount = 4;
    const spacing =
      (height - 20) / shelfCount;

    for (
      let i = 1;
      i < shelfCount;
      i++
    ) {
      this.add.rectangle(
        x,
        y -
          height / 2 +
          10 +
          spacing * i,
        width - 14,
        4,
        shelfColor
      );
    }

    // Fake books for programmer-art purposes.
    for (
      let i = 0;
      i < 10;
      i++
    ) {
      const bookX =
        x -
        width / 2 +
        20 +
        i * 20;

      this.add.rectangle(
        bookX,
        y + height / 2 - 28,
        10,
        28 + (i % 3) * 5,
        0x68536f
      );
    }
  }

  createBrainObject(
    x,
    y,
    label
  ) {
    this.add.rectangle(
      x,
      y,
      85,
      45,
      0x594561
    );

    this.add.text(
      x,
      y,
      label,
      {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: '#d0c1d5',
        align: 'center',
      }
    ).setOrigin(0.5);
  }

  createPlayer() {
  this.player = new Player(
    this,
    110,
    220,
    'nat-default'
  );

  this.player.setDepth(5);

  this.physics.add.collider(
    this.player,
    this.floor
  );

  this.cameras.main.startFollow(
    this.player,
    true,
    0.08,
    0.08
  );

  this.cameras.main.setDeadzone(
    120,
    80
  );
}

  createEntranceNarration() {
  this.entranceActive = true;

  this.startBrainExploration();

  this.player.setVelocityX(0);

  const lines = [
    '...',
    'Oh fuck.',
    "You're actually in here.",
    "Don't touch anything.",
  ];

  let index = 0;

  const camera = this.cameras.main;

  const centerX = camera.width / 2;
  const centerY = camera.height / 2;

  // -------------------------------------------------
  // NARRATION CONTAINER
  // -------------------------------------------------

  const container = this.add.container(
    centerX,
    centerY
  )
    .setScrollFactor(0)
    .setDepth(500);

  // Soft dark panel.
  const panel = this.add.graphics();

  panel.fillStyle(
    0x100d16,
    0.88
  );

  panel.fillRoundedRect(
    -235,
    -72,
    470,
    144,
    12
  );

  panel.lineStyle(
    2,
    0xc69bd6,
    0.9
  );

  panel.strokeRoundedRect(
    -235,
    -72,
    470,
    144,
    12
  );

  container.add(panel);

  // Decorative lines.
  const ornament = this.add.graphics();

  ornament.lineStyle(
    1,
    0xffd9a8,
    0.8
  );

  ornament.lineBetween(
    -150,
    -35,
    150,
    -35
  );

  ornament.lineBetween(
    -150,
    35,
    150,
    35
  );

  // Small center diamonds.
  ornament.fillStyle(
    0xffd9a8,
    1
  );

  ornament.fillTriangle(
    0,
    -43,
    5,
    -35,
    -5,
    -35
  );

  ornament.fillTriangle(
    0,
    43,
    5,
    35,
    -5,
    35
  );

  container.add(ornament);

  // -------------------------------------------------
  // SPARKLES
  // -------------------------------------------------

  const sparklePositions = [
    [-185, -42],
    [185, -42],
    [-195, 42],
    [195, 42],
    [0, -52],
    [0, 52],
  ];

  sparklePositions.forEach(
    ([x, y], i) => {
      const sparkle = this.add.text(
        x,
        y,
        '✦',
        {
          fontFamily: 'Arial',
          fontSize: i % 2 === 0
            ? '10px'
            : '7px',
          color: '#fff4cf',
        }
      )
        .setOrigin(0.5)
        .setAlpha(0.25);

      sparkle.setBlendMode(
        Phaser.BlendModes.ADD
      );

      container.add(sparkle);

      this.tweens.add({
        targets: sparkle,

        alpha: {
          from: 0.2,
          to: 1,
        },

        scale: {
          from: 0.6,
          to: 1.25,
        },

        duration: 700 + i * 120,

        delay: i * 130,

        yoyo: true,
        repeat: -1,

        ease: 'Sine.easeInOut',
      });
    }
  );

  // -------------------------------------------------
  // TEXT
  // -------------------------------------------------

  const narrationText = this.add.text(
    0,
    0,
    '',
    {
      fontFamily: UI_FONT,
      fontSize: '24px',
      color: '#fff8e7',
      align: 'center',
      lineSpacing: 7,

      stroke: '#fff8e7',
      strokeThickness: 1,

      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#ff8fda',
        blur: 12,
        fill: true,
      },
    }
  )
    .setOrigin(0.5)
    .setAlpha(0);

  container.add(narrationText);

  this.entranceText = narrationText;

  // -------------------------------------------------
  // SHOW EACH LINE
  // -------------------------------------------------

  const showNextLine = () => {
    if (index >= lines.length) {
      this.tweens.add({
        targets: container,
        alpha: 0,
        duration: 600,
        ease: 'Sine.easeIn',

        onComplete: () => {
          container.destroy(true);

          this.entranceText = null;
          this.entranceActive = false;
        },
      });

      return;
    }

    narrationText.setText(
      lines[index]
    );

    narrationText.setFontSize(
      lines[index] === 'Oh fuck.'
        ? 30
        : 24
    );

    narrationText.setAlpha(0);

    this.tweens.add({
      targets: narrationText,
      alpha: 1,
      duration: 450,
      ease: 'Sine.easeOut',
    });

    index++;

    this.time.delayedCall(
      index === 1
        ? 800
        : 1350,
      () => {
        this.tweens.add({
          targets: narrationText,
          alpha: 0,
          duration: 350,
          ease: 'Sine.easeIn',

          onComplete: () => {
            showNextLine();
          },
        });
      }
    );
  };

  // Container itself fades in first.
  container.setAlpha(0);

  this.tweens.add({
    targets: container,
    alpha: 1,
    duration: 500,
    ease: 'Sine.easeOut',
  });

  showNextLine();
}

  startBrainExploration() {
  // Give the final narration line
  // a moment to breathe.
  this.time.delayedCall(
    6500,
    () => {
      this.objectiveUI.setObjective(
        'KEEP GOING →'
      );

      // Let the objective register before
      // introducing the Q joke.
      this.time.delayedCall(
        2500,
        () => {
          this.entranceThoughtAvailable = true;

          this.thoughtPrompt.show();
        }
      );
    }
  );
}

updateEntranceThought() {
  if (
    !this.entranceThoughtAvailable ||
    this.entranceThoughtUsed
  ) {
    return;
  }

  if (
    Phaser.Input.Keyboard.JustDown(
      this.qKey
    )
  ) {
    this.useEntranceThought();
  }
}

useEntranceThought() {
  this.entranceThoughtUsed = true;
  this.entranceThoughtAvailable = false;

  this.thoughtPrompt.hide();

  this.thoughtUI.show(
    "You're in it.",
    1800
  );
}

  checkEndingTrigger() {
  if (this.endingStarted) {
    return;
  }

  if (this.player.x >= 13900) {
    this.startLibraryEnding();
  }
}

startLibraryEnding() {
  if (this.endingStarted) {
    return;
  }

  this.endingStarted = true;

  // Stop Nat.
  this.player.setVelocity(0, 0);

  // Stop following her.
  const camera = this.cameras.main;
  camera.stopFollow();

  // Give the end of the shelf a moment to sit.
  this.time.delayedCall(700, () => {

    // Hold on the final empty shelf.
    this.time.delayedCall(
      3000,
      () => {
        this.transitionToChapterSelect();
      }
    );
  });
}

transitionToChapterSelect() {
  saveManager.completeEnding();

  // Fade out the Mindfuck ending music
  // at the same time as the final visual fade.
  if (this.endingMusic) {
    this.tweens.add({
      targets: this.endingMusic,
      volume: 0,
      duration: 1200,
      ease: 'Linear',

      onComplete: () => {
        this.endingMusic.stop();
        this.endingMusic.destroy();
        this.endingMusic = null;
      },
    });
  }

  this.cameras.main.fadeOut(
    1200,
    0,
    0,
    0
  );

  this.cameras.main.once(
    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
    () => {
      this.scene.start(
        'ChapterSelectScene',
        {
          endingComplete: true,
        }
      );
    }
  );
}

  update(time) {
    if (this.debugMenu) {
      this.debugMenu.update();

      if (this.debugMenu.isOpen) {
        return;
      }
    }

    if (this.entranceActive) {
      this.player.setVelocityX(0);
      return;
    }

    if (this.endingStarted) {
    return;
    }

    this.player.update(time);

this.updateEntranceThought();

this.updateEntranceInteraction();

this.handleEntranceInteraction();

this.checkEndingTrigger();
  }
}