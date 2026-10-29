import {Bullet} from "./bullet.js";

export class Enemy extends Phaser.GameObjects.PathFollower {
    constructor(scene, path, x, y, which, duration, hp){
         super(scene, path, x, y, which);
         scene.add.existing(this);
         scene.physics.add.existing(this);
         this.scene = scene;
         this.hp = hp
         this.startFollow({
            duration: duration,
            repeat: 0,
            yoyo: true,
            rotateToPath: true,
            rotationOffset: 90,
            offset: {y: -360}
        })
    }

    enemyTakeDamage()
    {   
        if (this.hp <= 1) 
        {
            this.scene.explosion.play({
                loop: false,
                volume: 0.05
            })
            this.destroy(true);
        }
        else this.hp --;
    }

    restartFollow(duration)
    {
        this.startFollow({
            duration: duration, // how long to follow, in ms
            repeat: 0, // how often to repeat the path (-1: keep looping)
            yoyo: false, // yoyo: true makes the follower go back and forth 
            rotateToPath: true, // adjust rotation to path 
            rotationOffset: 90,// if the sprite needs to be rotated to face the path
            offset: {y: -360}
        })
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);
        if (this.pathTween.progress > 0.5 && this.pending)
        {
            this.scene.pending--;
            this.pending = false;
        }
        if (!this.isFollowing())
        {
            this.scene.playerTakeDamage();
            this.destroy();
        }
    }
}