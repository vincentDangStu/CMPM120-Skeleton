import { Bullet } from '../gameobjects/bullet.js';
import { Enemy } from '../gameobjects/enemy.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    init(data) {
        this.level = data.level || 1;
        this.start_score = data.score || 0;
    }

    preload() {
        this.load.image('background', 'assets/darkPurple.png');
        this.load.image('spaceBg', 'assets/black.png');
        this.load.atlasXML('player', 'assets/sheet.png', 'assets/sheet.xml');

        this.load.image('projectile', 'assets/laserBlue05.png');
        this.load.json('spawns', 'data/spawns.json');

        this.load.image('small_fry', 'assets/ufoGreen.png');
        this.load.image('medium_fry', 'assets/ufoYellow.png');
        this.load.image('big_fry', 'assets/ufoRed.png');

        this.load.audio('game_over', 'assets/sfx_lose.ogg');
        this.load.audio('laser_sfx', 'assets/sfx_laser2.ogg');
        this.load.audio('player_damage', 'assets/sfx_twoTone.ogg');
        this.load.audio('explosion', 'assets/explosion.wav');
        this.load.audio('bgm', 'assets/technological_antarctica.ogg');
    }

    create() {
        this.background = this.add.image(640, 360, 'background');
        this.spaceBg = this.add.image(640, 360, 'spaceBg');
        this.player = this.add.sprite(640, 600, 'player', 'playerShip3_blue.png');
        this.laser_sfx = this.sound.add('laser_sfx');
        this.game_over_sfx = this.sound.add('game_over');
        this.player_dmg_sfx = this.sound.add('player_damage');  
        this.explosion = this.sound.add('explosion');
        this.bgm = this.sound.add('bgm');

        this.bgm.play({
            loop: true,
            volume:0.02
        })

        this.background.displayWidth = 1280;
        this.background.displayHeight = 720;
        this.spaceBg.displayWidth = 720;
        this.spaceBg.displayHeight = 720;

        this.physics.add.existing(this.player);
        this.physics.world.setBounds(290, 0, 700, 720);
        this.player.body.setCollideWorldBounds(true);

        this.enemy_group = this.add.group("enemies");
        this.current_wave = 1;
        this.total_waves = 3;
        this.level_complete = false;
        this.wave_label = this.add.text(640, 100, "", { fontSize: '64px', fill: '#FFF', align: "center" });
        this.wave_label.setOrigin(0.5, 0.5);
        this.description_label = this.add.text(640, 180, "", { fontSize: '32px', fill: '#FFF', align: "center" });
        this.description_label.setOrigin(0.5, 0.5);
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xff0000);
        this.newWave();

        this.player.hp = 5;
        this.player.speed = 300;
        this.player.score = this.start_score;
        this.player.bullet_speed = 500;
        this.player.last_attack = 0;
        this.player.attack_speed = 250;
        this.player.attack_angle = 0;
        this.score_label = this.add.text(300, 80, 'Points: ' + this.player.score, { fontSize: '32px', fill: '#FFF' });
        
        this.last_time = 0;
        this.player_bullets = this.add.group("player_bullets");
        this.enemy_bullets = this.add.group("enemy_bullets");

        this.arrowLeft = this.input.keyboard.addKey("LEFT", false, true);
        this.arrowRight = this.input.keyboard.addKey("RIGHT", false, true);
        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);
        this.shoot = this.input.keyboard.addKey("SPACE", false, true);

        // this.time.delayedCall(1000, () => this.playerTakeDamage());
        // this.time.delayedCall(2000, () => this.playerTakeDamage());
        // this.time.delayedCall(3000, () => this.playerTakeDamage());
    }
    
    getPath(pattern)
    {
        let path = this.add.path(640, 0);
        if (pattern == "direct")
        {
            path.lineTo(640, 1120)
            return path;
        }
        else if (pattern == "snake")
        {
            const farLeft = 740;
            const farRight = 540;
            let height = 400;
            path.lineTo(640, height);

            while (height <=1000) {
                path.lineTo(farLeft, height);
                height += 50;
                path.lineTo(farLeft, height);
                path.lineTo(farRight, height);
                height += 50
                path.lineTo(farRight, height);
            }

            return path;
        }
   
    }
    
    newWave()
    {
        const spawns = this.cache.json.get("spawns");
        let wave = this.current_wave - 1;
        const spawn = spawns[wave];
        this.wave_label.text = "Wave " + this.current_wave;
        this.description_label.text = spawn.count + " " + spawn.name;

        this.time.delayedCall(2000, () => { this.wave_label.text = "";
                                            this.description_label.text = ""; });
        const followDuration = Math.max(3000, spawn.speed - ((this.level - 1) * 5000));

        for (let i = 0; i < spawn.count; ++i)
        {
            const dist = 0 + 40*Math.pow(-1, i)*i; 
            wave = this.current_wave - 1;
            const patterns = spawns[wave].pattern;
            const pattern = patterns[(this.level - 1) % patterns.length];
            let path = this.getPath(pattern);
            const e = new Enemy(this, path, 640 + dist, 0, spawn.sprite, followDuration, spawn.hp);
            e.setScale(0.5);
            e.setDepth(10);
            this.enemy_group.add(e);
            this.physics.add.existing(e);
            
        }
        const gridColumns = 5;
        const gridRows = 3;
        const cellWidth = 90;
        const cellHeight = 90;

        Phaser.Actions.GridAlign(this.enemy_group.getChildren(),
        {
            width: gridColumns,
            height: gridRows,
            cellWidth: cellWidth,
            cellHeight: cellHeight,
            x: (1280 - gridColumns * cellWidth) / 2,
            y: -300
        });
        this.enemy_group.getChildren().forEach(enemy => enemy.restartFollow(followDuration));

    }


    playerTakeDamage()
    {
        this.player.hp --;
        this.player_dmg_sfx.play({
            loop: false,
            volume: 0.10
        })
        this.player.tint = 0xff0000;
            
        this.time.delayedCall(500, () => { this.player.tint = 0xffffff; });
        this.tweens.chain({
            targets: this.player,
            tweens: [{
            duration: 150,
            ease: "sine",
            yoyo: true,
            angle: {from: 0, to: 25}
            },
            {
            duration: 150,
            ease: "sine",
            yoyo: true,
            angle: {from: 0, to: -25}
            },
            {
            duration: 150,
            ease: "sine",
            yoyo: true,
            angle: {from: 0, to: 25}
            },
            ]
        });

        this.checkEndGame();
    }

    checkEndGame()
    {
        if (this.player.hp <= 0)
        {
            this.game_over_sfx.play({
                loop: false,
                volume: 0.20
            })
            this.scene.stop("Start");
            this.scene.start('GameOver');
        }
    }

    update(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;
        
        if (this.left.isDown) this.player.x -= this.player.speed * dt;
        if (this.right.isDown) this.player.x += this.player.speed * dt;
        if (this.arrowLeft.isDown) this.player.x -= this.player.speed * dt;
        if (this.arrowRight.isDown) this.player.x += this.player.speed * dt;
        if (this.shoot.isDown && time > this.player.last_attack + this.player.attack_speed) {
            this.player.last_attack = time;
            let bullet = new Bullet(this, this.player.x, this.player.y - 50, this.player.attack_angle + 270, this.player.bullet_speed);
            this.player_bullets.add(bullet);
            this.laser_sfx.play({
                loop: false,
                volume: 0.05
            })
        }

        if (this.enemy_group.children.entries.length == 0 && this.current_wave != this.total_waves)
        {
            this.current_wave++;
            this.newWave();
        }
        else if (this.enemy_group.children.entries.length == 0 && this.current_wave == this.total_waves && !this.level_complete)
        {
            this.bgm.stop();
            this.level_complete = true;
            this.scene.stop('Start');
            this.scene.start('LevelComplete', {
                score: this.player.score,
                level: this.level,
                nextLevel: this.level + 1
            });
        }

        this.score_label.text = "HP: " + this.player.hp + " \nPoints: " + this.player.score + " \nWave: " + this.current_wave + "/" + this.total_waves + " \nEnemies: " + this.enemy_group.children.entries.length;
        this.physics.world.overlap(this.player_bullets, this.enemy_group, (b,e) => {e.enemyTakeDamage();b.destroy(true); this.player.score += 100;  });
    }
    
}
