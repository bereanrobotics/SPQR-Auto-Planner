/*
 * This file contains the class used for an action, such as dropping the arm.
 */
 'use strict';

class ActionNode extends Node {

  constructor(ctx, x, y, action, speedToNextNode){
    super(ctx, x, y, speedToNextNode);
    this.color = '#ed9924';
    this.hasAction = true;
    this.action = action;
  }
}
