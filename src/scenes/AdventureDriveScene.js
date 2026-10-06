import Phaser from 'phaser';

import ChapterTitle from '../ui/ChapterTitle.js';
import DebugMenu  from '../debug/DebugMenu.js';

import adventureDrive from '../data/adventureDrive.js';

import DialogueManager from '../systems/DialogueManager.js';

import saveManager from '../systems/saveManager.js';

import musicManager from '../systems/MusicManager.js';

import ThoughtPrompt from '../ui/ThoughtPrompt.js';
import sfxManager from '../systems/SFXManager.js';

import ThoughtUI from '../ui/ThoughtUI.js';

import AchievementPopup from '../systems/AchievementPopup.js';
import SettingsAccess from '../systems/SettingsAccess.js';

export class AdventureDriveScene extends Phaser.Scene {
  constructor() {
    super('AdventureDriveScene');
  }

  create() {

    this.settingsAccess =
  new SettingsAccess(this);

    saveManager.reachChapter(5);

    musicManager.interrupt(
    this,
    'ch5-ch6',
    {
      volume: 1,
      loop: true,
      fadeIn: true,
    }
  );

  

  // --------------------------------
  // DRIVING AMBIENCE
  // --------------------------------

  this.drivingAmbience = this.sound.add(
    'driving',
    {
      volume: 0.2,
      loop: true,
    }
  );

  this.drivingAmbience.play();

  this.events.once(
  Phaser.Scenes.Events.SHUTDOWN,
  () => {
    if (this.drivingAmbience) {
      this.drivingAmbience.stop();
      this.drivingAmbience.destroy();
      this.drivingAmbience = null;
    }
  }
);
    
    // --------------------------------
    // DEBUG MENU
    // --------------------------------

    this.debugMenu =
      new DebugMenu(this);

      this.achievementPopup =
  new AchievementPopup(this);

    // --------------------------------
    // CAR INTERIOR
    // --------------------------------


    this.createRoadBackground();

    this.createCarInterior();

    
    // --------------------------------
    // CHAPTER TITLE
    // --------------------------------

    this.chapterStarted = false;

    this.chapterTitle =
      new ChapterTitle(this);

    this.chapterTitle.show(
      5,
      'ESCAPING THE BEDROOM',
      () => {
        this.chapterStarted = true;

        this.startSongOne();
      }
    );

    this.dialogueManager =
    new DialogueManager(this);

    // --------------------------------
    // MUSIC CONTROLS
    // --------------------------------

    this.qKey =
    this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.Q
    );

    this.thoughtActive = false;
   

      this.thoughtPrompt =
        new ThoughtPrompt(this);

      this.thoughtUI =
        new ThoughtUI(this);

    this.currentThoughtBeat = null;
  }

  createRoadBackground() {
  this.roadBackground = this.add
    .image(
      320,
      180,
      'ch5-road-background'
    )
    .setOrigin(0.5)
    .setDepth(0);

  // Preserve aspect ratio while filling
  // the entire 640x360 game viewport.
  const scale = Math.max(
    640 / this.roadBackground.width,
    360 / this.roadBackground.height
  );

  this.roadBackground.setScale(scale);
}

  createCarInterior() {
  // --------------------------------
  // CHAPTER 5 CAR STATE
  // --------------------------------

  this.carScene = this.add
  .image(
    320,
    180,
    'ch5-car-neutral'
  )
  .setOrigin(0.5)
  .setDepth(20);

// Preserve the original aspect ratio.
// Fill the game's height and allow the
// left/right edges to crop offscreen.
const scale =
  360 / this.carScene.height;

this.carScene.setScale(scale);

  // --------------------------------
  // DYNAMIC RADIO TEXT
  // --------------------------------

  this.radioText = this.add
  .text(
    330,
    242, // move up onto radio
    '88.7 FM',
    {
      fontFamily: 'monospace',
      fontSize: '6px',
      color: '#b6d4b9',
      align: 'center',
    }
  )
  .setOrigin(0.5)
  .setDepth(30);

}

setCarState(
  state,
  fade = true,
  duration = 350
) {
  const textures = {
    neutral: 'ch5-car-neutral',
    singing: 'ch5-car-singing',
    relaxed: 'ch5-car-relaxed',
  };

  const texture = textures[state];

  if (!texture || !this.carScene) {
    return;
  }

  // Already showing this state.
  if (
    this.carScene.texture.key === texture
  ) {
    return;
  }

  // Instant swap if we ever need one.
  if (!fade) {
    this.carScene.setTexture(texture);
    this.fitCarScene();
    return;
  }

  // --------------------------------
  // TRUE CROSSFADE
  // --------------------------------

  // Create the new car directly over
  // the currently visible car.
  const nextCar = this.add
    .image(
      this.carScene.x,
      this.carScene.y,
      texture
    )
    .setOrigin(0.5)
    .setDepth(
      this.carScene.depth + 1
    )
    .setAlpha(0);

  // Fit it using the same rule as
  // the main car image.
  const scale =
    360 / nextCar.height;

  nextCar.setScale(scale);

  // Fade the new composition over the
  // old one. The car never disappears.
  this.tweens.add({
    targets: nextCar,
    alpha: 1,
    duration,
    ease: 'Sine.easeInOut',

    onComplete: () => {
      // Update the permanent car underneath.
      this.carScene.setTexture(texture);
      this.fitCarScene();

      // Temporary crossfade image is no
      // longer needed.
      nextCar.destroy();
    },
  });
}

fitCarScene() {
  if (!this.carScene) {
    return;
  }

  this.carScene.setScale(1);

  const scale =
    360 / this.carScene.height;

  this.carScene.setScale(scale);
}


startSongOne() {
  const song = adventureDrive.songs[0];

  this.setCarState(
    'neutral',
    false
  );

  this.currentSong = song;

  this.songActive = true;

  this.radioText.setText(
  `${song.title}\n${song.artist}`
);

this.radioText.setFontSize('6px');

  this.time.addEvent({
  delay: 4000,
  repeat: 2,
});
  

  this.time.delayedCall(
  1800,
  () => {
    this.startSongStory();
  }
);

}

startSongStory() {
  this.storyBeatIndex = 0;
  this.runNextStoryBeat();
}

runNextStoryBeat() {
  const song = this.currentSong;

  if (!song) {
  return;
    }

    if (
    this.storyBeatIndex >=
    song.dialogue.length
    ) {
    this.finishCurrentSong();
    return;
    }

  const beat =
    song.dialogue[this.storyBeatIndex];

  this.storyBeatIndex += 1;

  if (beat.type === 'dialogue') {
    this.runDialogueBeat(beat);
    return;
  }

  if (beat.type === 'pause') {
    this.runPauseBeat(beat);
    return;
  }

  if (beat.type === 'thought') {
    this.runThoughtBeat(beat);
    return;
    }

  // We haven't implemented Q thoughts,
  // song endings, etc. yet.
  if (beat.type === 'fade-out') {
  this.runFadeOutBeat();
  return;
}

if (beat.type === 'song-end') {
  this.runSongEndBeat();
  return;
}

console.log(
  'Chapter 5 story beat not implemented:',
  beat.type
);
}

runSongEndBeat() {

    
  this.songActive = false;


  this.radioText.setText(
    '88.7 FM'
  );

  this.radioText.setFontSize(
    '10px'
  );

  this.time.delayedCall(
    1200,
    () => {
      this.runNextStoryBeat();
    }
  );
}

runThoughtBeat(beat) {
  this.thoughtActive = true;
  this.currentThoughtBeat = beat;

  this.thoughtPrompt.show();
}

showCurrentThought() {
  if (
    !this.thoughtActive ||
    !this.currentThoughtBeat
  ) {
    return;
  }

  sfxManager.play(
    this,
    'click'
  );

  this.thoughtPrompt.hide();

  this.thoughtUI.show(
    this.currentThoughtBeat.text,
    null
  );

  this.time.delayedCall(
    2200,
    () => {
      this.finishThoughtBeat();
    }
  );
}

finishThoughtBeat() {
  const finishedThought =
    this.currentThoughtBeat;

  this.thoughtUI.hide();
  this.thoughtPrompt.hide();

  this.thoughtActive = false;
  this.currentThoughtBeat = null;

  // Final visual beat of Chapter 5.
  if (
    finishedThought?.text ===
    "Doesn't really matter"
  ) {
    this.setCarState(
  'relaxed',
  true,
  600
);
  }

  this.runNextStoryBeat();
}

runDialogueBeat(beat) {
  this.dialogueManager.start(
    beat.lines,
    {
      onComplete: () => {
        this.runNextStoryBeat();
      },
    }
  );
}

runPauseBeat(beat) {
  this.time.delayedCall(
    beat.duration,
    () => {
      this.runNextStoryBeat();
    }
  );
}


pulseRadio() {
  if (!this.radioText) {
    return;
  }

  this.tweens.killTweensOf(
    this.radioText
  );

  this.radioText.setScale(1);

  this.tweens.add({
    targets: this.radioText,
    scaleX: 1.08,
    scaleY: 1.08,
    duration: 80,
    yoyo: true,
    ease: 'Sine.easeOut',
  });
}


finishCurrentSong() {
  if (!this.currentSong) {
    return;
  }

  if (
    this.currentSong.id ===
    'still-into-you'
  ) {
    this.songActive = false;

    this.radioText.setText(
      '88.7 FM'
    );

    this.radioText.setFontSize(
      '10px'
    );

    this.time.delayedCall(
      2500,
      () => {
        this.startSongTwo();
      }
    );

    return;
  }

  if (
  this.currentSong.id ===
  'take-me-or-leave-me'
) {
  this.songActive = false;

  this.radioText.setText(
    '88.7 FM'
  );

  this.radioText.setFontSize(
    '10px'
  );

  this.time.delayedCall(
      2500,
      () => {
        this.startSongThree();
      }
    );

    return;
  }
}

startSongTwo() {
  const song =
    adventureDrive.songs[1];

    this.setCarState(
  'singing',
  true,
  400
);

  this.currentSong = song;

  this.songActive = true;

  this.radioText.setText(
  `${song.title}\n${song.artist}`
);

this.radioText.setFontSize('6px');

  // Visual marker that we're moving
  // into the late-night food-run section.


  this.time.delayedCall(
    1800,
    () => {
      this.startSongStory();
    }
  );
}


startSongThree() {
  const song =
    adventureDrive.songs[2];

  this.setCarState(
  'neutral',
  true,
  400
);

  this.currentSong = song;
 

  this.songActive = true;

  this.radioText.setText(
  `${song.title}\n${song.artist}`
);

this.radioText.setFontSize('6px');

  this.time.delayedCall(
    1800,
    () => {
      this.startSongStory();
    }
  );
}

runFadeOutBeat() {
  this.songActive = false;

 if (this.drivingAmbience) {
  this.tweens.add({
    targets: this.drivingAmbience,
    volume: 0,
    duration: 1500,

    onComplete: () => {
      this.drivingAmbience.stop();
      this.drivingAmbience.destroy();
      this.drivingAmbience = null;
    },
  });
}

  // Let the final thought breathe.
  this.time.delayedCall(
    2500,
    () => {
      this.cameras.main.fadeOut(
        1800,
        0,
        0,
        0
      );

      this.cameras.main.once(
  Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
  () => {
    // Remove the camera's fade overlay.
    // We'll replace it with our own black layer.
    this.cameras.main.resetFX();

    // Keep the scene completely black underneath
    // the achievement popup.
    this.chapterEndBlack = this.add
      .rectangle(
        320,
        180,
        640,
        360,
        0x000000,
        1
      )
      .setScrollFactor(0)
      .setDepth(400);

    const shown =
      this.achievementPopup.show(
        'odometer',
        () => {
          if (this.chapterEndBlack) {
            this.chapterEndBlack.destroy();
            this.chapterEndBlack = null;
          }

          this.scene.start(
            'NarrationScene',
            {
              transitionId: 'transition6',
            }
          );
        }
      );

    // Already unlocked on a previous playthrough.
    if (!shown) {
      this.chapterEndBlack.destroy();
      this.chapterEndBlack = null;

      this.scene.start(
        'NarrationScene',
        {
          transitionId: 'transition6',
        }
      );
    }
  }
);
    }
  );
}




  update(time) {
    if (
      this.debugMenu &&
      this.debugMenu.update()
    ) {
      return;
    }

    if (!this.chapterStarted) {
      return;
    }
    if (
        this.dialogueManager?.isActive
        ) {
        this.dialogueManager.update();
        }

    if (
        this.thoughtActive &&
        Phaser.Input.Keyboard.JustDown(
            this.qKey
        )
        ) {
        this.showCurrentThought();
        }    
    // Chapter 5 gameplay will
    // eventually run here.
  }
}