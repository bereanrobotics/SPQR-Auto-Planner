/*
 * This file contains the class used for an action, such as dropping the arm.
 */

class ActionNode extends Node {

  constructor(ctx, x, y, action, goBackwards){
    super(ctx, x, y, goBackwards);
    this.color = '#ed9924';
    this.hasAction = true;
    this.action = action;
  }
}
