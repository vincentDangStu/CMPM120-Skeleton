import {Bullet} from "./bullet.js";

export class Drop extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        this.dropType = type;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(2);
        this.body.setVelocityY(150);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y > 740) this.destroy();
    }
}

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

            if (Math.random() < 0.25)
            {
                const powerUps = ['slow_down', 'speed_up', 'heal_up'];
                const dropType = Phaser.Utils.Array.GetRandom(powerUps);
                this.scene.drops.add(new Drop(this.scene, this.x, this.y, dropType));
            }

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