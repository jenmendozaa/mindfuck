import Phaser from 'phaser';

import Player from '../gameplay/Player.js';
import party from '../data/party.js';

import TextController from '../systems/TextController.js';

import DebugMenu from '../debug/DebugMenu.js';
import ThoughtUI from '../ui/ThoughtUI.js';
import sfxManager from '../systems/SFXManager.js';
import ObjectiveUI from '../ui/ObjectiveUI.js';

import saveManager from '../systems/saveManager.js';

import SettingsAccess from '../systems/SettingsAccess.js';

export default class PartyScene extends Phaser.Scene {
  constructor() {
    super('PartyScene');
  }

  create() {

    this.settingsAccess =
  new SettingsAccess(this);
  
    this.currentPerspective = 'nat';

    const saveData = saveManager.load();

  this.jenHasRaccoonHat =
  saveData.equippedHat === 'raccoon_hat';

    this.textController = new TextController(this);

    this.partyEndingStarted = false;
    this.canAdvanceEnding = false;
    this.endingStep = 0;
    
    this.jenPerspectiveReady = false;

this.mySideActive = false;
this.mySideReady = false;
this.mySideAdvanceTimer = null;

this.thoughtUI = new ThoughtUI(this);
    this.chapterTransitionStarted = false;

    this.enterKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.cameras.main.setBackgroundColor('#17141f');

    this.createTemporaryTextures();
    this.createPartyRoom();

    this.physics.world.setBounds(
      0,
      0,
      this.partyWorldWidth,
      360
    );

    this.cameras.main.setBounds(
      0,
      0,
      this.partyWorldWidth,
      360
    );

    // Nat enters from the left.
    this.player = new Player(
    this,
    70,
    220,
    'nat-default'
  );

    this.player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(
        this.player,
        true,
        0.08,
        0.08
    );

    this.physics.add.collider(
      this.player,
      this.platforms
    );

    this.createJen();

  this.objectiveUI = new ObjectiveUI(
  this,
  true
);

this.objectiveUI.setObjective(
  party.objective
);

    this.cameras.main.fadeIn(
      700,
      0,
      0,
      0
    );

    this.debugMenu = new DebugMenu(this);

  }

  update(time) {
    if (this.debugMenu) {
  this.debugMenu.update();

  if (this.debugMenu.isOpen) {
    return;
  }
}

  if (
    this.player &&
    !this.partyEndingStarted
  ) {
    this.player.update(time);

    if (this.currentPerspective === 'jen' &&
        this.jenPerspectiveReady &&
        !this.chapterTransitionStarted &&
        Math.abs(this.player.body.velocity.x) > 0) {
              this.startChapterOne();
}

    if (this.currentPerspective === 'nat') {
      const distanceToJen =
        Math.abs(
          this.player.x - this.jen.x
        );

      if (distanceToJen <= 70) {
        this.findJen();
      }
    }
  }

  if (
  Phaser.Input.Keyboard.JustDown(this.enterKey)
) {
  if (this.mySideActive) {
    this.handleMySideEnter();
    return;
  }

  if (this.partyEndingStarted) {
    this.handleEndingEnter();
  }
}
}

  createPartyRoom() {
  this.platforms = this.physics.add.staticGroup();

  // =========================================
  // HOUSE BACKGROUND
  // =========================================

  const background = this.add
    .image(
      0,
      450,
      'party-house'
    )
    .setOrigin(0, 1)
    .setDepth(-10);

  const targetHeight = 500;

  const scale =
    targetHeight / background.height;

  background.setScale(scale);

  // IMPORTANT:
  // The background determines the actual level width.
  this.partyWorldWidth =
    background.displayWidth;

  // =========================================
  // INVISIBLE FLOOR
  // =========================================

  for (
    let x = 8;
    x < this.partyWorldWidth;
    x += 16
  ) {
    this.platforms
      .create(
        x,
        325,
        'party-floor-placeholder'
      )
      .setVisible(false)
      .refreshBody();
  }
}

  createCrowd() {
  this.partygoers = [];

  party.partygoers.forEach((partygoer, index) => {
    const sprite = this.add.sprite(
      partygoer.x,
      296,
      'partygoer-placeholder'
    );

    // Temporary variation so the crowd
    // doesn't look completely cloned.
    if (index % 2 === 0) {
      sprite.setFlipX(true);
    }

    const scale =
      index % 3 === 0
        ? 0.92
        : 1;

    sprite.setScale(scale);

    this.partygoers.push(sprite);
  });
}

createJen() {
  const jenTexture =
    this.jenHasRaccoonHat
      ? 'jen-default-hat'
      : 'jen-default';

  this.jen = this.add
    .sprite(
      this.partyWorldWidth - 140,
      317,
      jenTexture
    )
    .setOrigin(0.5, 1);
}

findJen() {
  this.partyEndingStarted = true;

  this.meetingNatX = this.player.x;
  this.meetingJenX = this.jen.x;

  // Stop Nat.
  this.player.setVelocity(0, 0);

  // Complete the objective.
  this.objectiveUI.complete(
  'FIND JEN'
);

  // Narration panel.
  this.endingPanel = this.add
    .rectangle(
      320,
      92,
      540,
      70,
      0x17101f,
      0.9
    )
    .setStrokeStyle(2, 0xb98acb)
    .setScrollFactor(0)
    .setDepth(199);

  // Small scrapbook-style decorations.
  this.endingLeftDecoration = this.add
    .text(65, 92, '✦', {
      fontFamily: 'Yabikoma',
      fontSize: '10px',
      color: '#d8a6cf',
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(200);

  this.endingRightDecoration = this.add
    .text(575, 92, '♡', {
      fontFamily: 'Yabikoma',
      fontSize: '10px',
      color: '#d8a6cf',
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(200);

  // Present-day Jen narration.
  this.endingText = this.add
    .text(320, 84, '', {
      fontFamily: 'Yabikoma',
      fontSize: '14px',
      color: '#f5e9ff',
      align: 'center',
      wordWrap: {
        width: 450,
      },
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(200);

  this.endingEnterPrompt = this.add
    .text(320, 112, '', {
      fontFamily: 'Yabikoma',
      fontSize: '8px',
      color: '#b98acb',
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(200);

  // Give the objective completion a second to land.
  this.time.delayedCall(1000, () => {
    this.showEndingLine(
      party.reveal.alreadyKnow
    );
  });
}

showEndingLine(text) {
  this.canAdvanceEnding = false;
  this.endingEnterPrompt.setText('');

  this.textController.typeText(
    this.endingText,
    text,
    () => {
      this.canAdvanceEnding = true;
      this.endingEnterPrompt.setText(
        '[ ENTER ]'
      );
    }
  );
}

handleEndingEnter() {
  if (this.textController.isTyping) {
  this.sound.play('click');

  this.textController.completeImmediately(
    this.endingText
  );

  this.canAdvanceEnding = true;
  this.endingEnterPrompt.setText(
    '[ ENTER ]'
  );

  return;
}

  if (!this.canAdvanceEnding) {
  return;
}

this.sound.play('click');

this.canAdvanceEnding = false;
this.endingEnterPrompt.setText('');;

  if (this.endingStep === 0) {
    this.endingStep = 1;

    this.showEndingLine(
      party.reveal.mostly
    );

    return;
  }

  if (this.endingStep === 1) {
    this.endingStep = 2;

    this.showEndingLine(
      party.reveal.badMemory
    );

    return;
  }

  if (this.endingStep === 2) {
    this.endingStep = 3;
    this.fadeToMySide();
  }
}

fadeToMySide() {
  this.endingText.destroy();
  this.endingEnterPrompt.destroy();
  this.endingPanel.destroy();
  this.endingLeftDecoration.destroy();
  this.endingRightDecoration.destroy();

  this.cameras.main.fadeOut(
    900,
    0,
    0,
    0
  );

  this.time.delayedCall(1000, () => {
    this.showMySide();
  });
}

showMySide() {
  // Remove everything from the old party.
  this.children.removeAll(true);

  // Reset the camera after the fade.
  this.cameras.main.resetFX();
  this.cameras.main.stopFollow();
  this.cameras.main.setScroll(0, 0);
  this.cameras.main.setBackgroundColor('#08070a');

  this.mySideActive = true;
  this.mySideReady = false;

  this.mySideText = this.add
    .text(320, 180, '', {
      fontFamily: 'Yabikoma',
      fontSize: '20px',
      color: '#f5e9ff',
      align: 'center',
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(500);

  this.textController.typeText(
    this.mySideText,
    party.reveal.mySide,
    () => {
      this.mySideReady = true;

      this.mySideAdvanceTimer =
        this.time.delayedCall(1500, () => {
          if (this.mySideActive) {
            this.startJenPerspective();
          }
        });
    }
  );
}

handleMySideEnter() {
  if (!this.mySideActive) {
    return;
  }

  // First Enter: finish the typing.
  if (this.textController.isTyping) {
    this.textController.completeImmediately(
      this.mySideText
    );

    this.mySideReady = true;

    return;
  }

  // Second Enter: move into Jen's perspective.
  if (this.mySideReady) {
    this.startJenPerspective();
  }
}

startJenPerspective() {
  this.mySideActive = false;
  this.mySideReady = false;

  if (this.mySideAdvanceTimer) {
    this.mySideAdvanceTimer.remove();
    this.mySideAdvanceTimer = null;
  }

  // Remove the black-screen title.
  this.mySideText.destroy();
  this.thoughtUI = new ThoughtUI(this);

  // Rebuild our temporary party world.
  this.createPartyRoom();

  this.physics.world.setBounds(
    0,
    0,
    this.partyWorldWidth,
    360
  );

  this.cameras.main.setBounds(
    0,
    0,
    this.partyWorldWidth,
    360
  );

  // Nat is now the person we're looking at,
  // rather than the person we're controlling.
this.nat = this.add
  .sprite(
    this.meetingNatX,
    317,
    'nat-default'
  )
  .setOrigin(0.5, 1);

const jenTexture =
  this.jenHasRaccoonHat
    ? 'jen-default-hat'
    : 'jen-default';

this.player = new Player(
  this,
  this.meetingJenX,
  220,
  jenTexture
);

  this.physics.add.collider(
    this.player,
    this.platforms
  );

  this.player.setCollideWorldBounds(true);

  this.cameras.main.startFollow(
    this.player,
    true,
    0.08,
    0.08
  );

  this.currentPerspective = 'jen';
this.partyEndingStarted = false;

  // Start the camera near Jen instead of back
  // at the beginning of the party.
  this.cameras.main.fadeIn(
    700,
    0,
    0,
    0
  );

  

  this.time.delayedCall(1000, () => {
    this.showFirstJenThought();
  });
}

showFirstJenThought() {
  this.thoughtUI.show(
    party.jenPerspective.firstThought,
    1800,
    '18px'
  );

  this.time.delayedCall(1800, () => {
    this.jenPerspectiveReady = true;
  });
}

  createTemporaryTextures() {

    if (!this.textures.exists('party-floor-placeholder')) {
      const graphics = this.make.graphics({
        add: false,
      });

      graphics.fillStyle(0x3b3742);
      graphics.fillRect(0, 0, 16, 16);

      graphics.generateTexture(
        'party-floor-placeholder',
        16,
        16
      );

      graphics.destroy();
    }

  }

  startChapterOne() {
  this.chapterTransitionStarted = true;

  this.player.setVelocity(0, 0);

  this.cameras.main.fadeOut(
    700,
    0,
    0,
    0
  );

  this.time.delayedCall(750, () => {
  this.scene.start(
    'NarrationScene',
    {
      transitionId: 'transition1',
    }
  );
});

}

}