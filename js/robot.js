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
    this.size = 457.2 / this.mmPerPixel;
    this.x = this.firstNode.x - this.size / 2;
    this.y = this.firstNode.y - this.size / 2;
    this.theta = initialAngle;

    //Speed in pixels/frame
    let speed = .04;
    let turnSpeed = .1;

    this.speed = (speed * this.mmPerPixel) / (80 / 100);
  }

  draw(){
    this.ctx.fillStyle = '#8a8a8a';
    this.ctx.rect(this.x, this.y, this.size, this.size);
    this.ctx.fill();
  }

  drive(d, speed){
    var totalMoveDistanceNeeded = d / this.mmPerPixel; //Pixels
    var movedDistanceX = 0;
    var movedDistanceY = 0;
    var initialX = this.x;
    var initialY = this.y;
    return new Promise((resolve, reject) => {
      var id = setInterval(() => {
        let delta = pointsOnSlope(this.x, this.y, this.theta, this.speed * speed);
        this.x += delta[0];
        this.y -= delta[1];
        movedDistanceX += Math.abs(delta[0]);
        movedDistanceY += Math.abs(delta[1]);

        //Keep it from overshooting node
        if (Math.sqrt(movedDistanceX * movedDistanceX + movedDistanceY * movedDistanceY) >= totalMoveDistanceNeeded){
          let finalPoint = pointsOnSlope(initialX, initialY, this.theta, totalMoveDistanceNeeded);
          this.x = initialX + finalPoint[0];
          this.y = initialY - finalPoint[1];
          clearInterval(id);
          resolve();
        }
      }, 80 / 1000);
    });
  }

  turn(degrees, speed){
  //   return new Promise((resolve, reject) => {
  //     var id = setInterval(function () {
  //
  //     }, 80 / 1000);
  //   });
  this.theta = degrees;
  }
}
