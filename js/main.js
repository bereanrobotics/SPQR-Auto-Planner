/*
 * This file contains the majority of the JavaScript on the website.
 */
'use strict';

//Global variables
var canvas, output, createButton, simulateButton, fileName, opmodeName, xElem, yElem, changeMode;
var towRedButton;
var ctx, width, height;
var snapTo = 'y';
var robot;
var background = new Image()
var nodes = [];

//Constants
const GREEN = '#32a852';
const RED = '#db3125';
const GREY = '#cfcfcf';
const ORANGE = '#ed9924';
const PURPLE = '#a42bcc';
const END = `        }
    }
}`;
const INDENTSPACE = '            ';

//Milimeters / Pixels
const mmPerPixel = 6.096;

//Wait for page to load
$(document).ready(() => {

  //Get elements
  canvas = document.getElementById('canvas');
  output = $('#output');
  createButton = $('#create');
  simulateButton = $('#simulate');
  xElem = $('#x');
  yElem = $('#y');
  changeMode = $('#change-mode');

  towRedButton = $('#towRedButton');

  robot = void(0);

  //Canvas setup
  ctx = canvas.getContext('2d');
  width = canvas.width;
  height = canvas.height;
  background.src = 'images/field.png';
  background.style.width = '50%';
  background.style.height = 'auto';

  //Mouse coordinates relative to the top left corner of the canvas
  var mouseX = 0;
  var mouseY = 0;

  //Node that is currently being moved
  var selectedNode = void(0);

  //Misc state variables
  var didStartPath = false;
  var createMode = true;
  var isMovingNode = false;
  var isShiftDown = false;

  //Handle keyboard events
  canvas.addEventListener('keydown', function(e){

    e.preventDefault();

    switch (e.key) {
      case 'Shift':
        isShiftDown = true;
        return;
        break;
      case 'Backspace':

        //Check if user is creating nodes
        if (createMode) return;

        //Check which mode is being deleted
        for (let n in nodes){
          let node = nodes[n];

          //Calculate distance from center
          let deltaX = mouseX - node.x;
          let deltaY = mouseY - node.y;
          if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) <= node.radius){
            if (nodes.indexOf(node) === 0){
              nodes.shift();
              nodes[0].color = GREEN;
            }else if (nodes.indexOf(node) === nodes.length - 1){
              nodes.pop();
              node = nodes[nodes.length - 1];
              node.nextNode = void(0);
              node.color = RED;
            }else{
              nodes.splice(n, 1);
              nodes[n - 1].nextNode = nodes[n];
              return;
            }
          }
        }
      default:
        return;
    }
    return;
  });
  canvas.addEventListener('keyup', function(e){
    if (e.key !== 'Shift') return;
    isShiftDown = false;
  });

  changeMode.click(function(){

    //Check if user is creating nodes
    if (createMode){

      //Exit create mode
      createMode = false;
      for (let node of nodes){
        if (!node.hasAction){
          node.color = PURPLE;
        }else{
          node.color = ORANGE;
        }
      }
      nodes[0].color = GREEN;
      nodes[nodes.length - 1].color = RED;
    } else {

      //Start create mode
      createMode = true;
      for (let n in nodes){
        if (n === 0) continue;
        let node = nodes[n];
        if (!node.hasAction){
          node.color = GREY;
        }else{
          node.color = ORANGE;
        }
      }
      nodes[0].color = GREEN;
    }
  });

  //Handle mouse events
  canvas.addEventListener('click', function(e){
    if (!createMode) return;
    if (mouseX > 600 || mouseX < 0 || mouseY > 600 || mouseY < 0) return;

    let node = new Node(ctx, mouseX, mouseY);
    if (nodes.length <= 0) node.color = GREEN;
    nodes.push(node);
    if (didStartPath){
      nodes[nodes.length - 2].nextNode = node;
    }

    didStartPath = true;
  });
  canvas.addEventListener('mousedown', function(e){
    if (createMode) return;

    //Get mouse coordinates according to top left of canvas
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;

    //Check which mode is being moved
    for (let n in nodes){
      let node = nodes[n];

      //Calculate distance from center
      let deltaX = x - node.x;
      let deltaY = y - node.y;
      if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) <= node.radius){
        selectedNode = node;
        node.x = x;
        node.y = y;
        isMovingNode = true;
        break;
      }
    }
  });
  canvas.addEventListener('mouseup', function(){
    if (createMode) return;
    isMovingNode = false;
  });
  canvas.addEventListener('mousemove', function(e){

    //Get mouse coordinates according to top left of canvas
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    xElem.text(x);
    yElem.text(y);
    mouseX = x;
    mouseY = y;

    //Snap to closest axis
    if (isShiftDown && nodes.length > 0 && createMode){
      let n = nodes[nodes.length - 1];
      let deltaX = Math.abs(mouseX - n.x);
      let deltaY = Math.abs(mouseY - n.y);
      let theta = Math.atan(deltaY / deltaX) * (180 / Math.PI);
      if (theta <= 45){
        mouseY = n.y;
        snapTo = 'x';
      } else {
        mouseX = n.x;
        snapTo = 'y';
      }
    }

    if (createMode || !isMovingNode || typeof selectedNode === 'undefined' || !selectedNode) return;

    //Click and drag
    selectedNode.x = x;
    selectedNode.y = y;
  });

  //Actions
  towRedButton.click(function(){
    nodes = nodes.concat(towRed(ctx));
    calcOrder();
  });

  //Main draw loop
  setInterval(function(){
    ctx.drawImage(background, 0, 0);

    //Draw snapping lines
    if (createMode){
      if (isShiftDown && nodes.length > 0){
        let node = nodes[nodes.length - 1];
        ctx.strokeStyle = '#d1d132';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.setLineDash([10, 10]);
        ctx.moveTo(node.x, node.y);
        if (snapTo === 'y'){
          ctx.lineTo(node.x, node.y + 600);
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(node.x, node.y - 600)
          ctx.stroke();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(node.x, mouseY, 9, 0, 2 * Math.PI, false);
          ctx.fillStyle = GREY;
          ctx.fill();
          ctx.stroke();
        }else{
          ctx.lineTo(node.x + 600, node.y);
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(node.x - 600, node.y)
          ctx.stroke();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(mouseX, node.y, 9, 0, 2 * Math.PI, false);
          ctx.fillStyle = GREY;
          ctx.fill();
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }else{
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 9, 0, 2 * Math.PI, false);
        ctx.fillStyle = GREY;
        ctx.fill();
        ctx.stroke();
      }
    }

    //Draw all nodes
    for (let node in nodes){
      nodes[node].draw();
    }

    if (robot) robot.draw();
  }, 80 / 1000);

  //Create the file on button click
  createButton.click(createFile);

  //Simulate the robot's path
  simulateButton.click(async function(){
    robot = new Robot(ctx, nodes);
    var instructions = createFile();
    if (typeof instructions === 'undefined') return;
    instructions.pop()

    //Loop through all instructions
    for (let i of instructions){
      var instruction = decodeInstruction(i);

      if (!(['turn', 'drive'].includes(instruction[0]))) continue;

      await robot[instruction[0]](instruction[1], instruction[2]);
    }
  });
});

//Calculates node order
function calcOrder(){
  for (let n = 0; n < nodes.length; n++){
    if (n === nodes.length - 1) return;
    nodes[n].nextNode = nodes[n + 1]
  }
}

//Create the file
function createFile(){

  //Get field values
  fileName = $('#file-name').val()
  opmodeName = $('#opmode-name').val()
  if (fileName === '' || opmodeName === '' || !fileName || !opmodeName){
    return window.alert('You must provide both an OpMode name and a file name.')
  }
  var middle = '';

  //Do math for nodes
  for (let n in nodes){
    let node = nodes[n];
    let nextNode = node.nextNode ? node.nextNode : void(0);
    let twoNodes = nextNode && nextNode.nextNode ? nextNode.nextNode : void(0);

    //Calculate distance
    if (nextNode && typeof nextNode !== 'undefined'){
      let d = distance(node.x, nextNode.x, node.y, nextNode.y);
      let neg = ' ';
      if (d){
        if (node.isBackwards){
          neg += '-';
        }
        middle += `${INDENTSPACE}drive(${d * mmPerPixel},${neg}1.0);\n`;
      }
    }

    //Calculate angle between next node and node after
    if ((nextNode && typeof nextNode !== 'undefined') && (twoNodes && typeof twoNodes !== 'undefined')){
      let theta = findDegrees(nextNode, twoNodes);
      if (theta && typeof theta !== 'undefined'){
        middle += `${INDENTSPACE}turn(${theta}, 1.0);\n`;
      }
    }

    //Run any actions
    if (node && typeof node !== 'undefined' && node.hasAction){
      middle += `${INDENTSPACE}${node.action}\n`;
    }
  }

  //Add begining of file
  var begining = `package org.firstinspires.ftc.teamcode;

import com.qualcomm.robotcore.eventloop.opmode.Autonomous;

@Autonomous(name="${fileName}")
public class ${opmodeName} extends SPQRLinearOpMode {

  @Override
  public void runOpMode() {
      this.hardwareInit();

      waitForStart();

      if (opModeIsActive() && !isStopRequested()) {

        //AUTO GENERATED CODE
`;

  output.val(begining + middle + END)
  output.height($("textarea")[0].scrollHeight);
  return middle.split('\n');
}

//Decode an instruction from the file
function decodeInstruction(i){
  var instruction = i.trim();
  instruction = instruction.replace(';', '');
  var decodedInstruction = [];
  instruction = instruction.split('(');
  decodedInstruction.push(instruction.shift());
  instruction = instruction[0];
  instruction.replace(')', '');
  instruction = instruction.split(', ');
  decodedInstruction.push(parseInt(instruction.shift(), 10));
  decodedInstruction.push(parseInt(instruction.shift(), 10));
  return decodedInstruction;
}
