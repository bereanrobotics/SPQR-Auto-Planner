/*
 * This file contains the majority of the JavaScript on the website.
 */
'use strict';

//Global variables
var canvas, output, createButton, fileName, opmodeName;
var ctx, width, height;
var snapTo = 'y';
var background = new Image()
var nodes = [];

//Constants
const GREEN = '#32a852';
const RED = '#db3125';
const GREY = '#cfcfcf';
const END = `        }
    }
}`;
const INDENTSPACE = '            ';

//Pixels per mm
const pixelsPerMm = 0.16404199475066;

//Wait for page to load
$(document).ready(function(){

  //Get elements
  canvas = document.getElementById('canvas');
  output = $('#output');
  createButton = $('#create');

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

    switch (e.key) {
      case 'Enter':

        //Check if user is creating nodes
        if (createMode){

          //Exit create mode
          createMode = false;
          for (let n in nodes){
            let node = nodes[n];
            node.color = '#a42bcc';
          }
          nodes[0].color = GREEN;
          nodes[nodes.length - 1].color = RED;
        } else {

          //Start create mode
          createMode = true;
          for (let n in nodes){
            if (n === 0) continue;
            let node = nodes[n];
            node.color = GREY;
          }
          nodes[0].color = GREEN;
        }
        return;
        break;
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

  //Handle mouse events
  canvas.addEventListener('click', function(e){
    if (!createMode) return;

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
  }, 60 / 1000);

  //Create the file on button click
  createButton.click(function(){

    //Get field values
    fileName = $('#file-name').val()
    opmodeName = $('#opmode-name').val()
    if (fileName === '' || opmodeName === '' || !fileName || !opmodeName){
      return window.alert('You must provide both an OpMode name and a file name.')
    }

    var middle = `${INDENTSPACE}\n${INDENTSPACE}//AUTO GENERATED CODE\n`;

    //Do math for nodes
    for (let n in nodes){
      let node = nodes[n];
      let nextNode = node.nextNode;
      let twoNodes = nextNode.nextNode;
      if (!node.nextNode) break;

      //Distance
      let x = Math.abs(node.x - nextNode.x);
      let y = Math.abs(node.y - nextNode.y);
      let d = Math.sqrt(x * x + y * y) / pixelsPerMm;
      middle += `${INDENTSPACE}drive(${d}, 1.0);\n`;

      //Turning
      if (!twoNodes) break;
      x = nextNode.x - twoNodes.x;
      y = nextNode.y - twoNodes.y;
      let theta = Math.atan((twoNodes.x - nextNode.x) / (twoNodes.y - nextNode.y)) * (180 / Math.PI);
      middle += `${INDENTSPACE}turn(${theta}, 1.0);\n`;
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
`;

    output.val(begining + middle + END)
    output.height($("textarea")[0].scrollHeight);
    document.getElementById("output").scrollIntoView()
  });
});
