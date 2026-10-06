import Phaser from 'phaser';

import ChapterTitle from '../ui/ChapterTitle.js';
import  DebugMenu  from '../debug/DebugMenu.js';
import Player from '../gameplay/Player.js';
import DialogueManager from '../systems/DialogueManager.js';
import saveManager from '../systems/saveManager.js';
import ObjectiveUI from '../ui/ObjectiveUI.js';
import InteractionPrompt from '../ui/InteractionPrompt.js';

import ThoughtUI from '../ui/ThoughtUI.js';
import ThoughtPrompt from '../ui/ThoughtPrompt.js';

import AchievementPopup from '../systems/AchievementPopup.js';

import SettingsAccess from '../systems/SettingsAccess.js';

export default class MorningScene extends Phaser.Scene {
  constructor() {
    super('MorningScene');
  }

  create() {

    this.settingsAccess =
  new SettingsAccess(this);
  
    saveManager.reachChapter(6);
    
    // --------------------------------
    // DEBUG
    // --------------------------------

    this.debugMenu =
      new DebugMenu(this);

      this.dialogueManager =
  new DialogueManager(this);

    // --------------------------------
    // CHAPTER STATE
    // --------------------------------

    this.chapterStarted = false;

    // --------------------------------
    // PLACEHOLDER KITCHEN
    // --------------------------------

    this.createKitchen();

    this.createCoffeeStation();

    this.createPlayer();
    this.createComposureUI();

    this.interactionPrompt =
  new InteractionPrompt(this);

this.thoughtUI =
  new ThoughtUI(this);

this.thoughtPrompt =
  new ThoughtPrompt(this);

  this.achievementPopup =
  new AchievementPopup(this);

this.finalMindQActive = false;
    this.finalMindQPrompt = null;
    this.mindTransitionStarted = false;

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

this.openingSequenceActive = false;

    this.coffeeStep = 'get-mug';

    // --------------------------------
    // CHAPTER TITLE
    // --------------------------------

    this.chapterTitle =
      new ChapterTitle(this);

    this.chapterTitle.show(
      6,
      'KEEPING IT COOL',
      () => {
        this.chapterStarted = true;
         this.startMorningOpening();
      }
    );
  }

  createKitchen() {
  // --------------------------------
  // SHARED CHAPTER 1 / 6 KITCHEN
  // --------------------------------

  this.kitchenWorldWidth = 1400;
  this.kitchenWorldHeight = 450;
  this.floorY = 350;

  // Production kitchen background.
  const background = this.add
    .image(0, 35, 'kitchen-shared')
    .setOrigin(0, 0)
    .setDepth(-10);

  // Match Chapter 1 exactly.
  const targetHeight = 360;
  const scale = targetHeight / background.height;

  background.setScale(scale);

  // World follows the actual scaled background width.
  this.kitchenWorldWidth = background.displayWidth;
  this.kitchenWorldHeight = 450;

  this.floorY = 320;

  // --------------------------------
  // TABLE INSERT
  // --------------------------------

  this.kitchenTable = this.add
    .image(
      this.kitchenWorldWidth - 200,
      this.floorY + 50,
      'kitchen-table'
    )
    .setOrigin(0.5, 1)
    .setScale(0.2)
    .setDepth(9);

  // --------------------------------
  // INVISIBLE FLOOR
  // --------------------------------

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

  // --------------------------------
  // WORLD + CAMERA BOUNDS
  // --------------------------------

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

createCoffeeStation() {
  this.coffeeMachine = this.add
    .image(
      this.kitchenWorldWidth * 0.60,
      this.floorY - 100,
      'coffee-machine-idle'
    )
    .setOrigin(0.5, 1)
    .setScale(0.065)
    .setDepth(3);

  this.coffeeMug = null;
  this.hasCoffeeMug = false;
  this.coffeeSound = null;
}

  createPlayer() {
  const saveData = saveManager.load();

  this.jenHasRaccoonHat =
    saveData.equippedHat === 'raccoon_hat';

  const jenTexture =
    this.jenHasRaccoonHat
      ? 'jen-morning-hat'
      : 'jen-morning';

  this.player = new Player(
    this,
    this.kitchenWorldWidth / 2,
    200,
    jenTexture
  );

  this.player.setScale(1.35);
  this.player.setDepth(5)

  // Player collides with the shared kitchen floor.
  this.physics.add.collider(
    this.player,
    this.platforms
  );

  this.player.setCollideWorldBounds(true);

  // Same camera behavior as Chapter 1.
  this.cameras.main.startFollow(
    this.player,
    true,
    0.08,
    0
  );

  this.cameras.main.setFollowOffset(0, 0);
  this.cameras.main.setDeadzone(180, 360);
}

    createComposureUI() {
  this.composure = 100;

  // ObjectiveUI stays top-left.
  this.objectiveUI =
    new ObjectiveUI(this);

  // --------------------------------
  // COMPOSURE HUD — TOP RIGHT
  // --------------------------------

  const width = 170;
  const height = 48;

  // 640px-wide game, so this leaves
  // 14px between the panel and right edge.
  this.composureContainer =
    this.add.container(
      640 - width - 14,
      12
    )
      .setScrollFactor(0)
      .setDepth(300);

  // Main panel.
  this.composurePanel =
    this.add.rectangle(
      0,
      0,
      width,
      height,
      0x17141f,
      0.96
    )
      .setOrigin(0, 0);

  // Pixel-style border pieces.
  const border = 0xd6b36a;

  const framePieces = [
    // Top / bottom
    this.add.rectangle(
      6, 0,
      width - 12, 3,
      border
    ).setOrigin(0, 0),

    this.add.rectangle(
      6, height - 3,
      width - 12, 3,
      border
    ).setOrigin(0, 0),

    // Left / right
    this.add.rectangle(
      0, 6,
      3, height - 12,
      border
    ).setOrigin(0, 0),

    this.add.rectangle(
      width - 3, 6,
      3, height - 12,
      border
    ).setOrigin(0, 0),

    // Pixel corners
    this.add.rectangle(
      3, 3,
      6, 3,
      border
    ).setOrigin(0, 0),

    this.add.rectangle(
      width - 9, 3,
      6, 3,
      border
    ).setOrigin(0, 0),

    this.add.rectangle(
      3, height - 6,
      6, 3,
      border
    ).setOrigin(0, 0),

    this.add.rectangle(
      width - 9, height - 6,
      6, 3,
      border
    ).setOrigin(0, 0),
  ];

  // Label.
  this.composureLabel =
    this.add.text(
      12,
      8,
      'COMPOSURE',
      {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#c9c2d0',
      }
    );

  // Little accent underneath the label.
  this.composureAccent =
    this.add.rectangle(
      12,
      20,
      42,
      2,
      0xd6b36a
    )
      .setOrigin(0, 0);

  // Meter backing.
  this.composureBarBackground =
    this.add.rectangle(
      12,
      29,
      146,
      10,
      0x0c0a10
    )
      .setOrigin(0, 0);

  // Actual meter.
  this.composureBar =
    this.add.rectangle(
      14,
      31,
      142,
      6,
      0xd6b36a
    )
      .setOrigin(0, 0);

  this.composureMaxWidth = 142;

  this.composureContainer.add([
    this.composurePanel,
    ...framePieces,
    this.composureLabel,
    this.composureAccent,
    this.composureBarBackground,
    this.composureBar,
  ]);
}

   startMorningOpening() {
  this.openingSequenceActive = true;

  // --------------------------------
  // SLEEPY NAT START POSITION
  // --------------------------------

  // Start Nat off to the right,
  // away from Jen.
  const natStartX =
    Math.min(
      this.player.x + 400,
      this.kitchenWorldWidth - 100
    );

  this.nat = this.physics.add
    .image(
      natStartX,
      this.floorY,
      'nat-sleepy'
    )
    .setOrigin(0.5, 1)
    .setScale(1.35)
    .setDepth(5);

  this.nat.body.setAllowGravity(false);
  this.nat.setCollideWorldBounds(true);

  // --------------------------------
  // OPENING PAUSE
  // --------------------------------

  // Let Jen exist in the kitchen
  // for a moment before Nat appears.
  this.nat.setVisible(false);

  this.time.delayedCall(
    700,
    () => {
      this.nat.setVisible(true);

      // Stop beside Jen instead of
      // walking directly into her.
      const natTargetX =
        this.player.x + 115;

      // --------------------------------
      // SLEEPY SHUFFLE
      // --------------------------------

      this.tweens.add({
        targets: this.nat,

        x: natTargetX,

        duration: 2200,
        ease: 'Sine.easeInOut',

        onComplete: () => {

          // Tiny sleepy pause after
          // reaching Jen.
          this.time.delayedCall(
            350,
            () => {
              this.startSleepyNatDialogue();
            }
          );
        },
      });
    }
  );
}

    startSleepyNatDialogue() {
  this.dialogueManager.start(
    [
      {
        speaker: 'NAT',
        text: '*yawn* eepy mornin baby',
      },
    ],
    {
      lockMovement: true,

      onComplete: () => {
        this.unlockMorningThought();
      },
    }
  );
}

switchNatToMorning() {
  if (!this.nat) {
    return;
  }

  // Remember sleepy Nat's exact position/state.
  const x = this.nat.x;
  const y = this.nat.y;
  const flipX = this.nat.flipX;

  // Remove the one-off sleepy pose.
  this.nat.destroy();

  // Replace her with the full morning spritesheet.
  this.nat = this.physics.add
    .sprite(
      x,
      y,
      'nat-morning'
    )
    .setOrigin(0.5, 1)
    .setScale(1.35)
    .setDepth(5);

  this.nat.body.setAllowGravity(false);
  this.nat.setCollideWorldBounds(true);
  this.nat.setFlipX(flipX);

  // Start on her normal idle frame.
  this.nat.setFrame(0);

  // Frame sets for later Chapter 6 movement.
  this.natIdleFrames = [0, 1];
  this.natWalkFrames = [2, 3, 4, 5];

  this.natIdleFrameIndex = 0;
  this.natWalkFrameIndex = 0;

  this.natLastIdleFrameTime = 0;
  this.natLastWalkFrameTime = 0;
}

   unlockMorningThought() {
  this.availableQThought =
    "God you're adorable";

  this.thoughtPrompt.show();
}

updateMorningThought() {
  if (!this.availableQThought) {
    return;
  }

  if (
    Phaser.Input.Keyboard.JustDown(
      this.qKey
    )
  ) {
    this.showMorningThought();
  }
}

showMorningThought() {
  this.thoughtPrompt.hide();

  const thoughtText =
    this.availableQThought;

  this.availableQThought = null;

  this.hitComposure(20);

  this.thoughtUI.show(
    thoughtText,
    2000
  );

  this.time.delayedCall(
    2000,
    () => {
      this.finishMorningOpening();
    }
  );
}

hitComposure(amount) {
  this.composure =
    Phaser.Math.Clamp(
      this.composure - amount,
      0,
      100
    );

  this.updateComposureBar();
}

setComposure(value) {
  this.composure =
    Phaser.Math.Clamp(
      value,
      0,
      100
    );

  this.updateComposureBar();
}

updateComposureBar() {
  const percent =
    this.composure / 100;

  const targetWidth =
    this.composureMaxWidth * percent;

  this.tweens.add({
    targets: this.composureBar,
    displayWidth: targetWidth,
    duration: 400,
    ease: 'Sine.easeOut',
  });

  this.reactComposureHUD();
}

reactComposureHUD() {
  if (!this.composureContainer) {
    return;
  }

  // Kill any previous reaction so they
  // don't stack on top of each other.
  this.tweens.killTweensOf(
    this.composureContainer
  );

  // Reset before each reaction.
  this.composureContainer
    .setAngle(0)
    .setScale(1);

  // --------------------------------
  // 76–100: KEEPING IT COOL
  // --------------------------------

  if (this.composure > 75) {
    return;
  }

  // --------------------------------
  // 51–75: tiny crack
  // --------------------------------

  if (this.composure > 50) {
    this.tweens.add({
      targets:
        this.composureContainer,

      x:
        this.composureContainer.x + 2,

      duration: 45,

      yoyo: true,

      repeat: 1,

      ease: 'Sine.easeInOut',
    });

    return;
  }

  // --------------------------------
  // 26–50: oh no
  // --------------------------------

  if (this.composure > 25) {
    this.tweens.add({
      targets:
        this.composureContainer,

      x:
        this.composureContainer.x + 3,

      angle: 1,

      duration: 40,

      yoyo: true,

      repeat: 3,

      ease: 'Sine.easeInOut',
    });

    return;
  }

  // --------------------------------
  // 1–25: NOT KEEPING IT COOL
  // --------------------------------

  if (this.composure > 0) {
    this.tweens.add({
      targets:
        this.composureContainer,

      x:
        this.composureContainer.x + 4,

      y:
        this.composureContainer.y + 2,

      angle: -2,

      scaleX: 1.02,
      scaleY: 0.98,

      duration: 35,

      yoyo: true,

      repeat: 5,

      ease: 'Sine.easeInOut',
    });

    return;
  }

  // --------------------------------
  // 0: COMPOSURE HAS LEFT THE CHAT
  // --------------------------------

  this.tweens.add({
    targets:
      this.composureContainer,

    x:
      this.composureContainer.x + 6,

    angle: 3,

    scaleX: 1.04,
    scaleY: 0.96,

    duration: 30,

    yoyo: true,

    repeat: 7,

    ease: 'Sine.easeInOut',
  });
}

finishMorningOpening() {
  // Sleepy opening is finished.
  // Switch Nat to her regular morning spritesheet.
  this.switchNatToMorning();

  this.dialogueManager.start(
    [
      {
        speaker: 'NAT',
        text: 'I can make the coffee while you make breakfast',
      },
    ],
    {
      lockMovement: true,

      onComplete: () => {
        this.showCoffeeChoice();
      },
    }
  );
}

showCoffeeChoice() {
  this.coffeeChoiceActive = true;
  this.coffeeChoiceIndex = 0;

  // --------------------------------
  // FIXED-SCREEN CHOICE UI
  // --------------------------------

  this.coffeeChoiceContainer =
    this.add.container(
      320,
      180
    )
      .setScrollFactor(0)
      .setDepth(500);

  // Dark backing panel.
  const box = this.add
    .rectangle(
      0,
      0,
      360,
      130,
      0x17141f,
      0.97
    )
    .setOrigin(0.5);

  // Pixel-style gold border.
  const border = 0xd6b36a;

  const framePieces = [
    this.add.rectangle(
      0, -65,
      348, 3,
      border
    ).setOrigin(0.5),

    this.add.rectangle(
      0, 65,
      348, 3,
      border
    ).setOrigin(0.5),

    this.add.rectangle(
      -180, 0,
      3, 118,
      border
    ).setOrigin(0.5),

    this.add.rectangle(
      180, 0,
      3, 118,
      border
    ).setOrigin(0.5),
  ];

  const question = this.add
    .text(
      0,
      -35,
      'LET NAT MAKE THE COFFEE?',
      {
        fontFamily: 'Yabikoma',
        fontSize: '11px',
        color: '#fff1cf',
        align: 'center',
      }
    )
    .setOrigin(0.5);

  this.coffeeYesText =
    this.add.text(
      -55,
      15,
      '> YES',
      {
        fontFamily: 'Yabikoma',
        fontSize: '12px',
        color: '#fff1cf',
      }
    )
      .setOrigin(0.5);

  this.coffeeNoText =
    this.add.text(
      55,
      15,
      'NO',
      {
        fontFamily: 'Yabikoma',
        fontSize: '12px',
        color: '#77727f',
      }
    )
      .setOrigin(0.5);

  const controls = this.add
    .text(
      0,
      45,
      '[ ← / → ] CHOOSE    [ ENTER ] SELECT',
      {
        fontFamily: 'Yabikoma',
        fontSize: '7px',
        color: '#77727f',
      }
    )
    .setOrigin(0.5);

  this.coffeeChoiceContainer.add([
    box,
    ...framePieces,
    question,
    this.coffeeYesText,
    this.coffeeNoText,
    controls,
  ]);

  // Small UI entrance.
  this.coffeeChoiceContainer
    .setScale(0.92)
    .setAlpha(0);

  this.tweens.add({
    targets:
      this.coffeeChoiceContainer,

    scaleX: 1,
    scaleY: 1,
    alpha: 1,

    duration: 180,
    ease: 'Back.easeOut',
  });
}

updateCoffeeChoice() {
  if (!this.coffeeChoiceActive) {
    return;
  }

  const leftPressed =
    Phaser.Input.Keyboard.JustDown(
      this.player.cursors.left
    );

  const rightPressed =
    Phaser.Input.Keyboard.JustDown(
      this.player.cursors.right
    );

  if (leftPressed || rightPressed) {
    this.coffeeChoiceIndex =
      this.coffeeChoiceIndex === 0
        ? 1
        : 0;

    this.updateCoffeeChoiceDisplay();
  }

  if (
  Phaser.Input.Keyboard.JustDown(
    this.enterKey
  )
) {
  this.sound.play('interact');
  this.selectCoffeeChoice();
}
}

updateCoffeeChoiceDisplay() {
  const yesSelected =
    this.coffeeChoiceIndex === 0;

  this.coffeeYesText
    .setText(
      yesSelected
        ? '> YES'
        : 'YES'
    )
    .setColor(
      yesSelected
        ? '#ffffff'
        : '#77727f'
    );

  this.coffeeNoText
    .setText(
      !yesSelected
        ? '> NO'
        : 'NO'
    )
    .setColor(
      !yesSelected
        ? '#ffffff'
        : '#77727f'
    );
}

showAutomaticThought(
  text,
  onComplete = null
) {
  const duration = 1800;

  this.thoughtUI.show(
    text,
    duration
  );

  this.time.delayedCall(
    duration,
    () => {
      if (onComplete) {
        onComplete();
      }
    }
  );
}

unlockIncenseAchievement() {
  this.natCoffeeMug?.destroy();
  this.natCoffeeMug = null;

  this.achievementPopup.show(
    'incense_coffee',
    () => {
      this.finishCoffeeSection();
    }
  );
}


selectCoffeeChoice() {
  this.coffeeChoiceActive = false;

  this.coffeeChoiceContainer
  ?.destroy(true);

this.coffeeChoiceContainer = null;

this.coffeeYesText = null;
this.coffeeNoText = null;

  if (this.coffeeChoiceIndex === 0) {
    this.chooseNatCoffee();
  } else {
    this.chooseJenCoffee();
  }
}

chooseJenCoffee() {
  this.dialogueManager.start(
    [
      {
        speaker: 'NAT',
        text: 'Why not?!?',
      },
      {
        speaker: 'JEN',
        text: 'Incense',
      },
      {
        speaker: 'NAT',
        text: 'Fair',
      },
    ],
    {
      lockMovement: true,

      onComplete: () => {
  this.moveNatAwayFromCoffee(() => {
    this.openingSequenceActive = false;

    this.startCoffeeObjective();
    this.setupCoffeeTask();
  });
},
    }
  );
}

moveNatAwayFromCoffee(onComplete) {
  if (!this.nat) {
    onComplete?.();
    return;
  }

  // Move Nat to the right side of Jen,
  // away from the coffee station.
  const targetX = Math.min(
    this.player.x + 170,
    this.kitchenWorldWidth - 120
  );

  this.nat.setFlipX(
    targetX < this.nat.x
  );

  this.tweens.add({
    targets: this.nat,
    x: targetX,

    duration: 900,
    ease: 'Sine.easeInOut',

    onComplete: () => {
      this.nat.setFrame(0);

      onComplete?.();
    },
  });
}

moveNatTo(targetX, onComplete = null) {
  if (!this.nat) {
    onComplete?.();
    return;
  }

  const movingLeft =
    targetX < this.nat.x;

  this.nat.setFlipX(movingLeft);

  const walkEvent =
    this.time.addEvent({
      delay: 125,
      loop: true,

      callback: () => {
        if (!this.nat?.active) {
          return;
        }

        this.natWalkFrameIndex =
          (
            this.natWalkFrameIndex + 1
          ) %
          this.natWalkFrames.length;

        this.nat.setFrame(
          this.natWalkFrames[
            this.natWalkFrameIndex
          ]
        );
      },
    });

  const distance =
    Math.abs(
      targetX - this.nat.x
    );

  // Similar walking speed regardless
  // of how far Nat needs to travel.
  const duration =
    Math.max(
      450,
      distance / 0.08
    );

  this.tweens.add({
    targets: this.nat,

    x: targetX,

    duration,

    ease: 'Linear',

    onComplete: () => {
      walkEvent.remove();

      this.nat.setFrame(0);

      onComplete?.();
    },
  });
}

chooseNatCoffee() {
  this.openingSequenceActive = true;

  this.coffeeStep = 'nat-getting-mug';

  this.objectiveUI.hide();

  console.log(
    'NAT COFFEE ROUTE'
  );

  this.dialogueManager.start(
    [
      {
        speaker: 'NAT',
        text: 'Yayyy!',
      },
    ],
    {
      lockMovement: true,

      onComplete: () => {
        this.startNatCoffeeSequence();
      },
    }
  );
}

startNatCoffeeSequence() {
  // Spawn the same empty mug Jen would use.
  this.natCoffeeMug = this.add
    .image(
      350,
      this.floorY - 95,
      'coffee-mug-empty'
    )
    .setOrigin(0.5, 1)
    .setScale(0.05)
    .setDepth(8);

  const mugX = this.natCoffeeMug.x;

  this.moveNatTo(
    mugX,
    () => {
      this.natPickUpCoffeeMug();
    }
  );
}

natPickUpCoffeeMug() {
  this.coffeeStep =
    'nat-carrying-mug';

  // Put the mug visually in Nat's hand.
  this.natCoffeeMug
    .setDepth(10);

  // Walk toward the coffee machine.
  this.moveNatTo(
    this.coffeeMachine.x - 45,
    () => {
      this.startNatCoffeeMaker();
    }
  );
}

startNatCoffeeMaker() {
  this.coffeeStep =
    'nat-brewing';

  // Hide the carried mug while it is
  // inside/under the machine.
  this.natCoffeeMug
    ?.setVisible(false);

  this.coffeeMachine.setTexture(
    'coffee-machine-brewing'
  );

  this.coffeeSound =
    this.sound.add(
      'coffee-making',
      {
        volume: 0.65,
      }
    );

  this.coffeeSound.play();

  // Jen immediately realizes this
  // may have been a terrible decision.
  this.time.delayedCall(
    500,
    () => {
      this.showNatCoffeeThought1();
    }
  );
}

showNatCoffeeThought1() {
  this.showAutomaticThought(
    'This was a mistake',
    () => {
      this.addFirstCoffeeIngredient();
    }
  );
}

addFirstCoffeeIngredient() {
  this.time.delayedCall(
    400,
    () => {
      this.showAutomaticThought(
        'Why are there so many ingredients',
        () => {
          this.addSecondCoffeeIngredient();
        }
      );
    }
  );
}

addSecondCoffeeIngredient() {
  this.time.delayedCall(
    400,
    () => {
      this.showAutomaticThought(
        "I should've said no",
        () => {
          this.finishNatCoffeeBrewing();
        }
      );
    }
  );
}

finishNatCoffeeBrewing() {
  this.coffeeStep =
    'nat-coffee-done';

  // Stop/fade the coffee sound.
  if (
    this.coffeeSound &&
    this.coffeeSound.isPlaying
  ) {
    this.tweens.add({
      targets: this.coffeeSound,

      volume: 0,

      duration: 200,

      onComplete: () => {
        this.coffeeSound?.stop();
        this.coffeeSound?.destroy();
        this.coffeeSound = null;
      },
    });
  }

  this.coffeeMachine.setTexture(
    'coffee-machine-idle'
  );

  // The innocent empty mug has somehow
  // become... this.
  this.natCoffeeMug
    .setTexture('coffee-mug-nat')
    .setPosition(
      this.coffeeMachine.x - 45,
      this.coffeeMachine.y
    )
    .setVisible(true)
    .setDepth(4);

  this.time.delayedCall(
    500,
    () => {
      this.finishNatCoffee();
    }
  );
}

finishNatCoffee() {
  this.dialogueManager.start(
    [
      {
        speaker: 'JEN',
        text: '*takes sip*',
      },
    ],
    {
      lockMovement: true,

      onComplete: () => {
        // Jen has taken the coffee,
        // so remove the mug from the kitchen.
        this.natCoffeeMug?.destroy();
        this.natCoffeeMug = null;

        this.showAutomaticThought(
          'Yup. Incense.',
          () => {
            this.unlockIncenseAchievement();
          }
        );
      },
    }
  );
}


    startCoffeeObjective() {
  this.currentObjective =
    'MAKE COFFEE';

  this.objectiveUI.setObjective(
  this.currentObjective
);
}

setupCoffeeTask() {
  this.coffeeStep = 'get-mug';

  this.coffeeMug = this.add
    .image(
      350,
      this.floorY - 95,
      'coffee-mug-empty'
    )
    .setOrigin(0.5, 1)
    .setScale(0.05)
    .setDepth(8);
}

takeCoffeeMug() {
  this.coffeeStep = 'use-machine';

  this.hasCoffeeMug = true;

  this.coffeeMug
    .setTexture('coffee-mug-empty')
    .setDepth(10);

  this.objectiveUI.setObjective(
  'MAKE COFFEE'
);
}

updateCoffeeInteraction() {
  if (!this.player) {
  return;
}

  let targetX;
  let targetY;
  let distanceLimit = 100;

  if (
  this.coffeeStep === 'get-mug' &&
  this.coffeeMug
) {
  targetX = this.coffeeMug.x;
  targetY = this.coffeeMug.y;
}
else if (
  this.coffeeStep === 'use-machine' ||
  this.coffeeStep === 'take-coffee'
) {
  targetX = this.coffeeMachine.x;
  targetY = this.floorY;
}
else {
  this.interactionPrompt.hide();
  return;
}

  const distance =
    Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      targetX,
      targetY
    );

  const nearby =
    distance < distanceLimit;

  if (nearby) {
  let label = '';

  if (this.coffeeStep === 'get-mug') {
    label = 'TAKE MUG';
  }
  else if (
    this.coffeeStep === 'use-machine'
  ) {
    label = 'MAKE COFFEE';
  }
  else if (
    this.coffeeStep === 'take-coffee'
  ) {
    label = 'TAKE COFFEE';
  }

  this.interactionPrompt.show(label);
}
else {
  this.interactionPrompt.hide();
}

  if (
    nearby &&
    Phaser.Input.Keyboard.JustDown(
      this.enterKey
    )
  ){
  this.sound.play('interact');

    if (
      this.coffeeStep === 'get-mug'
    ) {
      this.takeCoffeeMug();
    }
    else if (
      this.coffeeStep === 'use-machine'
    ) {
      this.startCoffeeMaker();
    }
    else if (
      this.coffeeStep === 'take-coffee'
    ) {
      this.takeCoffee();
    }
  }
}

    startCoffeeMaker() {
  if (
    this.coffeeStep !==
    'use-machine'
  ) {
    return;
  }

  this.coffeeStep = 'brewing';
  this.hasCoffeeMug = false;

  this.interactionPrompt.hide();

  this.objectiveUI.setObjective(
  'WAIT FOR COFFEE'
);

  // Put the empty mug into the machine.
  if (this.coffeeMug) {
    this.coffeeMug
      .setPosition(
        this.coffeeMachine.x,
        this.coffeeMachine.y - 4
      )
      .setVisible(false);
  }

  // Brewing version of the machine.
  this.coffeeMachine.setTexture(
    'coffee-machine-brewing'
  );

  // Actual coffee-making sound.
  this.coffeeSound = this.sound.add(
    'coffee-making',
    {
      volume: 0.65,
    }
  );

  this.coffeeSound.play();

this.time.delayedCall(
  5000,
  () => {
    if (
      this.coffeeSound &&
      this.coffeeSound.isPlaying
    ) {
      this.tweens.add({
        targets:
          this.coffeeSound,

        volume: 0,

        duration: 200,

        onComplete: () => {
          this.coffeeSound?.stop();
          this.coffeeSound?.destroy();
          this.coffeeSound = null;
        },
      });
    }

    this.finishBrewing();
  }
);
}

finishBrewing() {
  this.coffeeStep = 'take-coffee';

  this.coffeeMachine.setTexture(
    'coffee-machine-idle'
  );

  // Finished coffee sits on the counter
  // beside the coffee machine.
  this.coffeeMug
    .setTexture('coffee-mug-full')
    .setPosition(
      this.coffeeMachine.x - 45,
      this.coffeeMachine.y + 0,
    )
    .setVisible(true)
    .setDepth(4);

  this.objectiveUI.setObjective(
  'GET COFFEE'
);
}

takeCoffee() {
  if (
    this.coffeeStep !==
    'take-coffee'
  ) {
    return;
  }

  this.coffeeStep = 'complete';
  this.hasCoffeeMug = false;

  this.interactionPrompt.hide();

  // Jen takes her finished coffee.
  if (this.coffeeMug) {
    this.coffeeMug.destroy();
    this.coffeeMug = null;
  }

  this.objectiveUI.complete(
  'COFFEE'
);

  console.log(
    'COFFEE TASK COMPLETE'
  );

  this.time.delayedCall(
    1200,
    () => {
      this.finishCoffeeSection();
    }
  );
}

finishCoffeeSection() {
  this.openingSequenceActive = false;
  this.coffeeChoiceActive = false;
  this.coffeeStep = 'complete';

  this.objectiveUI.hide();

  console.log(
    'COFFEE SECTION COMPLETE'
  );

  this.time.delayedCall(
    700,
    () => {
      this.startBreakfastSection();
    }
  );
}

startBreakfastSection() {
  console.log(
    'BREAKFAST SECTION START'
  );

  this.breakfastStep =
    'get-ingredients';

  this.currentObjective =
    'GET INGREDIENTS';

    this.objectiveUI.show();

  this.objectiveUI.setObjective(
  this.currentObjective
);

  this.createBreakfastObjects();
}

createBreakfastObjects() {
  // Invisible interaction point at the
  // fridge/counter area from Chapter 1.
  this.breakfastFridge = {
    x: 150,
    y: this.floorY,
  };

  this.breakfastIngredients = null;
  this.breakfastPan = null;
  this.fryingSound = null;
}

updateBreakfastInteraction() {
  if (
  !this.player ||
  !this.breakfastStep
) {
  return;
}

  let targetX = null;
  let targetY = null;
  let promptText = '';

  // GET INGREDIENTS
  if (
    this.breakfastStep ===
    'get-ingredients'
  ) {
    targetX = 50;

    targetY =
      200;

    promptText =
      'GET INGREDIENTS';
  }

  // BRING INGREDIENTS TO COUNTER
  else if (
    this.breakfastStep ===
    'bring-to-counter'
  ) {
    targetX = 250;
    targetY = 150;

    promptText =
      'SET DOWN';
  }

  else if (
  this.breakfastStep ===
  'plate-breakfast'
) {
  targetX = this.breakfastPan.x;
  targetY = this.breakfastPan.y;

  promptText =
    'PICK UP BREAKFAST';
}


  // PREP BREAKFAST
  else if (
    this.breakfastStep ===
    'prep'
  ) {
    targetX = 320;
    targetY = 275;

    promptText =
      'PREP';
  }

  else if (
  this.breakfastStep ===
  'start-cooking'
) {
  targetX =
    this.breakfastPan.x;

  targetY =
    this.breakfastPan.y;

  promptText =
    'START COOKING';
}

else if (
  this.breakfastStep ===
  'plate-breakfast'
) {
  this.pickUpBreakfast();
}

else if (
  this.breakfastStep ===
  'carry-breakfast'
) {
 targetX = this.kitchenTable.x;
targetY = this.floorY;

  promptText =
    'SERVE BREAKFAST';
}

  // If the current breakfast step
  // has no player interaction,
  // hide the prompt.
  if (
  targetX === null ||
  targetY === null
) {
  this.interactionPrompt.hide();
  return;
}

  const distance =
    Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      targetX,
      targetY
    );

  const closeEnough =
    distance < 105;

  if (closeEnough) {
  this.interactionPrompt.show(
    promptText
  );
}
else {
  this.interactionPrompt.hide();
}

  if (
  closeEnough &&
  Phaser.Input.Keyboard.JustDown(
    this.enterKey
  )
) {
  this.sound.play('interact');

  if (
    this.breakfastStep ===
    'get-ingredients'
  ) {
    this.takeBreakfastIngredients();
  }

  else if (
    this.breakfastStep ===
    'bring-to-counter'
  ) {
    this.setDownBreakfastIngredients();
  }

  else if (
    this.breakfastStep ===
    'prep'
  ) {
    this.doBreakfastPrep();
  }

  else if (
    this.breakfastStep ===
    'start-cooking'
  ) {
    this.startCookingBreakfast();
  }

  else if (
    this.breakfastStep ===
    'plate-breakfast'
  ) {
    this.pickUpBreakfast();
  }

  else if (
    this.breakfastStep ===
    'carry-breakfast'
  ) {
    this.serveBreakfast();
  }
}
}

takeBreakfastIngredients() {
  this.breakfastStep =
    'bring-to-counter';

  this.currentObjective =
    'BRING TO COUNTER';

  this.objectiveUI.setObjective(
  this.currentObjective
);
  // Real breakfast ingredient asset.
  this.breakfastIngredients =
    this.add.image(
      this.player.x,
      this.player.y - 15,
      'breakfast-ingredients'
    )
      .setOrigin(0.5)
      .setScale(0.045)
      .setDepth(10);

  console.log(
    'BREAKFAST: ingredients taken'
  );

  this.time.delayedCall(
    300,
    () => {
      this.startBreakfastSmallTalk();
    }
  );
}

startBreakfastSmallTalk() {
  this.dialogueManager.start(
    [
      {
        speaker: 'NAT',
        text: 'Sleep well baby?',
      },
      {
        speaker: 'JEN',
        text: 'Yeah, you?',
      },
      {
        speaker: 'NAT',
        text: 'I think I tried to launch you extra last night, but good.',
      },
    ],
    {
      lockMovement: true,

      onComplete: () => {
        this.setComposure(72);
      },
    }
  );
}

updateCarriedBreakfastIngredients() {
  const isCarryingIngredients =
    this.breakfastStep ===
    'bring-to-counter';

  const isCarryingBreakfast =
    this.breakfastStep ===
    'carry-breakfast';

  if (
    !isCarryingIngredients &&
    !isCarryingBreakfast
  ) {
    return;
  }

  if (!this.breakfastIngredients) {
    return;
  }

  let carryX =
    this.player.x;

  let carryY;

  if (isCarryingIngredients) {
    carryY =
      this.player.y + 5;
  }
  else {
    // Plate can sit a little differently
    // in Jen's hands.
    carryY =
      this.player.y - 0;
  }

  this.breakfastIngredients.setPosition(
    carryX,
    carryY
  );
}

setDownBreakfastIngredients() {
  this.breakfastStep =
    'ingredients-ready';

  this.currentObjective =
    'INGREDIENTS ✓';

  this.objectiveUI.setObjective(
  this.currentObjective
);
  this.interactionPrompt.hide();

  this.breakfastIngredients
    ?.setPosition(
      320,
      200
    );

  this.time.delayedCall(
  800,
  () => {
    this.startBreakfastPrep();
  }
);

  // Next step will begin PREP BREAKFAST.
}

startBreakfastPrep() {
  this.breakfastStep = 'prep';

  this.prepProgress = 0;
  this.prepTotal = 3;

  this.objectiveUI.show();

 this.currentObjective =
  'PREP BREAKFAST';

this.objectiveUI.setObjective(
  this.currentObjective,
  {
    label:
      `${this.prepProgress}/${this.prepTotal}`,

    current:
      this.prepProgress,

    total:
      this.prepTotal,
  }
);

  console.log(
    'BREAKFAST: prep started'
  );

  this.time.delayedCall(
  500,
  () => {
    this.startPrepInterruption();
  }
);
}

startPrepInterruption() {
  if (
    this.breakfastStep !== 'prep'
  ) {
    return;
  }

  this.breakfastStep =
    'interruption';

  this.interactionPrompt.hide();

  this.dialogueManager.start(
    [
      {
        speaker: 'NAT',
        text: 'Okay, how can I help? *vibrates with ADHD*',
      },
      {
        speaker: 'JEN',
        text: 'uhhh',
      },
    ],
    {
      lockMovement: true,

      onComplete: () => {
        this.setComposure(60);

        this.breakfastStep =
          'prep';

        this.currentObjective =
  'PREP BREAKFAST';

this.objectiveUI.setObjective(
  this.currentObjective,
  {
    label:
      `${this.prepProgress}/${this.prepTotal}`,
    current:
      this.prepProgress,
    total:
      this.prepTotal,
  }
);
      },
    }
  );
}
doBreakfastPrep() {
  if (
    this.breakfastStep !== 'prep'
  ) {
    return;
  }

  this.prepProgress++;

  console.log(
    `BREAKFAST PREP: ${this.prepProgress}/${this.prepTotal}`
  );

  this.objectiveUI.setObjective(
  'PREP BREAKFAST',
  {
    label:
      `${this.prepProgress}/${this.prepTotal}`,

    current:
      this.prepProgress,

    total:
      this.prepTotal,
  }
);

  // Tiny programmer-art feedback.
  if (this.breakfastIngredients) {
    this.tweens.add({
      targets:
        this.breakfastIngredients,

      scaleX: 0.055,
      scaleY: 0.055,

      duration: 100,

      yoyo: true,
    });
  }
  if (
    this.prepProgress >=
    this.prepTotal
  ) {
    this.finishBreakfastPrep();
  }
}
triggerBreakfastInterruption(
  number
) {
  this.breakfastStep =
    'interruption';

  this.interactionPrompt.hide();

  console.log(
    `BREAKFAST INTERRUPTION ${number}`
  );

  const overlay =
    this.add.rectangle(
      320,
      180,
      640,
      360,
      0x000000,
      0.35
    )
      .setDepth(450);

  const beatText =
    this.add.text(
      320,
      170,
      `INTERRUPTION #${number}`,
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor:
          '#17141f',

        padding: {
          x: 12,
          y: 8,
        },
      }
    )
      .setOrigin(0.5)
      .setDepth(451);

  const continueText =
    this.add.text(
      320,
      205,
      '[ENTER] CONTINUE',
      {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#d6b85a',
      }
    )
      .setOrigin(0.5)
      .setDepth(451);

  this.enterKey.once(
    'down',
    () => {
      overlay.destroy();
      beatText.destroy();
      continueText.destroy();

      this.resumeBreakfastAfterInterruption(
        number
      );
    }
  );
}

resumeBreakfastAfterInterruption(
  number
) {
  console.log(
    `RESUME AFTER INTERRUPTION ${number}`
  );

  if (number === 1) {
    this.breakfastStep = 'prep';

    this.currentObjective =
      `PREP BREAKFAST ${this.prepProgress}/${this.prepTotal}`;

    this.objectiveUI.setObjective(
  this.currentObjective
);

    return;
  }

  if (number === 2) {
    this.resumeBreakfastCooking();
  }

  if (number === 3) {
  this.breakfastStep =
    'carry-breakfast';

  this.currentObjective =
    'BRING TO TABLE';

  this.objectiveUI.setObjective(
  this.currentObjective
);

  return;
}
if (number === 4) {
  this.finishBreakfastSection();
  return;
}

}

resumeBreakfastCooking() {
  this.breakfastStep = 'cooking';

  this.currentObjective =
    'COOKING...';

  this.objectiveUI.setObjective(
  this.currentObjective
);
  console.log(
    'BREAKFAST: cooking resumed'
  );

  // Finish cooking after a few more
  // seconds. Nothing can burn.
  this.time.delayedCall(
    2500,
    () => {
      if (
        this.breakfastStep ===
        'cooking'
      ) {
        this.finishCookingBreakfast();
      }
    }
  );
}

finishBreakfastPrep() {
  this.breakfastStep =
    'prep-complete';

  this.interactionPrompt.hide();

  // Prep is finished. Remove the
  // ingredient bundle before cooking.
  this.breakfastIngredients
    ?.destroy();

  this.breakfastIngredients = null;

  this.currentObjective =
    'PREP ✓';

  this.objectiveUI.setObjective(
  this.currentObjective
);

  this.time.delayedCall(
    800,
    () => {
      this.startBreakfastCooking();
    }
  );
}

startBreakfastCooking() {
  this.breakfastStep = 'start-cooking';

  this.currentObjective =
    'COOK BREAKFAST';

 this.objectiveUI.setObjective(
  this.currentObjective
);

  console.log(
    'BREAKFAST: ready to cook'
  );

  // Same pan + same stove placement
  // used in Chapter 1.
  const cookingX = 720;
  const cookingY = 225;

  this.breakfastPan = this.add
    .image(
      cookingX,
      cookingY,
      'frying-pan'
    )
    .setOrigin(0.5, 1)
    .setDepth(-1)
    .setScale(0)
    .setAlpha(0);

  // Same little Chapter 1 pop-in.
  this.tweens.add({
    targets: this.breakfastPan,

    scaleX: 0.05,
    scaleY: 0.05,
    alpha: 1,

    duration: 300,
    ease: 'Back.easeOut',
  });
}

startCookingBreakfast() {
  this.breakfastStep = 'cooking';

  this.interactionPrompt.hide();

  this.currentObjective =
    'COOKING...';

  this.objectiveUI.setObjective(
  this.currentObjective
);

  console.log(
    'BREAKFAST: cooking started'
  );

  // Ingredients are now in the pan,
  // so remove the carried/prepped visual.
  this.breakfastIngredients
    ?.setVisible(false);

  this.breakfastIngredientsLabel
    ?.setVisible(false);

  // Reuse Chapter 1 frying audio.
  this.fryingSound =
    this.sound.add(
      'frying',
      {
        loop: true,
        volume: 0.65,
      }
    );

  this.fryingSound.play();

  
 // Give the cooking a moment before Nat interrupts.
this.time.delayedCall(
  1800,
  () => {
    if (
      this.breakfastStep ===
      'cooking'
    ) {
      this.startCookingInterruption();
    }
  }
);
}

startCookingInterruption() {
  if (
    this.breakfastStep !== 'cooking'
  ) {
    return;
  }

  this.breakfastStep = 'interruption';

  this.interactionPrompt.hide();

  // Nat moves over to Jen first.
  const targetX =
    this.player.x + 25;

  this.tweens.add({
    targets: this.nat,

    x: targetX,

    duration: 650,
    ease: 'Sine.easeInOut',

    onComplete: () => {
      // Tiny pause so Nat arriving
      // feels separate from the dialogue.
      this.time.delayedCall(
        300,
        () => {
          this.startCookingInterruptionDialogue();
        }
      );
    },
  });
}

startCookingInterruptionDialogue() {
  this.dialogueManager.start(
    [
      {
        speaker: 'JEN',
        text: 'If you keep this up we are eating ash for breakfast',
      },
      {
        speaker: 'NAT',
        text: "What if I'm hungry for something else?",
      },
    ],
    {
      lockMovement: true,

      onComplete: () => {
        this.setComposure(42);

        this.unlockCookingThought();
      },
    }
  );
}

unlockCookingThought() {
  this.availableCookingThought =
    "I'm trying to keep us alive bruh!!";

  this.thoughtPrompt.show();
}

updateCookingThought() {
  if (
    !this.availableCookingThought
  ) {
    return;
  }

  if (
    Phaser.Input.Keyboard.JustDown(
      this.qKey
    )
  ) {
    this.showCookingThought();
  }
}

showCookingThought() {
  this.thoughtPrompt.hide();

  const thoughtText =
    this.availableCookingThought;

  this.availableCookingThought = null;

  this.setComposure(30);

  this.thoughtUI.show(
    thoughtText,
    1800
  );

  this.time.delayedCall(
    1800,
    () => {
      this.resumeBreakfastCooking();
    }
  );
}

finishCookingBreakfast() {
  this.breakfastStep =
    'cooking-complete';

  this.currentObjective =
    'BREAKFAST DONE';

  this.objectiveUI.setObjective(
  this.currentObjective
);
  // Stop frying audio.
  if (this.fryingSound) {
    this.fryingSound.stop();
    this.fryingSound.destroy();
    this.fryingSound = null;
  }

  console.log(
    'BREAKFAST: cooking complete'
  );

  this.time.delayedCall(
    900,
    () => {
      this.startBreakfastPlating();
    }
  );
}

startBreakfastPlating() {
  this.breakfastStep =
    'plate-breakfast';

  this.currentObjective =
    'PLATE BREAKFAST';

  this.objectiveUI.setObjective(
  this.currentObjective
);

  // Finished breakfast appears beside
  // the pan/stove ready for Jen.
  this.breakfastIngredients =
    this.add.image(
      this.breakfastPan.x,
      this.breakfastPan.y + 10,
      'breakfast-plate'
    )
      .setOrigin(0.5)
      .setScale(0.045)
      .setDepth(10);

  console.log(
    'BREAKFAST: ready to plate'
  );
}

pickUpBreakfast() {
  this.breakfastStep =
    'carry-breakfast';

  this.currentObjective =
    'BRING TO TABLE';

  this.objectiveUI.setObjective(
  this.currentObjective
);
 this.interactionPrompt.hide();

  console.log(
    'BREAKFAST: picked up'
  );

  this.time.delayedCall(
    900,
    () => {
      if (
        this.breakfastStep ===
        'carry-breakfast'
      ) {
        this.startCarryInterruption();
      }
    }
  );
}

startCarryInterruption() {
  if (
    this.breakfastStep !==
    'carry-breakfast'
  ) {
    return;
  }

  this.breakfastStep =
    'interruption';

  this.interactionPrompt.hide();

  this.dialogueManager.start(
    [
      {
        speaker: 'NAT',
        text: "Where's your phone, I want music!",
      },
      {
        speaker: 'JEN',
        text: 'In the room lol',
      },
    ],
    {
      lockMovement: true,

      onComplete: () => {
        this.time.delayedCall(
          700,
          () => {
            this.dialogueManager.start(
              [
                {
                  speaker: 'NAT',
                  text: 'OMG look I can probably do a line dance to this song!!',
                },
              ],
              {
                lockMovement: true,

                onComplete: () => {
                  this.setComposure(16);

                  this.showAutomaticThought(
                    "You're fucking ridiculous.",
                    () => {
                      this.resumeCarryAfterInterruption();
                    }
                  );
                },
              }
            );
          }
        );
      },
    }
  );
}

resumeCarryAfterInterruption() {
  this.breakfastStep =
    'carry-breakfast';

  this.currentObjective =
    'BRING TO TABLE';

 this.objectiveUI.setObjective(
  this.currentObjective
);
}

serveBreakfast() {
  this.breakfastStep =
    'served';

  this.interactionPrompt.hide();

  this.breakfastIngredients
    ?.setPosition(
      this.kitchenTable.x,
      this.kitchenTable.y - 135
    );

  this.currentObjective =
    'SERVE BREAKFAST ✓';

  this.objectiveUI.setObjective(
  this.currentObjective
);

  console.log(
    'BREAKFAST: served'
  );

  this.time.delayedCall(
  700,
  () => {
    if (
      this.breakfastStep ===
      'served'
    ) {
      this.startFinalBreakfastInterruption();
    }
  }
);
}

startFinalBreakfastInterruption() {
  if (
    this.breakfastStep !== 'served'
  ) {
    return;
  }

  this.breakfastStep =
    'final-interruption';

  this.interactionPrompt.hide();

  this.dialogueManager.start(
    [
      {
        speaker: 'JEN',
        text: 'ahhhh',
      },
      {
        speaker: 'NAT',
        text: 'What you like it',
      },
      {
        speaker: 'NAT',
        text: 'And you look pretty with my marks',
      },
    ],
    {
      lockMovement: true,

      onComplete: () => {
        this.startComposureCollapse();
      },
    }
  );
}

startComposureCollapse() {
  this.objectiveUI.hide();

  this.objectiveUI.hide();

  this.setComposure(0);

  this.time.delayedCall(
    900,
    () => {
      this.showPretenseBreak();
    }
  );
}

showPretenseBreak() {
  this.composureLabel
    ?.setText('PRETENSE');

  this.tweens.add({
    targets: [
      this.composureLabel,
      this.composureBar,
      this.composureBarBackground,
    ],

    alpha: 0.25,
    duration: 90,
    yoyo: true,
    repeat: 5,

    onComplete: () => {
      this.showFuckItThought();
    },
  });
}

showFuckItThought() {
  this.showAutomaticThought(
    'Fuck it',
    () => {
      this.removeComposureUI();
    }
  );
}

removeComposureUI() {
  if (!this.composureContainer) {
    this.time.delayedCall(
      600,
      () => {
        this.unlockFinalMindThought();
      }
    );

    return;
  }

  // Composure has officially left the building.
  this.tweens.add({
    targets: this.composureContainer,

    alpha: 0,
    y: this.composureContainer.y - 6,

    duration: 350,
    ease: 'Sine.easeIn',

    onComplete: () => {
      this.composureContainer.destroy();
      this.composureContainer = null;

      this.time.delayedCall(
        600,
        () => {
          this.unlockFinalMindThought();
        }
      );
    },
  });
}

unlockFinalMindThought() {
  this.finalMindQActive = true;

  this.thoughtPrompt.show();
}

finishBreakfastSection() {
  this.breakfastStep =
    'complete';

  this.interactionPrompt.hide();

  this.currentObjective =
    'BREAKFAST ✓';

  this.objectiveUI.setObjective(
  this.currentObjective
);
  console.log(
    'BREAKFAST SECTION COMPLETE'
  );

  // Next:
  // GET READY / CLEAN UP section
}

updateFinalMindThought() {
  if (
    !this.finalMindQActive ||
    this.mindTransitionStarted
  ) {
    return;
  }

  if (
    Phaser.Input.Keyboard.JustDown(
      this.qKey
    )
  ) {
    this.startMindTransition();
  }
}

startMindTransition() {
  if (this.mindTransitionStarted) {
    return;
  }

  this.mindTransitionStarted = true;
  this.finalMindQActive = false;

  this.thoughtPrompt.hide();

  this.breakMorningScene();
}

breakMorningScene() {
  // Temporary programmer-art glitch.
  // We'll replace this with the real transition later.

  this.cameras.main.shake(
    700,
    0.012
  );

  const glitchText =
    this.add.text(
      320,
      180,
      'READ MY MIND',
      {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff',
      }
    )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1000);

  this.tweens.add({
    targets: glitchText,

    alpha: 0,
    scaleX: 1.5,
    scaleY: 0.7,

    duration: 100,
    yoyo: true,
    repeat: 5,

    onComplete: () => {
      this.cameras.main.fadeOut(
        700,
        0,
        0,
        0
      );

      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start(
            'MindfuckScene'
          );
        }
      );
    },
  });
}


  update(time) {
  if (this.debugMenu) {
    this.debugMenu.update();

    if (this.debugMenu.isOpen) {
      return;
    }
  }

  if (!this.chapterStarted) {
    return;
  }

  if (
    this.dialogueManager &&
    this.dialogueManager.isActive
  ) {
    this.dialogueManager.update();
    return;
  }

  if (
  this.achievementPopup &&
  this.achievementPopup.isActive()
) {
  return;
}

  if (this.coffeeChoiceActive) {
    this.updateCoffeeChoice();
    return;
  }

  if (this.finalMindQActive) {
  this.updateFinalMindThought();
  return;
}

  this.player.update(time);

  if (
  this.hasCoffeeMug &&
  this.coffeeStep === 'use-machine' &&
  this.coffeeMug
) {
  this.coffeeMug.setPosition(
  this.player.x + 9,
  this.player.y + 25,
);
}

if (
  this.coffeeStep ===
    'nat-carrying-mug' &&
  this.natCoffeeMug &&
  this.nat
) {
  this.natCoffeeMug.setPosition(
    this.nat.x + 9,
    this.nat.y - 40
  );
}

  if (this.openingSequenceActive) {
    this.updateMorningThought();
    return;
  }

  this.updateCookingThought();

  this.updateCoffeeInteraction();

  this.updateBreakfastInteraction();

  this.updateCarriedBreakfastIngredients();
}

}