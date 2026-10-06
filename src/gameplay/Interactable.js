import Phaser from 'phaser';

export default class Interactable {
  constructor(scene, x, y, options = {}) {
    this.scene = scene;

    this.x = x;
    this.y = y;

    this.interactionDistance = options.interactionDistance ?? 60;
    this.promptText = options.promptText ?? 'INTERACT';
    this.onInteract = options.onInteract ?? null;

    this.enabled = true;
    this.playerInRange = false;
  }

  update(player) {
    if (!this.enabled || !player) {
      this.playerInRange = false;
      return false;
    }

    const distance = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      this.x,
      this.y
    );

    this.playerInRange =
      distance <= this.interactionDistance;

    return this.playerInRange;
  }

  interact() {
    if (
      !this.enabled ||
      !this.playerInRange ||
      !this.onInteract
    ) {
      return;
    }

    this.onInteract();
  }

  disable() {
    this.enabled = false;
    this.playerInRange = false;
  }
}