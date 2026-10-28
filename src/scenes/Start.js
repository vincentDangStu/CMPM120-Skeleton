export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.atlasXML('player', 'assets/sheet.png', 'assets/sheet.xml');
    }

    create() {
        this.player = this.add.sprite(640, 660, 'player', 'playerShip3_red.png');
        player.setCollideWorldBounds(true);
        this.last_time = 0;
    }

    update(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;
        
    }
    
}
