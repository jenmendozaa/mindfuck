import ObjectiveUI from '../ui/ObjectiveUI.js';
import Phaser from 'phaser';

import Player from '../gameplay/Player.js';
import ChapterTitle from '../ui/ChapterTitle.js';

import bedroom from '../data/bedroom.js';

import Interactable from '../gameplay/Interactable.js';
import InteractionPrompt from '../ui/InteractionPrompt.js';
import DebugMenu from '../debug/DebugMenu.js';
import DialogueManager from '../systems/DialogueManager.js';
import saveManager from '../systems/saveManager.js';

import sfxManager from '../systems/SFXManager.js';

import ThoughtUI from '../ui/ThoughtUI.js';

import AchievementPopup from '../systems/AchievementPopup.js';

import SettingsAccess from '../systems/SettingsAccess.js';


export default class BedroomScene extends Phaser.Scene {
  constructor() {
    super('BedroomScene');
  }

  init(data) {
  this.returningFromCooking =
    data?.returningFromCooking ?? false;
}

  create() {
    this.settingsAccess =
  new SettingsAccess(this);
  
    saveManager.reachChapter(1);
  this.cameras.main.setBackgroundColor('#17141f');

  this.roomWidth = 1400;

  // Set up clothing state BEFORE creating the clothes.
  this.clothesCollected = 0;
  this.clothingItems = [];
  this.nearbyClothingItem = null;
  this.sockChoiceActive = false;
  this.searchingForSock = false;
  this.nearBed = false;
  this.bedSearchInteractable = null;

  this.createTemporaryTextures();
  this.createBedroom();

  // Only create the clothes on the first visit.
  if (!this.returningFromCooking) {
    this.createClothes();
  }

  const saveData = saveManager.load();

  const hasRaccoonHat =
    saveData.equippedHat === 'raccoon_hat';

  this.jenHasRaccoonHat = hasRaccoonHat;

  const startingJenTexture =
    hasRaccoonHat
      ? 'jen-base-hat'
      : 'jen-base';

  this.player = new Player(
    this,
    this.roomWidth / 2,
    280,
    startingJenTexture
  );

  this.createCensorOverlay();

  this.physics.add.collider(
    this.player,
    this.platforms
  );

  this.player.setCollideWorldBounds(true);

  this.physics.world.setBounds(
  0,
  0,
  this.roomWidth,
  450
);

this.cameras.main.setBounds(
  0,
  0,
  this.roomWidth,
  450
);

this.cameras.main.startFollow(
  this.player,
  true,
  0.12,
  0.12
);

  this.interactionPrompt =
    new InteractionPrompt(this);

  this.dialogueManager =
  new DialogueManager(this);

  this.thoughtUI =
  new ThoughtUI(this);

  this.achievementPopup =
  new AchievementPopup(this);

  this.enterKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.ENTER
  );

  this.upKey =
  this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.UP
  );

  this.downKey =
    this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );

  this.wKey =
    this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W
    );

  this.sKey =
    this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );

  this.debugMenu = new DebugMenu(this);

  // RETURNING FROM THE COOKING FLASHBACK
  if (this.returningFromCooking) {
    this.setupAfterCooking();
    return;
  }

  // NORMAL CHAPTER 1 START
  this.chapterStarting = true;

  this.chapterTitle = new ChapterTitle(this);

  this.chapterTitle.show(
    bedroom.chapter.number,
    bedroom.chapter.title,
    () => {
      this.startChapter();
    }
  );
}

createCensorOverlay() {
  this.censorOverlay = this.add.container(
    this.player.x,
    this.player.y
  );

  this.censorOverlay.setDepth(
    this.player.depth + 10
  );

  // -------------------------
  // CHEST PIXEL CENSOR
  // -------------------------

  const chestPixels = [
  [-15, -5, 9, 10, 0x111111],
  [-7,  -6, 9, 12, 0x29242f],
  [1,   -5, 9, 11, 0x17141f],
  [9,   -6, 9, 12, 0x3b3444],
  [16,  -5, 7, 10, 0x111111],
];

  // -------------------------
  // HIP PIXEL CENSOR
  // -------------------------

  const hipPixels = [
    [-17, 16, 10, 14, 0x17141f],
    [-8,  15, 10, 16, 0x302a38],
    [1,   16, 10, 15, 0x111111],
    [10,  15, 10, 16, 0x403748],
    [18,  16, 8, 14, 0x17141f],
  ];

  const allPixels = [
    ...chestPixels,
    ...hipPixels,
  ];

  allPixels.forEach(
    ([x, y, width, height, color]) => {
      const pixel = this.add.rectangle(
        x,
        y,
        width,
        height,
        color
      );

      this.censorOverlay.add(pixel);
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

if (this.sockChoiceActive) {
  this.player.setVelocityX(0);

  if (
  Phaser.Input.Keyboard.JustDown(this.upKey) ||
  Phaser.Input.Keyboard.JustDown(this.wKey) ||
  Phaser.Input.Keyboard.JustDown(this.downKey) ||
  Phaser.Input.Keyboard.JustDown(this.sKey)
) {
  this.sockChoiceIndex =
    this.sockChoiceIndex === 0 ? 1 : 0;

  sfxManager.play(
    this,
    'click',
    {
      volume: 0.65,
    }
  );

  this.updateSockChoiceDisplay();
}

  if (
  Phaser.Input.Keyboard.JustDown(
    this.enterKey
  )
) {
  sfxManager.play(
    this,
    'click',
    {
      volume: 0.65,
    }
  );

  this.confirmSockChoice();
}

  return;
}

if (this.dialogueManager) {
  this.dialogueManager.update();

  if (
    this.dialogueManager.isActive &&
    this.dialogueManager.lockMovement
  ) {
    this.player.setVelocityX(0);
    return;
  }
}
  if (
    this.player &&
    !this.chapterStarting
  ) {
    this.player.update(time);
    this.updateClothingInteractions();

    this.updateBedSearch();

    if (
  Phaser.Input.Keyboard.JustDown(
    this.enterKey
  )
) {
  if (
    this.searchingForSock &&
    this.nearBed
  ) {
    this.bedSearchInteractable.interact();
  } else if (
    this.nearbyClothingItem
  ) {
    this.nearbyClothingItem
      .interactable
      .interact();
  }
}
  }


if (this.censorOverlay) {
  this.censorOverlay.setPosition(
    this.player.x,
    this.player.y
  );
}

}

  startChapter() {
    this.chapterStarting = false;
this.objectiveUI =
  new ObjectiveUI(this);

this.objectiveUI.setObjective(
  'GET DRESSED',
  {
    label: 'CLOTHES',
    current: this.clothesCollected,
    total: bedroom.objective.total,
  }
);

      this.time.delayedCall(600, () => {
        this.showThought(
     bedroom.thoughts.start
        );
    }
);
  }

 createBedroom() {
  // --------------------------------
  // BEDROOM BACKGROUND
  // --------------------------------

  const bedroomBackground = this.add.image(
    0,
    -10,
    'bedroom-ch1'
  );

  bedroomBackground.setOrigin(0, 0);

  // This artwork represents the entire
  // 1400px searchable bedroom.
  const backgroundScale =
    this.roomWidth / bedroomBackground.width;

  bedroomBackground
    .setScale(backgroundScale)
    .setDepth(-10);

  this.bedroomBackground = bedroomBackground;
  this.bedroomBackgroundScale = backgroundScale;

  // Useful while we're calibrating.
  const displayedHeight =
    bedroomBackground.height * backgroundScale;

  console.log(
    'Bedroom displayed size:',
    this.roomWidth,
    displayedHeight
  );


  // --------------------------------
  // GAMEPLAY FLOOR
  // --------------------------------

  this.platforms =
    this.physics.add.staticGroup();

  // TEMPORARY — we'll adjust this after
  // seeing where the wooden floor lands.
  const floorY = 390;

  const floor = this.add.rectangle(
    this.roomWidth / 2,
    floorY + 8,
    this.roomWidth,
    16
  );

  this.physics.add.existing(floor, true);
  this.platforms.add(floor);

}

  updateClothingInteractions() {
  let nearbyItem = null;

  for (const item of this.clothingItems) {
    if (item.collected) {
      continue;
    }

    const inRange =
      item.interactable.update(this.player);

    if (inRange) {
      nearbyItem = item;
      break;
    }
  }

  if (nearbyItem) {
    this.interactionPrompt.show(
      nearbyItem.interactable.promptText
    );
  } else {
    this.interactionPrompt.hide();
  }

  this.nearbyClothingItem = nearbyItem;
}

  createTemporaryTextures() {
    if (!this.textures.exists('clothing-placeholder')) {
  const graphics = this.make.graphics({
    add: false,
  });

  graphics.fillStyle(0xc09ac8);
  graphics.fillRect(0, 4, 16, 10);

  graphics.fillStyle(0xe0c4e6);
  graphics.fillRect(4, 0, 8, 4);

  graphics.generateTexture(
    'clothing-placeholder',
    16,
    14
  );

  graphics.destroy();
}
    if (
      !this.textures.exists(
        'bedroom-floor-placeholder'
      )
    ) {
      const graphics = this.make.graphics({
        add: false,
      });

      graphics.fillStyle(0x3b3742);
      graphics.fillRect(0, 0, 16, 16);

      graphics.generateTexture(
        'bedroom-floor-placeholder',
        16,
        16
      );

      graphics.destroy();
    }

    // This makes BedroomScene independently testable
    // even if we later enter it from somewhere else.
    if (!this.textures.exists('jen-placeholder')) {
      const graphics = this.make.graphics({
        add: false,
      });

      graphics.fillStyle(0xf2d0a7);
      graphics.fillRect(8, 0, 16, 14);

      graphics.fillStyle(0xc8aa73);
      graphics.fillRect(5, 0, 22, 9);
      graphics.fillRect(4, 7, 6, 17);
      graphics.fillRect(22, 7, 6, 17);

      graphics.fillStyle(0x846d8f);
      graphics.fillRect(5, 14, 22, 16);

      graphics.fillStyle(0x37313d);
      graphics.fillRect(4, 30, 10, 18);
      graphics.fillRect(18, 30, 10, 18);

      graphics.generateTexture(
        'jen-placeholder',
        32,
        48
      );

      graphics.destroy();
    }
  }

  createClothingSprite(clothingData) {
  const textureMap = {
    shirt: 'clothing-shirt',
    pants: 'clothing-pants',
    'sock-1': 'clothing-sock',
    bra: 'clothing-bra',
  };

  const widthMap = {
  shirt: 96,
  pants: 116,
  'sock-1': 64,
  bra: 96,
};
  const texture =
    textureMap[clothingData.id];

  const sprite = this.add.image(
    clothingData.x,
    clothingData.y,
    texture
  );

  // Size based on the actual object rather
  // than the generated image dimensions.
  sprite.setDisplaySize(
    widthMap[clothingData.id],
    sprite.height *
      (widthMap[clothingData.id] /
        sprite.width)
  );

  sprite.setOrigin(0.5, 1);
  sprite.setDepth(5);

  return sprite;
}

  createClothes() {
  bedroom.clothes
    .filter((clothingData) => !clothingData.missing)
    .forEach((clothingData) => {

    const sprite =
    this.createClothingSprite(
      clothingData
    );

    const interactable = new Interactable(
      this,
      clothingData.x,
      clothingData.y,
      {
        interactionDistance: 85,
        promptText: `PICK UP ${clothingData.name}`,

        onInteract: () => {
          this.collectClothing(
            clothingData,
            sprite,
            interactable
          );
        },
      }
    );

    this.clothingItems.push({
      data: clothingData,
      sprite,
      interactable,
      collected: false,
    });
  });
}

collectClothing(
  clothingData,
  sprite,
  interactable
) {
  interactable.disable();

 sfxManager.play(this, 'interact');
  sprite.destroy();

  const item = this.clothingItems.find(
    (clothingItem) =>
      clothingItem.data.id === clothingData.id
  );

  if (item) {
    item.collected = true;
  }

  this.clothesCollected += 1;

  if (this.clothesCollected === 2) {
  this.showThought(
    bedroom.thoughts.secondItem
  );
}

if (this.clothesCollected === 4) {
  this.startMissingSockChoice();
  return;
}

  this.interactionPrompt.hide();

  this.objectiveUI.setProgress(
  this.clothesCollected,
  bedroom.objective.total
);

  if (
  this.clothesCollected >=
  bedroom.objective.total
) {
  console.log('ALL CLOTHES COLLECTED');
  this.completeGetDressed();
}
}

startMissingSockChoice() {
  this.chapterStarting = true;

  this.player.setVelocity(0, 0);
  this.interactionPrompt.hide();

  this.dialogueManager.start(
    [
      {
        speaker: 'JEN',
        text: "Fuck where's my other sock?",
      },
      {
        speaker: 'JEN',
        text: 'Ugh do I really need it?',
      },
    ],
    {
      lockMovement: true,

      onComplete: () => {
        this.showSockChoice();
      },
    }
  );
}

showSockChoice() {
  this.sockChoiceActive = true;
  this.sockChoiceIndex = 0;

  this.sockChoiceObjects = [];

  const overlay = this.add
    .rectangle(
      320,
      180,
      640,
      360,
      0x08070a,
      0.58
    )
    .setScrollFactor(0)
    .setDepth(500);

  const box = this.add
    .rectangle(
      320,
      180,
      300,
      175,
      0x211729,
      1
    )
    .setStrokeStyle(
      2,
      0xd996b7,
      1
    )
    .setScrollFactor(0)
    .setDepth(501);

  const decoration = this.add
    .text(
      320,
      112,
      '♡  ✦  ♡',
      {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#d996b7',
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  const question = this.add
    .text(
      320,
      138,
      'FIND THE SOCK?',
      {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#fff0f6',
        stroke: '#542f4c',
        strokeThickness: 2,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  this.sockYesHighlight = this.add
    .rectangle(
      320,
      177,
      100,
      25,
      0x542f4c,
      1
    )
    .setScrollFactor(0)
    .setDepth(501);

  this.sockNoHighlight = this.add
    .rectangle(
      320,
      210,
      100,
      25,
      0x542f4c,
      0
    )
    .setScrollFactor(0)
    .setDepth(501);

  this.sockYesText = this.add
    .text(
      320,
      177,
      '✦ YES ✦',
      {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ffffff',
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  this.sockNoText = this.add
    .text(
      320,
      210,
      'NO',
      {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#8f8494',
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  const controls = this.add
    .text(
      320,
      248,
      '↑ ↓  SELECT     ENTER  CONFIRM',
      {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: '#9d8fa0',
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  this.sockChoiceObjects.push(
    overlay,
    box,
    decoration,
    question,
    this.sockYesHighlight,
    this.sockNoHighlight,
    this.sockYesText,
    this.sockNoText,
    controls
  );

  this.updateSockChoiceDisplay();
}

updateSockChoiceDisplay() {
  const yesSelected =
    this.sockChoiceIndex === 0;

  this.sockYesHighlight.setAlpha(
    yesSelected ? 1 : 0
  );

  this.sockNoHighlight.setAlpha(
    yesSelected ? 0 : 1
  );

  this.sockYesText
    .setText(
      yesSelected
        ? '✦ YES ✦'
        : 'YES'
    )
    .setColor(
      yesSelected
        ? '#ffffff'
        : '#8f8494'
    );

  this.sockNoText
    .setText(
      yesSelected
        ? 'NO'
        : '✦ NO ✦'
    )
    .setColor(
      yesSelected
        ? '#8f8494'
        : '#ffffff'
    );
}

confirmSockChoice() {
  const choseYes =
    this.sockChoiceIndex === 0;

  this.sockChoiceActive = false;

  this.sockChoiceObjects.forEach(
    (object) => object.destroy()
  );

  this.sockChoiceObjects = [];

  if (choseYes) {
    this.startSockSearch();
  } else {
    this.skipMissingSock();
  }
}

skipMissingSock() {
  this.showThought(
    'eh fuck it'
  );

  this.time.delayedCall(
    1800,
    () => {
      this.completeGetDressed();
    }
  );
}

startSockSearch() {
  this.searchingForSock = true;
  this.chapterStarting = false;

  this.objectiveUI.setObjective(
  'FIND THE FUCKING SOCK',
  {
    label: 'CLOTHES',
    current: 4,
    total: 5,
  }
);

  this.createBedSearch();
}

createBedSearch() {
  const bedX = 700;
  const bedY = 290;

  this.bedSearchInteractable =
    new Interactable(
      this,
      bedX,
      bedY,
      {
        interactionDistance: 95,
        promptText: 'SEARCH UNDER BED',

        onInteract: () => {
          this.findMissingSock();
        },
      }
    );
}

updateBedSearch() {
  if (
    !this.searchingForSock ||
    !this.bedSearchInteractable
  ) {
    return;
  }

  this.nearBed =
    this.bedSearchInteractable.update(
      this.player
    );

  if (this.nearBed) {
  this.interactionPrompt.show(
    this.bedSearchInteractable.promptText
  );

}
}

findMissingSock() {
  if (!this.searchingForSock) {
    return;
  }

  this.searchingForSock = false;
  this.nearBed = false;

  this.bedSearchInteractable.disable();
  this.bedSearchInteractable = null;

  this.interactionPrompt.hide();

  this.clothesCollected = 5;

  this.objectiveUI.setProgress(5, 5);

  this.chapterStarting = true;
  this.player.setVelocity(0, 0);

  this.showThought(
    'Fuck yeah! Found it'
  );

  this.time.delayedCall(1800, () => {
    this.unlockMissingSockAchievement();
  });
}

unlockMissingSockAchievement() {
  this.achievementPopup.show(
    'missing_sock',
    () => {
      this.completeGetDressed();
    }
  );
}

playDressTransition() {
  this.chapterStarting = true;
  this.player.setVelocity(0, 0);

  const x = this.player.x;
  const y = this.player.y;

  this.sound.play('getting-dressed', {
    volume: 0.7,
  });

  // Quick flash centered on Jen.
  const flash = this.add
    .rectangle(
      x,
      y,
      58,
      92,
      0xfff4cf,
      0
    )
    .setDepth(this.player.depth + 20);

  this.tweens.add({
    targets: flash,
    alpha: 0.8,
    scaleX: 1.25,
    scaleY: 1.15,
    duration: 120,
    yoyo: true,

    onYoyo: () => {
      // Outfit changes at the brightest point.
      this.dressJen();
    },

    onComplete: () => {
      flash.destroy();
    },
  });

  // Little pixel sparkles around Jen.
  const sparklePositions = [
    [-28, -32],
    [25, -25],
    [-34, 2],
    [31, 8],
    [-22, 35],
    [24, 38],
  ];

  sparklePositions.forEach(
    ([offsetX, offsetY], index) => {
      const sparkle = this.add
        .rectangle(
          x + offsetX,
          y + offsetY,
          5,
          5,
          0xffe69a
        )
        .setDepth(this.player.depth + 25)
        .setAlpha(0);

      this.tweens.add({
        targets: sparkle,
        alpha: {
          from: 0,
          to: 1,
        },
        scale: {
          from: 0.5,
          to: 1.4,
        },
        angle: 45,
        duration: 140,
        delay: index * 25,
        yoyo: true,

        onComplete: () => {
          sparkle.destroy();
        },
      });
    }
  );
}

dressJen() {
  const dressedTexture =
    this.jenHasRaccoonHat
      ? 'jen-default-hat'
      : 'jen-default';

  this.player.setTexture(
    dressedTexture,
    0
  );

  if (this.censorOverlay) {
    this.censorOverlay.destroy();
    this.censorOverlay = null;
  }
}

completeGetDressed() {
  console.log('completeGetDressed RUNNING');

  this.objectiveUI.complete(
  'GET DRESSED!'
);

  this.interactionPrompt.hide();

  this.chapterStarting = true;
  this.player.setVelocity(0, 0);

  // Visually dress Jen.
  this.playDressTransition();

  this.time.delayedCall(1200, () => {
    console.log(
      'STARTING POST DRESSING THOUGHTS'
    );

    this.startPostDressingThoughts();
  });
}

startPostDressingThoughts() {
  this.postDressingThoughtIndex = 0;

  this.showNextPostDressingThought();
}

showNextPostDressingThought() {
  const thoughts =
    bedroom.thoughts.afterDressing;

  if (
    this.postDressingThoughtIndex >=
    thoughts.length
  ) {
    this.startCookingFlashback();
    return;
  }

  const thought =
    thoughts[this.postDressingThoughtIndex];

  this.showThought(thought);

  this.postDressingThoughtIndex += 1;

  this.time.delayedCall(2800, () => {
    this.showNextPostDressingThought();
  });
}

startCookingFlashback() {
  this.thoughtUI.hide();

  this.objectiveUI.hide();

  this.cameras.main.fadeOut(
    800,
    0,
    0,
    0
  );

  this.time.delayedCall(900, () => {
  this.scene.start('CookingScene');
});
}

setupAfterCooking() {
  this.chapterStarting = false;

  this.dressJen();
  this.clothesCollected = bedroom.objective.total;
  this.clothingItems = [];
  this.nearbyClothingItem = null;
  

  this.interactionPrompt.hide();

  this.player.setPosition(700, 260);

  this.cameras.main.centerOn(
    this.player.x,
    180
  );
  this.player.setVelocity(0, 0);

  this.cameras.main.fadeIn(
    800,
    0,
    0,
    0
  );

  this.time.delayedCall(1100, () => {
    this.showThought(
      'goddamn are we bad at cooking together...'
    );

    this.time.delayedCall(2800, () => {
      this.startBreakfastConversation();
    });
  });
}

startBreakfastConversation() {
  this.dialogueManager.start(
    [
      {
        speaker: 'NAT',
        text: 'Wanna eat the leftovers for breakfast?',
      },
      {
        speaker: 'JEN',
        text: 'Yeah why not',
      },
    ],
    {
      lockMovement: true,

      onComplete: () => {
        this.startChapterTwo();
      },
    }
  );
}


startChapterTwo() {
  this.chapterStarting = true;
  this.player.setVelocity(0, 0);

  this.cameras.main.fadeOut(
    800,
    0,
    0,
    0
  );

  this.time.delayedCall(1000, () => {
  this.scene.start(
    'NarrationScene',
    {
      transitionId: 'transition2',
    }
  );
});

}

showThought(text) {
  this.thoughtUI.show(text);
}
}