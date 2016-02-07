game.OtherPlayerEntity = me.Entity.extend({
    init: function(offsetX, offsetY, playerId) {
        
        var x = offsetX;
        var y = 200 + offsetY;

        var settings = {
            name: playerId,
            z:6,
            width:35,
            height:88
        };

        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);
        
        this.playerId = playerId;

        // player can exit the viewport (jumping, falling into a hole, etc.)
        this.alwaysUpdate = true;

        // walking & jumping speed
        this.body.setVelocity(3, 15);
        this.body.setFriction(0.4,0);

        // set the entity body collision type
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        // filter collision detection with collision shapes, enemies and collectables
        this.body.setCollisionMask(me.collision.types.WORLD_SHAPE | me.collision.types.ENEMY_OBJECT | me.collision.types.COLLECTABLE_OBJECT);

        this.dying = false;

        this.mutipleJump = 1;

        // set a renderable
        this.renderable = game.texture.createAnimationFromName([
            "walk0001.png", "walk0002.png", "walk0003.png",
            "walk0004.png", "walk0005.png", "walk0006.png",
            "walk0007.png", "walk0008.png", "walk0009.png",
            "walk0010.png", "walk0011.png"
        ]);

        // define a basic walking animatin
        this.renderable.addAnimation ("walk",  [
            { name: "walk0001.png", delay: 100 },
            { name: "walk0002.png", delay: 100 },
            { name: "walk0003.png", delay: 100 }
        ]);
        // set as default
        this.renderable.setCurrentAnimation("walk");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 1.0);
    },

    /* -----

        update the player pos

    ------            */
    update : function (dt) {

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        this._super(me.Entity, "update", [dt]);

        return true;
    },

    /**
     * colision handler
     */
    onCollision : function (response, other) {

        switch (other.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "platform") {
                    if (this.body.falling &&
                        !me.input.isKeyPressed("down") &&
                        // Shortest overlap would move the player upward
                        (response.overlapV.y > 0) &&
                        // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ) {
                        // Disable collision on the x axis
                        response.overlapV.x = 0;
                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the platform (pass through)
                    return false;
                }

                // Custom collision response for slopes
                else if (other.type === "slope") {
                    // Always adjust the collision response upward
                    response.overlapV.y = Math.abs(response.overlap);
                    response.overlapV.x = 0;

                    // Respond to the slope (it is solid)
                    return true;
                }
                break;

            case me.collision.types.ENEMY_OBJECT:
                if (!other.isMovingEnemy) {
                    // spike or any other fixed danger
                    this.body.vel.y -= this.body.maxVel.y * me.timer.tick;
                    this.hurt();
                }
                else {
                    // a regular moving enemy entity
                    if ((response.overlapV.y > 0) && this.body.falling) {
                        // jump
                        this.body.vel.y -= this.body.maxVel.y * 1.5 * me.timer.tick;
                    }
                    else {
                        this.hurt();
                    }
                    // Not solid
                    return false;
                }
                break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
    },


    /**
     * ouch
     */
    hurt : function () {
        if (!this.renderable.flickering)
        {
            this.renderable.flicker(750);
        }
    }
});
