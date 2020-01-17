/*
 * This file contains the classes used for actions.
 */

function towRed(ctx){
  return [
    new ActionNode(ctx, 450, 100, 'this.robot.tow.setPosition(-1);'),
    new ActionNode(ctx, 520, 100, 'this.robot.tow.setPosition(1);'),
    new Node(ctx, 550, 100),
    new Node(ctx, 550, 230),
    new Node(ctx, 370, 230),
    new Node(ctx, 370, 100),
    new Node(ctx, 475, 100),
    new Node(ctx, 430, 100),
    new Node(ctx, 430, 175),
  ];
}
