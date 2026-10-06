import Phaser from 'phaser';
import sfxManager from '../systems/SFXManager.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.usesJenAnimations = texture.startsWith('jen-');
    this.usesNatAnimations = texture.startsWith('nat-');
    this.usesCharacterAnimations =
    this.usesJenAnimations || this.usesNatAnimations;

    this.walkFrames = [2, 3, 4, 5];
    this.walkFrameIndex = 0;
    this.lastWalkFrameTime = 0;
    this.walkFrameDuration = 125;

    this.idleFrames = [0, 1];
    this.idleFrameIndex = 0;
    this.lastIdleFrameTime = 0;
    this.idleFrameDuration = 500;

    if (this.usesJenAnimations) {
    this.setScale(1.15);
  }

  if (this.usesNatAnimations) {
    this.setScale(1.15);
  }

    // Movement settings
    this.moveSpeed = 140;
    this.jumpSpeed = 370;

    // Makes the character feel less slippery.
    this.setDragX(900);
    this.setMaxVelocity(this.moveSpeed, 500);

    
    // Keep the collision box narrower than the artwork.
      if (this.usesCharacterAnimations) {
        this.body.setSize(40, 100);
        this.body.setOffset(75, 24);
      } else {
        this.body.setSize(24, 46);
        this.body.setOffset(4, 2);
      }

    // Controls
    this.keys = scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    this.cursors = scene.input.keyboard.createCursorKeys();

    // Coyote time:
    // lets the player jump for a tiny moment after walking off an edge.
    this.coyoteTime = 100;
    this.lastGroundedTime = 0;

    // Jump buffering:
    // remembers a slightly-early jump press.
    this.jumpBufferTime = 120;
    this.lastJumpPressedTime = -Infinity;

    // Used if Nat falls out of the world.
    this.respawnX = x;
    this.respawnY = y;

  }

  update(time) {
    const movingLeft =
      this.keys.left.isDown || this.cursors.left.isDown;

    const movingRight =
      this.keys.right.isDown || this.cursors.right.isDown;

    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.keys.jump) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.up);

    // -------------------------
    // Horizontal movement
    // -------------------------

    if (movingLeft && !movingRight) {
      this.setVelocityX(-this.moveSpeed);
      this.setFlipX(true);
    } else if (movingRight && !movingLeft) {
      this.setVelocityX(this.moveSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // -------------------------
    // Ground detection
    // -------------------------

    if (this.body.blocked.down) {
      this.lastGroundedTime = time;
    }

    // -------------------------
    // Jump buffering
    // -------------------------

    if (jumpPressed) {
      this.lastJumpPressedTime = time;
    }

    const withinCoyoteTime =
      time - this.lastGroundedTime <= this.coyoteTime;

    const hasBufferedJump =
      time - this.lastJumpPressedTime <= this.jumpBufferTime;

    if (withinCoyoteTime && hasBufferedJump) {
    this.setVelocityY(-this.jumpSpeed);

    sfxManager.play(this.scene, 'jump');

    // Prevent one buffered press from firing twice.
    this.lastJumpPressedTime = -Infinity;
    this.lastGroundedTime = -Infinity;
  }

    // -------------------------
    // Variable jump height
    // -------------------------

    const jumpHeld =
        this.keys.jump.isDown || this.cursors.up.isDown;

    // If the player releases jump while still traveling upward,
    // cut some upward velocity to create a smaller hop.
    if (!jumpHeld && this.body.velocity.y < -120) {
    this.setVelocityY(this.body.velocity.y * 0.55);
    }

    // -------------------------
    // Character animation
    // -------------------------

    if (this.usesCharacterAnimations) {
      const onGround = this.body.blocked.down;

      if (!onGround) {
        // Frame 6 = jump.
        // We intentionally use the same frame
        // while rising AND falling.
        this.setFrame(6);

      } else if (movingLeft || movingRight) {
        // Frames 2–5 = walk cycle.
        if (
          time - this.lastWalkFrameTime >=
          this.walkFrameDuration
        ) {
          this.walkFrameIndex =
            (this.walkFrameIndex + 1) %
            this.walkFrames.length;

          this.lastWalkFrameTime = time;
        }

        this.setFrame(
          this.walkFrames[this.walkFrameIndex]
        );

      } else {
        // Frames 0–1 = idle cycle.
        if (
          time - this.lastIdleFrameTime >=
          this.idleFrameDuration
        ) {
          this.idleFrameIndex =
            (this.idleFrameIndex + 1) %
            this.idleFrames.length;

          this.lastIdleFrameTime = time;
        }

        this.setFrame(
          this.idleFrames[this.idleFrameIndex]
        );
      }
    }

    // -------------------------
    // Fall protection
    // -------------------------

    if (this.y > 420) {
      this.respawn();
    }
  }

  respawn() {
    this.setPosition(this.respawnX, this.respawnY);
    this.setVelocity(0, 0);
  }
}