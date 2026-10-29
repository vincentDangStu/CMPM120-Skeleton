export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/darkPurple.png');
        this.load.image('spaceBg', 'assets/black.png');
        this.load.atlasXML('player', 'assets/sheet.png', 'assets/sheet.xml');
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
        this.wave = 1;
        this.wave_label = this.add.text(640, 100, "", { fontSize: '64px', fill: '#FFF', align: "center" });
        this.wave_label.setOrigin(0.5, 0.5);
        this.description_label = this.add.text(640, 180, "", { fontSize: '32px', fill: '#FFF', align: "center" });
        this.description_label.setOrigin(0.5, 0.5);

        this.player.hp = 3;
        this.player.speed = 300;
        this.player.score = 0;
        this.player.bullet_speed = 500;
        this.player.last_attack = 0;
        this.player.attack_speed = 1000;
        this.player.attack_angle = 0;
        this.score_label = this.add.text(300, 100, 'Points: ' + this.player.score, { fontSize: '32px', fill: '#FFF' });
        
        this.last_time = 0;
        this.player_bullets = this.add.group("player_bullets");
        this.enemy_bullets = this.add.group("enemy_bullets");

        this.arrowLeft = this.input.keyboard.addKey("LEFT", false, true);
        this.arrowRight = this.input.keyboard.addKey("RIGHT", false, true);
        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xff0000);

        this.newWave();

    }
    
    getPath()
    {
        // your path *has to* start at 1500, 360
        let path = this.add.path(1500, 360);

       // the "play area" is from (0,0) to (1280,720)
        path.quadraticBezierTo(1000, 100, 640, 360);
        path.quadraticBezierTo(640, 100, 300, 360);
        // and it has to end at -300,360 (you can use something other than a line, of course)
        path.lineTo(-300, 360);
        return path;
    }
    
    newWave()
    {
        this.wave_label.text = "Wave " + this.wave;

        this.description_label.text = "Dodge This!"; 
        this.time.delayedCall(5000, () => { this.wave_label.text = "";
                                            this.description_label.text = ""; });

        let n = 3*Math.log(this.wave+1);
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
    update(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;
        
        if (this.left.isDown) this.player.x -= this.player.speed * dt;
        if (this.right.isDown) this.player.x += this.player.speed * dt;
        if (this.arrowLeft.isDown) this.player.x -= this.player.speed * dt;
        if (this.arrowRight.isDown) this.player.x += this.player.speed * dt;
    }
    
}
