/*
 * This file contains the node class. Each instancw of this class represents
 * the end of a vector and the begining of a new one.
 */
'use strict';

class Node {

  constructor(ctx, x, y, speedToNextNode){
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = '#cfcfcf';
    this.radius = 9;
    this.nextNode = void(0);
    this.hasAction = false;
    this.outlineColor= '#000';
    this.speedToNextNode = (typeof speedToNextNode !== 'undefined') ? speedToNextNode : 1;
  }

  draw(){
    this.ctx.strokeStyle = '#000';
    if (this.speedToNextNode < 0){
      this.ctx.strokeStyle = '#f00';
    }
    if (this.nextNode && typeof this.nextNode != 'undefined'){
      this.ctx.lineWidth = 3 * Math.abs(this.speedToNextNode);
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(this.nextNode.x, this.nextNode.y);
      this.ctx.stroke()
    }
    this.ctx.strokeStyle = this.outlineColor;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }
}
