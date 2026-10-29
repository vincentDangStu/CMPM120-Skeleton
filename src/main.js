import { Start } from './scenes/Start.js';
import { GameOver } from './scenes/GameOver.js';
import { LevelComplete } from './scenes/LevelComplete.js';

const config = {
    type: Phaser.AUTO,
    title: 'CMPM 120 Project Skeleton',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    physics: {default: 'arcade'},
    scene: [
        Start, GameOver, LevelComplete
    ],
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            