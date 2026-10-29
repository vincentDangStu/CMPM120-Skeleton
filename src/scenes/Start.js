export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/darkPurple.png');
        this.load.atlasXML('player', 'assets/sheet.png', 'assets/sheet.xml');
    }

    create() {
        this.background = this.add.image(640, 360, 'background');
        this.player = this.add.sprite(640, 600, 'player', 'playerShip3_red.png');
        
        this.background.displayWidth = 720;
        this.background.displayHeight = 720;

        this.physics.add.existing(this.player);
        this.physics.world.setBounds(290, 0, 700, 720);
        this.player.body.setCollideWorldBounds(true);

        this.player.hp = 100;
        this.player.speed = 300;
        
        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);

        this.last_time = 0;
    }

    update(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;
        
        if (this.left.isDown) this.player.x -= this.player.speed * dt;
        if (this.right.isDown) this.player.x += this.player.speed * dt;
    }
    
}
