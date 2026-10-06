import Phaser from 'phaser';

import Player from '../gameplay/Player.js';
import Interactable from '../gameplay/Interactable.js';

import TextController from '../systems/TextController.js';
import InteractionPrompt from '../ui/InteractionPrompt.js';

import prologue from '../data/prologue.js';

import DebugMenu from '../debug/DebugMenu.js';

import { UI_FONT } from '../ui/uiTheme.js';
import sfxManager from '../systems/SFXManager.js';

import SettingsAccess from '../systems/SettingsAccess.js';




export default class PrologueScene extends Phaser.Scene {
  constructor() {
    super('PrologueScene');
  }

  create() {

    this.settingsAccess =
  new SettingsAccess(this);
  
    this.cameras.main.setBackgroundColor('#08070a');

    this.textController = new TextController(this);

    this.sequenceStep = 0;
    this.canAdvance = false;
    this.player = null;
    

    this.movementTutorialActive = false;
    this.movementTutorialComplete = false;

    this.jumpTutorialActive = false;
    this.jumpTutorialComplete = false;

    this.jumpTutorialText = null;

    this.narrationText = this.add
  .text(320, 170, '', {
    fontFamily: UI_FONT,
    fontSize: '20px',
    color: '#fff0f6',
    align: 'center',
    wordWrap: {
      width: 500,
      useAdvancedWrap: true,
    },
    lineSpacing: 5,
  })
  .setOrigin(0.5);

    this.enterPrompt = this.add
  .text(320, 220, '', {
    fontFamily: UI_FONT,
    fontSize: '10px',
    color: '#9f849d',
  })
  .setOrigin(0.5);

    this.enterKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.startOpening();

    this.phoneInteractable = null;
    this.interactionPrompt = new InteractionPrompt(this);

    this.phoneSequenceStarted = false;

    this.debugMenu = new DebugMenu(this);
  }

  startNarrationTypingSound() {
  // Stop any existing narration typing sound first.
  this.stopNarrationTypingSound();

  this.narrationTypingSound =
    this.sound.add('typing', {
      loop: true,
      volume: 0.45,
    });

  this.narrationTypingSound.play();
}

stopNarrationTypingSound() {
  if (this.narrationTypingSound) {
    this.narrationTypingSound.stop();
    this.narrationTypingSound.destroy();
    this.narrationTypingSound = null;
  }
}

  update(time) {
    if (this.debugMenu) {
  this.debugMenu.update();

  if (this.debugMenu.isOpen) {
    return;
  }
} 

    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.handleEnter();
    }

    if (this.player) {
    this.player.update(time);
    this.updateTutorial();
    }
  }

  updateTutorial() {
  if (
    this.movementTutorialActive &&
    Math.abs(this.player.body.velocity.x) > 0
  ) {
    this.completeMovementTutorial();
  }

  if (
    this.movementTutorialComplete &&
    !this.jumpTutorialComplete &&
    !this.jumpTutorialActive &&
    this.player.x >= 220
  ) {
    this.showJumpTutorial();
  }

  if (
    this.jumpTutorialActive &&
    this.player.body.velocity.y < 0
  ) {
    this.completeJumpTutorial();
  }

  if (
  this.jumpTutorialComplete &&
  this.phoneInteractable &&
  !this.phoneSequenceStarted
) {
  const nearPhone =
    this.phoneInteractable.update(this.player);

  if (nearPhone) {
    this.interactionPrompt.show(
      this.phoneInteractable.promptText
    );
  } else {
    this.interactionPrompt.hide();
  }
}
}

  startOpening() {
  const firstLine =
    prologue.opening[0].text;

  this.startNarrationTypingSound();

  this.textController.typeText(
    this.narrationText,
    firstLine,
    () => {
      this.stopNarrationTypingSound();

      this.canAdvance = true;
      this.showEnterPrompt();
    }
  );
}

  handleEnter() {
  if (this.phoneSequenceStarted) {
    this.handlePhoneEnter();
    return;
  }

  if (
  this.phoneInteractable &&
  this.phoneInteractable.playerInRange &&
  !this.phoneSequenceStarted
) {
  sfxManager.play(this, 'interact');
  this.phoneInteractable.interact();
  return;
}

  // If text is still typing, Enter finishes the line instantly.
  if (this.textController.isTyping) {
  sfxManager.play(this, 'click');

  this.stopNarrationTypingSound();

  this.textController.completeImmediately(
    this.narrationText
  );


  return;
}

  if (!this.canAdvance) {
    return;
  }

  sfxManager.play(this, 'click');

  this.canAdvance = false;
  this.hideEnterPrompt();

  if (this.sequenceStep === 0) {
    this.sequenceStep = 1;
    this.showSecondLine();
    return;
  }

  if (this.sequenceStep === 1) {
    this.sequenceStep = 2;
    this.revealNat();
  }
}

  handlePhoneEnter() {
  if (this.phoneMode === 'profiles') {
    const currentProfile =
      prologue.profiles[this.phoneProfileIndex];

    sfxManager.play(this, 'click');

    if (currentProfile.id === 'jen') {
      this.showMatchScreen();
      return;
    }

    this.phoneProfileIndex += 1;
    this.showPhoneProfile();
    return;
  }

  if (this.phoneMode === 'match') {
    sfxManager.play(this, 'click');
    this.showMessageScreen();
    return;
  }

  if (this.phoneMode === 'compose') {
    if (!this.canSendInvite) return;

    sfxManager.play(this, 'click');
    this.sendPartyInvite();
    return;
  }

  // Do nothing while we're waiting for Jen.
  if (this.phoneMode === 'waiting') {
    return;
  }

  if (this.phoneMode === 'response') {
    sfxManager.play(this, 'click');
    this.closePhone();
  }
}

showMatchScreen() {
  this.phoneMode = 'match';

  // Hide profile-card content.
  this.profileNameText.setVisible(false);
  this.profilePicture.setVisible(false);
  this.profileDetailsText.setVisible(false);

  // =================================
  // MATCH HEART
  // =================================

  const heart = this.add
    .text(
      320,
      100,
      '♡',
      {
        fontFamily: UI_FONT,
        fontSize: '42px',
        color: '#d66f9f',
      }
    )
    .setOrigin(0.5)
    .setDepth(203)
    .setScale(0)
    .setData('match-text', true);

  // =================================
  // JEN PROFILE
  // =================================

  const jenPicture = this.add
    .image(
      270,
      158,
      'profile-jen'
    )
    .setDepth(203)
    .setData('match-text', true);

  const jenScale = Math.min(
    78 / jenPicture.width,
    78 / jenPicture.height
  );

  jenPicture.setScale(jenScale);

  // =================================
  // YOU
  // =================================

  const youCircle = this.add
    .circle(
      370,
      158,
      39,
      0xd8b6ca
    )
    .setStrokeStyle(
      2,
      0xb56d94
    )
    .setDepth(202)
    .setData('match-text', true);

  const youText = this.add
    .text(
      370,
      158,
      'YOU',
      {
        fontFamily: UI_FONT,
        fontSize: '13px',
        color: '#6b3e61',
      }
    )
    .setOrigin(0.5)
    .setDepth(203)
    .setData('match-text', true);

  // =================================
  // MATCH TEXT
  // =================================

  const matchText = this.add
    .text(
      320,
      220,
      "IT'S A MATCH!",
      {
        fontFamily: UI_FONT,
        fontSize: '22px',
        color: '#6b3e61',
      }
    )
    .setOrigin(0.5)
    .setDepth(203)
    .setAlpha(0)
    .setData('match-text', true);

  const reactionText = this.add
    .text(
      320,
      251,
      'well shit',
      {
        fontFamily: UI_FONT,
        fontSize: '11px',
        color: '#9b718d',
      }
    )
    .setOrigin(0.5)
    .setDepth(203)
    .setAlpha(0)
    .setData('match-text', true);

  // =================================
  // LITTLE PAYOFF ANIMATION
  // =================================

  this.tweens.add({
    targets: heart,
    scale: 1,
    duration: 350,
    ease: 'Back.easeOut',
  });

 jenPicture.setAlpha(0);
youCircle.setAlpha(0);
youText.setAlpha(0);

this.tweens.add({
  targets: [
    jenPicture,
    youCircle,
    youText
  ],
  alpha: 1,
  duration: 300,
  delay: 100,
});

  this.tweens.add({
    targets: matchText,
    alpha: 1,
    y: 215,
    duration: 350,
    delay: 250,
    ease: 'Sine.easeOut',
  });

  this.tweens.add({
    targets: reactionText,
    alpha: 1,
    duration: 300,
    delay: 550,
  });

  this.phoneActionText
    .setText('[ ENTER ]')
    .setVisible(true);
}

showMessageScreen() {
  this.phoneMode = 'compose';
  this.canSendInvite = false;

  // =================================
  // CLEAN UP MATCH / PROFILE UI
  // =================================

  this.children
    .getChildren()
    .filter(
      (child) =>
        child.getData?.('match-text')
    )
    .forEach((child) => child.destroy());

  this.profileNameText
    .setVisible(false)
    .setText('');

  this.profilePicture.setVisible(false);

  this.profileDetailsText
    .setVisible(false)
    .setText('');

  this.phoneActionText.setVisible(false);

  // =================================
  // CHAT HEADER
  // =================================

  this.chatHeader = this.add
    .text(320, 72, 'JENEVIEVE', {
      fontFamily: UI_FONT,
      fontSize: '16px',
      color: '#6b3e61',
    })
    .setOrigin(0.5)
    .setDepth(203);

  this.chatStatus = this.add
    .text(320, 94, 'matched just now ♡', {
      fontFamily: UI_FONT,
      fontSize: '9px',
      color: '#a4869b',
    })
    .setOrigin(0.5)
    .setDepth(203);

  // =================================
  // COMPOSE BOX
  // =================================

  this.composeBubble = this.createChatBubble(
    320,
    250,
    330,
    60,
    0xead6e2
  );

  this.composeText = this.add
    .text(175, 250, '', {
      fontFamily: UI_FONT,
      fontSize: '13px',
      color: '#5e4b5c',
      wordWrap: {
        width: 290,
        useAdvancedWrap: true,
      },
    })
    .setOrigin(0, 0.5)
    .setDepth(203);

  const inviteText =
    prologue.messages.partyInvite.text;

  // Type the invite into the compose field.
  this.textController.typeText(
    this.composeText,
    inviteText,
    () => {
      this.canSendInvite = true;

      this.phoneActionText
        .setText('[ ENTER ]  SEND')
        .setVisible(true);
    }
  );
}

createChatBubble(x, y, width, height, color) {
  const bubble = this.add.graphics();

  bubble.fillStyle(color, 1);

  bubble.fillRoundedRect(
    -width / 2,
    -height / 2,
    width,
    height,
    12
  );

  bubble.setPosition(x, y);
  bubble.setDepth(202);

  return bubble;
}

sendPartyInvite() {
  this.phoneMode = 'waiting';
  this.canSendInvite = false;

  this.phoneActionText.setVisible(false);

  // Remove compose field.
  this.composeBubble.destroy();
  this.composeText.destroy();

  this.composeBubble = null;
  this.composeText = null;

  // =================================
  // NAT'S SENT MESSAGE
  // =================================

  this.natLabel = this.add
  .text(505, 132, 'YOU', {
    fontFamily: UI_FONT,
    fontSize: '10px',
    color: '#9b718d',
  })
  .setOrigin(1, 0.5)
  .setDepth(203)
  .setAlpha(0);

this.natBubble = this.createChatBubble(
  420,
  166,
  210, // was 260
  52,  // was 72
  0xd9a9c4
);

this.natMessage = this.add
  .text(
    420,
    166,
    prologue.messages.partyInvite.text,
    {
      fontFamily: UI_FONT,
      fontSize: '14px',
      color: '#382436',
      align: 'center',
      wordWrap: {
        width: 185,
        useAdvancedWrap: true,
      },
    }
  )
  .setOrigin(0.5)
  .setDepth(203)
  .setAlpha(0)
  .setScale(0.75);

    sfxManager.play(this, 'message');


  // =================================
  // SEND POP
  // =================================

  this.tweens.add({
    targets: [
      this.natBubble,
      this.natMessage,
    ],
    alpha: 1,
    scaleX: 1,
    scaleY: 1,
    duration: 300,
    ease: 'Back.easeOut',
  });

  this.tweens.add({
    targets: this.natLabel,
    alpha: 1,
    duration: 200,
  });

  // Start Jen's typing indicator shortly after send.
  this.time.delayedCall(450, () => {
    this.showTypingIndicator();
  });

  // Deliberate comedic pause.
  this.time.delayedCall(1800, () => {
    this.showJenResponse();
  });
}

showTypingIndicator() {
  this.waitingBubble = this.createChatBubble(
    150,
    260,
    100,
    46,
    0x80617b
  );

  this.waitingText = this.add
    .text(
      150,
      256,
      '...',
      {
        fontFamily: UI_FONT,
        fontSize: '18px',
        color: '#fff0f6',
      }
    )
    .setOrigin(0.5)
    .setDepth(203);

  this.tweens.add({
    targets: this.waitingText,
    alpha: 0.3,
    duration: 350,
    yoyo: true,
    repeat: -1,
  });
}

showJenResponse() {
  if (this.waitingBubble) {
    this.waitingBubble.destroy();
    this.waitingBubble = null;
  }

  if (this.waitingText) {
    this.waitingText.destroy();
    this.waitingText = null;
  }

  // =================================
  // JEN LABEL
  // =================================

  this.jenLabel = this.add
  .text(115, 242, 'JENEVIEVE', {
    fontFamily: UI_FONT,
    fontSize: '10px',
    color: '#9b718d',
  })
  .setDepth(203)
  .setAlpha(0);

this.jenBubble = this.createChatBubble(
  193,
  279,
  165, // was 250
  50,  // was 68
  0x6b4966
);

this.jenMessage = this.add
  .text(
    190,
    276,
    prologue.messages.jenResponse.text,
    {
      fontFamily: UI_FONT,
      fontSize: '14px',
      color: '#fff0f6',
      align: 'center',
      wordWrap: {
        width: 140,
        useAdvancedWrap: true,
      },
    }
  )
  .setOrigin(0.5)
  .setDepth(203)
  .setAlpha(0)
  .setScale(0.85);

    sfxManager.play(this, 'message');

this.tweens.add({
  targets: [
    this.jenBubble,
    this.jenMessage,
  ],
  alpha: 1,
  scaleX: 1,
  scaleY: 1,
  duration: 250,
  ease: 'Back.easeOut',
});

  this.tweens.add({
    targets: this.jenLabel,
    alpha: 1,
    duration: 200,
  });

  this.phoneMode = 'response';

  this.phoneActionText
    .setText('[ ENTER ]')
    .setVisible(true);
}


closePhone() {
  this.phoneMode = 'closing';
  this.phoneActionText.setText('');

  this.cameras.main.fadeOut(
    700,
    0,
    0,
    0
  );

  this.time.delayedCall(750, () => {
  this.scene.start('PartyScene');
    });
}

  showSecondLine() {
  const secondLine =
    prologue.opening[1];

  this.startNarrationTypingSound();

  this.textController.typeText(
    this.narrationText,
    secondLine.firstPart,
    () => {
      this.stopNarrationTypingSound();

      this.time.delayedCall(
        1000,
        () => {
          this.startNarrationTypingSound();

          this.textController.appendText(
            this.narrationText,
            `\n${secondLine.secondPart}`,
            () => {
              this.stopNarrationTypingSound();

              this.canAdvance = true;
              this.showEnterPrompt();
            }
          );
        }
      );
    }
  );
}

  revealNat() {
    this.narrationText.setText('');
    this.hideEnterPrompt();

    this.limboBackground = this.add
    .image(320, 180, 'prologue-limbo')
    .setDisplaySize(640, 360)
    .setDepth(-10)
    .setAlpha(0);

    this.tweens.add({
      targets: this.limboBackground,
      alpha: 1,
      duration: 700,
      ease: 'Sine.easeOut',
    });

    this.createTemporaryTextures();
    this.createTutorialWorld();

    this.player = new Player(
      this,
      100,
      260,
      'nat-default'
    );

    this.physics.add.collider(
      this.player,
      this.platforms
    );

    this.add
      .text(320, 75, "There she is (Psst that's you)", {
        fontFamily: UI_FONT,
        fontSize: '12px',
        color: '#fff0f6',
      })
      .setOrigin(0.5);

    this.time.delayedCall(900, () => {
      this.showMovementTutorial();
    });
  }

  showMovementTutorial() {
  this.movementTutorialActive = true;

  this.movementTutorialText = this.add
    .text(320, 105, 'A / D  —  MOVE', {
      fontFamily: UI_FONT,
      fontSize: '12px',
      color: '#c9aebf',
    })
    .setOrigin(0.5);
}

    completeMovementTutorial() {
  this.movementTutorialActive = false;
  this.movementTutorialComplete = true;

  if (this.movementTutorialText) {
    this.movementTutorialText.destroy();
    this.movementTutorialText = null;
  }
}

showJumpTutorial() {
  this.jumpTutorialActive = true;

  this.jumpTutorialText = this.add
    .text(320, 105, 'SPACE  —  JUMP', {
      fontFamily: UI_FONT,
      fontSize: '12px',
      color: '#c9aebf',
    })
    .setOrigin(0.5);
}

completeJumpTutorial() {
  this.jumpTutorialActive = false;
  this.jumpTutorialComplete = true;

  if (this.jumpTutorialText) {
    this.jumpTutorialText.destroy();
    this.jumpTutorialText = null;
  }
}

  showEnterPrompt() {
    this.enterPrompt.setText('[ ENTER ]');
  }

  hideEnterPrompt() {
    this.enterPrompt.setText('');
  }

  createTemporaryTextures() {
    if (!this.textures.exists('nat-placeholder')) {
      const natGraphics = this.make.graphics({
        add: false,
      });

      natGraphics.fillStyle(0xf2d0a7);
      natGraphics.fillRect(8, 0, 16, 14);

      natGraphics.fillStyle(0x29232f);
      natGraphics.fillRect(6, 0, 20, 6);

      natGraphics.fillStyle(0xe8e1dc);
      natGraphics.fillRect(5, 14, 22, 16);

      natGraphics.fillStyle(0x6b7280);
      natGraphics.fillRect(4, 30, 10, 18);
      natGraphics.fillRect(18, 30, 10, 18);

      natGraphics.generateTexture(
        'nat-placeholder',
        32,
        48
      );

      natGraphics.destroy();
    }

    if (!this.textures.exists('platform-placeholder')) {
      const platformGraphics = this.make.graphics({
        add: false,
      });

      platformGraphics.fillStyle(0x3b3742);
      platformGraphics.fillRect(0, 0, 16, 16);

      platformGraphics.generateTexture(
        'platform-placeholder',
        16,
        16
      );

      platformGraphics.destroy();
    }

    if (!this.textures.exists('phone-placeholder')) {
  const phoneGraphics = this.make.graphics({
    add: false,
  });

  // Phone body
  phoneGraphics.fillStyle(0x24202b);
  phoneGraphics.fillRoundedRect(
    0,
    0,
    80,
    128,
    8
  );

  // Screen
  phoneGraphics.fillStyle(0xd8d1df);
  phoneGraphics.fillRect(
    7,
    10,
    66,
    100
  );

  // Bottom button
  phoneGraphics.fillStyle(0x777080);
  phoneGraphics.fillRect(
    34,
    116,
    12,
    4
  );

  phoneGraphics.generateTexture(
    'phone-placeholder',
    80,
    128
  );

  phoneGraphics.destroy();
}
  }

  createTutorialWorld() {
  this.platforms = this.physics.add.staticGroup();

  // Floor
  for (let x = 8; x < 640; x += 16) {
    this.platforms
      this.platforms
  .create(x, 344, 'platform-placeholder')
  .setVisible(false)
  .refreshBody();
  }

  // First tutorial obstacle
  for (let x = 300; x <= 332; x += 16) {
   this.platforms
  .create(x, 285, 'platform-placeholder')
  .setVisible(false)
  .refreshBody();

  }

  this.tutorialPlatformArt = this.add
  .image(
    316,
    280,
    'prologue-platform'
  )
  .setDisplaySize(105, 60)
  .setDepth(1);

  this.phone = this.add
  .image(
    540,
    305,
    'prologue-phone'
  )
  .setDisplaySize(90, 90)
  .setDepth(2);

this.phoneInteractable = new Interactable(
  this,
  500,
  280,
  {
    interactionDistance: 55,
    promptText: 'INTERACT',

    onInteract: () => {
      this.openPhone();
    },
  }
);
}

openPhone() {
  this.phoneSequenceStarted = true;

  this.phoneInteractable.disable();
  this.interactionPrompt.hide();

  this.player.setVelocity(0, 0);
  this.player.body.enable = false;

  this.phoneProfileIndex = 0;
  this.phoneMode = 'profiles';

  // =================================
// DARK WORLD OVERLAY
// =================================

this.phoneOverlay = this.add
  .rectangle(
    320,
    180,
    640,
    360,
    0x08070a,
    0.82
  )
  .setDepth(150);

// =================================
// APP SCREEN
// =================================

this.phoneUI = this.add
  .rectangle(
    320,
    180,
    430,
    320,
    0x24182d,
    1
  )
  .setStrokeStyle(
    2,
    0xd996b7,
    1
  )
  .setDepth(200);

// Inner app area
this.phoneScreen = this.add
  .rectangle(
    320,
    180,
    414,
    304,
    0xf3e9ef,
    1
  )
  .setDepth(201);

// =================================
// APP HEADER
// =================================

this.appTitleText = this.add
  .text(
    320,
    38,
    '♡  MATCHED?  ♡',
    {
      fontFamily: UI_FONT,
      fontSize: '15px',
      color: '#6b3e61',
    }
  )
  .setOrigin(0.5)
  .setDepth(203);

// =================================
// PROFILE PHOTO AREA
// =================================

this.profilePicture = this.add
  .image(
    320,
    119,
    'profile-random-1'
  )
  .setDepth(202);

  this.fitProfilePicture();

// =================================
// PROFILE NAME
// =================================

this.profileNameText = this.add
  .text(
    205,
    198,
    '',
    {
      fontFamily: UI_FONT,
      fontSize: '18px',
      color: '#382436',
    }
  )
  .setDepth(203);

// =================================
// PROFILE DETAILS
// =================================

this.profileDetailsText = this.add
  .text(
    205,
    221,
    '',
    {
      fontFamily: UI_FONT,
      fontSize: '12px',
      color: '#5e4b5c',
      lineSpacing: 4,

      wordWrap: {
        width: 230,
        useAdvancedWrap: true,
      },
    }
  )
  .setDepth(203);

  

// =================================
// ACTION
// =================================

this.phoneActionText = this.add
  .text(
    320,
    325,
    '',
    {
      fontFamily: UI_FONT,
      fontSize: '12px',
      color: '#9b527c',
    }
  )
  .setOrigin(0.5)
  .setDepth(203);

this.showPhoneProfile();

}

fitProfilePicture() {
  const maxWidth = 210;
  const maxHeight = 130;

  const scale = Math.min(
    maxWidth / this.profilePicture.width,
    maxHeight / this.profilePicture.height
  );

  this.profilePicture.setScale(scale);
}

showPhoneProfile() {
  const profile =
    prologue.profiles[this.phoneProfileIndex];

  this.profileNameText.setText(profile.name);

  const detailLines = profile.details
    .map((detail) => `• ${detail}`)
    .join('\n');

  this.profileDetailsText.setText(detailLines);

  const profileTextures = {
    'random-1': 'profile-random-1',
    'random-2': 'profile-random-2',
    jen: 'profile-jen',
  };

  this.profilePicture.setTexture(
    profileTextures[profile.id]
  );

  this.fitProfilePicture();

  if (profile.id === 'jen') {
    this.phoneActionText.setText(
      '[ ENTER ]  LIKE'
    );
  } else {
    this.phoneActionText.setText(
      '[ ENTER ]  NEXT'
    );
  }
}
}