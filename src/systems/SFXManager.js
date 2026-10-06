import Phaser from 'phaser';
import saveManager from './saveManager.js';

class SFXManager {
  constructor() {
    // Master SFX volume
    this.volume =
  saveManager.load().sfxVolume ?? 0.7;

    // Default settings for individual sounds
    this.soundSettings = {
      interact: {
        volume: 1.6,
      },

      'getting-dressed': {
        volume: 1.0,
      },

      'jump': {
        volume: 0.5,
      },

      click: {
    volume: 1.0,
    },
    
     message: { volume: 1.0 },

     frying: { volume: 1.0 },

    };
  }

  play(scene, key, options = {}) {
    if (!scene?.sound) return null;

    const defaults =
      this.soundSettings[key] ?? {};

    const volume =
      options.volume ??
      defaults.volume ??
      1;

    const rate =
      options.rate ??
      defaults.rate ??
      1;

    const detune =
      options.detune ??
      defaults.detune ??
      0;

    const loop =
      options.loop ??
      defaults.loop ??
      false;

    const finalVolume = this.isMuted
      ? 0
      : this.volume * volume;

    return scene.sound.play(key, {
      volume: finalVolume,
      rate,
      detune,
      loop,
    });
  }

  setVolume(value) {
  this.volume = Phaser.Math.Clamp(
    value,
    0,
    1
  );

  saveManager.update({
    sfxVolume: this.volume,
  });
}

  setMuted(muted) {
    this.isMuted = muted;
  }

  toggleMuted() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

const sfxManager = new SFXManager();

export default sfxManager;