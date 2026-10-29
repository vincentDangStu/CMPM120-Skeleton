export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
        
    }

    create() {
        this.background = this.add.sprite(640, 320, 'background');
        this.spaceBg = this.add.image(640, 360, 'spaceBg');

        this.background.displayWidth = 1280;
        this.background.displayHeight = 720;
        this.spaceBg.displayWidth = 720;
        this.spaceBg.displayHeight = 720;

        this.add.text(420, 320, 'GAME OVER', { fontSize: '78px', fill: '#e05809', align: "center" });
    }

}