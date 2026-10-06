export default class ThoughtPrompt {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
  }

  show() {
    // Don't accidentally create duplicates.
    if (this.container) {
      return;
    }

    this.container = this.scene.add
      .container(
        320,
        315
      )
      .setScrollFactor(0)
      .setDepth(200);

    const background =
      this.scene.add.rectangle(
        0,
        0,
        150,
        28,
        0x17141f,
        0.95
      )
      .setStrokeStyle(
        1,
        0xd889b5
      );

    const keyBox =
      this.scene.add.rectangle(
        -58,
        0,
        20,
        18,
        0x30243a
      )
      .setStrokeStyle(
        1,
        0xffb4d9
      );

    const keyText =
      this.scene.add.text(
        -58,
        0,
        'Q',
        {
          fontFamily: 'Yabikoma',
          fontSize: '11px',
          color: '#fff1cf',
        }
      )
      .setOrigin(0.5);

    const label =
      this.scene.add.text(
        14,
        0,
        'READ MY MIND',
        {
          fontFamily: 'Yabikoma',
          fontSize: '10px',
          color: '#fff1cf',
        }
      )
      .setOrigin(0.5);

    this.container.add([
      background,
      keyBox,
      keyText,
      label,
    ]);

    // Little "thought available" pop.
    this.container.setScale(0.85);
    this.container.setAlpha(0);

    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 180,
      ease: 'Back.easeOut',
    });
  }

  hide() {
    if (!this.container) {
      return;
    }

    this.container.destroy();
    this.container = null;
  }

  destroy() {
    this.hide();
  }
}