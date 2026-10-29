import {Bullet} from "./bullet.js";

export class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, which, direction, speed, attack_rate, bullet_speed, damage, target, time){
         super(scene, x, y, which);
         scene.add.existing(this);
         scene.physics.add.existing(this);
         this.direction = Phaser.Math.DegToRad(direction);
         this.scene = scene;
         this.speed = speed;
         this.rotation = this.direction;
         this.attack_rate = attack_rate;
         this.bullet_speed = bullet_speed;
         this.damage = damage;
         this.target = target;
         this.last_attack = time + Math.random()*this.attack_rate;
    }

    preUpdate(time, delta)
    {
        let dt = delta/1000;

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const angle = Math.atan2(dy, dx);
        this.rotation = angle+2*Math.PI/2;
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10)
        {
            this.x += Math.cos(angle)*this.speed*dt;
            this.y += Math.sin(angle)*this.speed*dt;
        }
        if (this.last_attack + this.attack_rate < time)
        {
            this.last_attack = time;
            let b = new Bullet(this.scene, this.x, this.y, this.angle+180, this.bullet_speed, this.damage);
            this.scene.enemy_bullets.add(b);
        }
    }
}