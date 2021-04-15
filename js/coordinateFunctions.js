/*
 * This file contains common coodinate system functions.
 */
'use strict';

//Find relative degrees between two points
function findDegrees(node1, node2){
  return Math.atan2((node2.y - node1.y), (node2.x - node1.x)) * 180 / Math.PI;
}

//Find points on a degree at a given distance from a given point
function findPoint(node, degrees, distance){

  let deltaPoints = [0, 0];
  let radians = degrees * Math.PI / 180;

  //Calculate distance
  deltaPoints[1] = distance * Math.sin(radians);
  deltaPoints[0] = distance * Math.cos(radians);

  return deltaPoints;
}

//Finds distance between two points
function distance(a1, a2, b1, b2){

  //Finds distances between x's and y's
  let a = a1 - a2;
  let b = b1 - b2;

  //Returns the distance
  return Math.sqrt(a * a + b * b);
}
