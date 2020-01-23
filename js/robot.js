/*
 * This class contains the robot used in the simulator.
 */
'use strict';

class Robot {

  constructor(ctx, initialAngle, nodes){
    this.ctx = ctx;
    this.nodes = nodes;
    this.firstNode = nodes[0];
    this.mmPerPixel = 6.096;
    this.size = 457.2 / this.mmPerPixel; //Pixels
    this.x = this.firstNode.x - this.size / 2;
    this.y = this.firstNode.y - this.size / 2;
    this.theta = initialAngle;

    //Speed in pixels/frame
    let speed = .04;

    //Turning speed in degrees/frame
    this.turnSpeed = .5;

    this.speed = (speed * this.mmPerPixel) / (80 / 100);
  }

  draw(){

    //Rotate rectangle
    this.ctx.save();
    this.ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
    this.ctx.rotate(this.theta * Math.PI / 180);
    this.ctx.fillStyle = '#8a8a8a';
    this.ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    this.ctx.fillStyle = '#00ff34';
    this.ctx.fillRect(this.size / 2 - 20, -this.size / 2, 20, this.size);
    this.ctx.restore();
  }

  drive(d, speed){
    var totalMoveDistanceNeeded = (d / 10) / this.mmPerPixel; //Pixels
    var movedDistanceX = 0;
    var movedDistanceY = 0;
    var initialX = this.x;
    var initialY = this.y;
    return new Promise((resolve, reject) => {
      var id = setInterval(() => {
        let delta = findPoint(new Node(void(0), this.x, this.y), this.theta, this.speed * speed);
        this.x += delta[0];
        this.y += delta[1];
        movedDistanceX += Math.abs(delta[0]);
        movedDistanceY += Math.abs(delta[1]);

        //Keep it from overshooting node
        if (Math.sqrt(movedDistanceX * movedDistanceX + movedDistanceY * movedDistanceY) >= totalMoveDistanceNeeded){
          let finalPoint = findPoint(new Node(void(0), initialX, initialY, false), this.theta, (speed > 0) ? totalMoveDistanceNeeded : -totalMoveDistanceNeeded);
          this.x = initialX + finalPoint[0];
          this.y = initialY + finalPoint[1];
          clearInterval(id);
          resolve();
        }
      }, 80 / 1000);
    });
  }

  turn(degrees, speed){
    if (degrees > 180){
      degrees -= 360;
    }
    if (degrees < -180){
      degrees += 360;
    }
    return new Promise((resolve, reject) => {
      var finalAngle = this.theta - degrees;
      var neededTurnDistance = Math.abs(this.theta - finalAngle);
      var distanceTurned = 0;
      var id = setInterval(() => {

        //Inside interval to check if slider was changed
        let turn = this.turnSpeed * speed;
        if (degrees < 0){
          turn *= -1;
        }

        this.theta -= turn;
        distanceTurned += Math.abs(turn);

        //Prevent turning too far
        if (distanceTurned >= neededTurnDistance){
          this.theta = finalAngle;
          clearInterval(id);
          resolve();
        }
      }, 80 / 1000);
    });
  }
}
