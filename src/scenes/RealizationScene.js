import Phaser from 'phaser';
import DebugMenu from '../debug/DebugMenu.js';
import Player from '../gameplay/Player.js';
import MessagePlatform from '../gameplay/MessagePlatform.js';
import realization from '../data/realization.js';
import ChapterTitle from '../ui/ChapterTitle.js';

import saveManager from '../systems/saveManager.js';

import sfxManager from '../systems/SFXManager.js';

import ObjectiveUI from '../ui/ObjectiveUI.js';

import musicManager from '../systems/MusicManager.js';

import InteractionPrompt from '../ui/InteractionPrompt.js';

import AchievementPopup from '../systems/AchievementPopup.js';
import SettingsAccess from '../systems/SettingsAccess.js';

export default class RealizationScene extends Phaser.Scene {
  constructor() {
    super('RealizationScene');
  }

  preload() {
  this.load.audio(
  'voice-memo',
  `${import.meta.env.BASE_URL}audio/voice-memo.mp3`
);
}

  create() {

    this.settingsAccess =
  new SettingsAccess(this);

    saveManager.reachChapter(3);
    
  this.cameras.main.setBackgroundColor('#17141f');

this.worldWidth = 4100;
this.worldTop = -360;
this.worldHeight = 720;

// -------------------------
// BACKGROUND
// -------------------------

const bgTexture = this.textures.get('ch3').getSourceImage();

this.background = this.add
  .tileSprite(
    -320,
    -360,
    this.worldWidth + 640,
    720,
    'ch3'
  )
  .setOrigin(0, 0)
  .setDepth(-100)
  .setAlpha(0.45);


// Scale the full tall image to the full 720px world height.
const bgScale = 720 / bgTexture.height;

this.background.setTileScale(bgScale);


// Keep temporary textures for anything else in
// this prototype that still depends on them.
this.createTemporaryTextures();
this.createTestRoom();

this.secretPlatforms = [];
this.secretRouteRevealed = false;
this.voiceMemoRouteCreated = false;

this.voiceMemoRouteCreated = false;
this.secretRouteRevealed = false;

  this.voiceMemoFound = false;
  this.voiceMemoNearby = false;
  this.voiceMemoPlaying = false;

  // -------------------------
  // PLAYER
  // -------------------------

  const saveData = saveManager.load();

const hasRaccoonHat =
  saveData.equippedHat === 'raccoon_hat';

const jenTexture = hasRaccoonHat
  ? 'jen-default-hat'
  : 'jen-default';

this.player = new Player(
  this,
  80,
  150,
  jenTexture
);

// Safe location to return to if Jen falls.
this.respawnX = 80;
this.respawnY = 150;

// The normal world ends at y = 360.
// Respawn Jen before she gets stuck against
// the bottom world boundary.
this.deathY = 315;

this.player.setScale(1.15);

  this.enterKey = this.input.keyboard.addKey(
  Phaser.Input.Keyboard.KeyCodes.ENTER
    );

  this.player.setCollideWorldBounds(true);

  this.worldWidth = 4100;

    this.physics.world.setBounds(
      0,
      this.worldTop,
      this.worldWidth,
      this.worldHeight
    );

    this.cameras.main.startFollow(
    this.player,
    true,
    0.08,
    0.08
    );

    this.cameras.main.setDeadzone(
    180,
    100
    );

  this.physics.add.collider(
    this.player,
    this.ground
  );

  this.objectiveUI = new ObjectiveUI(
  this,
  false,
  false
);

this.objectiveUI.setObjective(
  'GO ABOUT YOUR DAY'
);

  // -------------------------
  // EXCHANGE #1
  // -------------------------

  this.messagePlatforms = [];
  this.openingMessagesReady = false;


    // -------------------------
    // REPLY INTERACTION
    // -------------------------

    this.replyAvailable = false;
    this.replySent = false;

    this.exchangeTwoStarted = false;
    this.exchangeTwoReplySent = false;
    this.exchangeThreeStarted = false;
    this.exchangeFourStarted = false;
    this.exchangeFiveStarted = false;
    this.unsentSequenceStarted = false;
    this.unsentSequenceFinished = false;
    this.realizationTriggered = false;
    this.chapterTitle = new ChapterTitle(this);
    this.pendingReply = null;

   this.replyPrompt = new InteractionPrompt(this);
  this.replyPrompt.hide();

  this.achievementPopup =
  new AchievementPopup(this);

  // -------------------------
  // DEBUG
  // -------------------------

  this.debugMenu =
    new DebugMenu(this);

  this.cameras.main.fadeIn(
    800,
    0,
    0,
    0
  );

  this.time.delayedCall(1400, () => {
  this.createOpeningMessages();
});

}

respawnPlayer() {
  if (!this.player) {
    return;
  }

  this.player.setPosition(
    this.respawnX,
    this.respawnY
  );

  this.player.setVelocity(
    0,
    0
  );

  this.player.body.setAcceleration(
    0,
    0
  );
}

createOpeningMessages() {
  const natMessageOne =
    new MessagePlatform(
      this,
      210,
      275,
      {
        speaker: 'NAT',
        text: 'When are you free next?',
        width: 155,
        style: 'nat',
      }
    );

  const natMessageTwo =
    new MessagePlatform(
      this,
      410,
      230,
      {
        speaker: 'NAT',
        text: 'We have to practice finding all the spots!!!',
        width: 175,
        style: 'nat',
      }
    );

  this.messagePlatforms.push(
    natMessageOne,
    natMessageTwo
  );

  this.messagePlatforms.forEach(
    (messagePlatform) => {
      this.physics.add.collider(
        this.player,
        messagePlatform.getPlatform()
      );
    }
  );

  this.openingMessagesReady = true;

const exchange = realization.exchanges[0];

this.setPendingReply({
  triggerX: 410,
  triggerY: 230,

  replyX: 570,
  replyY: 275,

  message: exchange.messages[2],

  width: 150,

  onSent: () => {
    this.replySent = true;

    this.createSeparatorPlatform({
      x: 770,
      y: 315,
      width: 180,
    });
  },
});
}

createNormalPlatform({
  x,
  y,
  width = 180,
}) {
  // Visible artwork
  const platform = this.add.image(
    x,
    y,
    'prologue-platform'
  );

  const scale = width / platform.width;

  platform
    .setScale(scale)
    .setDepth(20);

  // Thin invisible collision surface
  // near the visual top of the platform.
  const platformTop =
  y - platform.displayHeight / 2;

// Collision surface intentionally sits
// farther inside the visible platform art.
const physicsBody =
  this.add.rectangle(
    x,
    platformTop + 60,
    width - 12,
    12,
    0x000000,
    0
  );

  this.physics.add.existing(
    physicsBody,
    true
  );

  this.physics.add.collider(
    this.player,
    physicsBody
  );

  return physicsBody;
}

createTemporaryTextures() {
  if (
    !this.textures.exists(
      'jen-placeholder'
    )
  ) {
    const graphics =
      this.add.graphics();

    graphics.fillStyle(
      0xd8d2dc,
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
  // Visible starting platform
  this.groundArt = this.add.image(
    80,
    300,
    'prologue-platform'
  );

  const width = 160;

  const scale =
    width / this.groundArt.width;

  this.groundArt
    .setScale(scale)
    .setDepth(20);

  // Thin physics surface
  const platformTop =
    300 - this.groundArt.displayHeight / 2;

  this.ground =
    this.add.rectangle(
      80,
      platformTop + 60,
      width - 12,
      12,
      0x000000,
      0
    );

  this.physics.add.existing(
    this.ground,
    true
  );
}

createMessagePlatform({
  x,
  y,
  speaker,
  text,
  width = 170,
}) {
  const messagePlatform =
    new MessagePlatform(
      this,
      x,
      y,
      {
        speaker,
        text,
        width,
        style:
          speaker === 'JEN'
            ? 'jen'
            : 'nat',
      }
    );

  this.messagePlatforms.push(
    messagePlatform
  );

  this.physics.add.collider(
    this.player,
    messagePlatform.getPlatform()
  );

  return messagePlatform;
}

updateReplyInteraction() {
   if (
    !this.openingMessagesReady ||
    this.replySent
  ) {
    return;
  }

  const distance = Phaser.Math.Distance.Between(
    this.player.x,
    this.player.y,
    410,
    230
  );

  this.replyAvailable = distance < 100;

  this.replyPrompt.setVisible(
    this.replyAvailable
  );

  if (
    this.replyAvailable &&
    Phaser.Input.Keyboard.JustDown(
      this.enterKey
    )
  ) {
    this.sendFirstReply();
  }
}

sendFirstReply() {
  this.replySent = true;
  this.replyAvailable = false;

  this.replyPrompt.setVisible(false);

  const jenReply =
    new MessagePlatform(
      this,
      570,
      275,
      {
        speaker: 'JEN',
        text: 'Miss me already lol?',
        width: 150,
        style: 'jen',
      }
    );

  this.messagePlatforms.push(jenReply);

  this.physics.add.collider(
    this.player,
    jenReply.getPlatform()
  );

  const separator =
  this.add.rectangle(
    770,
    315,
    180,
    24,
    0x29252f
  );

    this.physics.add.existing(
    separator,
    true
    );

    this.physics.add.collider(
    this.player,
    separator
    );
}

updateExchangeTwo() {
  if (
    this.exchangeTwoStarted ||
    this.player.x < 700
  ) {
    return;
  }

  this.exchangeTwoStarted = true;

  const exchange =
    realization.exchanges[1];

  this.createMessagePlatform({
    x: 930,
    y: 265,
    speaker: exchange.messages[0].speaker,
    text: exchange.messages[0].text,
    width: 190,
  });

  this.setPendingReply({
    triggerX: 930,
    triggerY: 265,

    replyX: 1115,
    replyY: 215,

    message: exchange.messages[1],

    width: 190,

    onSent: () => {
    this.createMessagePlatform({
        x: 1290,
        y: 265,
        speaker: exchange.messages[2].speaker,
        text: exchange.messages[2].text,
        width: 110,
    });

    this.createSeparatorPlatform({
        x: 1460,
        y: 310,
        width: 170,
    });
    },
  });
}

setPendingReply({
  triggerX,
  triggerY,
  replyX,
  replyY,
  message,
  width = 170,
  onSent = null,
}) {
  this.pendingReply = {
    triggerX,
    triggerY,
    replyX,
    replyY,
    message,
    width,
    onSent,
  };

 this.replyPrompt.hide();
}

updatePendingReply() {
  if (!this.pendingReply) {
    return;
  }

  const reply =
    this.pendingReply;

  const horizontalDistance =
  Math.abs(
    this.player.x - reply.triggerX
  );

const nearby = horizontalDistance < 115;

if (nearby) {
  this.replyPrompt.show('REPLY');
} else {
  this.replyPrompt.hide();
}

  if (
    nearby &&
    Phaser.Input.Keyboard.JustDown(
      this.enterKey
    )
  ) {
    this.replyPrompt.hide();

    sfxManager.play(this, 'message');

    this.createMessagePlatform({
      x: reply.replyX,
      y: reply.replyY,
      speaker: reply.message.speaker,
      text: reply.message.text,
      width: reply.width,
    });

    const onSent = reply.onSent;

    this.pendingReply = null;

    if (onSent) {
      onSent();
    }
  }
}

createSeparatorPlatform({
  x,
  y,
  width = 180,
  height = 24,
}) {
  return this.createNormalPlatform({
    x,
    y,
    width,
    height,
  });
}

createSecretPlatform({
  x,
  y,
  size = 'medium',
  targetAlpha = 0.44,
}) {
  const textureMap = {
    small: 'secret-platform-small',
    medium: 'secret-platform',
    big: 'secret-platform-big',
  };

  const texture =
    textureMap[size] ??
    textureMap.medium;

  // -------------------------
  // VISIBLE ART
  // -------------------------
const art = this.add.image(
  x,
  y,
  texture
);

// Target gameplay widths, roughly matching
// our message-platform scale.
const widthMap = {
  small: 100,
  medium: 145,
  big: 190,
};

const targetWidth =
  widthMap[size] ??
  widthMap.medium;

const scale =
  targetWidth / art.width;

art
  .setScale(scale)
  .setAlpha(0)
  .setDepth(15);

  // -------------------------
  // COLLISION
  // -------------------------

  // Keep collision separate from the artwork,
  // like our normal platforms.
  const platformTop =
    y - art.displayHeight / 2;

  const physicsBody =
    this.add.rectangle(
      x,
      platformTop + 35,
      art.displayWidth - 10,
      12,
      0x000000,
      0
    );

  this.physics.add.existing(
    physicsBody,
    true
  );

  this.physics.add.collider(
    this.player,
    physicsBody
  );

  const secretPlatform = {
    art,
    body: physicsBody,
    targetAlpha,
  };

  this.secretPlatforms.push(
    secretPlatform
  );

  return secretPlatform;
}

revealSecretRoute() {
  if (this.secretRouteRevealed) {
    return;
  }

  this.secretRouteRevealed = true;

  this.secretPlatforms.forEach(
    (platform, index) => {
      this.tweens.add({
        targets: platform.art,
        alpha: platform.targetAlpha,
        duration: 2600,
        delay: index * 120,
        ease: 'Sine.easeOut',
      });
    }
  );
}

createVoiceMemoRoute() {
  // Secret route climbs up and left.

  // 1
  this.createSecretPlatform({
    x: 2370,
    y: 185,
    size: 'big',
    targetAlpha: 0.38,
  });

  // 2
  this.createSecretPlatform({
    x: 2250,
    y: 125,
    size: 'medium',
    targetAlpha: 0.41,
  });

  // 3
  this.createSecretPlatform({
    x: 2130,
    y: 65,
    size: 'small',
    targetAlpha: 0.44,
  });

  // 4
  this.createSecretPlatform({
    x: 2010,
    y: 5,
    size: 'medium',
    targetAlpha: 0.47,
  });

  // 5
  this.createSecretPlatform({
    x: 1890,
    y: -55,
    size: 'small',
    targetAlpha: 0.50,
  });

  // Final horizontal landing.
  // Same height as platform 5 so we're no longer
  // climbing toward the background boundary.
  this.voiceMemoLanding =
    this.createSecretPlatform({
      x: 1730,
      y: -55,
      size: 'big',
      targetAlpha: 0.58,
    });

  // We'll turn this back on after fixing its
  // position for the new platform object.
  this.createVoiceMemoRecorder();
}

createVoiceMemoRecorder() {
  const landingArt =
    this.voiceMemoLanding.art;

  const landingTop =
    landingArt.y -
    landingArt.displayHeight / 2;

  const x = landingArt.x;
  const y = landingTop - 18;

  this.voiceMemoRecorder =
    this.add.container(x, y);

  // Little recorder body.
  const body = this.add.rectangle(
    0,
    0,
    22,
    30,
    0x4a304f,
    1
  );

  body.setStrokeStyle(
    2,
    0xd9afd1,
    1
  );

  // Tiny screen.
  const screen = this.add.rectangle(
    0,
    -6,
    14,
    8,
    0x17141f,
    1
  );

  // Audio waveform.
  const wave1 = this.add.rectangle(
    -4,
    -6,
    2,
    3,
    0xffd6ed
  );

  const wave2 = this.add.rectangle(
    0,
    -6,
    2,
    6,
    0xffd6ed
  );

  const wave3 = this.add.rectangle(
    4,
    -6,
    2,
    4,
    0xffd6ed
  );

  // Record button.
  const recordButton =
    this.add.circle(
      0,
      7,
      3,
      0xe0a8d2
    );

  // Tiny status light.
  const light =
    this.add.rectangle(
      7,
      -11,
      3,
      3,
      0xfff1fa
    );

  this.voiceMemoRecorder.add([
    body,
    screen,
    wave1,
    wave2,
    wave3,
    recordButton,
    light,
  ]);

  this.voiceMemoRecorder
    .setDepth(25);

  this.voiceMemoPrompt =
    new InteractionPrompt(this);

  this.voiceMemoPrompt.hide();
}

updateVoiceMemoInteraction() {
  if (
    !this.voiceMemoRecorder ||
    this.voiceMemoPlaying
  ) {
    return;
  }

  const distance =
    Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.voiceMemoRecorder.x,
      this.voiceMemoRecorder.y
    );

  this.voiceMemoNearby =
    distance < 75;

  if (this.voiceMemoNearby) {
  this.voiceMemoPrompt.show('LISTEN');
} else {
  this.voiceMemoPrompt.hide();
}

  if (
    this.voiceMemoNearby &&
    Phaser.Input.Keyboard.JustDown(
      this.enterKey
    )
  ) {
    this.startVoiceMemo();
  }
}

showVoiceMemoPlayer() {
  this.voiceMemoOverlay =
    this.add.rectangle(
      320,
      180,
      640,
      360,
      0x000000,
      0.55
    )
      .setScrollFactor(0)
      .setDepth(500);

  this.voiceMemoBox =
    this.add.rectangle(
      320,
      180,
      360,
      130,
      0x17141f
    )
      .setStrokeStyle(
        1,
        0x77727f
      )
      .setScrollFactor(0)
      .setDepth(501);

  this.voiceMemoTitle =
    this.add.text(
      320,
      140,
      'VOICE MEMO',
      {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#ffffff',
      }
    )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(502);

  this.voiceMemoStatus =
    this.add.text(
      320,
      180,
      '▶  PLAYING...',
      {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#c9c2d0',
      }
    )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(502);

  this.voiceMemoContinue =
    this.add.text(
      320,
      220,
      '',
      {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#77727f',
      }
    )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(502);
}


startVoiceMemo() {
  if (this.voiceMemoPlaying) {
    return;
  }

  this.voiceMemoPlaying = true;
  this.voiceMemoNearby = false;

  this.voiceMemoPrompt.hide();
this.replyPrompt.hide();

  this.player.setVelocity(0, 0);

  // Pause the soundtrack while the voice memo plays.
  musicManager.pause();

  this.showVoiceMemoPlayer();

  this.voiceMemoSound =
    this.sound.add('voice-memo');

  this.voiceMemoSound.once(
    'complete',
    () => {
      this.finishVoiceMemoPlayback();
    }
  );

  this.voiceMemoSound.play();
}

finishVoiceMemoPlayback() {

    musicManager.resume();
  this.voiceMemoStatus.setText(
    '■  RECORDING ENDED'
  );

  this.voiceMemoContinue.setText(
    '[ENTER] CONTINUE'
  );

  this.waitingForVoiceMemoContinue = true;
}


updateVoiceMemoContinue() {
  if (
    !this.waitingForVoiceMemoContinue
  ) {
    return;
  }

  if (
    Phaser.Input.Keyboard.JustDown(
      this.enterKey
    )
  ) {
    this.waitingForVoiceMemoContinue = false;

    this.voiceMemoOverlay.destroy();
    this.voiceMemoBox.destroy();
    this.voiceMemoTitle.destroy();
    this.voiceMemoStatus.destroy();
    this.voiceMemoContinue.destroy();

    this.finishVoiceMemoDiscovery();
  }
}

updateVoiceMemoRoute() {
  if (this.voiceMemoRouteCreated) {
    return;
  }

  // Wait until Jen has safely passed the point
  // where the secret route would interfere with
  // the normal path.
  if (this.player.x < 2350) {
    return;
  }

  this.voiceMemoRouteCreated = true;

  this.createVoiceMemoRoute();
  this.revealSecretRoute();
}

finishVoiceMemoDiscovery() {
  this.achievementPopup.show(
    'voice_memo',
    () => {
      this.voiceMemoPlaying = false;
    }
  );
}

updateExchangeThree() {
  if (
    this.exchangeThreeStarted ||
    this.player.x < 1380
  ) {
    return;
  }

  this.exchangeThreeStarted = true;

  const exchange =
    realization.exchanges[2];

  // NAT
  this.createMessagePlatform({
    x: 1610,
    y: 260,
    speaker: exchange.messages[0].speaker,
    text: exchange.messages[0].text,
    width: 210,
  });

  // JEN reply
  this.setPendingReply({
    triggerX: 1610,
    triggerY: 260,

    replyX: 1815,
    replyY: 285,

    message: exchange.messages[1],

    width: 200,

    onSent: () => {
      this.createSeparatorPlatform({
        x: 2010,
        y: 315,
        width: 160,
      });
    },
  });
}

updateExchangeFour() {
  if (
    this.exchangeFourStarted ||
    this.player.x < 1940
  ) {
    return;
  }

  this.exchangeFourStarted = true;
  

  const exchange =
    realization.exchanges[3];

  // NAT
  this.createMessagePlatform({
    x: 2200,
    y: 270,
    speaker: exchange.messages[0].speaker,
    text: exchange.messages[0].text,
    width: 220,
  });

  // JEN
  this.setPendingReply({
    triggerX: 2200,
    triggerY: 270,

    replyX: 2410,
    replyY: 240,

    message: exchange.messages[1],

    width: 225,

    onSent: () => {
  this.createSeparatorPlatform({
    x: 2625,
    y: 285,
    width: 170,
  });

  this.createSeparatorPlatform({
    x: 2800,
    y: 315,
    width: 150,
  });

},
  });
}

updateExchangeFive() {
  if (
    this.exchangeFiveStarted ||
    this.player.x < 2730
  ) {
    return;
  }

  this.exchangeFiveStarted = true;

  const exchange =
    realization.exchanges[4];

  this.exchangeFiveNatPlatform =
    this.createMessagePlatform({
      x: 2990,
      y: 270,
      speaker: exchange.messages[0].speaker,
      text: exchange.messages[0].text,
      width: 145,
    });

  this.exchangeFiveAutoReplyStarted = false;
}

updateExchangeFiveAutoReply() {
  if (
    !this.exchangeFiveNatPlatform ||
    this.exchangeFiveAutoReplyStarted
  ) {
    return;
  }

  const natPlatform =
    this.exchangeFiveNatPlatform.getPlatform();

  // Jen is roughly over the Nat message and
  // physically standing on top of it.
  const standingOnNatMessage =
    this.player.body.blocked.down &&
    this.player.x >
      natPlatform.x - natPlatform.width / 2 &&
    this.player.x <
      natPlatform.x + natPlatform.width / 2 &&
    this.player.y < natPlatform.y;

  if (!standingOnNatMessage) {
    return;
  }

  this.exchangeFiveAutoReplyStarted = true;

  const exchange =
    realization.exchanges[4];

  this.time.delayedCall(3000, () => {
    this.createMessagePlatform({
      x: 3180,
      y: 220,
      speaker: exchange.messages[1].speaker,
      text: exchange.messages[1].text,
      width: 155,
    });

    this.finalSeparator =
    this.createSeparatorPlatform({
        x: 3370,
        y: 285,
        width: 150,
    });
  });
}

updateUnsentSequence() {
  if (
    this.unsentSequenceStarted ||
    !this.finalSeparator
  ) {
    return;
  }

  const standingOnFinalPlatform =
    this.player.body.blocked.down &&
    this.player.x >
      this.finalSeparator.x -
        this.finalSeparator.width / 2 &&
    this.player.x <
      this.finalSeparator.x +
        this.finalSeparator.width / 2 &&
    this.player.y <
      this.finalSeparator.y;

  if (!standingOnFinalPlatform) {
    return;
  }

  this.unsentSequenceStarted = true;
  this.unsentSequenceLocked = true;
    this.player.setVelocity(0, 0);

  // Stop normal camera following.
  this.cameras.main.stopFollow();

  // Shift focus toward the empty space
  // where Jen's message is about to appear.
  this.cameras.main.pan(
    3475,
    180,
    900,
    'Sine.easeInOut'
  );

  this.time.delayedCall(1200, () => {
    this.showUnsentMessage();
  });
}

showUnsentMessage() {
  const message =
    realization.unsentMessage.text;

  // =========================================
  // UNSENT MESSAGE COMPOSER
  // =========================================

  const x = 3600;
  const y = 235;

  this.unsentContainer =
    this.add.container(x, y);

  // Soft shadow behind the composer.
  this.unsentShadow =
    this.add.rectangle(
      3,
      4,
      220,
      72,
      0x120d18,
      0.45
    );

  // Main Jen-colored message composer.
  this.unsentBox =
    this.add.rectangle(
      0,
      0,
      220,
      72,
      0x4a304f,
      0.96
    );

  this.unsentBox.setStrokeStyle(
    2,
    0xc98fbd,
    1
  );

  // Little decorative corner blocks to match
  // the rest of our pixel UI.
  this.unsentAccentLeft =
    this.add.rectangle(
      -96,
      -27,
      8,
      8,
      0xe0a8d2
    );

  this.unsentAccentRight =
    this.add.rectangle(
      96,
      27,
      8,
      8,
      0x8b628f
    );

  // Small draft status.
  this.unsentDraftLabel =
    this.add.text(
      -88,
      -25,
      'JEN  ·  DRAFT',
      {
        fontFamily: 'Yabikoma',
        fontSize: '9px',
        color: '#d9afd1',
      }
    );

  // Actual message being typed.
  this.unsentText =
    this.add.text(
      -88,
      -5,
      `${message}|`,
      {
        fontFamily: 'Yabikoma',
        fontSize: '12px',
        color: '#fff5fc',
        wordWrap: {
          width: 175,
        },
      }
    );

  // Tiny unsent indicator.
  this.unsentStatus =
    this.add.text(
      88,
      23,
      '...',
      {
        fontFamily: 'Yabikoma',
        fontSize: '10px',
        color: '#c98fbd',
      }
    )
      .setOrigin(1, 0.5);

  this.unsentContainer.add([
    this.unsentShadow,
    this.unsentBox,
    this.unsentAccentLeft,
    this.unsentAccentRight,
    this.unsentDraftLabel,
    this.unsentText,
    this.unsentStatus,
  ]);

  this.unsentContainer.setDepth(50);

  // Let Nat read it and expect another platform
  // before Jen changes her mind.
  this.time.delayedCall(2200, () => {
    this.eraseUnsentMessage();
  });
}

eraseUnsentMessage() {
  const fullText =
    realization.unsentMessage.text;

  let characterIndex =
    fullText.length;

  // Play typing/backspace audio during deletion.
  this.unsentTypingSound =
    this.sound.add('typing', {
      loop: true,
      volume: 0.55,
    });

  this.unsentTypingSound.play();

  this.unsentEraseEvent =
    this.time.addEvent({
      delay: 75,
      repeat: fullText.length - 1,

      callback: () => {
        characterIndex--;

        const remainingText =
          fullText.substring(
            0,
            characterIndex
          );

        this.unsentText.setText(
          `${remainingText}|`
        );

        if (characterIndex === 0) {

          // Stop deletion audio.
          if (this.unsentTypingSound) {
            this.unsentTypingSound.stop();
            this.unsentTypingSound.destroy();
            this.unsentTypingSound = null;
          }

          this.unsentSequenceFinished = true;

          this.time.delayedCall(700, () => {
            this.unsentSequenceLocked = false;
            this.beginFallSetup();
          });
        }
      },
    });
}

beginFallSetup() {
  // Give control back, but keep the camera
  // focused on this final gap.
  this.unsentSequenceLocked = false;

  this.waitingForFinalFall = true;
  this.finalFallStarted = false;

  // Expand the physics world downward so Jen
  // can actually fall instead of immediately
  // leaving the world.
  this.physics.world.setBounds(
    0,
    0,
    this.worldWidth,
    1000
  );
}

updateFinalFall() {
  if (
    !this.waitingForFinalFall ||
    this.finalFallStarted
  ) {
    return;
  }

  // Once Jen is clearly below the final
  // platform, she's committed to the fall.
  if (this.player.y > 350) {
    this.startFinalFall();
  }
}

startFinalFall() {
  this.finalFallStarted = true;
  this.waitingForFinalFall = false;

  // We're no longer doing normal platforming.
  this.unsentSequenceLocked = true;

  sfxManager.play(
  this,
  'record-scratch'
);

musicManager.stop();

  // Let the camera descend with Jen.
  this.cameras.main.startFollow(
    this.player,
    true,
    0.06,
    0.06
  );

  this.cameras.main.setBounds(
    0,
    0,
    this.worldWidth,
    1000
  );

  // Remove the normal UI from the moment.
  if (this.unsentContainer) {
  this.unsentContainer.setAlpha(0.35);
}
}

updateRealization() {
  if (
    !this.finalFallStarted ||
    this.realizationTriggered ||
    this.player.y < 700
  ) {
    return;
  }

  this.realizationTriggered = true;

// Gameplay is over — clear the objective before
// the realization/title sequence.
if (this.objectiveUI) {
  this.objectiveUI.hide();
}

this.player.setVelocity(0, 0);

this.cameras.main.fadeOut(
  700,
  0,
  0,
  0
);

  this.player.setVelocity(0, 0);

  this.cameras.main.fadeOut(
    700,
    0,
    0,
    0
  );

  this.time.delayedCall(900, () => {
    this.showRealization();
  });
}

showRealization() {
  this.cameras.main.stopFollow();
  this.player.setVisible(false);

  // IMPORTANT:
  // Do NOT reset camera scroll.
  // We want to remain down in the void.

  this.cameras.main.fadeIn(
    500,
    0,
    0,
    0
  );

  const thought =
    this.add.text(
      320,
      180,
      'fucking goddamit',
      {
        fontFamily: 'monospace',
        fontSize: '11px',
        fontStyle: 'italic',
        color: '#c9c2d0',
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(500);

  this.time.delayedCall(2200, () => {
    thought.destroy();

    this.time.delayedCall(700, () => {
      this.showChapterThreeTitle();
    });
  });
}

showChapterThreeTitle() {
  this.chapterTitle.show(
    3,
    'FUCK, I MAYBE LIKE YOU',
    () => {
       this.showMindReadUnlock();
    }
  );
}

showMindReadUnlock() {
  const background =
    this.add.rectangle(
      320,
      180,
      640,
      360,
      0x08070a
    )
    .setScrollFactor(0)
    .setDepth(1000);

  const unlockedText =
    this.add.text(
      320,
      125,
      'NEW ABILITY UNLOCKED',
      {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#77727f',
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1001);

  const keyText =
    this.add.text(
      320,
      170,
      '[ Q ]',
      {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold',
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1001);

  const abilityText =
    this.add.text(
      320,
      205,
      'READ MY MIND',
      {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1001);

  const continueText =
    this.add.text(
      320,
      275,
      '[ENTER] CONTINUE',
      {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#77727f',
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1001);

  this.mindReadUnlockObjects = [
    background,
    unlockedText,
    keyText,
    abilityText,
    continueText,
  ];

  this.waitingForUnlockContinue = true;
}

updateMindReadUnlock() {
  if (
    !this.waitingForUnlockContinue
  ) {
    return;
  }

  if (
    Phaser.Input.Keyboard.JustDown(
      this.enterKey
    )
  ) {
    this.waitingForUnlockContinue = false;

    this.mindReadUnlockObjects.forEach(
      (object) => {
        object.destroy();
      }
    );

    this.mindReadUnlockObjects = [];

    this.finishChapterThree();
  }
}

finishChapterThree() {
  this.cameras.main.fadeOut(
    500,
    0,
    0,
    0
  );

  this.time.delayedCall(550, () => {
    this.scene.start(
      'NarrationScene',
      {
        transitionId: 'transition4',
      }
    );
  });
}

  update(time) {
  if (this.debugMenu) {
    this.debugMenu.update();

    if (this.debugMenu.isOpen) {
      return;
    }
  }

  if (this.player) {
    if (
      !this.unsentSequenceLocked &&
      !this.voiceMemoPlaying
    ) {
      this.player.update(time);
    } else {
      this.player.setVelocityX(0);
    }

    // --------------------------------
    // FALL SAFETY / RESPAWN
    // --------------------------------
    //
    // The normal world ends at y = 360.
    // Respawn before Jen reaches the
    // bottom world boundary.
    //
    // Do NOT run this during the intentional
    // final fall at the end of Chapter 3.
    if (
  !this.finalFallStarted &&
  !this.waitingForFinalFall &&
  this.player.y >= this.deathY
) {
  this.respawnPlayer();
  return;
}

    this.updateExchangeTwo();
    this.updateExchangeThree();
    this.updateExchangeFour();
    this.updateVoiceMemoRoute();
    this.updateVoiceMemoInteraction();
    this.updateVoiceMemoContinue();
    this.updateExchangeFive();
    this.updateExchangeFiveAutoReply();
    this.updateUnsentSequence();
    this.updatePendingReply();
    this.updateRealization();
    this.updateFinalFall();
    this.updateMindReadUnlock();
  }
}
}