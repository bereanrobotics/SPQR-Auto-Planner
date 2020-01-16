/*
 * This file contains the majority of the JavaScript on the website.
 */
'use strict';

//Global variables
var canvas, output, createButton, fileName, opmodeName;
var ctx, width, height;
var background = new Image()
var nodes = [];
const end = `        }
    }
}`;
const indentSpace = '            ';

//Pixels per mm
const pixelsPerDistance = 0.16404199475066;

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

  var didStartPath = false;

  //Handle mouse events
  canvas.addEventListener('click', function(e){

    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;

    let n = new Node(ctx, x, y);
    nodes.push(n)

    if (didStartPath){
      nodes[nodes.length - 2].nextNode = n;
    }

    didStartPath = true;
  });

  //Main draw loop
  setInterval(function(){
    ctx.drawImage(background, 0, 0);

    for (let node in nodes){
      nodes[node].draw();
    }
  }, 60 / 1000);

  //Create the file
  createButton.click(function(){

    //Get values
    fileName = $('#file-name').val()
    opmodeName = $('#opmode-name').val()
    if (fileName === '' || opmodeName === '' || !fileName || !opmodeName){
      return window.alert('You must provide both an OpMode name and a file name.')
    }

    var middle = '';

    for (let n in nodes){
      let node = nodes[n];
      if (!node.nextNode) break;
      let x = Math.abs(node.x - node.nextNode.x);
      let y = Math.abs(node.y - node.nextNode.y);
      let d = Math.sqrt(x * x, y * y) / pixelsPerDistance;
      middle += indentSpace + `drive(${d}, 1.0);\n`;
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

    output.val(begining + middle + end)
    output.height($("textarea")[0].scrollHeight);
    document.getElementById("output").scrollIntoView()
  });
});
