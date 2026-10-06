import Phaser from 'phaser';

import Player from '../gameplay/Player.js';
import cooking from '../data/cooking.js';

import Interactable from '../gameplay/Interactable.js';
import InteractionPrompt from '../ui/InteractionPrompt.js';

import DebugMenu from '../debug/DebugMenu.js';

import ObjectiveUI from '../ui/ObjectiveUI.js';

import sfxManager from '../systems/SFXManager.js';
import saveManager from '../systems/saveManager.js';
import SettingsAccess from '../systems/SettingsAccess.js';

import {
  UI_FONT,
  UI_COLORS
} from '../ui/uiTheme.js';

export default class CookingScene extends Phaser.Scene {
  constructor() {
    super('CookingScene');
  }

  create() {

    this.settingsAccess =
  new SettingsAccess(this);
  
    this.cameras.main.setBackgroundColor('#17141f');

    this.createTemporaryTextures();
    this.ingredientsAdded = 0;
    this.ingredientItems = [];
    this.nearbyIngredient = null;

    this.createKitchen();
    this.createIngredients();

    this.wrappingUnlocked = false;
    this.wrappingActive = false;
    this.lumpiaWrapped = 0;

    this.wrapMarkerDirection = 1;

    this.wrapResults = [];
    this.wrapFeedbackText = null;
    this.wrappingFinishing = false;

    this.fryingUnlocked = false;
    this.fryingActive = false;
    this.fryAmount = 0;
    this.fryResult = null;

    this.nearStove = false;

    // Jen is still the player.
    // Respect the player's saved raccoon-hat setting.
const saveData = saveManager.load();

this.jenHasRaccoonHat =
  saveData.equippedHat === 'raccoon_hat';

const jenTexture =
  this.jenHasRaccoonHat
    ? 'jen-default-hat'
    : 'jen-default';

// Jen is still the player.
this.player = new Player(
  this,
  this.kitchenWorldWidth / 2,
  200,
  jenTexture
);

this.player.setScale(1.35);

  this.cameras.main.startFollow(
  this.player,
  true,
  0.08,
  0
);

// Lock the camera vertically
this.cameras.main.setFollowOffset(0, 0);
this.cameras.main.setDeadzone(180, 360);

    this.interactionPrompt =
    new InteractionPrompt(this);

    this.objectiveUI = new ObjectiveUI(
  this,
  false, // compact
  false  // light
);

    this.enterKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.spaceKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.physics.add.collider(
      this.player,
      this.platforms
    );

    this.player.setCollideWorldBounds(true);

    // Nat is hanging out in the kitchen too.
    // Nat wanders around the kitchen while Jen cooks.
    this.nat = this.physics.add
      .sprite(
        450,
        this.floorY,
        'nat-default'
      )
      .setOrigin(0.5, 1);

    this.nat.setScale(1.35);
    this.nat.setDepth(5);

    this.nat.body.setAllowGravity(false);
    this.nat.setCollideWorldBounds(true);

    this.natWanderTarget = null;
    this.natIsWaiting = false;

    // Nat animation state
    this.natWalkFrames = [2, 3, 4, 5];
    this.natWalkFrameIndex = 0;
    this.natLastWalkFrameTime = 0;

    this.natIdleFrames = [0, 1];
    this.natIdleFrameIndex = 0;
    this.natLastIdleFrameTime = 0;

    this.scheduleNatWander();

    

    // Don't let Jen move during the initial
    // flashback label.
    this.flashbackStarting = true;

    this.flashbackPanel = this.add
  .rectangle(
    320,
    168,
    180,
    50,
    UI_COLORS.panel,
    0.94
  )
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(199)
  .setAlpha(0);

this.flashbackPanel.setStrokeStyle(
  1,
  UI_COLORS.border,
  0.9
);

    this.flashbackText = this.add
  .text(
    320,
    157,
    cooking.flashbackLabel,
    {
      fontFamily: UI_FONT,
      fontSize: '16px',
      color: UI_COLORS.text,
      align: 'center',
    }
  )
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(200)
  .setAlpha(0);

this.flashbackDecoration = this.add
  .text(
    320,
    181,
    '♡  ✦  ♡',
    {
      fontFamily: UI_FONT,
      fontSize: '9px',
      color: '#e99ada',
    }
  )
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(200)
  .setAlpha(0);

  this.tweens.add({
  targets: [
    this.flashbackPanel,
    this.flashbackText,
    this.flashbackDecoration
  ],
  alpha: 1,
  duration: 500,
  ease: 'Sine.easeOut'
});

    this.cameras.main.fadeIn(
      800,
      0,
      0,
      0
    );

    this.time.delayedCall(1300, () => {
  this.tweens.add({
    targets: [
      this.flashbackPanel,
      this.flashbackText,
      this.flashbackDecoration
    ],
    alpha: 0,
    duration: 400,
    ease: 'Sine.easeIn',

    onComplete: () => {
      this.flashbackPanel.destroy();
      this.flashbackText.destroy();
      this.flashbackDecoration.destroy();

      this.startCooking();
    }
  });
});

    this.debugMenu = new DebugMenu(this);
  }

  update(time, delta) {

    if (this.debugMenu) {
  this.debugMenu.update();

  if (this.debugMenu.isOpen) {
    return;
  }
}

  this.updateNatWander(time);

  // Frying minigame takes over normal gameplay.
  if (this.fryingActive) {
    this.updateFrying(delta);
    return;
  }

  // Wrapping minigame takes over normal gameplay.
  if (this.wrappingActive) {
    this.updateWrapping(delta);
    return;
  }

  if (
    this.player &&
    !this.flashbackStarting
  ) {
    this.player.update(time);

    // STEP 1: Filling
    if (
      !this.wrappingUnlocked &&
      !this.fryingUnlocked
    ) {
      this.updateIngredientInteractions();

      if (
        this.nearbyIngredient &&
        Phaser.Input.Keyboard.JustDown(
          this.enterKey
        )
      ) {
        this.nearbyIngredient
          .interactable
          .interact();
      }
    }

    // STEP 2: Wrapping
    else if (
      this.wrappingUnlocked &&
      !this.fryingUnlocked
    ) {
      this.updateWrappingInteraction();

      if (
        this.nearWrappingStation &&
        Phaser.Input.Keyboard.JustDown(
          this.enterKey
        )
      ) {
        this.wrapInteractable.interact();
      }
    }

    // STEP 3: Frying
    else if (this.fryingUnlocked) {
      this.updateFryingInteraction();

      if (
  this.fryInteractable &&
  this.nearStove &&
  Phaser.Input.Keyboard.JustDown(
    this.enterKey
  )
) {
  this.fryInteractable.interact();
}
    }
  }
}

  startCooking() {
  this.flashbackStarting = false;

  this.objectiveUI.setObjective(
    `${cooking.filling.objective}: ` +
    `${this.ingredientsAdded}/` +
    `${cooking.filling.ingredients.length}`
  );
}

addIngredient(
  ingredientData,
  sprite,
  interactable
) {

  sfxManager.play(this, 'interact');

  interactable.disable();
  sprite.destroy();

  const item = this.ingredientItems.find(
    (ingredientItem) =>
      ingredientItem.data.id ===
      ingredientData.id
  );

  if (item) {
    item.collected = true;
  }

  this.ingredientsAdded += 1;

  this.interactionPrompt.hide();

  this.objectiveUI.setObjective(
  `${cooking.filling.objective}: ` +
  `${this.ingredientsAdded}/` +
  `${cooking.filling.ingredients.length}`
);

  if (
    this.ingredientsAdded >=
    cooking.filling.ingredients.length
  ) {
    this.completeFilling();
  }
}

completeFilling() {
  this.objectiveUI.setObjective(
  'Filling complete!'
);

  this.time.delayedCall(900, () => {
  if (
    this.wrappingUnlocked &&
    !this.wrappingActive
  ) {
    this.objectiveUI.setObjective(
      cooking.wrapping.objective
    );
  }
}
);

  this.wrappingUnlocked = true;

  this.createWrappingStation();
}

createWrappingStation() {
  const wrappingX = 350;
  const wrappingY = 200;

  // --------------------------------
  // VISUAL
  // --------------------------------

  this.wrappingStationSprite = this.add
    .image(
      wrappingX,
      wrappingY,
      'wrapping-station'
    );

  // Start tiny/invisible so it can pop in.
  this.wrappingStationSprite
    .setDepth(-1)
    .setScale(0)
    .setAlpha(0);

  // --------------------------------
  // SOUND
  // --------------------------------

  sfxManager.play(this, 'getting-dressed');

  // --------------------------------
  // POP-IN
  // --------------------------------

  this.tweens.add({
    targets: this.wrappingStationSprite,

    scaleX: 0.05,
    scaleY: 0.05,
    alpha: 1,

    duration: 300,
    ease: 'Back.easeOut',
  });

  // --------------------------------
  // SPARKLE BURST
  // --------------------------------

  const sparklePositions = [
    { x: -28, y: -15, symbol: '✦' },
    { x: 30, y: -10, symbol: '✧' },
    { x: -20, y: 15, symbol: '✧' },
    { x: 25, y: 17, symbol: '✦' },
  ];

  sparklePositions.forEach((sparkle) => {
    const star = this.add
      .text(
        wrappingX,
        wrappingY,
        sparkle.symbol,
        {
          fontFamily: UI_FONT,
          fontSize: '10px',
          color: UI_COLORS.accent,
        }
      )
      .setOrigin(0.5)
      .setDepth(20)
      .setAlpha(0);

    this.tweens.add({
      targets: star,

      x: wrappingX + sparkle.x,
      y: wrappingY + sparkle.y,

      alpha: {
        from: 1,
        to: 0,
      },

      scale: {
        from: 0.5,
        to: 1.2,
      },

      duration: 500,
      ease: 'Quad.easeOut',

      onComplete: () => {
        star.destroy();
      },
    });
  });

  // --------------------------------
  // INTERACTION
  // --------------------------------

  this.wrapInteractable = new Interactable(
    this,
    wrappingX,
    wrappingY,
    {
      interactionDistance: 65,
      promptText: 'START WRAPPING',

      onInteract: () => {
        this.startWrapping();
      },
    }
  );
}

updateIngredientInteractions() {
  let nearbyItem = null;

  for (const item of this.ingredientItems) {
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

  this.nearbyIngredient = nearbyItem;
}
scheduleNatWander() {
  if (!this.nat || !this.nat.active) {
    return;
  }

  this.natIsWaiting = true;
  this.nat.setVelocityX(0);

  // Nat hangs around for a random amount of time
  // before deciding she absolutely needs to be
  // somewhere else in the kitchen.
  const waitTime =
    Phaser.Math.Between(900, 2400);

  this.time.delayedCall(waitTime, () => {
    if (!this.nat || !this.nat.active) {
      return;
    }

    this.chooseNatWanderTarget();
  });
}


chooseNatWanderTarget() {
  if (!this.nat || !this.nat.active) {
    return;
  }

  this.natIsWaiting = false;

  // Keep her away from the extreme edges of
  // the kitchen.
  const minX = 160;
  const maxX = this.kitchenWorldWidth - 160;

  this.natWanderTarget =
    Phaser.Math.Between(
      minX,
      maxX
    );

  const movingRight =
    this.natWanderTarget > this.nat.x;

  this.nat.setFlipX(!movingRight);

  this.natWalkFrameIndex = 0;
  this.natLastWalkFrameTime = 0;

  this.nat.setVelocityX(
  movingRight ? 55 : -55
);
}


updateNatWander(time) {
  if (!this.nat || !this.nat.active) {
    return;
  }

  // -----------------------------
  // IDLE
  // -----------------------------

  if (
    this.natIsWaiting ||
    this.natWanderTarget === null
  ) {
    this.nat.setVelocityX(0);

    // Switch idle frame every 500ms.
    if (
      time - this.natLastIdleFrameTime >= 500
    ) {
      this.natIdleFrameIndex =
        (this.natIdleFrameIndex + 1) %
        this.natIdleFrames.length;

      this.natLastIdleFrameTime = time;
    }

    this.nat.setFrame(
      this.natIdleFrames[
        this.natIdleFrameIndex
      ]
    );

    return;
  }

  // -----------------------------
  // WALKING
  // -----------------------------

  const distance = Math.abs(
    this.nat.x -
    this.natWanderTarget
  );

  if (distance <= 8) {
    this.nat.setVelocityX(0);

    this.natWanderTarget = null;
    this.natIdleFrameIndex = 0;
    this.natLastIdleFrameTime = time;

    this.nat.setFrame(0);

    this.scheduleNatWander();
    return;
  }

  // Frames 2–5 only.
  if (
    time - this.natLastWalkFrameTime >= 125
  ) {
    this.natWalkFrameIndex =
      (this.natWalkFrameIndex + 1) %
      this.natWalkFrames.length;

    this.natLastWalkFrameTime = time;
  }

  this.nat.setFrame(
    this.natWalkFrames[
      this.natWalkFrameIndex
    ]
  );
}

  createKitchen() {
  // Shared production kitchen used by Chapters 1 and 6.
  this.kitchenWorldWidth = 1400;
  this.kitchenWorldHeight = 450;
  this.floorY = 350;

  // Production background.
  const background = this.add
  .image(0, 35, 'kitchen-shared')
  .setOrigin(0, 0)
  .setDepth(-10);

// Keep the image's real aspect ratio.
const targetHeight = 360;
const scale = targetHeight / background.height;

background.setScale(scale);

// Make the world exactly as wide as the scaled kitchen.
this.kitchenWorldWidth = background.displayWidth;
this.kitchenWorldHeight = 450;

this.floorY = 320;

this.kitchenTable = this.add
  .image(
    this.kitchenWorldWidth - 200,
    this.floorY + 50,
    'kitchen-table'
  )
  .setOrigin(0.5, 1)
  .setScale(0.2)
  .setDepth(9);

  this.kitchenTable.setScale(0.2);

  // Invisible collision floor.
  this.platforms = this.physics.add.staticGroup();

  const floor = this.add.rectangle(
    this.kitchenWorldWidth / 2,
    this.floorY + 20,
    this.kitchenWorldWidth,
    40,
    0x000000,
    0
  );

  this.physics.add.existing(floor, true);
  this.platforms.add(floor);

  // Expand both physics and camera worlds.
  this.physics.world.setBounds(
    0,
    0,
    this.kitchenWorldWidth,
    this.kitchenWorldHeight
  );

  this.cameras.main.setBounds(
    0,
    0,
    this.kitchenWorldWidth,
    this.kitchenWorldHeight
  );
}

  createIngredients() {
  const ingredientVisuals = {
    meat: {
      texture: 'ingredient-meat',
      scale: 0.05,
    },

    cabbage: {
      texture: 'ingredient-cabbage',
      scale: 0.04,
    },

    carrots: {
      texture: 'ingredient-carrots',
      scale: 0.04,
    },
  };

  cooking.filling.ingredients.forEach(
    (ingredientData) => {
      const visual =
        ingredientVisuals[ingredientData.id];

      const sprite = this.add
        .sprite(
          ingredientData.x,
          ingredientData.y,
          visual.texture
        )
        .setScale(visual.scale);

      if (ingredientData.id === 'meat') {
        sprite.setDepth(10);
      }

      const interactable = new Interactable(
        this,
        ingredientData.x,
        ingredientData.y,
        {
          interactionDistance: 45,

          promptText:
            `ADD ${ingredientData.name}`,

          onInteract: () => {
            this.addIngredient(
              ingredientData,
              sprite,
              interactable
            );
          },
        }
      );

      this.ingredientItems.push({
        data: ingredientData,
        sprite,
        interactable,
        collected: false,
      });
    }
  );
}
updateWrappingInteraction() {
  const inRange =
    this.wrapInteractable.update(
      this.player
    );

  this.nearWrappingStation = inRange;

  if (inRange) {
    this.interactionPrompt.show(
      this.wrapInteractable.promptText
    );
  } else {
    this.interactionPrompt.hide();
  }
}

startWrapping() {
  sfxManager.play(this, 'interact');

  this.wrappingActive = true;

  this.player.setVelocity(0, 0);
  this.interactionPrompt.hide();
  this.wrapInteractable.disable();

  this.wrappingObjects = [];

  // --------------------------------
  // DARK BACKDROP
  // --------------------------------

  const overlay = this.add
    .rectangle(
      320,
      180,
      640,
      360,
      0x120d18,
      0.96
    )
    .setDepth(500)
    .setScrollFactor(0);

  // --------------------------------
  // PRODUCTION WRAPPING ART
  // --------------------------------

  const wrappingArt = this.add
    .image(
      320,
      180,
      'wrapping-minigame'
    )
    .setOrigin(0.5)
    .setDepth(501)
    .setScrollFactor(0);

  // Fit inside the screen without cropping.
  const maxWidth = 600;
  const maxHeight = 320;

  const artScale = Math.min(
    maxWidth / wrappingArt.width,
    maxHeight / wrappingArt.height
  );

  wrappingArt.setScale(artScale);

  // Slight darkening so UI stays readable.
  const artShade = this.add
    .rectangle(
      320,
      180,
      600,
      320,
      0x17101f,
      0.18
    )
    .setDepth(502)
    .setScrollFactor(0);

  // --------------------------------
  // TITLE
  // --------------------------------

  const title = this.add
    .text(
      320,
      38,
      cooking.wrapping.objective,
      {
        fontFamily: UI_FONT,
        fontSize: '18px',
        color: UI_COLORS.text,
        align: 'center',
      }
    )
    .setOrigin(0.5)
    .setDepth(510)
    .setScrollFactor(0);

  const decoration = this.add
    .text(
      320,
      59,
      '♡  ✦  ♡',
      {
        fontFamily: UI_FONT,
        fontSize: '8px',
        color: UI_COLORS.accent,
      }
    )
    .setOrigin(0.5)
    .setDepth(510)
    .setScrollFactor(0);

  // --------------------------------
  // COUNTER
  // --------------------------------

  this.wrapCounterText = this.add
    .text(
      320,
      82,
      `LUMPIA: ${this.lumpiaWrapped}/${cooking.wrapping.total}`,
      {
        fontFamily: UI_FONT,
        fontSize: '10px',
        color: UI_COLORS.text,
      }
    )
    .setOrigin(0.5)
    .setDepth(510)
    .setScrollFactor(0);

  // --------------------------------
  // TIMING PANEL
  // --------------------------------

  const timingPanel = this.add
    .rectangle(
      320,
      267,
      360,
      74,
      UI_COLORS.panel,
      0.94
    )
    .setDepth(508)
    .setScrollFactor(0);

  timingPanel.setStrokeStyle(
    1,
    UI_COLORS.border,
    0.9
  );

  // Main timing bar.
  this.wrapBar = this.add
    .rectangle(
      320,
      254,
      300,
      16,
      0x3a3044
    )
    .setDepth(510)
    .setScrollFactor(0);

  // Successful zone.
  this.wrapGoodZone = this.add
    .rectangle(
      320,
      254,
      cooking.wrapping.goodZoneWidth,
      16,
      UI_COLORS.accent,
      0.65
    )
    .setDepth(511)
    .setScrollFactor(0);

  // Moving marker.
  this.wrapMarker = this.add
    .rectangle(
      185,
      254,
      5,
      26,
      0xffffff
    )
    .setDepth(512)
    .setScrollFactor(0);

  const prompt = this.add
    .text(
      320,
      287,
      '[ SPACE ]  WRAP',
      {
        fontFamily: UI_FONT,
        fontSize: '10px',
        color: UI_COLORS.text,
      }
    )
    .setOrigin(0.5)
    .setDepth(510)
    .setScrollFactor(0);

  // --------------------------------
  // STORE EVERYTHING FOR CLEANUP
  // --------------------------------

  this.wrappingObjects.push(
    overlay,
    wrappingArt,
    artShade,
    title,
    decoration,
    this.wrapCounterText,
    timingPanel,
    this.wrapBar,
    this.wrapGoodZone,
    this.wrapMarker,
    prompt
  );
}

updateWrapping(delta) {
  const leftEdge = 180;
  const rightEdge = 460;

  const movement =
    cooking.wrapping.speed *
    (delta / 1000) *
    this.wrapMarkerDirection;

  this.wrapMarker.x += movement;

  if (this.wrapMarker.x >= rightEdge) {
    this.wrapMarker.x = rightEdge;
    this.wrapMarkerDirection = -1;
  }

  if (this.wrapMarker.x <= leftEdge) {
    this.wrapMarker.x = leftEdge;
    this.wrapMarkerDirection = 1;
  }

  if (
    Phaser.Input.Keyboard.JustDown(
      this.spaceKey
    )
  ) {
    this.attemptWrap();
  }
}

attemptWrap() {
  // Don't allow another wrap while we're
  // finishing the third one.
  if (this.wrappingFinishing) {
    return;
  }

  const goodZoneLeft =
    320 -
    cooking.wrapping.goodZoneWidth / 2;

  const goodZoneRight =
    320 +
    cooking.wrapping.goodZoneWidth / 2;

  const wasGood =
    this.wrapMarker.x >= goodZoneLeft &&
    this.wrapMarker.x <= goodZoneRight;

  // Save the result for the final food result.
  this.wrapResults.push(wasGood);

  // Show Jen's immediate reaction.
  this.showWrapFeedback(wasGood);

  this.lumpiaWrapped += 1;

  this.wrapCounterText.setText(
    `LUMPIA: ${this.lumpiaWrapped}/${cooking.wrapping.total}`
  );

  // All three are wrapped.
  if (
    this.lumpiaWrapped >=
    cooking.wrapping.total
  ) {
    this.wrappingFinishing = true;

    this.time.delayedCall(800, () => {
      this.completeWrapping();
    });

    return;
  }

  // Reset marker for the next lumpia.
  this.wrapMarker.x = 185;
  this.wrapMarkerDirection *= -1;
}

completeWrapping() {
  this.wrappingActive = false;
  this.wrappingFinishing = false;

  if (this.wrapFeedbackText) {
    this.wrapFeedbackText.destroy();
    this.wrapFeedbackText = null;
  }

  if (this.wrappingObjects) {
    this.wrappingObjects.forEach(
      (object) => {
        if (object && object.active) {
          object.destroy();
        }
      }
    );
  }

  this.wrappingObjects = [];

  this.objectiveUI.setObjective(
  'Wrapping complete!'
);

  this.time.delayedCall(900, () => {
  if (
    this.fryingUnlocked &&
    !this.fryingActive
  ) {
    this.objectiveUI.setObjective(
    cooking.frying.objective
  );
  }
});

// --------------------------------
// REMOVE WRAPPING STATION
// --------------------------------

if (
  this.wrappingStationSprite &&
  this.wrappingStationSprite.active
) {
  this.tweens.add({
    targets: this.wrappingStationSprite,

    scaleX: 0,
    scaleY: 0,
    alpha: 0,

    duration: 220,
    ease: 'Back.easeIn',

    onComplete: () => {
      this.wrappingStationSprite.destroy();
      this.wrappingStationSprite = null;
    },
  });
}

  // Unlock the final cooking stage.
  this.fryingUnlocked = true;

this.time.delayedCall(300, () => {
  this.createFryingStation();
});
}

createFryingStation() {
  // Temporary placement values.
  // We'll tune these against the actual stove.
  const fryingX = 720;
  const fryingY = 225;

  // --------------------------------
  // PAN VISUAL
  // --------------------------------

  this.fryingPanSprite = this.add
    .image(
      fryingX,
      fryingY,
      'frying-pan'
    )
    .setOrigin(0.5, 1)
    .setDepth(-1)
    .setScale(0)
    .setAlpha(0);

  // --------------------------------
  // SOUND
  // --------------------------------

  sfxManager.play(
    this,
    'getting-dressed'
  );

  // --------------------------------
  // POP-IN
  // --------------------------------

  this.tweens.add({
    targets: this.fryingPanSprite,

    scaleX: 0.05,
    scaleY: 0.05,
    alpha: 1,

    duration: 300,
    ease: 'Back.easeOut',
  });

  // --------------------------------
  // SPARKLE BURST
  // --------------------------------

  const sparklePositions = [
    { x: -24, y: -18, symbol: '✦' },
    { x: 25, y: -13, symbol: '✧' },
    { x: -18, y: 10, symbol: '✧' },
    { x: 22, y: 8, symbol: '✦' },
  ];

  sparklePositions.forEach((sparkle) => {
    const star = this.add
      .text(
        fryingX,
        fryingY - 10,
        sparkle.symbol,
        {
          fontFamily: UI_FONT,
          fontSize: '10px',
          color: UI_COLORS.accent,
        }
      )
      .setOrigin(0.5)
      .setDepth(20)
      .setAlpha(0);

    this.tweens.add({
      targets: star,

      x: fryingX + sparkle.x,
      y: fryingY - 10 + sparkle.y,

      alpha: {
        from: 1,
        to: 0,
      },

      scale: {
        from: 0.5,
        to: 1.2,
      },

      duration: 500,
      ease: 'Quad.easeOut',

      onComplete: () => {
        star.destroy();
      },
    });
  });

  // --------------------------------
  // INTERACTION
  // --------------------------------

  this.fryInteractable = new Interactable(
    this,
    fryingX,
    fryingY,
    {
      interactionDistance: 65,
      promptText: 'FRY LUMPIA',

      onInteract: () => {
        this.startFrying();
      },
    }
  );
}

showWrapFeedback(wasGood) {
  if (this.wrapFeedbackText) {
    this.wrapFeedbackText.destroy();
  }

  const text = wasGood
    ? 'damn okay'
    : 'close enough';

  this.wrapFeedbackText = this.add
    .text(
      320,
      112,
      text,
      {
        fontFamily: UI_FONT,
        fontSize: '11px',
        color: UI_COLORS.text,
        fontStyle: 'italic',
      }
    )
    .setOrigin(0.5)
    .setDepth(520)
    .setScrollFactor(0)
    .setAlpha(0);

  this.tweens.add({
    targets: this.wrapFeedbackText,
    y: 106,
    alpha: 1,
    duration: 160,
    ease: 'Back.easeOut',
  });

  this.time.delayedCall(600, () => {
    if (
      this.wrapFeedbackText &&
      this.wrapFeedbackText.active
    ) {
      this.tweens.add({
        targets: this.wrapFeedbackText,
        alpha: 0,
        duration: 150,

        onComplete: () => {
          if (this.wrapFeedbackText) {
            this.wrapFeedbackText.destroy();
            this.wrapFeedbackText = null;
          }
        },
      });
    }
  });
}

updateFrying(delta) {
  // While Space is held, fill the meter
  // and play the frying sound.
  if (this.spaceKey.isDown) {
    this.wasFrying = true;

    if (
      this.fryingSound &&
      !this.fryingSound.isPlaying
    ) {
      this.fryingSound.play();
    }

    this.fryAmount +=
      cooking.frying.speed *
      (delta / 1000);

    this.fryAmount = Phaser.Math.Clamp(
      this.fryAmount,
      0,
      100
    );

    const fillWidth =
      300 * (this.fryAmount / 100);

    this.fryFill.width = fillWidth;
  }

  // Once Space has actually been held,
  // releasing it finishes the attempt.
  if (
    this.wasFrying &&
    Phaser.Input.Keyboard.JustUp(
      this.spaceKey
    )
  ) {
    if (
      this.fryingSound &&
      this.fryingSound.isPlaying
    ) {
      this.fryingSound.stop();
    }

    this.finishFrying();
  }
}

finishFrying() {
  if (this.fryingSound) {
  this.fryingSound.stop();
  this.fryingSound.destroy();
  this.fryingSound = null;
}

  this.fryingActive = false;

  if (
    this.fryAmount <
    cooking.frying.goodMin
  ) {
    this.fryResult = 'undercooked';
  } else if (
    this.fryAmount <=
    cooking.frying.goodMax
  ) {
    this.fryResult = 'good';
  } else {
    this.fryResult = 'burnt';
  }

  console.log(
    'FRY RESULT:',
    this.fryResult,
    this.fryAmount
  );

  this.time.delayedCall(700, () => {
    this.completeCooking();
  });
}

completeCooking() {
  if (this.fryingObjects) {
    this.fryingObjects.forEach(
      (object) => {
        if (object && object.active) {
          object.destroy();
        }
      }
    );
  }

  this.fryingObjects = [];

  this.objectiveUI.setObjective(
  'Lumpia complete!'
);

  // Give the objective completion a moment
  // before showing the final result.
  this.time.delayedCall(900, () => {
    this.showLumpiaResult();
  });
}

showLumpiaResult() {
  this.objectiveUI.hide();
  this.interactionPrompt.hide();

  this.player.setVelocity(0, 0);

  this.resultObjects = [];

  // --------------------------------
  // BACKDROP
  // --------------------------------

  const overlay = this.add
    .rectangle(
      320,
      180,
      640,
      360,
      0x120d18,
      0.97
    )
    .setDepth(600)
    .setScrollFactor(0);

  // --------------------------------
  // RESULT CARD
  // --------------------------------

  const panel = this.add
    .rectangle(
      320,
      180,
      410,
      310,
      UI_COLORS.panel,
      0.96
    )
    .setDepth(601)
    .setScrollFactor(0);

  panel.setStrokeStyle(
    1,
    UI_COLORS.border,
    0.9
  );

  // --------------------------------
  // TITLE
  // --------------------------------

  const title = this.add
    .text(
      320,
      48,
      'FINAL RESULT',
      {
        fontFamily: UI_FONT,
        fontSize: '17px',
        color: UI_COLORS.text,
        align: 'center',
      }
    )
    .setOrigin(0.5)
    .setDepth(603)
    .setScrollFactor(0);

  const decoration = this.add
    .text(
      320,
      69,
      '♡  ✦  ♡',
      {
        fontFamily: UI_FONT,
        fontSize: '8px',
        color: UI_COLORS.accent,
      }
    )
    .setOrigin(0.5)
    .setDepth(603)
    .setScrollFactor(0);

  // --------------------------------
  // TERRIBLE LUMPIA <3
  // --------------------------------

  const resultArt = this.add
    .image(
      320,
      154,
      'lumpia-final-result'
    )
    .setOrigin(0.5)
    .setDepth(602)
    .setScrollFactor(0);

  // Fit it into the card while preserving
  // the original aspect ratio.
  const maxArtWidth = 285;
  const maxArtHeight = 145;

  const artScale = Math.min(
    maxArtWidth / resultArt.width,
    maxArtHeight / resultArt.height
  );

  resultArt.setScale(artScale);

  // --------------------------------
  // STAR RATING
  // --------------------------------

  const stars = this.add
    .text(
      320,
      233,
      '★★☆☆☆',
      {
        fontFamily: UI_FONT,
        fontSize: '18px',
        color: UI_COLORS.text,
        letterSpacing: 3,
      }
    )
    .setOrigin(0.5)
    .setDepth(603)
    .setScrollFactor(0);

  // --------------------------------
  // VERDICT
  // --------------------------------

  const rating = this.add
    .text(
      320,
      260,
      'EDIBLE, TECHNICALLY',
      {
        fontFamily: UI_FONT,
        fontSize: '11px',
        color: UI_COLORS.text,
      }
    )
    .setOrigin(0.5)
    .setDepth(603)
    .setScrollFactor(0);

  // Little extra Jen energy.
  const comment = this.add
    .text(
      320,
      280,
      '...we tried',
      {
        fontFamily: UI_FONT,
        fontSize: '8px',
        color: '#aaa4b2',
        fontStyle: 'italic',
      }
    )
    .setOrigin(0.5)
    .setDepth(603)
    .setScrollFactor(0);

  // --------------------------------
  // CONTINUE
  // --------------------------------

  const continuePrompt = this.add
    .text(
      320,
      315,
      '[ ENTER ]  CONTINUE',
      {
        fontFamily: UI_FONT,
        fontSize: '9px',
        color: '#aaa4b2',
      }
    )
    .setOrigin(0.5)
    .setDepth(603)
    .setScrollFactor(0);

  this.resultObjects.push(
    overlay,
    panel,
    title,
    decoration,
    resultArt,
    stars,
    rating,
    comment,
    continuePrompt
  );

  this.input.keyboard.once(
    'keydown-ENTER',
    () => {
      sfxManager.play(this, 'click');
      this.closeLumpiaResult();
    }
  );
}

closeLumpiaResult() {
  if (this.resultObjects) {
    this.resultObjects.forEach(
      (object) => {
        if (object && object.active) {
          object.destroy();
        }
      }
    );
  }

  this.resultObjects = [];

  this.returnToBedroom();
}

returnToBedroom() {
  this.cameras.main.fadeOut(
    800,
    0,
    0,
    0
  );

  this.time.delayedCall(900, () => {
    this.scene.start(
      'BedroomScene',
      {
        returningFromCooking: true,
      }
    );
  });
}

updateFryingInteraction() {
  // The frying station has a short pop-in delay.
  // Don't check interaction until it exists.
  if (!this.fryInteractable) {
    this.nearStove = false;
    this.interactionPrompt.hide();
    return;
  }

  const inRange =
    this.fryInteractable.update(
      this.player
    );

  this.nearStove = inRange;

  if (inRange) {
    this.interactionPrompt.show(
      this.fryInteractable.promptText
    );
  } else {
    this.interactionPrompt.hide();
  }
}

startFrying() {

  sfxManager.play(this, 'interact');

  this.fryingActive = true;
  this.fryAmount = 0;
  this.wasFrying = false;

  this.fryingSound = this.sound.add('frying', {
  loop: true,
  volume: 1,
});

  this.player.setVelocity(0, 0);

  this.interactionPrompt.hide();
  this.fryInteractable.disable();

  this.fryingObjects = [];

  // --------------------------------
  // DARK BACKDROP
  // --------------------------------

  const overlay = this.add
    .rectangle(
      320,
      180,
      640,
      360,
      0x120d18,
      0.96
    )
    .setDepth(500)
    .setScrollFactor(0);

  // --------------------------------
  // PRODUCTION FRYING ART
  // --------------------------------

  const fryingArt = this.add
    .image(
      320,
      180,
      'frying-minigame'
    )
    .setOrigin(0.5)
    .setDepth(501)
    .setScrollFactor(0);

  // Fit inside the screen without cropping.
  const maxWidth = 600;
  const maxHeight = 320;

  const artScale = Math.min(
    maxWidth / fryingArt.width,
    maxHeight / fryingArt.height
  );

  fryingArt.setScale(artScale);

  // Slight tint over the art so UI stays readable.
  const artShade = this.add
    .rectangle(
      320,
      180,
      600,
      320,
      0x17101f,
      0.14
    )
    .setDepth(502)
    .setScrollFactor(0);

  // --------------------------------
  // TITLE
  // --------------------------------

  const title = this.add
    .text(
      320,
      38,
      cooking.frying.objective,
      {
        fontFamily: UI_FONT,
        fontSize: '18px',
        color: UI_COLORS.text,
        align: 'center',
      }
    )
    .setOrigin(0.5)
    .setDepth(510)
    .setScrollFactor(0);

  const decoration = this.add
    .text(
      320,
      59,
      '♡  ✦  ♡',
      {
        fontFamily: UI_FONT,
        fontSize: '8px',
        color: UI_COLORS.accent,
      }
    )
    .setOrigin(0.5)
    .setDepth(510)
    .setScrollFactor(0);

  // --------------------------------
  // FRYING METER PANEL
  // --------------------------------

  const meterPanel = this.add
    .rectangle(
      320,
      270,
      370,
      92,
      UI_COLORS.panel,
      0.94
    )
    .setDepth(508)
    .setScrollFactor(0);

  meterPanel.setStrokeStyle(
    1,
    UI_COLORS.border,
    0.9
  );

  // --------------------------------
  // METER BACKGROUND
  // --------------------------------

  this.fryBar = this.add
    .rectangle(
      320,
      251,
      300,
      16,
      0x3a3044
    )
    .setDepth(510)
    .setScrollFactor(0);

  // --------------------------------
// GOOD ZONE
// --------------------------------

const meterLeft = 170;
const meterWidth = 300;

const goodStart =
  meterLeft +
  meterWidth *
  (cooking.frying.goodMin / 100);

const goodEnd =
  meterLeft +
  meterWidth *
  (cooking.frying.goodMax / 100);

const goodWidth = goodEnd - goodStart;

this.fryGoodZone = this.add.graphics();

this.fryGoodZone
  .setDepth(511)
  .setScrollFactor(0);

this.fryGoodZone.fillStyle(
  UI_COLORS.accent,
  0.65
);

this.fryGoodZone.fillRect(
  goodStart,
  243,
  goodWidth,
  16
);

  // --------------------------------
  // LIVE FRYING FILL
  // --------------------------------

  this.fryFill = this.add
  .rectangle(
    170,
    251,
    1,
    12,
    0xffffff
  )
  .setOrigin(0, 0.5)
  .setDepth(512)
  .setScrollFactor(0);
  // --------------------------------
  // RAW / BURNT LABELS
  // --------------------------------

  const rawLabel = this.add
    .text(
      170,
      268,
      'RAW',
      {
        fontFamily: UI_FONT,
        fontSize: '8px',
        color: UI_COLORS.secondaryText,
      }
    )
    .setOrigin(0.5)
    .setDepth(510)
    .setScrollFactor(0);

  const burntLabel = this.add
    .text(
      470,
      268,
      'BURNT',
      {
        fontFamily: UI_FONT,
        fontSize: '8px',
        color: UI_COLORS.secondaryText,
      }
    )
    .setOrigin(0.5)
    .setDepth(510)
    .setScrollFactor(0);

  // --------------------------------
  // INSTRUCTIONS
  // --------------------------------

  const prompt = this.add
    .text(
      320,
      300,
      'HOLD [ SPACE ] TO FRY\nRELEASE WHEN READY',
      {
        fontFamily: UI_FONT,
        fontSize: '9px',
        color: UI_COLORS.text,
        align: 'center',
        lineSpacing: 3,
      }
    )
    .setOrigin(0.5)
    .setDepth(510)
    .setScrollFactor(0);

  // --------------------------------
  // CLEANUP LIST
  // --------------------------------

  this.fryingObjects.push(
    overlay,
    fryingArt,
    artShade,
    title,
    decoration,
    meterPanel,
    this.fryBar,
    this.fryGoodZone,
    this.fryFill,
    rawLabel,
    burntLabel,
    prompt
  );

  this.wasFrying = false;
}

  createTemporaryTextures() {
    if (
      !this.textures.exists(
        'kitchen-floor-placeholder'
      )
    ) {
      const graphics = this.make.graphics({
        add: false,
      });

      graphics.fillStyle(0x3b3742);
      graphics.fillRect(
        0,
        0,
        16,
        16
      );

      graphics.generateTexture(
        'kitchen-floor-placeholder',
        16,
        16
      );

      graphics.destroy();
    }

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

    if (!this.textures.exists('nat-placeholder')) {
      const graphics = this.make.graphics({
        add: false,
      });

      graphics.fillStyle(0xe1b88e);
      graphics.fillRect(8, 0, 16, 14);

      graphics.fillStyle(0x29242e);
      graphics.fillRect(5, 0, 22, 10);
      graphics.fillRect(5, 7, 5, 10);

      graphics.fillStyle(0x70657d);
      graphics.fillRect(5, 14, 22, 16);

      graphics.fillStyle(0x37313d);
      graphics.fillRect(4, 30, 10, 18);
      graphics.fillRect(18, 30, 10, 18);

      graphics.generateTexture(
        'nat-placeholder',
        32,
        48
      );

      graphics.destroy();
    }

    if (!this.textures.exists('ingredient-placeholder')) {
  const graphics = this.make.graphics({
    add: false,
  });

  graphics.fillStyle(0xc09ac8);

  graphics.fillRect(
    0,
    0,
    14,
    10
  );

  graphics.generateTexture(
    'ingredient-placeholder',
    14,
    10
  );

  graphics.destroy();
}
  }
}