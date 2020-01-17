/*
 * This file contains the node class. Each instancw of this class represents
 * the end of a vector and the begining of a new one.
 */
'use strict';

class Node {

  constructor(ctx, x, y){
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = '#cfcfcf';
    this.radius = 9;
    this.nextNode = void(0)
  }

  draw(){
    this.ctx.strokeStyle = '#000';
    if (this.nextNode && typeof this.nextNode != 'undefined'){
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(this.nextNode.x, this.nextNode.y);
      this.ctx.stroke()
    }
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }
}
