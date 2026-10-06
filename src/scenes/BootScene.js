import Phaser from 'phaser';

export default class aaootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {

    this.load.audio('music-title', 'audio/music/title.mp3');

   
    this.load.audio('jump', 'audio/sfx/jump.mp3');

    this.load.audio(
    'click',
    'audio/sfx/click.mp3'
  );

  this.load.image(
  'title-desk-final',
  'assets/backgrounds/title-desk-final.png'
);



// =================================
// PICTURES
// =================================

this.load.image(
  'picture-1',
  'assets/pictures/photo-1.JPG'
);

this.load.image(
  'picture-2',
  'assets/pictures/photo-2.JPG'
);

this.load.image(
  'picture-3',
  'assets/pictures/photo-3.JPG'
);

this.load.image(
  'picture-4',
  'assets/pictures/photo-4.JPG'
);

this.load.image(
  'picture-5',
  'assets/pictures/photo-5.JPG'
);

this.load.image(
  'picture-6',
  'assets/pictures/photo-6.JPG'
);

this.load.image(
  'picture-7',
  'assets/pictures/photo-7.JPG'
);

this.load.image(
  'picture-8',
  'assets/pictures/photo-8.JPG'
);

this.load.image(
  'picture-9',
  'assets/pictures/photo-9.JPG'
);

this.load.image(
  'picture-10',
  'assets/pictures/photo-10.jpeg'
);

this.load.image(
  'picture-11',
  'assets/pictures/photo-11.JPG'
);

this.load.image(
  'picture-12',
  'assets/pictures/photo-12.jpeg'
);

this.load.image(
  'picture-13',
  'assets/pictures/photo-13.jpg'
);

this.load.image(
  'picture-14',
  'assets/pictures/photo-14.JPG'
);

this.load.audio(
  'typing',
  'audio/sfx/typing.mp3'
);


this.load.image(
  'prologue-limbo',
  'assets/backgrounds/prologue-limbo.png'
);

this.load.image(
  'prologue-platform',
  'assets/interactables/prologue-platform.png'
);

this.load.image(
  'prologue-phone',
  'assets/interactables/prologue-phone.png'
);

this.load.image(
  'profile-random-1',
  'assets/prologue/profile-random-1.png'
);

this.load.image(
  'profile-random-2',
  'assets/prologue/profile-random-2.png'
);

this.load.image(
  'profile-jen',
  'assets/prologue/profile-jen.png'
);
    
    this.load.spritesheet(
  'jen-default',
  'assets/characters/jen-default.png',
  {
    frameWidth: 192,
    frameHeight: 128,
  }
);

this.load.spritesheet(
  'jen-default-hat',
  'assets/characters/jen-default-hat.png',
  {
    frameWidth: 192,
    frameHeight: 128,
  }
);

this.load.spritesheet(
  'jen-base',
  'assets/characters/jen-base.png',
  {
    frameWidth: 192,
    frameHeight: 128,
  }
);

this.load.spritesheet(
  'jen-base-hat',
  'assets/characters/jen-base-hat.png',
  {
    frameWidth: 192,
    frameHeight: 128,
  }
);

    this.load.image(
    'bedroom-ch1',
    'assets/backgrounds/bedroom-ch1.png'
  );

    this.load.spritesheet(
  'nat-default',
  'assets/characters/nat-default.png',
  {
    frameWidth: 192,
    frameHeight: 128,
  }
);

this.load.image(
  'clothing-shirt',
  'assets/interactables/clothing/shirt.png'
);

this.load.image(
  'clothing-pants',
  'assets/interactables/clothing/pants.png'
);

this.load.image(
  'clothing-sock',
  'assets/interactables/clothing/sock.png'
);

this.load.image(
  'clothing-bra',
  'assets/interactables/clothing/bra.png'
);

this.load.image(
  'thought-frame',
  'assets/ui/thought-frame.png'
);

this.load.image(
  'dialogue-frame',
  'assets/ui/dialogue-frame.png'
);

this.load.image(
  'jen-dialogue',
  'assets/ui/portraits/jen-dialogue.png'
);

this.load.image(
  'nat-dialogue',
  'assets/ui/portraits/nat-dialogue.png'
);

this.load.audio(
  'getting-dressed',
  'audio/sfx/getting-dressed.mp3'
);

this.load.audio(
  'interact',
  'audio/sfx/interact.mp3'
);

this.load.audio(
  'message',
  'audio/sfx/message.mp3'
);

this.load.image(
  'party-house',
  'assets/backgrounds/party-house.png'
);

this.load.image(
  'kitchen-shared',
  'assets/backgrounds/kitchen-shared.png'
);

this.load.image(
  'kitchen-table',
  'assets/interactables/kitchen-table.png'
);

this.load.image(
  'ingredient-meat',
  'assets/interactables/ingredient-meat.png'
);

this.load.image(
  'ingredient-cabbage',
  'assets/interactables/ingredient-cabbage.png'
);

this.load.image(
  'ingredient-carrots',
  'assets/interactables/ingredient-carrots.png'
);

this.load.image(
  'wrapping-station',
  'assets/interactables/wrapping-station.png'
);

this.load.image(
  'wrapping-minigame',
  'assets/interactables/wrapping-minigame.png'
);

this.load.image(
  'frying-pan',
  'assets/interactables/frying-pan.png'
);

this.load.image(
  'frying-minigame',
  'assets/backgrounds/frying-minigame.png'
);

this.load.audio(
  'frying',
  'audio/sfx/frying.mp3'
);

this.load.image(
  'lumpia-final-result',
  'assets/interactables/lumpia-final-result.png'
);

this.load.image(
  'ch2-highway-tile',
  'assets/backgrounds/ch2-highway-tile.png'
);

this.load.audio(
  'driving',
  'audio/sfx/driving.mp3'
);

this.load.image(
  'jen-car',
  'assets/vehicles/jen-car.png'
);

this.load.audio(
  'crash',
  'audio/sfx/crash.mp3'
);

this.load.audio(
  'honk',
  'audio/sfx/honk.mp3'
);

this.load.image(
  'traffic-car1',
  'assets/vehicles/traffic-car1.png'
);
this.load.image(
  'traffic-car2',
  'assets/vehicles/traffic-car2.png'
);
this.load.image(
  'traffic-car3',
  'assets/vehicles/traffic-car3.png'
);
this.load.image(
  'traffic-car4',
  'assets/vehicles/traffic-car4.png'
);

this.load.image(
  'thought-frame-compact',
  'assets/ui/thought-frame-compact.png'
);

this.load.image(
  'nat-message',
  'assets/ui/nat-message.png'
);

this.load.image(
  'jen-message',
  'assets/ui/jen-message.png'
);

this.load.image(
  'secret-platform-small',
  'assets/platforms/secret-platform-small.png'
);

this.load.image(
  'secret-platform',
  'assets/platforms/secret-platform.png'
);

this.load.image(
  'secret-platform-big',
  'assets/platforms/secret-platform-big.png'
);

this.load.image(
  'ch3',
  'assets/backgrounds/ch3.png'
);

this.load.audio(
  'typing',
  'audio/sfx/typing.mp3'
);

this.load.audio(
  'record-scratch',
  'audio/sfx/record-scratch.mp3'
);

// =========================================
// CHAPTER 4 — BIT CITY
// =========================================

this.load.image(
  'ch4-base',
  'assets/backgrounds/ch4-base.png'
);

this.load.image(
  'ch4-bedroom',
  'assets/backgrounds/ch4-bedroom.png'
);

this.load.image(
  'ch4-bed-nat',
  'assets/backgrounds/ch4-bed-nat.png'
);

this.load.image(
  'ch4-magic',
  'assets/backgrounds/ch4-magic.png'
);

this.load.image(
  'ch4-puppet',
  'assets/backgrounds/ch4-puppet.png'
);

this.load.image(
  'ch4-mime',
  'assets/backgrounds/ch4-mime.png'
);

this.load.image(
  'ch4-pp',
  'assets/backgrounds/ch4-pp.png'
);

this.load.image(
  'ch4-nose',
  'assets/objects/ch4-nose.png'
);

this.load.audio('ch4', 'audio/music/ch4.mp3');

this.load.audio('ending', 'audio/music/ending.mp3');

this.load.image(
  'ch4-pp-eggplant',
  'assets/objects/ch4-pp-eggplant.png'
);

this.load.image(
  'ch4-magic-table',
  'assets/objects/ch4-magic-table.png'
);

this.load.image(
  'ch4-cards',
  'assets/objects/ch4-cards.png'
);

this.load.image(
  'magic-ace-hearts',
  'assets/objects/magic/ace-hearts.png'
);

this.load.image(
  'magic-queen-diamonds',
  'assets/objects/magic/queen-diamonds.png'
);

this.load.image(
  'magic-king-spades',
  'assets/objects/magic/king-spades.png'
);

this.load.image(
  'magic-card-front',
  'assets/objects/magic/card-front.png'
);

this.load.image(
  'ch4-sock-puppet',
  'assets/objects/ch4-sock-puppet.png'
);

this.load.image(
  'trash',
  'assets/interactables/trash.png'
);

this.load.audio(
  'ch5-ch6',
  'audio/music/ch5-ch6.mp3'
);

// --------------------------------
// CHAPTER 5 — CAR STATES
// --------------------------------

this.load.image(
  'ch5-car-neutral',
  'assets/backgrounds/ch5/ch5-car-neutral.png'
);

this.load.image(
  'ch5-car-singing',
  'assets/backgrounds/ch5/ch5-car-singing.png'
);

this.load.image(
  'ch5-car-relaxed',
  'assets/backgrounds/ch5/ch5-car-relaxed.png'
);

this.load.image(
  'ch5-road-background',
  'assets/backgrounds/ch5/road-background.png'
);

// =================================
// CHAPTER 6 — MORNING CHARACTERS
// =================================

this.load.spritesheet(
  'jen-morning',
  'assets/characters/jen-morning.png',
  {
    frameWidth: 192,
    frameHeight: 128,
  }
);

this.load.spritesheet(
  'jen-morning-hat',
  'assets/characters/jen-morning-hat.png',
  {
    frameWidth: 192,
    frameHeight: 128,
  }
);

this.load.spritesheet(
  'nat-morning',
  'assets/characters/nat-morning.png',
  {
    frameWidth: 192,
    frameHeight: 128,
  }
);

this.load.image(
  'nat-sleepy',
  'assets/characters/nat-sleepy.png'
);

// =================================
// CHAPTER 6 — COFFEE
// =================================

this.load.image(
  'coffee-machine-idle',
  'assets/interactables/coffee-machine-idle.png'
);

this.load.image(
  'coffee-machine-brewing',
  'assets/interactables/coffee-machine-brewing.png'
);

this.load.image(
  'coffee-mug-empty',
  'assets/interactables/coffee-mug-empty.png'
);

this.load.image(
  'coffee-mug-full',
  'assets/interactables/coffee-mug-full.png'
);

this.load.image(
  'coffee-mug-nat',
  'assets/interactables/coffee-mug-nat.png'
);

this.load.audio(
  'coffee-making',
  'audio/sfx/coffee-making.mp3'
);

this.load.image(
  'breakfast-ingredients',
  'assets/interactables/breakfast-ingredients.png'
);

this.load.image(
  'breakfast-plate',
  'assets/interactables/breakfast-plate.png'
);

this.load.image(
  'library-balcony-01',
  'assets/images/mindfuck/library-balcony-01.png'
);

this.load.image(
  'library-balcony-02',
  'assets/images/mindfuck/library-balcony-02.png'
);

this.load.image(
  'library-balcony-03',
  'assets/images/mindfuck/library-balcony-03.png'
);

this.load.image(
  'library-deep-01',
  'assets/images/mindfuck/library-deep-01.png'
);

this.load.image(
  'library-room-04',
  'assets/images/mindfuck/library-room-04.png'
);

this.load.image(
  'library-archive-05',
  'assets/images/mindfuck/library-archive-05.png'
);

this.load.image(
  'library-archive-deep-05',
  'assets/images/mindfuck/library-archive-deep-05.png'
);

this.load.image(
  'library-chamber-06',
  'assets/images/mindfuck/library-chamber-06.png'
);

this.load.image(
  'library-chamber-deep-06',
  'assets/images/mindfuck/library-chamber-deep-06.png'
);

this.load.image(
  'library-transition-05-06-back',
  'assets/images/mindfuck/library-transition-05-06-back.png'
);

this.load.image(
  'library-transition-05-06-front',
  'assets/images/mindfuck/library-transition-05-06-front.png'
);

this.load.image(
  'library-room-07',
  'assets/images/mindfuck/library-room-07.png'
);

this.load.image(
  'library-column-06-07',
  'assets/images/mindfuck/library-column-06-07.png'
);

this.load.image(
  'library-room-08',
  'assets/images/mindfuck/library-room-08.png'
);

this.load.image(
  'library-transition-07-08-back',
  'assets/images/mindfuck/library-transition-07-08-back.png'
);

this.load.image(
  'library-transition-07-08-front',
  'assets/images/mindfuck/library-transition-07-08-front.png'
);

this.load.image(
  'library-room-09',
  'assets/images/mindfuck/library-room-09.png'
);

this.load.image(
  'library-room-10',
  'assets/images/mindfuck/library-room-10.png'
);

this.load.image(
  'library-bookshelf-09-10',
  'assets/images/mindfuck/library-bookshelf-09-10.png'
);

this.load.image(
  'library-room-11',
  'assets/images/mindfuck/library-room-11.png'
);

this.load.image(
  'library-curtain-10-11',
  'assets/images/mindfuck/library-curtain-10-11.png'
);

this.load.image(
  'library-room-12',
  'assets/images/mindfuck/library-room-12.png'
);

this.load.image(
  'library-ladder-11-12',
  'assets/images/mindfuck/library-ladder-11-12.png'
);

this.load.image(
  'library-touch-chest',
  'assets/interactables/library-touch-chest.png'
);

this.load.image(
  'keys',
  'assets/objects/keys.png'
);

this.load.image(
  'voice-memo',
  'assets/objects/voice-memo.png'
);

this.load.image(
  'raccoon-hat',
  'assets/objects/raccoon-hat.png'
);

this.load.image(
  'odometer',
  'assets/objects/odometer.png'
);

  }

 async create() {
  await document.fonts.load(
    '16px "MagicWords"'
  );

  await document.fonts.ready;

  console.log(
    'MagicWords loaded:',
    document.fonts.check(
      '16px "MagicWords"'
    )
  );

    this.anims.create({
  key: 'jen-idle',
  frames: this.anims.generateFrameNumbers(
    'jen-default',
    {
      start: 0,
      end: 1,
    }
  ),
  frameRate: 2,
  repeat: -1,
});

this.anims.create({
  key: 'jen-walk',
  frames: this.anims.generateFrameNumbers(
    'jen-default',
    {
      start: 2,
      end: 5,
    }
  ),
  frameRate: 8,
  repeat: -1,
});

this.anims.create({
  key: 'jen-jump',
  frames: [
    {
      key: 'jen-default',
      frame: 6,
    },
  ],
  frameRate: 1,
});

this.anims.create({
  key: 'jen-interact',
  frames: [
    {
      key: 'jen-default',
      frame: 7,
    },
  ],
  frameRate: 1,
});

this.anims.create({
  key: 'nat-idle',
  frames: this.anims.generateFrameNumbers('nat-default', {
    start: 0,
    end: 1,
  }),
  frameRate: 2,
  repeat: -1,
});

this.anims.create({
  key: 'nat-walk',
  frames: this.anims.generateFrameNumbers('nat-default', {
    start: 2,
    end: 5,
  }),
  frameRate: 8,
  repeat: -1,
});

this.anims.create({
  key: 'nat-jump',
  frames: [{ key: 'nat-default', frame: 6 }],
  frameRate: 1,
});

this.anims.create({
  key: 'nat-interact',
  frames: [{ key: 'nat-default', frame: 7 }],
  frameRate: 1,
});

    this.scene.start('TitleScene');
  }
}