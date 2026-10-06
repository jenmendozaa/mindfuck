import Phaser from 'phaser';
import saveManager from './saveManager.js';

class MusicManager {
  constructor() {
    this.currentTrack = null;
    this.currentKey = null;
    this.currentTrackVolume = 1;

    // The normal soundtrack used unless a scene
    // deliberately interrupts it.
    this.defaultKey = 'music-title';
    this.defaultVolume = 0.7;

    this.volume =
      saveManager.load().musicVolume ?? 0.5;

    this.isMuted = false;

    this.fadeDuration = 750;

    // Custom loop regions for tracks that contain
    // silence or outros we don't want in-game.
    //
    // music-title.mp3:
    // Actual music ends at approximately 2:42.05.
    // The rest of the file is silent.
    this.loopRegions = {
      'music-title': {
        start: 0,
        end: 162.05,
      },
    };
  }

  // =========================================
  // DEFAULT MUSIC
  // =========================================

  playDefault(scene, options = {}) {
    const {
      volume = this.defaultVolume,
      fadeIn = true,
    } = options;

    this.play(scene, this.defaultKey, {
      volume,
      loop: true,
      fadeIn,
    });
  }

  resumeDefault(scene, options = {}) {
    this.playDefault(scene, options);
  }

  // =========================================
  // SPECIAL / INTERRUPTING MUSIC
  // =========================================

  interrupt(scene, key, options = {}) {
    const {
      volume = 1,
      loop = true,
      fadeIn = true,
    } = options;

    this.play(scene, key, {
      volume,
      loop,
      fadeIn,
    });
  }

  // =========================================
  // GENERAL PLAYBACK
  // =========================================

  play(scene, key, options = {}) {
    const {
      volume = 1,
      loop = true,
      fadeIn = true,
    } = options;

    // Already playing this exact track.
    // Leave it alone so scene changes don't
    // restart the music.
    if (
      this.currentTrack &&
      this.currentKey === key &&
      this.currentTrack.isPlaying
    ) {
      return;
    }

    if (this.currentTrack) {
      this.fadeOut(() => {
        this.startTrack(
          scene,
          key,
          volume,
          loop,
          fadeIn
        );
      });

      return;
    }

    this.startTrack(
      scene,
      key,
      volume,
      loop,
      fadeIn
    );
  }

  startTrack(
    scene,
    key,
    trackVolume,
    loop,
    fadeIn
  ) {
    this.currentKey = key;
    this.currentTrackVolume = trackVolume;

    const finalVolume =
      this.getFinalVolume();

    const region =
      this.loopRegions[key];

    // Create the sound without the normal
    // whole-file loop.
    this.currentTrack =
      scene.sound.add(key, {
        loop: false,
        volume: fadeIn
          ? 0
          : finalVolume,
      });

    // -----------------------------------------
    // CUSTOM LOOP REGION
    // -----------------------------------------

    if (region && loop) {
      this.currentTrack.addMarker({
        name: 'custom-loop',

        start: region.start,

        duration:
          region.end -
          region.start,

        config: {
          loop: true,
        },
      });

      this.currentTrack.play(
        'custom-loop'
      );
    }

    // -----------------------------------------
    // NORMAL WHOLE-TRACK PLAYBACK
    // -----------------------------------------

    else {
      this.currentTrack.setLoop(
        loop
      );

      this.currentTrack.play();
    }

    // -----------------------------------------
    // FADE IN
    // -----------------------------------------

    if (fadeIn) {
      scene.tweens.add({
        targets:
          this.currentTrack,

        volume:
          finalVolume,

        duration:
          this.fadeDuration,

        ease: 'Linear',
      });
    }
  }

  // =========================================
  // VOLUME
  // =========================================

  getFinalVolume() {
    if (this.isMuted) {
      return 0;
    }

    return (
      this.volume *
      this.currentTrackVolume
    );
  }

  setVolume(value) {
    this.volume =
      Phaser.Math.Clamp(
        value,
        0,
        1
      );

    saveManager.update({
      musicVolume:
        this.volume,
    });

    if (this.currentTrack) {
      this.currentTrack.setVolume(
        this.getFinalVolume()
      );
    }
  }

  setMuted(muted) {
    this.isMuted = muted;

    if (this.currentTrack) {
      this.currentTrack.setVolume(
        this.getFinalVolume()
      );
    }
  }

  // =========================================
  // FADING / STOPPING
  // =========================================

  fadeOut(onComplete = null) {
    if (!this.currentTrack) {
      if (onComplete) {
        onComplete();
      }

      return;
    }

    const track =
      this.currentTrack;

    const scene =
      track.manager.game.scene
        .getScenes(true)[0];

    if (!scene) {
      this.stop();

      if (onComplete) {
        onComplete();
      }

      return;
    }

    scene.tweens.add({
      targets: track,

      volume: 0,

      duration:
        this.fadeDuration,

      ease: 'Linear',

      onComplete: () => {
        track.stop();
        track.destroy();

        if (
          this.currentTrack ===
          track
        ) {
          this.currentTrack =
            null;

          this.currentKey =
            null;

          this.currentTrackVolume =
            1;
        }

        if (onComplete) {
          onComplete();
        }
      },
    });
  }

  stop() {
    if (!this.currentTrack) {
      return;
    }

    this.currentTrack.stop();
    this.currentTrack.destroy();

    this.currentTrack = null;
    this.currentKey = null;
    this.currentTrackVolume = 1;
  }

  // =========================================
  // PAUSE / RESUME
  // =========================================

  pause() {
    if (
      this.currentTrack?.isPlaying
    ) {
      this.currentTrack.pause();
    }
  }

  resume() {
    if (
      this.currentTrack?.isPaused
    ) {
      this.currentTrack.resume();
    }
  }
}

const musicManager =
  new MusicManager();

export default musicManager;