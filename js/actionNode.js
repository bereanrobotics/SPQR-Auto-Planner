/*
 * This file contains the class used for an action, such as dropping the arm.
 */
 'use strict';

class ActionNode extends Node {

  constructor(ctx, x, y, action){
    super(ctx, x, y);
    this.color = '#ed9924';
    this.hasAction = true;
    this.action = action;
  }
}
