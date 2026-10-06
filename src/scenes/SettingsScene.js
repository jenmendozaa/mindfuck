import Phaser from 'phaser';

import DebugMenu from '../debug/DebugMenu.js';
import saveManager from '../systems/saveManager.js';
import musicManager from '../systems/MusicManager.js';
import sfxManager from '../systems/SFXManager.js';

import { UI_FONT } from '../ui/uiTheme.js';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  init(data) {
  this.returnScene =
    data?.returnScene ?? 'TitleScene';

  this.fromGameplay =
    data?.fromGameplay ?? false;
}

  create() {
    this.debugMenu =
      new DebugMenu(this);

    this.saveData =
      saveManager.load();

    this.selectedIndex = 0;
    this.transitioning = false;

    this.musicVolume =
      this.saveData.musicVolume ?? 0.5;

    this.sfxVolume =
      this.saveData.sfxVolume ?? 0.7;

    this.cameras.main.setBackgroundColor(
      '#100d16'
    );

    this.createUI();
    this.createControls();

    this.cameras.main.fadeIn(
      400,
      0,
      0,
      0
    );
  }

  // =================================================
  // UI
  // =================================================

  createUI() {
    // -----------------------------------------------
    // BACKGROUND
    // -----------------------------------------------

    this.add.rectangle(
      320,
      180,
      640,
      360,
      0x17101f
    );

    this.add.rectangle(
      320,
      180,
      520,
      300,
      0x24182d,
      0.96
    )
      .setStrokeStyle(
        1,
        0x765477,
        0.9
      );

    // -----------------------------------------------
    // DECORATION
    // -----------------------------------------------

    this.add.text(
      82,
      42,
      '♡  ✦',
      {
        fontFamily: UI_FONT,
        fontSize: '11px',
        color: '#d996b7',
      }
    );

    this.add.text(
      535,
      292,
      '✦  ♡',
      {
        fontFamily: UI_FONT,
        fontSize: '11px',
        color: '#9c7ab5',
      }
    );

    // -----------------------------------------------
    // TITLE
    // -----------------------------------------------

    this.add.text(
      320,
      35,
      'SETTINGS',
      {
        fontFamily: UI_FONT,
        fontSize: '20px',
        color: '#fff0f6',
        stroke: '#542f4c',
        strokeThickness: 3,
      }
    )
      .setOrigin(0.5);

    this.add.text(
      320,
      57,
      'make yourself comfortable ♡',
      {
        fontFamily: UI_FONT,
        fontSize: '9px',
        color: '#c995ad',
      }
    )
      .setOrigin(0.5);

    // -----------------------------------------------
    // SETTINGS
    // -----------------------------------------------

    this.settingTexts = [];

    const settings = [
  {
    label: 'MUSIC VOLUME',
    type: 'music',
  },
  {
    label: 'SFX VOLUME',
    type: 'sfx',
  },
  {
    label: 'RACCOON HAT',
    type: 'hat',
  },
];

if (this.fromGameplay) {
  settings.push({
    label: 'RETURN TO GAME',
    type: 'game',
  });
}

settings.push({
  label: 'RETURN TO TITLE',
  type: 'title',
});

    this.settings = settings;

    const startY = 90;
    const spacing = 43;

    settings.forEach(
      (setting, index) => {
        const y =
          startY +
          index * spacing;

        const text =
          this.add.text(
            320,
            y,
            '',
            {
              fontFamily: UI_FONT,
              fontSize: '11px',
              color: '#d6a9bd',
              stroke: '#4c2b43',
              strokeThickness: 2,
              align: 'center',
            }
          )
            .setOrigin(0.5);

        this.settingTexts.push(text);
      }
    );

    // -----------------------------------------------
    // CONTROLS REFERENCE
    // -----------------------------------------------

    this.add.text(
      320,
      280,
      'A / D MOVE     SPACE JUMP',
      {
        fontFamily: UI_FONT,
        fontSize: '6px',
        color: '#8f748c',
      }
    )
      .setOrigin(0.5);

    this.add.text(
      320,
      292,
      'ENTER INTERACT     Q THOUGHTS',
      {
        fontFamily: UI_FONT,
        fontSize: '6px',
        color: '#8f748c',
      }
    )
      .setOrigin(0.5);

    // -----------------------------------------------
    // CONTROL INSTRUCTIONS
    // -----------------------------------------------

    this.controlsText =
      this.add.text(
        320,
        320,
        '[↑ ↓] SELECT   [← →] ADJUST   [ENTER] CONFIRM   [P] RESUME',
        {
          fontFamily: UI_FONT,
          fontSize: '10px',
          color: '#784d75',
        }
      )
        .setOrigin(0.5);

    this.updateSelection();
  }

  // =================================================
  // CONTROLS
  // =================================================

  

  createControls() {
    this.upKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.UP
      );

    this.downKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.DOWN
      );

    this.leftKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.LEFT
      );

    this.rightKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.RIGHT
      );

    this.wKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.W
      );

    this.sKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.S
      );

    this.enterKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
      );

    this.escKey =
      this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ESC
      );

      this.pauseKey =
  this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.P
  );
  }

  // =================================================
  // SELECTION DISPLAY
  // =================================================

  updateSelection() {
    const hatUnlocked =
      this.saveData.achievements.includes(
        'raccoon_hat'
      );

    const hatEquipped =
      this.saveData.equippedHat ===
      'raccoon_hat';

    this.settings.forEach(
      (setting, index) => {
        const selected =
          index === this.selectedIndex;

        let text = '';

        // -------------------------------------------
        // MUSIC
        // -------------------------------------------

        if (setting.type === 'music') {
          text =
            `${selected ? '♡  ' : '   '}` +
            `MUSIC VOLUME  ${this.makeVolumeBar(
              this.musicVolume
            )} ${Math.round(
              this.musicVolume * 100
            )}%`;
        }

        // -------------------------------------------
        // SFX
        // -------------------------------------------

        if (setting.type === 'sfx') {
          text =
            `${selected ? '♡  ' : '   '}` +
            `SFX VOLUME  ${this.makeVolumeBar(
              this.sfxVolume
            )} ${Math.round(
              this.sfxVolume * 100
            )}%`;
        }

        // -------------------------------------------
        // RACCOON HAT
        // -------------------------------------------

        if (setting.type === 'hat') {
          if (!hatUnlocked) {
            text =
              `${selected ? '♡  ' : '   '}` +
              '???';
          } else {
            text =
              `${selected ? '♡  ' : '   '}` +
              `RACCOON HAT  ${
                hatEquipped
                  ? '[ EQUIPPED ]'
                  : '[ UNEQUIPPED ]'
              }`;
          }
        }

        // -------------------------------------------
        // RETURN TO TITLE
        // -------------------------------------------

        if (setting.type === 'title') {
          text =
            `${selected ? '♡  ' : '   '}` +
            'RETURN TO TITLE';
        }

        setting.text = text;

        this.settingTexts[index]
          .setText(text)
          .setColor(
            selected
              ? '#fff0f6'
              : '#d6a9bd'
          )
          .setScale(
            selected
              ? 1.04
              : 1
          );
      }
    );
  }

  // =================================================
  // VOLUME BAR
  // =================================================

  makeVolumeBar(value) {
    const segments = 10;

    const filled = Math.round(
      value * segments
    );

    return (
      '[' +
      '█'.repeat(filled) +
      '░'.repeat(
        segments - filled
      ) +
      ']'
    );
  }

  // =================================================
  // MOVE SELECTION
  // =================================================

  moveSelection(direction) {
    this.selectedIndex =
      Phaser.Math.Wrap(
        this.selectedIndex + direction,
        0,
        this.settings.length
      );

    sfxManager.play(
      this,
      'click'
    );

    this.updateSelection();
  }

  // =================================================
  // ADJUST SETTING
  // =================================================

  adjustSetting(direction) {
    const setting =
      this.settings[
        this.selectedIndex
      ];

    const amount = 0.05;

    // ---------------------------------------------
    // MUSIC
    // ---------------------------------------------

    if (setting.type === 'music') {
      this.musicVolume =
        Phaser.Math.Clamp(
          this.musicVolume +
            direction * amount,
          0,
          1
        );

      musicManager.setVolume(
        this.musicVolume
      );

      this.updateSelection();

      return;
    }

    // ---------------------------------------------
    // SFX
    // ---------------------------------------------

    if (setting.type === 'sfx') {
      this.sfxVolume =
        Phaser.Math.Clamp(
          this.sfxVolume +
            direction * amount,
          0,
          1
        );

      sfxManager.setVolume(
        this.sfxVolume
      );

      // Play the click at the new volume
      sfxManager.play(
        this,
        'click'
      );

      this.updateSelection();

      return;
    }
  }

  refreshGameplayHat(gameplayScene) {
  if (!gameplayScene) {
    return;
  }

  const saveData =
    saveManager.load();

  const equipped =
    saveData.equippedHat === 'raccoon_hat';

  // Some scenes use `player` for Jen.
  // PartyScene uses `jen` because its player is Nat.
  const jenObjects = [
    gameplayScene.player,
    gameplayScene.jen,
  ];

  jenObjects.forEach((jen) => {
    if (!jen || !jen.texture) {
      return;
    }

    const currentKey =
      jen.texture.key;

    // Only modify Jen character textures.
    if (
      !currentKey ||
      !currentKey.startsWith('jen-')
    ) {
      return;
    }

    // Example:
    // jen-default      → jen-default-hat
    // jen-default-hat  → jen-default
    // jen-morning      → jen-morning-hat
    // jen-morning-hat  → jen-morning
    // jen-base         → jen-base-hat
    // jen-base-hat     → jen-base

    const baseKey =
      currentKey.endsWith('-hat')
        ? currentKey.slice(
            0,
            -4
          )
        : currentKey;

    const targetKey =
      equipped
        ? `${baseKey}-hat`
        : baseKey;

    // Don't attempt to switch to a
    // texture that doesn't exist.
    if (
      !gameplayScene.textures.exists(
        targetKey
      )
    ) {
      console.warn(
        `Settings: Missing Jen texture "${targetKey}".`
      );

      return;
    }

    // Preserve the current animation frame.
    const currentFrame =
      jen.frame?.name ?? 0;

    jen.setTexture(
      targetKey,
      currentFrame
    );
  });

  // Keep the scene's cached hat state
  // synchronized too.
  gameplayScene.jenHasRaccoonHat =
    equipped;
}

  // =================================================
  // ENTER / CONFIRM
  // =================================================

  selectItem() {
    if (this.transitioning) {
      return;
    }

    const setting =
      this.settings[
        this.selectedIndex
      ];

    sfxManager.play(
      this,
      'click'
    );

    // ---------------------------------------------
    // RACCOON HAT
    // ---------------------------------------------

    if (
      setting.type === 'hat'
    ) {
      this.toggleRaccoonHat();
      return;
    }

    // ---------------------------------------------
    // RETURN TO GAME
    // ---------------------------------------------

    if (
    setting.type === 'game'
    ) {
    this.returnToGame();
    return;
    }

    // ---------------------------------------------
    // RETURN TO TITLE
    // ---------------------------------------------

    if (
      setting.type === 'title'
    ) {
      this.returnToTitle();
    }
  }

  // =================================================
  // RACCOON HAT
  // =================================================

  toggleRaccoonHat() {
    const unlocked =
      this.saveData.achievements.includes(
        'raccoon_hat'
      );

    if (!unlocked) {
      return;
    }

    const equipped =
      this.saveData.equippedHat ===
      'raccoon_hat';

    saveManager.update({
  equippedHat:
    equipped
      ? null
      : 'raccoon_hat',
});

this.saveData =
  saveManager.load();

// Immediately update the character
// in the paused gameplay scene.
if (this.fromGameplay) {
  const gameplayScene =
    this.scene.get(
      this.returnScene
    );

  this.refreshGameplayHat(
    gameplayScene
  );
}

this.updateSelection();
  }

  returnToGame() {
  if (this.transitioning) {
    return;
  }

  this.transitioning = true;

  sfxManager.play(
    this,
    'click'
  );

  const returnScene =
    this.returnScene;

  // Get the actual gameplay Scene.
  const gameplayScene =
    this.scene.get(
      returnScene
    );

  // Stop Settings.
  this.scene.stop(
    'SettingsScene'
  );

  // Resume the exact scene we paused.
  if (
    gameplayScene &&
    this.scene.isPaused(
      returnScene
    )
  ) {
    this.scene.resume(
      returnScene
    );
  }

  // Re-enable P on the gameplay scene.
  if (
    gameplayScene &&
    gameplayScene.settingsAccess
  ) {
    gameplayScene.settingsAccess.enable();
  }
}

  // =================================================
  // RETURN TO TITLE
  // =================================================

  returnToTitle() {
  if (this.transitioning) {
    return;
  }

  this.transitioning = true;

  sfxManager.play(
    this,
    'click'
  );

  // If we came from gameplay,
  // stop that gameplay scene too.
  if (this.fromGameplay) {
    this.scene.stop(
      this.returnScene
    );
  }

  this.cameras.main.fadeOut(
    400,
    0,
    0,
    0
  );

  this.cameras.main.once(
    Phaser.Cameras.Scene2D.Events
      .FADE_OUT_COMPLETE,
    () => {
      this.scene.start(
        'TitleScene'
      );
    }
  );
}

  // =================================================
  // UPDATE
  // =================================================

  update() {
    if (this.debugMenu) {
      this.debugMenu.update();

      if (
        this.debugMenu.isOpen
      ) {
        return;
      }
    }

    if (this.transitioning) {
      return;
    }

    // ---------------------------------------------
    // UP / DOWN
    // ---------------------------------------------

    if (
      Phaser.Input.Keyboard.JustDown(
        this.upKey
      ) ||
      Phaser.Input.Keyboard.JustDown(
        this.wKey
      )
    ) {
      this.moveSelection(-1);
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.downKey
      ) ||
      Phaser.Input.Keyboard.JustDown(
        this.sKey
      )
    ) {
      this.moveSelection(1);
    }

    // ---------------------------------------------
    // LEFT / RIGHT
    // ---------------------------------------------

    if (
      Phaser.Input.Keyboard.JustDown(
        this.leftKey
      )
    ) {
      this.adjustSetting(-1);
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.rightKey
      )
    ) {
      this.adjustSetting(1);
    }

    // ---------------------------------------------
    // ENTER
    // ---------------------------------------------

    if (
      Phaser.Input.Keyboard.JustDown(
        this.enterKey
      )
    ) {
      this.selectItem();
    }

    // ---------------------------------------------
    // ESC
    // ---------------------------------------------

    if (
      Phaser.Input.Keyboard.JustDown(
        this.escKey
      )
    ) {
      this.returnToTitle();
    }

    if (
  Phaser.Input.Keyboard.JustDown(
    this.pauseKey
  )
) {
  if (this.fromGameplay) {
    this.returnToGame();
  }

  return;
}
  }
}