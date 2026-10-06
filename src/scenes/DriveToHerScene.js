import Phaser from 'phaser';
import ChapterTitle from '../ui/ChapterTitle.js';
import DebugMenu from '../debug/DebugMenu.js';
import driveToHer from '../data/driveToHer.js';
import saveManager from '../systems/saveManager.js';

import ObjectiveUI from '../ui/ObjectiveUI.js';

import CompactThoughtUI from '../ui/CompactThoughtUI.js';

import MessageUI from '../ui/MessageUI.js';
import { UI_FONT } from '../ui/uiTheme.js';

import AchievementPopup from '../systems/AchievementPopup.js';
import SettingsAccess from '../systems/SettingsAccess.js';

export default class DriveToHerScene extends Phaser.Scene {
  constructor() {
    super('DriveToHerScene');
  }

  create() {
    this.settingsAccess =
  new SettingsAccess(this);

    saveManager.reachChapter(2);
    
    this.cameras.main.setBackgroundColor('#111015');

    // -------------------------
    // DRIVING STATE
    // -------------------------

    this.lanes = [
      215,
      325,
      435,
    ];

    this.currentLane = 1;

    this.roadSpeed = 150;

    // Temporary distance for testing.
    this.distanceRemaining = 48;

    this.driveDuration = 45;
    this.driveElapsed = 0;
    this.driveComplete = false;

    this.drivingActive = false;

    this.collisionCooldown = false;
    this.speedMultiplier = 1;
    // -------------------------
    // TRAFFIC STATE
    // -------------------------

    this.trafficCars = [];

    this.trafficSpawnTimer = 0;

    this.trafficSpawnDelay = 2400;

    this.trafficSpeedMin = 105;
    this.trafficSpeedMax = 190;

    this.triggeredThoughts = new Set();

  this.natTextTriggered = false;
  this.finalThoughtTriggered = false;
  this.distanceLabelChanged = false;


    // -------------------------
    // INPUT
    // -------------------------

    this.leftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );

    this.rightKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );

    this.aKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );

    this.dKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // -------------------------
    // WORLD
    // -------------------------

    this.createRoad();
    this.createCar();
    this.createDrivingUI();
    this.objectiveUI = new ObjectiveUI(
    this,
    false,
    false
  );

  this.objectiveUI.setObjective(
    'DRIVE TO SAN JOSE'
  );

      this.thoughtUI =
  new CompactThoughtUI(this);


    // -------------------------
    // DEBUG
    // -------------------------

    this.debugMenu =
      new DebugMenu(this);

    this.achievementPopup =
      new AchievementPopup(this);

    // -------------------------
    // CHAPTER TITLE
    // -------------------------

    this.chapterTitle = new ChapterTitle(this);

    this.chapterTitle.show(
      2,
      'WE STILL GOING?',
      () => {
        this.startDriving();
      }
    );

    this.carsHit = 0;

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

this.messageUI = new MessageUI(
  this,
  {
    sender: 'nat',
    x: 490,
    y: 82,
    width: 240,
    height: 100,
    depth: 500,
  }
);

  }

  startDriving() {
  this.drivingActive = true;

  // Start looping road ambience.
  if (!this.drivingAmbience) {
    this.drivingAmbience = this.sound.add(
      'driving',
      {
        loop: true,
        volume: 0.45,
      }
    );
  }

  this.drivingAmbience.play();

  this.time.delayedCall(2500, () => {
    if (this.controlsText) {
      this.controlsText.destroy();
      this.controlsText = null;
    }
  });
}

  updateTraffic(delta) {
  this.trafficSpawnTimer += delta;

  if (
    this.trafficSpawnTimer >=
    this.trafficSpawnDelay
  ) {
    this.trafficSpawnTimer = 0;

    this.spawnTrafficCar();
  }

  const seconds = delta / 1000;

  for (
    let i = this.trafficCars.length - 1;
    i >= 0;
    i -= 1
  ) {
    const traffic = this.trafficCars[i];

    traffic.car.y +=
      traffic.speed *
      this.speedMultiplier *
      seconds;

    if (traffic.car.y > 410) {
      traffic.car.destroy();

      this.trafficCars.splice(i, 1);
    }
  }
}

    spawnTrafficCar() {
  // ---------------------------------
  // FIND SAFE LANES
  // ---------------------------------

  const safeLanes = [];

  for (
    let lane = 0;
    lane < this.lanes.length;
    lane += 1
  ) {
    const laneIsBlocked =
      this.trafficCars.some((traffic) => {
        // Only care about cars in this lane.
        if (traffic.lane !== lane) {
          return false;
        }

        // Don't spawn another car too close
        // behind an existing one.
        return traffic.car.y < 110;
      });

    if (!laneIsBlocked) {
      safeLanes.push(lane);
    }
  }

  // If every lane is currently too crowded,
  // simply skip this spawn.
  if (safeLanes.length === 0) {
    return;
  }

  // ---------------------------------
  // PREVENT IMPOSSIBLE WALLS
  // ---------------------------------

  const lanesWithNearbyCars = new Set();

  for (const traffic of this.trafficCars) {
    // Cars around this vertical region form
    // the "next obstacle group" the player
    // is approaching.
    if (
      traffic.car.y >= -80 &&
      traffic.car.y <= 100
    ) {
      lanesWithNearbyCars.add(
        traffic.lane
      );
    }
  }

  const protectedLanes =
    safeLanes.filter((lane) => {
      const resultingLanes =
        new Set(lanesWithNearbyCars);

      resultingLanes.add(lane);

      // Never allow one obstacle group
      // to occupy all 3 lanes.
      return resultingLanes.size <
        this.lanes.length;
    });

  // If spawning would complete a wall,
  // skip this spawn entirely.
  if (protectedLanes.length === 0) {
    return;
  }

  // ---------------------------------
  // CHOOSE LANE
  // ---------------------------------

  const lane =
    Phaser.Utils.Array.GetRandom(
      protectedLanes
    );

  const x = this.lanes[lane];

  // ---------------------------------
  // CREATE CAR
  // ---------------------------------

  const trafficTextures = [
    'traffic-car1',
    'traffic-car2',
    'traffic-car3',
    'traffic-car4',
  ];

  const texture =
    Phaser.Utils.Array.GetRandom(
      trafficTextures
    );

  const car = this.add.image(
    x,
    -60,
    texture
  );

  car
    .setOrigin(0.5)
    .setScale(0.13)
    .setDepth(8);

  const speed =
    Phaser.Math.Between(
      this.trafficSpeedMin,
      this.trafficSpeedMax
    );

  this.trafficCars.push({
    car,
    lane,
    speed,
  });
}

updateDistance(delta) {
  if (this.driveComplete) {
    return;
  }

  this.driveElapsed += delta / 1000;

  const progress = Phaser.Math.Clamp(
    this.driveElapsed / this.driveDuration,
    0,
    1
  );

  const milesRemaining = Math.ceil(
    48 * (1 - progress)
  );

  this.distanceRemaining = milesRemaining;

  const destination =
  this.distanceLabelChanged
    ? 'HER'
    : 'SAN JOSE';

this.distanceText.setText(
  `DISTANCE TO ${destination}: ${this.distanceRemaining} MI`
);

  if (progress >= 1) {
    this.completeDrive();
  }
}

  createRoad() {
  // Repeating Chapter 2 highway.
  this.road = this.add.tileSprite(
    320,
    180,
    640,
    360,
    'ch2-highway-tile'
  );
  this.road.setTileScale(0.39, 0.39);

  this.road.setDepth(0);
}

  createCar() {
  this.car = this.add.image(
    this.lanes[this.currentLane],
    285,
    'jen-car'
  );

  this.car
    .setOrigin(0.5)
    .setDepth(10);

  // Starting size — we'll tune this visually.
  this.car.setScale(0.13);
}


  createDrivingUI() {
    this.distanceText = this.add
      .text(
        18,
        88,
        `DISTANCE TO SAN JOSE: ${this.distanceRemaining} MI`,
        {
          fontFamily: UI_FONT,
          fontSize: '9px',
          color: '#dd73cb',
        }
      )
      .setDepth(100)
      .setScrollFactor(0);

    this.controlsText = this.add
      .text(
        320,
        340,
        'A / D   CHANGE LANES     SPACE   HONK',
        {
          fontFamily: 'monospace',
          fontSize: '8px',
          color: '#77727f',
        }
      )
      .setOrigin(0.5)
      .setDepth(100)
      .setScrollFactor(0);
  }

  update(time, delta) {
    // -------------------------
    // DEBUG MENU
    // -------------------------

    if (this.debugMenu) {
      this.debugMenu.update();

      if (this.debugMenu.isOpen) {
        return;
      }
    }

    if (!this.drivingActive) {
      return;
    }

    if (
  Phaser.Input.Keyboard.JustDown(
    this.spaceKey
  )
  ) {
    this.sound.play('honk', {
      volume: 0.8,
    });
  }

    // -------------------------
    // LANE CHANGING
    // -------------------------

    if (
      Phaser.Input.Keyboard.JustDown(this.leftKey) ||
      Phaser.Input.Keyboard.JustDown(this.aKey)
    ) {
      this.changeLane(-1);
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.rightKey) ||
      Phaser.Input.Keyboard.JustDown(this.dKey)
    ) {
      this.changeLane(1);
    }

    // -------------------------
    // ROAD MOVEMENT
    // -------------------------

    this.updateRoad(delta);
    this.updateTraffic(delta);
    this.checkTrafficCollisions();
    this.updateDistance(delta);
    this.updateStoryTriggers();
  }

  checkTrafficCollisions() {
  if (this.collisionCooldown) {
    return;
  }

  const rawCarBounds =
    this.car.getBounds();

  const carBounds =
    new Phaser.Geom.Rectangle(
      rawCarBounds.x +
        rawCarBounds.width * 0.30,

      rawCarBounds.y +
        rawCarBounds.height * 0.20,

      rawCarBounds.width * 0.40,
      rawCarBounds.height * 0.60
    );

  for (const traffic of this.trafficCars) {
    const rawTrafficBounds =
      traffic.car.getBounds();

    const trafficBounds =
      new Phaser.Geom.Rectangle(
        rawTrafficBounds.x +
          rawTrafficBounds.width * 0.30,

        rawTrafficBounds.y +
          rawTrafficBounds.height * 0.20,

        rawTrafficBounds.width * 0.40,
        rawTrafficBounds.height * 0.60
      );

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        carBounds,
        trafficBounds
      )
    ) {
      this.handleTrafficCollision(
        traffic
      );

      return;
    }
  }
}

handleTrafficCollision(traffic) {
  this.collisionCooldown = true;

  this.sound.play('crash', {
    volume: 1.0,
  });

  // Useful later for the no-collision achievement.
  this.carsHit += 1;

  // Little impact shake.
  this.cameras.main.shake(
    120,
    0.008
  );

  // Knock the traffic car forward so we
  // don't immediately collide with it again.
  traffic.car.y -= 45;

  // Briefly slow the highway down.
  this.speedMultiplier = 0.4;

  // Wobble Jen's car.
  this.tweens.add({
    targets: this.car,
    angle: {
      from: -5,
      to: 5,
    },
    duration: 60,
    yoyo: true,
    repeat: 2,

    onComplete: () => {
      this.car.angle = 0;
    },
  });

  this.time.delayedCall(
    500,
    () => {
      this.speedMultiplier = 1;
    }
  );

  this.time.delayedCall(
    750,
    () => {
      this.collisionCooldown = false;
    }
  );
}

  changeLane(direction) {
    const newLane = Phaser.Math.Clamp(
      this.currentLane + direction,
      0,
      this.lanes.length - 1
    );

    if (newLane === this.currentLane) {
      return;
    }

    this.currentLane = newLane;

    this.tweens.killTweensOf(this.car);

    this.tweens.add({
      targets: this.car,

      x: this.lanes[this.currentLane],

      duration: 160,

      ease: 'Sine.easeOut',
    });
  }

  updateRoad(delta) {
  if (!this.road) {
    return;
  }

  const movement =
    this.roadSpeed *
    this.speedMultiplier *
    (delta / 1000);

  this.road.tilePositionY -= movement;
}

  showDrivingThought(text) {
  if (!this.thoughtUI) {
    return;
  }

  this.thoughtUI.show(
    text,
    4200
  );
}

  showNatText(text) {
  if (!this.messageUI) {
    return;
  }

  this.messageUI.show(
    text,
    {
      duration: 4500,
      fontSize: '12px',
      playSound: true,
    }
  );
}

  updateStoryTriggers() {
  for (
    let i = 0;
    i < driveToHer.thoughts.length;
    i += 1
  ) {
    const thought =
      driveToHer.thoughts[i];

    if (
      this.distanceRemaining <=
        thought.distance &&
      !this.triggeredThoughts.has(i)
    ) {
      this.triggeredThoughts.add(i);

      this.showDrivingThought(
        thought.text
      );

      break;
    }
  }

  if (
  this.distanceRemaining <=
    driveToHer.natText.distance &&
  !this.natTextTriggered
) {
  this.natTextTriggered = true;

 this.showNatText(
  driveToHer.natText.text
);

}

if (
  this.distanceRemaining <=
    driveToHer.finalThought.distance &&
  !this.finalThoughtTriggered
) {
  this.finalThoughtTriggered = true;

  this.showDrivingThought(
    driveToHer.finalThought.text
  );

  this.time.delayedCall(
    1800,
    () => {
      this.changeDistanceLabel();
    }
  );
}
}

changeDistanceLabel() {
  if (this.distanceLabelChanged) {
    return;
  }

  this.distanceLabelChanged = true;

  this.objectiveUI.setObjective(
  'DRIVE TO HER'
);

  this.distanceText.setText(
    `DISTANCE TO HER: ${this.distanceRemaining} MI`
  );
}

  completeDrive() {
  if (this.driveComplete) {
    return;
  }

  this.driveComplete = true;
  this.drivingActive = false;

  if (this.drivingAmbience) {
    this.drivingAmbience.stop();
    this.drivingAmbience.destroy();
    this.drivingAmbience = null;
  }

  this.distanceRemaining = 0;

  this.distanceText.setText(
    'DISTANCE TO HER: 0 MI'
  );

  // Fade the completed drive away first.
  this.cameras.main.fadeOut(
    1000,
    0,
    0,
    0
  );

  // Let the fade finish completely.
  this.time.delayedCall(
    1100,
    () => {
      // Bring the camera back so the achievement
      // popup can actually be seen.
      this.cameras.main.fadeIn(
        300,
        0,
        0,
        0
      );

      this.time.delayedCall(
        350,
        () => {
          this.checkDrivingAchievement();
        }
      );
    }
  );
}


checkDrivingAchievement() {
  if (this.carsHit <= 1) {
    this.achievementPopup.show(
      'lost_keys',
      () => {
        this.finishChapterTwo();
      }
    );

    return;
  }

  this.finishChapterTwo();
}

finishChapterTwo() {
  this.scene.start(
    'NarrationScene',
    {
      transitionId: 'transition3',
    }
  );
}

}