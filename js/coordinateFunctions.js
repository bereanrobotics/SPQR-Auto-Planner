/*
 * This file contains common coodinate system functions
 */
'use strict';
//
// //Finds the degrees between two points
// function findDegrees(n1, n2){
//
//   //Variable initialization
//   var from = [n1.x, n1.y];
//   var to = [n2.x, n2.y];
//   var quadrant = findQuadrant(from, to);
//   var degrees = undefined;
//   var delta1 = Math.abs(from[0] - to[0]);
//   var delta2 = Math.abs(from[1] - to[1]);
//   var newPoint = [0, 0];
//
//   //Finds quadrant or returns degrees if it is on a line
//   switch (quadrant) {
//     case 'line':
//       if (from[1] === to[1] && from[0] < to[0]){
//         degrees = 0;
//       }else if (from[1] < to[1] && from[0] === to[0]){
//         degrees = -90;
//       }else if (from[1] === to[1] && from[0] > to[0]){
//         degrees = 180;
//       }else if (from[1] > to[1] && from[0] === to[0]){
//         degrees = 90;
//       }
//       break;
//     case 'I':
//       newPoint[0] += delta1;
//       newPoint[1] += delta2;
//       break;
//     case 'II':
//       newPoint[0] -= delta1;
//       newPoint[1] += delta2;
//       break;
//     case 'III':
//       newPoint[0] -= delta1;
//       newPoint[1] -= delta2;
//       break;
//     case 'IV':
//       newPoint[0] += delta1;
//       newPoint[1] -= delta2;
//       break;
//   }
//
//   if ((!degrees && typeof degrees === 'undefined') && quadrant !== 'line'){
//
//     //Gets degrees
//     degrees = Math.atan(newPoint[1] / newPoint[0]) * 180 / Math.PI;
//   }
//   return degrees;
// }
//
// //Gets new points on slope
// function pointsOnSlope(x, y, degrees, distance){
//
//   //Variable initialization
//   var newPoints = [null, null];
//   var rad = degrees * Math.PI / 180;
//
//   //Finds new y
//   newPoints[1] = distance * Math.sin(rad);
//   if (degrees === 90 || degrees === 270){
//     newPoints[1] *= 1;
//   }
//
//   //Finds new x
//   newPoints[0] = distance * Math.cos(rad);
//
//   return newPoints;
// }
//
// //Finds realative angle between two points
// function findRelativeAngle(node1, node2){
//
//   // let slope1 = (no)
// }
//
// //Finds which quadrant a point is in realation to another point on the unit circle
// function findQuadrant(from, to){
//
//   //Returns if on line
//   if ((from[1] === to[1] && from[0] < to[0]) || (from[1] < to[1] && from[0] === to[0]) || (from[1] === to[1] && from[0] > to[0]) || (from[1] > to[1] && from[0] === to[0])) return 'line';
//
//   //Finds quadrant
//   if (from[0] < to[0] && from[1] > to[1]) return 'I';
//   if (from[0] > to[0] && from[1] > to[1]) return 'II';
//   if (from[0] > to[0] && from[1] < to[1]) return 'III';
//   if (from[0] < to[0] && from[1] < to[1]) return 'IV';
// }
//

//Find relative degrees between two points
function findDegrees(node1, node2){
  return Math.atan((node2.y - node1.y) / (node2.x - node1.x)) * 180 / Math.PI;
}

//Find points on a degree at a given distance from a given point
function findPoint(node, degrees, distance){

  let deltaPoints = [0, 0];
  let radians = degrees * Math.PI / 180;

  if ([90, 270].includes(degrees)){
    deltaPoints[1] = distance;
    if (degrees === 90){
      deltaPoints[1] *= -1;
    }
    return deltaPoints;
  }

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
