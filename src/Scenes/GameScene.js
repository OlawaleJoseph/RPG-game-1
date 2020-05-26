import 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {}

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tiles = map.addTilesetImage('forest_tileset-32x32', 'tiles');
    // console.log('tiles', tiles);
    let grass = map.createStaticLayer('Grass', tiles, 0, 0);
    let obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
    obstacles.setCollisionByExclusion([-1]);
    let score = 0;
    let scoreText = this.add.text(16, 10, 'Score: 0', {
      fontSize: '32px',
      fill: '#fff',
    });
    let userName = this.add.text(
      400,
      10,
      this.sys.game.globals.model.userName,
      { color: '#fff' }
    );
    userName.setScrollFactor(0);
    scoreText.setScrollFactor(0);
    this.player = this.physics.add.sprite(64, 64, 'player', 63);
    this.physics.add.sprite();
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, obstacles);

    this.cursors = this.input.keyboard.createCursorKeys();
    // camera follow
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true;

    //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [69, 68, 69, 70],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [69, 68, 69, 70],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [65, 64, 65, 66],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [62, 60, 62, 61],
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.spawns = this.physics.add.group({
      classType: Phaser.GameObjects.Zone,
    });

    const dangerZones = [
      [980, 640],
      [480, 864],
      [800, 768],
      [832, 224],
      [352, 288],
      [256, 448],
      [640, 672],
      [768, 960],
      [520, 390],
      [440, 600],
      [360, 740],
    ];

    dangerZones.forEach(([x, y], i) => {
      this.spawns.create(x, y, 96, 96);
    });

    this.physics.add.overlap(
      this.player,
      this.spawns,
      this.onMeetEnemy,
      false,
      this
    );
  }

  onMeetEnemy(zone) {
    console.log(zone);
    // zone.destroy();

    this.scene.start('Battle');
    // start battle
  }

  update(time, delta) {
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(80);
    }
    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-80);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(80);
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown) {
      this.player.anims.play('left', true);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.anims.play('right', true);
      this.player.flipX = false;
    } else if (this.cursors.up.isDown) {
      this.player.anims.play('up', true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play('down', true);
    } else {
      this.player.anims.stop();
    }
    console.log(this.player.x, this.player.y);
  }
}
