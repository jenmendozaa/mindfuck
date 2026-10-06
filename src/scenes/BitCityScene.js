import Phaser from 'phaser';

import Player from '../gameplay/Player.js';
import ChapterTitle from '../ui/ChapterTitle.js';
import DebugMenu from '../debug/DebugMenu.js';

import bitCity from '../data/bitCity.js';

import DialogueManager from '../systems/DialogueManager.js';

import saveManager from '../systems/saveManager.js';

import ThoughtUI from '../ui/ThoughtUI.js';

import musicManager from '../systems/MusicManager.js';

import ObjectiveUI from '../ui/ObjectiveUI.js';

import InteractionPrompt from '../ui/InteractionPrompt.js';
import sfxManager from '../systems/SFXManager.js';

import AchievementPopup from '../systems/AchievementPopup.js';

import SettingsAccess from '../systems/SettingsAccess.js';

export default class BitCityScene extends Phaser.Scene {
  constructor() {
    super('BitCityScene');
  }

  create() {

    this.settingsAccess =
  new SettingsAccess(this);

    saveManager.reachChapter(4);

    musicManager.interrupt(
      this,
      'ch4',
      {
        volume: 0.8,
        loop: true,
        fadeIn: true,
      }
    );

     // 1. DEFINE WORLD
  this.worldWidth = 15000;
  this.worldHeight = 1000;
  this.worldCenter = this.worldWidth / 2;
    // LOCKED production home position
    this.homeX = 3500;

    this.mimeX = this.homeX + 1500; // 5000

  // 2. CREATE AREAS
  this.createTemporaryTextures();
  this.createTestRoom();

  // 3. CREATE MATERIALS
  this.createMaterials();

    
    this.cameras.main.setBackgroundColor('#17141f');

    this.raccoonRewardActive = false;
    this.raccoonEquipActive = false;
    this.raccoonEquipSelection = 0;
    this.raccoonEquipObjects = [];
  
    // =========================================
    // CHAPTER 4 ENVIRONMENT
    // =========================================

    // Permanent liminal background.
    const baseSource =
  this.textures
    .get('ch4-base')
    .getSourceImage();

const baseScale = 0.75;

  const baseWidth =
  baseSource.width * baseScale;

// Slight overlap prevents visible seams
// between repeated background images.
const overlap = 4;

this.baseBackgrounds = [];

for (
  let x = baseWidth / 2;
  x < this.worldWidth + baseWidth;
  x += baseWidth - overlap
) {
  const piece = this.add
    .image(
      x,
      325,
      'ch4-base'
    )
    .setOrigin(0.5, 1)
    .setScale(baseScale)
    .setAlpha(0.7)
    .setDepth(-100);

  this.baseBackgrounds.push(piece);
}
    // Bedroom environment.
    // This will fade as Jen moves away.


    this.bedroomEnvironment = this.add
      .image(
        this.homeX,
        125,
        'ch4-bedroom'
      )
      .setDepth(-50)
      .setScale(0.81);

    // Nat + bed.
    // This NEVER fades.
    this.bedNat = this.add
      .image(
        this.homeX,
        232,
        'ch4-bed-nat'
      )
      .setDepth(1);

    this.bedNat.setScale(0.215);

    // Nat interaction anchor
    this.nat = this.bedNat;

    // =========================================
    // TEMP HOME-BASE FLOOR
    // =========================================

    this.homeFloor =
      this.add.rectangle(
        this.homeX,
        345,
        900,
        30,
        0x000000,
        0
      );

    this.physics.add.existing(
      this.homeFloor,
      true
    );

    // =========================================
    // PLAYER
    // =========================================

    const saveData = saveManager.load();

    this.jenHasRaccoonHat =
      saveData.equippedHat === 'raccoon_hat';

    const jenTexture =
      this.jenHasRaccoonHat
        ? 'jen-base-hat'
        : 'jen-base';

    this.player = new Player(
      this,
      this.homeX - 120,
      220,
      jenTexture
    );

    this.player.setScale(1.15);
    this.player.setDepth(10);

    this.cameras.main.startFollow(
        this.player,
        true,
        0.1,
        0.1
    );

    this.cameras.main.setDeadzone(
        180,
        100
    );

    this.nearNat = false;

    this.physics.add.collider(
      this.player,
      this.ground
    );

    this.physics.add.collider(
      this.player,
      this.magicFloor
    );

    this.physics.add.collider(
      this.player,
      this.puppetFloor
    );

    this.physics.add.collider(
      this.player,
      this.mimeWall
    );

    this.physics.add.collider(
      this.player,
      this.mimePlatform
    );

    this.physics.add.collider(
      this.player,
      this.ppFloor
    );

   this.physics.add.collider(
    this.player,
    this.ppBook1,
    null,
    this.canLandOnPPBook,
    this
);

  this.physics.add.collider(
  this.player,
  this.ppBook2,
  null,
  this.canLandOnPPBook,
  this
);

this.physics.add.collider(
  this.player,
  this.ppBook3,
  null,
  this.canLandOnPPBook,
  this
);

this.physics.add.collider(
  this.player,
  this.ppBook4,
  null,
  this.canLandOnPPBook,
  this
);

this.physics.add.collider(
  this.player,
  this.ppBook5,
  null,
  this.canLandOnPPBook,
  this
);

this.physics.add.collider(
  this.player,
  this.ppBook6,
  null,
  this.canLandOnPPBook,
  this
);

this.physics.add.collider(
  this.player,
  this.ppPedestalPlatform,
  null,
  this.canLandOnPPBook,
  this
);

this.physics.add.collider(
  this.player,
  this.ppRightBook1,
  null,
  this.canLandOnPPBook,
  this
);

this.physics.add.collider(
  this.player,
  this.ppRightBook2,
  null,
  this.canLandOnPPBook,
  this
);

this.physics.add.collider(
  this.player,
  this.ppRightBook3,
  null,
  this.canLandOnPPBook,
  this
);

this.physics.add.collider(
  this.player,
  this.ppRightBook4,
  null,
  this.canLandOnPPBook,
  this
);

this.physics.add.collider(
  this.player,
  this.ppRightBook5,
  null,
  this.canLandOnPPBook,
  this
);



    this.chapterTitle = new ChapterTitle(this);
    this.dialogueManager = new DialogueManager(this);

    this.thoughtUI = new ThoughtUI(this);

    this.interactionPrompt =
      new InteractionPrompt(this);

    this.currentInteraction = null;

    this.debugMenu = new DebugMenu(this);

    this.achievementPopup =
  new AchievementPopup(this);

    this.chapterTitle.show(
      bitCity.chapter.number,
      bitCity.chapter.title,
      () => {
        this.startChapter();
      }
    );

    this.enterKey =
    this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.qKey =
    this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Q
    );

    this.availableQThought = null;
    this.qPrompt = null;
  }

  createTemporaryTextures() {
    if (
      !this.textures.exists(
        'jen-placeholder'
      )
    ) {
      const graphics = this.make.graphics({
        x: 0,
        y: 0,
        add: false,
      });

      graphics.fillStyle(
        0xd8c7a6,
        1
      );

      graphics.fillRect(
        0,
        0,
        32,
        48
      );

      graphics.generateTexture(
        'jen-placeholder',
        32,
        48
      );

      graphics.destroy();
    }
  }

  createTestRoom() {
  // Expand physics world using the
  // production world size defined in create().
 this.physics.world.setBounds(
  0,
  -640,
  this.worldWidth,
  this.worldHeight
);

  this.cameras.main.setBounds(
  0,
  -640,
  this.worldWidth,
  this.worldHeight
);

  // Invisible continuous floor.
  this.ground = this.add.rectangle(
    this.worldWidth / 2,
    340,
    this.worldWidth,
    40,
    0x666666,
    0
  );

  this.physics.add.existing(
    this.ground,
    true
  );

  this.createCardsArea();
  this.createPuppetArea();
  this.createNoseArea();
  this.createPPArea();
}

updateInteractionPrompt() {
  if (
    !this.player ||
    this.magicActive ||
    this.presentationActive ||
    this.raccoonRewardActive
  ) {
    this.currentInteraction = null;
    this.interactionPrompt.hide();
    return;
  }

  this.currentInteraction = null;

  // ---------------------------------
  // PRIORITY 1: SHOW MATERIAL TO NAT
  // ---------------------------------

  if (
    this.carriedMaterial &&
    this.nat
  ) {
    const natDistance =
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.nat.x,
        this.nat.y
      );

    if (natDistance < 120) {
      this.currentInteraction = {
        type: 'nat',
      };

      this.interactionPrompt.show(
        'SHOW NAT'
      );

      return;
    }
  }

  // ---------------------------------
  // PRIORITY 2: MATERIAL
  // ---------------------------------

  if (!this.carriedMaterial) {
    let closestMaterial = null;
    let closestDistance = Infinity;

    this.materials.forEach((material) => {
      if (
        material.found ||
        material.presented
      ) {
        return;
      }

      const distance =
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          material.object.x,
          material.object.y
        );

      if (
        distance < 90 &&
        distance < closestDistance
      ) {
        closestDistance = distance;
        closestMaterial = material;
      }
    });

    if (closestMaterial) {
      this.nearbyMaterial =
        closestMaterial;

      this.currentInteraction = {
        type: 'material',
        material: closestMaterial,
      };

      const label =
        closestMaterial.interaction ===
        'magic'
          ? 'PRACTICE'
          : `TAKE ${closestMaterial.name}`;

      this.interactionPrompt.show(label);

      return;
    }
  }

  // ---------------------------------
  // PRIORITY 3: TRASH CAN
  // ---------------------------------

  if (
    this.trashCan &&
    !this.raccoonHatFound
  ) {
    const trashDistance =
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.trashCan.x,
        this.trashCan.y
      );

    if (trashDistance < 90) {
      this.currentInteraction = {
        type: 'trash',
      };

      this.interactionPrompt.show(
        'CHECK TRASH'
      );

      return;
    }
  }

  // Nothing nearby.
  this.nearbyMaterial = null;
  this.interactionPrompt.hide();
}

handleInteractionInput() {
  if (
    !this.currentInteraction ||
    !Phaser.Input.Keyboard.JustDown(
      this.enterKey
    )
  ) {
    return;
  }

  const interaction =
    this.currentInteraction;

  this.currentInteraction = null;
  this.interactionPrompt.hide();

  switch (interaction.type) {
    case 'nat':
      sfxManager.play(
        this,
        'interact'
      );

      this.presentMaterial();
      break;

    case 'material': {
      const material =
        interaction.material;

      if (
        material.interaction ===
        'magic'
      ) {
        sfxManager.play(
          this,
          'interact'
        );

        this.startMagicTrick(
          material
        );
      } else {
        sfxManager.play(
          this,
          'interact'
        );

        this.collectMaterial(
          material
        );
      }

      break;
    }

    case 'trash':
      sfxManager.play(
        this,
        'interact'
      );

      this.findRaccoonHat();
      break;

    default:
      break;
  }
}

createPuppetArea() {
  this.puppetX = this.magicX - 1500;

  this.puppetEnvironment = this.add
    .image(
      this.puppetX,
      150,
      'ch4-puppet'
    )
    .setDepth(-20)
    .setScale(0.45);

  const puppetFloorXOffset = 0;
  const puppetFloorY = 265;
  const puppetFloorLength = 430;
  const puppetFloorHeight = 20;

  this.puppetFloor = this.add.rectangle(
    this.puppetX + puppetFloorXOffset,
    puppetFloorY,
    puppetFloorLength,
    puppetFloorHeight,
    0xff0000,
    0
  );

  this.physics.add.existing(
    this.puppetFloor,
    true
  );

  this.sockPuppet = this.add
  .image(
    this.puppetX,
    215,
    'ch4-sock-puppet'
  )
  .setDepth(5)
  .setScale(0.06);
}

createNoseArea() {
  // =========================================
  // MIME ENVIRONMENT — PRODUCTION ART
  // =========================================

  this.mimeX = this.homeX + 1500;

  this.mimeEnvironment = this.add
    .image(
      this.mimeX,
      140,
      'ch4-mime'
    )
    .setDepth(-20)
    .setScale(0.45);

  // =========================================
  // MIME FOREGROUND PLATFORM
  // =========================================

  this.mimePlatform = this.add.rectangle(
    this.mimeX,
    270,
    740,
    20,
    0xff0000,
    0
  );

  this.physics.add.existing(
    this.mimePlatform,
    true
  );

  // =========================================
  // MIME INVISIBLE BOX
  // =========================================

  const mimeBoxWidth = 160;

  this.mimeWall = this.add.rectangle(
    this.mimeX + 5 + mimeBoxWidth / 2,
    230,
    mimeBoxWidth,
    80,
    0xff0000,
    0
  );

  this.physics.add.existing(
    this.mimeWall,
    true
  );

  // =========================================
  // NOSE
  // =========================================

    this.nose = this.add
      .image(
        this.mimeX + 140,
        130,
        'ch4-nose'
      )
      .setDepth(5)
      .setScale(0.06);
}

canLandOnPPBook(player, platform) {
  const previousBottom =
    player.body.prev.y +
    player.body.height;

  const platformTop =
    platform.body.top;

  return (
    player.body.velocity.y >= 0 &&
    previousBottom <= platformTop + 4
  );
}

createPPArea() {
  // =========================================
  // PP ENVIRONMENT — PRODUCTION ART
  // =========================================

  this.ppX = this.mimeX + 1500;

  this.ppEnvironment = this.add
    .image(
      this.ppX,
      120,
      'ch4-pp'
    )
    .setDepth(-20)
    .setScale(0.65);

    // =========================================
    // PP MAIN FLOOR COLLIDER
    // =========================================

    const ppFloorXOffset = 0;
    const ppFloorY = 271;
    const ppFloorLength = 1400;
    const ppFloorHeight = 20;

    this.ppFloor = this.add.rectangle(
      this.ppX + ppFloorXOffset,
      ppFloorY,
      ppFloorLength,
      ppFloorHeight,
      0xff0000,
      0
    );

    this.physics.add.existing(
      this.ppFloor,
      true
    );

    // =========================================
    // PP BOOK 1 — LOWEST STEP
    // =========================================

    const ppBook1XOffset = -110;
    const ppBook1Y = 232;
    const ppBook1Length = 100;
    const ppBook1Height = 10;

    this.ppBook1 = this.add.rectangle(
      this.ppX + ppBook1XOffset,
      ppBook1Y,
      ppBook1Length,
      ppBook1Height,
      0xff0000,
      0
    );

    this.physics.add.existing(
      this.ppBook1,
      true
    );

    // =========================================
    // PP BOOK 2
    // =========================================

    const ppBook2XOffset = -50;
    const ppBook2Y = 200;
    const ppBook2Length = 90;
    const ppBook2Height = 10;

    this.ppBook2 = this.add.rectangle(
      this.ppX + ppBook2XOffset,
      ppBook2Y,
      ppBook2Length,
      ppBook2Height,
      0xff0000,
      0
    );

    this.physics.add.existing(
      this.ppBook2,
      true
    );

    // =========================================
    // PP BOOK 3
    // =========================================

    const ppBook3XOffset = -8;
    const ppBook3Y = 167;
    const ppBook3Length = 115;
    const ppBook3Height = 10;

    this.ppBook3 = this.add.rectangle(
      this.ppX + ppBook3XOffset,
      ppBook3Y,
      ppBook3Length,
      ppBook3Height,
      0xff0000,
      0
    );

    this.physics.add.existing(
      this.ppBook3,
      true
    );

    // =========================================
    // PP BOOK 4
    // =========================================

    const ppBook4XOffset = 47;
    const ppBook4Y = 131;
    const ppBook4Length = 92;
    const ppBook4Height = 10;

    this.ppBook4 = this.add.rectangle(
      this.ppX + ppBook4XOffset,
      ppBook4Y,
      ppBook4Length,
      ppBook4Height,
      0xff0000,
      0
    );

    this.physics.add.existing(
      this.ppBook4,
      true
);

// =========================================
// PP BOOK 5
// =========================================

const ppBook5XOffset = 75;
const ppBook5Y = 103;
const ppBook5Length = 90;
const ppBook5Height = 10;

this.ppBook5 = this.add.rectangle(
  this.ppX + ppBook5XOffset,
  ppBook5Y,
  ppBook5Length,
  ppBook5Height,
  0xff0000,
  0
);

this.physics.add.existing(
  this.ppBook5,
  true
);


// =========================================
// PP BOOK 6 — TOP LEFT STEP
// =========================================

const ppBook6XOffset = 105;
const ppBook6Y = 75;
const ppBook6Length = 75;
const ppBook6Height = 10;

this.ppBook6 = this.add.rectangle(
  this.ppX + ppBook6XOffset,
  ppBook6Y,
  ppBook6Length,
  ppBook6Height,
  0xff0000,
  0
);

this.physics.add.existing(
  this.ppBook6,
  true
);

// =========================================
// PP PEDESTAL PLATFORM
// =========================================

const ppPedestalXOffset = 235;
const ppPedestalY = 65;
const ppPedestalLength = 130;
const ppPedestalHeight = 10;

this.ppPedestalPlatform = this.add.rectangle(
  this.ppX + ppPedestalXOffset,
  ppPedestalY,
  ppPedestalLength,
  ppPedestalHeight,
  0xff0000,
  0
);

this.physics.add.existing(
  this.ppPedestalPlatform,
  true
);

// =========================================
// PP COLLECTIBLE
// =========================================

this.ppEggplant = this.add
  .image(
    this.ppX + 235,
    -30,
    'ch4-pp-eggplant'
  )
  .setDepth(5)
  .setScale(0.05);

// =========================================
// PP RIGHT STAIR 1
// =========================================

const ppRightBook1XOffset = 365;
const ppRightBook1Y = 73;
const ppRightBook1Length = 80;
const ppRightBook1Height = 10;

this.ppRightBook1 = this.add.rectangle(
  this.ppX + ppRightBook1XOffset,
  ppRightBook1Y,
  ppRightBook1Length,
  ppRightBook1Height,
  0xff0000,
  0
);

this.physics.add.existing(
  this.ppRightBook1,
  true
);


// =========================================
// PP RIGHT STAIR 2
// =========================================

const ppRightBook2XOffset = 390;
const ppRightBook2Y = 105;
const ppRightBook2Length = 70;
const ppRightBook2Height = 10;

this.ppRightBook2 = this.add.rectangle(
  this.ppX + ppRightBook2XOffset,
  ppRightBook2Y,
  ppRightBook2Length,
  ppRightBook2Height,
  0xff0000,
  0
);

this.physics.add.existing(
  this.ppRightBook2,
  true
);

// =========================================
// PP RIGHT STAIR 3
// =========================================

const ppRightBook3XOffset = 465;
const ppRightBook3Y = 130;
const ppRightBook3Length = 100;
const ppRightBook3Height = 10;

this.ppRightBook3 = this.add.rectangle(
  this.ppX + ppRightBook3XOffset,
  ppRightBook3Y,
  ppRightBook3Length,
  ppRightBook3Height,
  0xff0000,
  0
);

this.physics.add.existing(
  this.ppRightBook3,
  true
);


// =========================================
// PP RIGHT STAIR 4
// =========================================

const ppRightBook4XOffset = 515;
const ppRightBook4Y = 160;
const ppRightBook4Length = 97;
const ppRightBook4Height = 10;

this.ppRightBook4 = this.add.rectangle(
  this.ppX + ppRightBook4XOffset,
  ppRightBook4Y,
  ppRightBook4Length,
  ppRightBook4Height,
  0xff0000,
  0
);

this.physics.add.existing(
  this.ppRightBook4,
  true
);

// =========================================
// PP RIGHT STAIR 5
// =========================================

const ppRightBook5XOffset = 595;
const ppRightBook5Y = 190;
const ppRightBook5Length = 115;
const ppRightBook5Height = 10;

this.ppRightBook5 = this.add.rectangle(
  this.ppX + ppRightBook5XOffset,
  ppRightBook5Y,
  ppRightBook5Length,
  ppRightBook5Height,
  0xff0000,
  0
);

this.physics.add.existing(
  this.ppRightBook5,
  true
);

// =========================================
// RACCOON HAT TRASH CAN
// =========================================

this.trashCan = this.add
  .image(
    this.ppRightBook5.x,
    this.ppRightBook5.y,
    'trash'
  )
  .setOrigin(0.5, 1)
  .setScale(0.07)
  .setDepth(3);

}

createCardsArea() {
  // =========================================
  // MAGIC AREA
  // =========================================

  this.magicX =
    this.homeX - 1500;

  // Production environment artwork.
  this.magicEnvironment = this.add
    .image(
      this.magicX,
      160,
      'ch4-magic'
    )
    .setDepth(-20)
    .setScale(0.45);


  // =========================================
  // MAGIC STAGE FLOOR
  // =========================================

  const magicFloorXOffset = 0;
  const magicFloorY = 275;
  const magicFloorLength = 450;
  const magicFloorHeight = 20;

  this.magicFloor = this.add.rectangle(
    this.magicX + magicFloorXOffset,
    magicFloorY,
    magicFloorLength,
    magicFloorHeight,
    0xff0000,
    0 // temporary while positioning
  );

  this.physics.add.existing(
    this.magicFloor,
    true
  );

  // =========================================
  // MAGIC TABLE
  // =========================================

  this.magicTable = this.add
    .image(
      this.magicX,
      215,
      'ch4-magic-table'
    )
    .setDepth(2)
    .setScale(0.08);

// =========================================
// CARD COLLECTIBLE
// =========================================

this.magicCardDeck = this.add
  .image(
    this.magicX,
    175,
    'ch4-cards'
  )
  .setDepth(3)
  .setScale(0.06);

}

  createMaterials() {
  this.materials = [];

  bitCity.materials.forEach((data) => {
    const direction =
      data.side === 'left' ? -1 : 1;

    let x =
      this.worldCenter +
      direction * data.offset;

    if (data.id === 'nose') {
      x += 220;
    }

     if (data.id === 'pp-relic') {
      x += 25;
    }


    const y =
      data.id === 'cards'
        ? 255
        : data.id === 'puppet'
          ? 200
          : data.id === 'nose'
            ? 185
            : data.id === 'pp-relic'
              ? 70
              : 285;

    const object = this.add.rectangle(
      x,
      y,
      28,
      28,
      0xd6b36a
    );

    const label = this.add.text(
      x,
      y - 28,
      data.name,
      {
        fontFamily: 'monospace',
        fontSize: '7px',
        color: '#ffffff',
      }
    )
    .setOrigin(0.5);

    this.materials.push({
      ...data,

      object,
      label,

      found: false,
      presented: false,
    });
  });

  // =========================================
  // CONNECT PRODUCTION NOSE TO MATERIAL SYSTEM
  // =========================================

  const noseMaterial = this.materials.find(
    (material) => material.id === 'nose'
  );

  if (noseMaterial) {
    // Destroy the old temporary square.
    noseMaterial.object.destroy();

    // Destroy the old floating label.
    noseMaterial.label.destroy();

    // Use the real production nose instead.
    noseMaterial.object = this.nose;

    // We no longer need a label for it.
    noseMaterial.label = null;
  }

  this.nearbyMaterial = null;

  const ppMaterial = this.materials.find(
  (material) => material.id === 'pp-relic'
);

if (ppMaterial) {
  ppMaterial.object.destroy();

  if (ppMaterial.label) {
    ppMaterial.label.destroy();
  }

  ppMaterial.object = this.ppEggplant;
  ppMaterial.label = null;
}

const cardsMaterial = this.materials.find(
  (material) => material.id === 'cards'
);

if (cardsMaterial) {
  cardsMaterial.object.destroy();

  if (cardsMaterial.label) {
    cardsMaterial.label.destroy();
  }

  cardsMaterial.object = this.magicCardDeck;
  cardsMaterial.label = null;
}

const puppetMaterial =
  this.materials.find(
    (material) => material.id === 'puppet'
  );

if (puppetMaterial) {
  puppetMaterial.object.destroy();

  if (puppetMaterial.label) {
    puppetMaterial.label.destroy();
  }

  puppetMaterial.object = this.sockPuppet;
  puppetMaterial.label = null;
}

}



  startChapter() {
  this.materialsPresented = 0;
  this.carriedMaterial = null;

  this.objectiveUI =
    new ObjectiveUI(this);

  this.updateObjective();
}

updateObjective() {
  if (!this.objectiveUI) {
    return;
  }

  if (this.carriedMaterial) {
    this.objectiveUI.setObjective(
      'SHOW NAT'
    );

    return;
  }

  this.objectiveUI.setObjective(
    bitCity.objective.text,
    {
      label: 'MATERIAL',
      current: this.materialsPresented,
      total: bitCity.objective.total,
    }
  );
}


collectMaterial(material) {
  material.found = true;

  this.carriedMaterial = material;

  material.object.setVisible(false);

  if (material.label) {
    material.label.setVisible(false);
  }

  this.nearbyMaterial = null;
  this.currentInteraction = null;

  this.interactionPrompt.hide();

  this.updateObjective();
}

startMagicTrick(material) {
  this.magicActive = true;
  this.magicMaterial = material;

  this.interactionPrompt.hide();
  this.player.setVelocity(0, 0);

  this.magicObjects = [];

  // Dark theatrical overlay.
  this.magicOverlay = this.add
    .rectangle(
      320,
      180,
      640,
      360,
      0x120b18,
      0.72
    )
    .setScrollFactor(0)
    .setDepth(500);

  this.magicObjects.push(this.magicOverlay);

  // Magician table.
  this.magicMinigameTable = this.add
    .image(
      320,
      330,
      'ch4-magic-table'
    )
    .setScrollFactor(0)
    .setDepth(501)
    .setScale(0.16);

  this.magicObjects.push(
    this.magicMinigameTable
  );

  // One heading reused throughout the trick.
  this.magicPromptText = this.add.text(
    320,
    85,
    'PICK A CARD',
    {
      fontFamily: 'Yabikoma',
      fontSize: '14px',
      color: '#fff1cf',
      align: 'center',
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(503)
    .setShadow(
      2,
      2,
      '#000000',
      3
    );

  this.magicObjects.push(
    this.magicPromptText
  );

  this.createMagicCards();
}

createMagicCards() {
  const positions = [
  190,
  320,
  450,
];

  const textures = [
    'magic-ace-hearts',
    'magic-queen-diamonds',
    'magic-king-spades',
  ];

  this.magicCards = [];
  this.selectedMagicCard = 0;

  positions.forEach((x, index) => {
    const card = this.add
      .image(
        x,
        180,
        textures[index]
      )
      .setScrollFactor(0)
      .setDepth(502)
      .setScale(0.12);

    this.magicCards.push({
      card,

      // Remember which face belongs to this
      // physical card during the shuffle.
      faceTexture: textures[index],
    });

    this.magicObjects.push(card);
  });

  this.magicControlsText = this.add.text(
    320,
    300,
    '[← / →] CHOOSE     [ENTER] PICK',
    {
      fontFamily: 'Yabikoma',
      fontSize: '9px',
      color: '#c9c2d0',
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(503);

  this.magicObjects.push(
    this.magicControlsText
  );

  this.magicLeftKey =
    this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );

  this.magicRightKey =
    this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );

  this.magicPhase = 'choose';

  this.updateMagicCardSelection();
}

updateMagicTrick() {
  const canChoose =
    this.magicPhase === 'choose' ||
    this.magicPhase === 'guess';

  // Don't accept movement/selection input
  // while cards are locked, shuffling,
  // or showing the result.
  if (!canChoose) {
    return;
  }

  // Move selection left.
  if (
    Phaser.Input.Keyboard.JustDown(
      this.magicLeftKey
    )
  ) {
  sfxManager.play(
    this,
    'click',
    {
      volume: 0.65,
    }
  );
    this.selectedMagicCard -= 1;

    if (this.selectedMagicCard < 0) {
      this.selectedMagicCard =
        this.magicCards.length - 1;
    }

    this.updateMagicCardSelection();
  }

  // Move selection right.
  if (
    Phaser.Input.Keyboard.JustDown(
      this.magicRightKey
    )
  ) {
  sfxManager.play(
    this,
    'click',
    {
      volume: 0.65,
    }
  );
    this.selectedMagicCard += 1;

    if (
      this.selectedMagicCard >=
      this.magicCards.length
    ) {
      this.selectedMagicCard = 0;
    }

    this.updateMagicCardSelection();
  }

  // ENTER does something different
  // depending on which phase we're in.
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
    if (this.magicPhase === 'choose') {
      this.lockMagicCard();
    } else if (
      this.magicPhase === 'guess'
    ) {
      this.finishMagicTrick();
    }
  }
}

updateMagicCardSelection() {
  this.magicCards.forEach(
    (magicCard, index) => {
      const selected =
        index === this.selectedMagicCard;

      magicCard.card.setScale(
        selected ? 0.13 : 0.12
      );

      magicCard.card.setAlpha(
        selected ? 1 : 0.78
      );

      magicCard.card.setY(
        selected ? 168 : 180
      );
    }
  );
}

flipMagicCard(cardData, texture, delay = 0) {
  this.magicControlsText.setVisible(false);

  this.tweens.add({
    targets: cardData.card,
    scaleX: 0.01,
    duration: 140,
    delay,
    ease: 'Sine.easeIn',

    onComplete: () => {
      cardData.card.setTexture(texture);

      this.tweens.add({
        targets: cardData.card,
        scaleX: 0.12,
        duration: 140,
        ease: 'Sine.easeOut',
      });
    },
  });
}

lockMagicCard() {
  this.magicPhase = 'locked';

  this.magicCards.forEach(
    (cardData) => {
      cardData.card.setScale(0.12);
      cardData.card.setAlpha(1);
      cardData.card.setY(180);
    }
  );

  this.chosenMagicCard =
    this.magicCards[
      this.selectedMagicCard
    ];

  this.magicPromptText.setText(
    'REMEMBER YOUR CARD'
  );

  this.time.delayedCall(1400, () => {
    if (!this.magicActive) return;

    this.flipMagicCards();
  });
}

flipMagicCards() {
  this.magicPhase = 'flipping';

  this.magicCards.forEach((cardData, index) => {
    this.flipMagicCard(
      cardData,
      'magic-card-front',
      index * 100
    );
  });

  this.time.delayedCall(850, () => {
    if (!this.magicActive) return;

    this.magicPhase = 'shuffling';
    this.shuffleMagicCards();
  });
}

shuffleMagicCards(shuffleNumber = 1) {
  const targetPositions = [
  190,
  320,
  450,
];

  const shuffledPositions =
    Phaser.Utils.Array.Shuffle(
      [...targetPositions]
    );

  this.magicCards.forEach(
    (magicCard, index) => {
      this.tweens.add({
        targets: [
          magicCard.card,
          magicCard.label,
        ],

        x: shuffledPositions[index],

        duration: 550,
        ease: 'Sine.easeInOut',
      });
    }
  );

  this.time.delayedCall(650, () => {
    if (shuffleNumber < 3) {
      this.shuffleMagicCards(
        shuffleNumber + 1
      );
    } else {
      this.beginMagicGuess();
    }
  });
}

beginMagicGuess() {
  this.magicPhase = 'guess';

  this.selectedMagicCard = 0;

  this.magicCards.sort(
    (a, b) => a.card.x - b.card.x
  );

  this.magicPromptText.setText(
    'WHERE IS YOUR CARD?'
  );

  this.magicControlsText
    .setText(
      '[← / →] CHOOSE     [ENTER] PICK'
    )
    .setVisible(true);

  this.updateMagicCardSelection();
}

finishMagicTrick() {
  if (this.magicPhase !== 'guess') return;

  this.magicPhase = 'result';

  const guessedCard =
    this.magicCards[this.selectedMagicCard];

  const correct =
    guessedCard === this.chosenMagicCard;

  // Normalize cards before reveal.
  this.magicCards.forEach((cardData) => {
    cardData.card.setAlpha(1);
    cardData.card.setY(180);
  });

  // Flip every card back to its actual face.
  this.magicCards.forEach((cardData, index) => {
    this.flipMagicCard(
      cardData,
      cardData.faceTexture,
      index * 100
    );
  });

  this.time.delayedCall(750, () => {
    if (!this.magicActive) return;

    this.time.delayedCall(750, () => {
  if (!this.magicActive) return;

  this.magicControlsText.setVisible(false);

  this.magicPromptText.setText(
    correct
      ? 'HOLY SHIT IM GOOD'
      : '...THAT WAS A PRACTICE ROUND'
  );

  if (correct) {
    this.tweens.add({
      targets: this.magicPromptText,
      scaleX: 1.12,
      scaleY: 1.12,
      duration: 120,
      yoyo: true,
      ease: 'Back.easeOut',
    });
  }
});
  });

  this.time.delayedCall(2200, () => {
    if (!this.magicActive) return;

    this.completeMagicTrick();
  });
}

completeMagicTrick() {
  this.magicObjects.forEach(
    (object) => {
      if (
        object &&
        object.active
      ) {
        object.destroy();
      }
    }
  );

  this.magicObjects = [];
  this.magicActive = false;
  this.magicPhase = null;

  this.collectMaterial(
    this.magicMaterial
  );

  this.magicMaterial = null;
}

presentMaterial() {
  if (
    !this.carriedMaterial ||
    this.presentationActive
  ) {
    return;
  }

  const material =
    this.carriedMaterial;

  this.interactionPrompt.hide();

  if (material.presentation) {
    this.startMaterialPresentation(
      material
    );

    return;
  }

  this.completeMaterialPresentation(
    material
  );
}

startMaterialPresentation(material) {
  this.presentationActive = true;

  this.dialogueManager.start(
    material.presentation.dialogue,
    {
      lockMovement: true,

      onComplete: () => {
        this.showAutomaticMaterialThought(
          material
        );
      },
    }
  );
}

showAutomaticMaterialThought(material) {
  if (!material.presentation.automaticThought) {
    this.unlockMaterialThought(material);
    return;
  }

  this.thoughtUI.show(
    material.presentation.automaticThought,
    2200
  );

  this.time.delayedCall(2200, () => {
    this.unlockMaterialThought(material);
  });
}


findRaccoonHat() {
  this.raccoonHatFound = true;

  this.player.setVelocity(0, 0);
  this.raccoonRewardActive = true;

  // AchievementPopup handles:
  // - unlocking the achievement
  // - displaying the achievement screen
  // - waiting for ENTER
  // - calling the callback afterward
  const shown =
    this.achievementPopup.show(
      'raccoon_hat',
      () => {
        this.showRaccoonEquipChoice();
      }
    );

  // If the achievement was already unlocked,
  // AchievementPopup calls the callback immediately.
  if (!shown) {
    this.showRaccoonEquipChoice();
  }
}

showRaccoonEquipChoice() {
  this.raccoonEquipActive = true;
  this.raccoonEquipSelection = 0;
  this.raccoonEquipObjects = [];

  // -------------------------------------------------
  // SOFT OVERLAY
  // -------------------------------------------------

  const overlay = this.add
    .rectangle(
      320,
      180,
      640,
      360,
      0x08070a,
      0.62
    )
    .setScrollFactor(0)
    .setDepth(500);

  // -------------------------------------------------
  // MAIN CUTE POPUP
  // -------------------------------------------------

  const box = this.add
    .rectangle(
      320,
      180,
      300,
      175,
      0x17141f,
      1
    )
    .setStrokeStyle(
      2,
      0xd889b5,
      1
    )
    .setScrollFactor(0)
    .setDepth(501);

  // -------------------------------------------------
  // TOP DECORATION
  // -------------------------------------------------

  const decoration = this.add.text(
    320,
    105,
    '♡  ✦  ♡',
    {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#d996b7',
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  // -------------------------------------------------
  // LITTLE HAT
  // -------------------------------------------------

  const hatIcon = this.add.text(
    320,
    128,
    '▲',
    {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#a27b62',
      stroke: '#542f4c',
      strokeThickness: 2,
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  // -------------------------------------------------
  // QUESTION
  // -------------------------------------------------

  const question = this.add.text(
    320,
    149,
    'DO I LOOK CUTE? ♡',
    {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#fff0f6',
      stroke: '#542f4c',
      strokeThickness: 2,
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  // -------------------------------------------------
  // YES SELECTION BACKGROUND
  // -------------------------------------------------

  this.raccoonYesHighlight = this.add
    .rectangle(
      320,
      177,
      105,
      24,
      0x542f4c,
      1
    )
    .setScrollFactor(0)
    .setDepth(501.5);

  // -------------------------------------------------
  // YES
  // -------------------------------------------------

  this.raccoonYesText = this.add.text(
    320,
    177,
    '',
    {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#ffffff',
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  // -------------------------------------------------
  // NO SELECTION BACKGROUND
  // -------------------------------------------------

  this.raccoonNoHighlight = this.add
    .rectangle(
      320,
      204,
      105,
      24,
      0x542f4c,
      1
    )
    .setScrollFactor(0)
    .setDepth(501.5);

  // -------------------------------------------------
  // NO
  // -------------------------------------------------

  this.raccoonNoText = this.add.text(
    320,
    204,
    '',
    {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#77727f',
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  // -------------------------------------------------
  // CONTROLS
  // -------------------------------------------------

  const controls = this.add.text(
    320,
    238,
    '↑ ↓ SELECT     ENTER CONFIRM',
    {
      fontFamily: 'monospace',
      fontSize: '6px',
      color: '#77727f',
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  // -------------------------------------------------
  // DECORATIVE CORNERS
  // -------------------------------------------------

  const leftHeart = this.add.text(
    190,
    150,
    '♡',
    {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#9c7ab5',
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  const rightHeart = this.add.text(
    450,
    150,
    '♡',
    {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#9c7ab5',
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(502);

  // -------------------------------------------------
  // TRACK UI OBJECTS
  // -------------------------------------------------

  this.raccoonEquipObjects.push(
    overlay,
    box,
    decoration,
    hatIcon,
    question,
    this.raccoonYesHighlight,
    this.raccoonNoHighlight,
    this.raccoonYesText,
    this.raccoonNoText,
    controls,
    leftHeart,
    rightHeart
  );

  // -------------------------------------------------
  // INPUT
  // -------------------------------------------------

  this.raccoonUpKey =
    this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP
    );

  this.raccoonDownKey =
    this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );

  // -------------------------------------------------
  // INITIAL DISPLAY
  // -------------------------------------------------

  this.updateRaccoonEquipSelection();

  // -------------------------------------------------
  // CUTE ENTRANCE
  // -------------------------------------------------

  this.raccoonEquipObjects.forEach(
    (object) => {
      object.setAlpha(0);
    }
  );

 box.setScale(0.92);
hatIcon.setScale(0.7);

  this.tweens.add({
    targets: this.raccoonEquipObjects,
    alpha: 1,
    duration: 180,
    ease: 'Sine.easeOut',
  });

  this.tweens.add({
  targets: box,
  scaleX: 1,
  scaleY: 1,
  duration: 250,
  ease: 'Back.easeOut',
});

this.tweens.add({
  targets: hatIcon,
  scaleX: 1,
  scaleY: 1,
  duration: 300,
  ease: 'Back.easeOut',
});
}

updateRaccoonEquipChoice() {
  if (!this.raccoonEquipActive) {
    return;
  }

  if (
    Phaser.Input.Keyboard.JustDown(
      this.raccoonUpKey
    ) ||
    Phaser.Input.Keyboard.JustDown(
      this.raccoonDownKey
    )
  ) {
    sfxManager.play(
      this,
      'click',
      {
        volume: 0.65,
      }
    );

    this.raccoonEquipSelection =
      this.raccoonEquipSelection === 0
        ? 1
        : 0;

    this.updateRaccoonEquipSelection();
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

    this.confirmRaccoonEquipChoice();
  }
}


updateRaccoonEquipSelection() {
  const yesSelected =
    this.raccoonEquipSelection === 0;

  this.raccoonYesHighlight.setVisible(
    yesSelected
  );

  this.raccoonNoHighlight.setVisible(
    !yesSelected
  );

  this.raccoonYesText
    .setText(
      yesSelected
        ? '✦ YES PLEASE ✦'
        : '  YES PLEASE'
    )
    .setColor(
      yesSelected
        ? '#fff0f6'
        : '#77727f'
    );

  this.raccoonNoText
    .setText(
      yesSelected
        ? '  NO THANKS'
        : '✦ NO THANKS ✦'
    )
    .setColor(
      yesSelected
        ? '#77727f'
        : '#fff0f6'
    );
}

confirmRaccoonEquipChoice() {
  const equip =
    this.raccoonEquipSelection === 0;

  saveManager.update({
    equippedHat:
      equip
        ? 'raccoon_hat'
        : null,
  });

  // Update Jen immediately.
  this.jenHasRaccoonHat = equip;

  this.player.setTexture(
    equip
      ? 'jen-base-hat'
      : 'jen-base'
  );

  this.raccoonEquipObjects.forEach(
    (object) => {
      if (object && object.active) {
        object.destroy();
      }
    }
  );

  this.raccoonEquipObjects = [];

  this.raccoonEquipActive = false;
  this.raccoonRewardActive = false;
}



unlockMaterialThought(material) {
  this.completeMaterialPresentation(
    material
  );

  this.availableQThought =
    material.presentation.qThought;

  this.qPrompt = this.add.container(
  320,
  315
)
  .setScrollFactor(0)
  .setDepth(200);

const qPromptBg = this.add
  .rectangle(
    0,
    0,
    150,
    28,
    0x17141f,
    0.95
  )
  .setStrokeStyle(
    1,
    0xd889b5
  );

const qKeyBox = this.add
  .rectangle(
    -58,
    0,
    20,
    18,
    0x30243a
  )
  .setStrokeStyle(
    1,
    0xffb4d9
  );

const qKeyText = this.add
  .text(
    -58,
    0,
    'Q',
    {
      fontFamily: 'Yabikoma',
      fontSize: '11px',
      color: '#fff1cf',
    }
  )
  .setOrigin(0.5);

const qLabel = this.add
  .text(
    14,
    0,
    'READ MY MIND',
    {
      fontFamily: 'Yabikoma',
      fontSize: '10px',
      color: '#fff1cf',
    }
  )
  .setOrigin(0.5);

this.qPrompt.add([
  qPromptBg,
  qKeyBox,
  qKeyText,
  qLabel,
]);

this.qPrompt.setScale(0.85);
this.qPrompt.setAlpha(0);

this.tweens.add({
  targets: this.qPrompt,
  scaleX: 1,
  scaleY: 1,
  alpha: 1,
  duration: 180,
  ease: 'Back.easeOut',
});
}

completeMaterialPresentation(material) {
  material.presented = true;

  this.materialsPresented += 1;
  this.carriedMaterial = null;

  this.presentationActive = false;

  if (this.materialsPresented >= 4) {
  // Give the player time to read the final
  // Q thought before the chapter ending begins.
  this.time.delayedCall(
    10000,
    () => {
      this.startChapterEnding();
    }
  );

  return;
}

  this.updateObjective();
}

updateQThought() {
  if (
    !this.availableQThought
  ) {
    return;
  }

  if (
  Phaser.Input.Keyboard.JustDown(
    this.qKey
  )
) {
  sfxManager.play(
    this,
    'click'
  );

  this.showQThought();
}
}

showQThought() {
  if (this.qPrompt) {
    this.qPrompt.destroy();
    this.qPrompt = null;
  }

  this.thoughtUI.show(
    this.availableQThought,
    2800
  );

  this.availableQThought = null;
}

startChapterEnding() {
  this.objectiveUI.complete();

  this.time.delayedCall(1500, () => {
    this.objectiveUI.setObjective(
      'MAKE HER LAUGH'
    );

   // Fade the Chapter 4 music out with the
// visual ending of the chapter.
musicManager.fadeOut();

this.cameras.main.fadeOut(
  1000,
  0,
  0,
  0
);

this.cameras.main.once(
  'camerafadeoutcomplete',
  () => {
    this.scene.start(
      'NarrationScene',
      {
        transitionId: 'transition5',
      }
    );
  }
);
  });
}


updateEnvironmentFade() {
  if (
    !this.player ||
    !this.bedroomEnvironment
  ) {
    return;
  }

  const distance = Math.abs(
    this.player.x - this.homeX
  );

  const fadeStart = 250;
  const fadeEnd = 700;

  const alpha =
    1 -
    Phaser.Math.Clamp(
      (distance - fadeStart) /
        (fadeEnd - fadeStart),
      0,
      1
    );

  this.bedroomEnvironment.setAlpha(alpha);
}

updatePPCamera() {
  if (!this.player) return;

  const camera = this.cameras.main;

  // Only start following vertically once Jen climbs
  // significantly above the normal ground level.
  const groundY = 285;
  const verticalFollowStart = 210;

  if (this.player.y < verticalFollowStart) {
    const targetScrollY =
      this.player.y - camera.height * 0.55;

    camera.scrollY = Phaser.Math.Linear(
      camera.scrollY,
      targetScrollY,
      0.08
    );
  } else {
    // Ease back down to the normal Chapter 4 camera position.
    camera.scrollY = Phaser.Math.Linear(
      camera.scrollY,
      0,
      0.08
    );
  }
}

 update(time) {
  this.updateEnvironmentFade();
  this.updatePPCamera();

  if (this.debugMenu) {
    this.debugMenu.update();

    if (this.debugMenu.isOpen) {
      return;
    }
  }

  // Dialogue gets first priority.
  if (
    this.dialogueManager &&
    this.dialogueManager.isActive
  ) {
    this.dialogueManager.update();
    return;
  }

  // Magic minigame gets priority over
  // normal gameplay.
  if (this.magicActive) {
    this.updateMagicTrick();
    return;
  }

  // Temporary raccoon reward handling.
  // We'll replace this during the global
  // achievement/equip UI pass.
  if (this.raccoonRewardActive) {
    this.player.setVelocity(0, 0);

    if (this.raccoonEquipActive) {
      this.updateRaccoonEquipChoice();
    }

    return;
  }

  if (!this.player) {
    return;
  }

  this.player.update(time);

    this.updateInteractionPrompt();
    this.handleInteractionInput();
    this.updateQThought();
}

}
