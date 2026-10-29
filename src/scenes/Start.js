import { Bullet } from '../gameobjects/bullet.js';
import { Enemy } from '../gameobjects/enemy.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/darkPurple.png');
        this.load.image('spaceBg', 'assets/black.png');
        this.load.atlasXML('player', 'assets/sheet.png', 'assets/sheet.xml');

        this.load.image('projectile', 'assets/laserBlue05.png');
        this.load.json('spawns', 'data/spawns.json');
    }

    create() {
        this.background = this.add.image(640, 360, 'background');
        this.spaceBg = this.add.image(640, 360, 'spaceBg');
        this.player = this.add.sprite(640, 600, 'player', 'playerShip3_blue.png');

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
        this.wave_label = this.add.text(640, 100, "", { fontSize: '64px', fill: '#FFF', align: "center" });
        this.wave_label.setOrigin(0.5, 0.5);
        this.description_label = this.add.text(640, 180, "", { fontSize: '32px', fill: '#FFF', align: "center" });
        this.description_label.setOrigin(0.5, 0.5);
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xff0000);
        this.newWave();

        this.player.hp = 3;
        this.player.speed = 300;
        this.player.score = 0;
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
    
    getPath()
    {
        let path = this.add.path(1500, 360);
        return path;
    }
    
    newWave()
    {
        this.wave_label.text = "Wave " + this.current_wave;

        this.description_label.text = "Dodge This!"; 
        this.time.delayedCall(2000, () => { this.wave_label.text = "";
                                            this.description_label.text = ""; });

        let n = 3*Math.log(this.current_wave+1);
        this.pending = 0;
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xff0000);
        for (let i = 0; i < n; ++i)
        {
            let path = this.getPath();
            this.pending += 1;
        }
    }

    playerTakeDamage()
    {
        this.player.hp -= 1;

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
        }

        if (this.enemy_group.children.entries.length == 0 && this.current_wave != this.total_waves)
        {
            this.current_wave++;
            this.newWave();
        }

        this.score_label.text = "HP: " + this.player.hp + " \nPoints: " + this.player.score + " \nWave: " + this.current_wave + "/" + this.total_waves + " \nEnemies: " + this.enemy_group.children.entries.length;
        this.physics.world.overlap(this.player_bullets, this.enemy_group, (b,e) => {e.destroy(true); b.destroy(true); this.player.score++; this.checkLevelUp(); });
        this.physics.world.overlap(this.player, this.enemy_bullets, (p,b) => { p.hp -= b.damage; b.destroy(true); this.checkEndGame(); });
    }
    
}
