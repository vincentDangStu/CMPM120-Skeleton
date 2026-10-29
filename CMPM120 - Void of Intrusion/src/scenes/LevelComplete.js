export class LevelComplete extends Phaser.Scene {
    constructor() {
        super('LevelComplete');
    }

    create(data) {
        this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.75);
        this.add.text(640, 260, 'LEVEL COMPLETE', {
            fontSize: '72px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(640, 305, `Level ${data.level || 1} Complete`, {
            fontSize: '32px',
            fill: '#ffd700',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(640, 350, `Score: ${data.score || 0}`, {
            fontSize: '36px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(640, 400, `Next: Level ${data.nextLevel || 2}`, {
            fontSize: '32px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        const continueButton = this.add.text(640, 455, 'CONTINUE', {
            fontSize: '42px',
            fill: '#ffffff',
            backgroundColor: '#0a8f3d',
            align: 'center',
            padding: { x: 24, y: 12 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        continueButton.on('pointerover', () => continueButton.setFill('#ffff00'));
        continueButton.on('pointerout', () => continueButton.setFill('#ffffff'));
        continueButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('Start', {
                level: data.nextLevel || 2,
                score: data.score || 0
            });
        });
    }
}
