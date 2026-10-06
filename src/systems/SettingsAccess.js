import Phaser from 'phaser';

export default class SettingsAccess {
  constructor(scene) {
    this.scene = scene;
    this.enabled = true;
    this.opening = false;

    this.pauseKey =
  scene.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.P
  );

this.pauseKey.on(
  'down',
  this.handlePause,
  this
);

    scene.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      this.destroy,
      this
    );
  }

  handlePause() {
    if (!this.enabled) {
      return;
    }

    if (this.opening) {
      return;
    }

    this.open();
  }

  open() {
  if (this.opening) {
    return;
  }

  this.opening = true;
  this.enabled = false;

  const currentScene =
    this.scene.scene.key;

  // Open Settings.
  this.scene.scene.launch(
    'SettingsScene',
    {
      returnScene: currentScene,
      fromGameplay: true,
    }
  );

  // Make absolutely sure Settings is rendered
  // above the paused gameplay scene.
  this.scene.scene.bringToTop(
    'SettingsScene'
  );

  // Now pause the gameplay scene.
  this.scene.scene.pause(
    currentScene
  );
}

  enable() {
    this.opening = false;
    this.enabled = true;
  }

  destroy() {
   if (this.pauseKey) {
  this.pauseKey.off(
    'down',
    this.handlePause,
    this
  );
}
  }
}