export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
        
    }

    create() {
        this.background = this.add.sprite(640, 320, 'background');

        this.background.displayWidth = 1280;
        this.background.displayHeight = 720;

        this.add.text(420, 320, 'GAME OVER', { fontSize: '78px', fill: '#e05809', align: "center" });

        const retryButton = this.add.text(640, 430, 'TRY AGAIN', {
            fontSize: '48px',
            fill: '#f4ec07',
            backgroundColor: '#e05809',
            align: 'center',
            padding: { x: 20, y: 10 }
        });

        retryButton.setOrigin(0.5);
        retryButton.setInteractive({ useHandCursor: true });

        retryButton.on('pointerover', () => retryButton.setFill('#ffff00'));
        retryButton.on('pointerout', () => retryButton.setFill('#ffffff'));
        retryButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('Start');
        });
    }

}